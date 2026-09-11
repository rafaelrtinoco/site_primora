#!/usr/bin/env node
/**
 * Gera src/lib/brandGlyphs.ts, a tabela de glifos usada pela cena 3D da
 * seção Ferramentas (extrusão do logo na face de cada tile).
 *
 * Duas fontes:
 *   1. simple-icons (CC0-1.0) — logo real, com o hex oficial da marca.
 *      Só usado pra marcas presentes no pacote (hoje: Instagram, Facebook,
 *      Meta, Google Ads, WhatsApp).
 *   2. @phosphor-icons/react, peso "fill" (já dependência do projeto) —
 *      fallback pra ferramentas sem logo no simple-icons (hoje: Canva,
 *      CapCut). Sem hex de marca: o material 3D usa o acid-400 do tema, o
 *      mesmo padrão de IconFrame tone="brand" no resto do site.
 *
 * Por que gerar em vez de importar simple-icons em runtime: o pacote inteiro
 * tem milhares de ícones, e a cena usa cinco. Gerar em build time mantém o
 * bundle do site livre da dependência — ela nunca é importada por código de
 * produção, só por este script (devDependency).
 *
 * Rodar depois de qualquer bump de versão do simple-icons ou @phosphor-icons/react:
 *   npm run gen:glyphs
 */

import { readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';

const ROOT = fileURLToPath(new URL('..', import.meta.url));
const OUT_PATH = `${ROOT}/src/lib/brandGlyphs.ts`;

const SIMPLE_ICONS_DIR = `${ROOT}/node_modules/simple-icons/icons`;
const SIMPLE_ICONS_DATA = `${ROOT}/node_modules/simple-icons/data/simple-icons.json`;
const SIMPLE_ICONS_PKG = `${ROOT}/node_modules/simple-icons/package.json`;

const PHOSPHOR_DEFS_DIR = `${ROOT}/node_modules/@phosphor-icons/react/dist/defs`;
const PHOSPHOR_PKG = `${ROOT}/node_modules/@phosphor-icons/react/package.json`;

/** slug simple-icons -> chave usada em site.ts (ferramentas[].slug) */
const MARCAS = {
  instagram: 'instagram',
  facebook: 'facebook',
  meta: 'meta',
  googleads: 'googleAds',
  whatsapp: 'whatsapp',
};

/** nome do componente Phosphor -> chave usada em site.ts (ferramentas[].slug) */
const FALLBACKS = {
  PenNib: 'canva',
  FilmSlate: 'capcut',
};

const simpleIconsVersion = JSON.parse(readFileSync(SIMPLE_ICONS_PKG, 'utf8')).version;
const phosphorVersion = JSON.parse(readFileSync(PHOSPHOR_PKG, 'utf8')).version;
const dadosMarcas = JSON.parse(readFileSync(SIMPLE_ICONS_DATA, 'utf8'));

const entradasMarca = Object.entries(MARCAS).map(([slugPacote, chave]) => {
  const meta = dadosMarcas.find((icone) => icone.slug === slugPacote);
  if (!meta) {
    throw new Error(
      `gen-brand-glyphs: slug "${slugPacote}" não existe mais em simple-icons@${simpleIconsVersion}. ` +
        'Atualize MARCAS neste script e o fallback correspondente em src/content/site.ts.',
    );
  }

  const svg = readFileSync(`${SIMPLE_ICONS_DIR}/${slugPacote}.svg`, 'utf8');
  const match = svg.match(/<path d="([^"]+)"/);
  if (!match) {
    throw new Error(`gen-brand-glyphs: não achei <path d="..."> em ${slugPacote}.svg`);
  }

  return {
    chave,
    titulo: meta.title,
    hex: meta.hex,
    path: match[1],
    viewBox: 24,
  };
});

const entradasFallback = Object.entries(FALLBACKS).map(([componente, chave]) => {
  const src = readFileSync(`${PHOSPHOR_DEFS_DIR}/${componente}.es.js`, 'utf8');
  // Peso "fill": único path, mais fácil de extrudar que o duotone (2 camadas).
  const match = src.match(/"fill",[\s\S]*?d:\s*"([^"]+)"/);
  if (!match) {
    throw new Error(`gen-brand-glyphs: não achei o peso "fill" em ${componente}.es.js`);
  }

  return {
    chave,
    titulo: componente,
    hex: undefined, // sem marca própria: a cena usa o acid-400 do tema
    path: match[1],
    viewBox: 256, // grade nativa do Phosphor, diferente dos 24 do simple-icons
  };
});

const todasEntradas = [...entradasMarca, ...entradasFallback];

const corpo = todasEntradas
  .map((e) => {
    const hex = e.hex === undefined ? 'undefined' : JSON.stringify(e.hex);
    return `  ${e.chave}: { titulo: ${JSON.stringify(e.titulo)}, hex: ${hex}, path: ${JSON.stringify(e.path)}, viewBox: ${e.viewBox} },`;
  })
  .join('\n');

const arquivo = `/**
 * Tabela de glifos para a cena 3D da seção Ferramentas.
 *
 * GERADO por scripts/gen-brand-glyphs.mjs. NÃO EDITAR À MÃO — rode
 * \`npm run gen:glyphs\` de novo depois de mudar MARCAS/FALLBACKS no script.
 *
 * Fontes: simple-icons@${simpleIconsVersion} (CC0-1.0) para logo de marca real;
 * @phosphor-icons/react@${phosphorVersion}, peso "fill", para as ferramentas sem
 * logo no simple-icons (\`hex: undefined\`, a cena usa o acid-400 do tema).
 *
 * Cada logotipo pertence à respectiva marca. Este arquivo só identifica a
 * ferramenta operada pela Praxis; não implica parceria ou certificação — ver
 * a nota em src/components/Ferramentas.tsx.
 */

export type ToolGlyph = {
  titulo: string;
  /** Hex oficial da marca, sem #. \`undefined\` = usa o acid-400 do tema. */
  hex: string | undefined;
  /** Atributo \`d\` do <path> único do ícone. */
  path: string;
  /** Lado do viewBox quadrado de origem (24 para simple-icons, 256 para Phosphor). */
  viewBox: number;
};

export const brandGlyphs = {
${corpo}
} as const satisfies Record<string, ToolGlyph>;

export type BrandGlyphSlug = keyof typeof brandGlyphs;
`;

writeFileSync(OUT_PATH, arquivo, 'utf8');
console.log(
  `gen:glyphs — ${entradasMarca.length} marca(s) + ${entradasFallback.length} fallback(s) escritos em src/lib/brandGlyphs.ts`,
);
