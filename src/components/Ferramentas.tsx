import { Suspense, lazy, useMemo, useRef, useState } from 'react';
import { useInView, useReducedMotion } from 'framer-motion';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import IconFrame from './ui/IconFrame';
import { Reveal, RevealGroup, RevealItem } from './ui/Reveal';
import { site, type Ferramenta } from '../content/site';
import { brandGlyphs, type BrandGlyphSlug } from '../lib/brandGlyphs';
import type { FerramentaCena } from './ferramentas/construirCena';

/* Chunk isolado: nada neste arquivo importa `three`. O import() dinâmico só
   busca CenaFerramentas.tsx (e o three que ela carrega) quando a seção
   entra perto da viewport, então o bundle inicial da página não cresce. */
const CenaFerramentas = lazy(() => import('./ferramentas/CenaFerramentas'));

function temWebGL(): boolean {
  try {
    const canvas = document.createElement('canvas');
    return !!(canvas.getContext('webgl2') || canvas.getContext('webgl'));
  } catch {
    return false;
  }
}

/**
 * Glifo de marca em SVG puro (não passa por IconFrame sozinho: a cor vem do
 * hex oficial da marca, não do currentColor do tema). Fallback sem `hex`
 * (Canva, CapCut) herda a cor do elemento pai, que é o acid-400 de IconFrame.
 */
function Glifo({ slug, size = 22 }: { slug: string; size?: number }) {
  const glifo = brandGlyphs[slug as BrandGlyphSlug];
  if (!glifo) return null;

  return (
    <svg
      viewBox={`0 0 ${glifo.viewBox} ${glifo.viewBox}`}
      width={size}
      height={size}
      aria-hidden="true"
      style={glifo.hex ? { color: `#${glifo.hex}` } : undefined}
    >
      <path d={glifo.path} fill="currentColor" />
    </svg>
  );
}

/**
 * Estado permanente sem WebGL / com movimento reduzido, e fallback do
 * Suspense enquanto o chunk da cena carrega. `aria-hidden`: a informação real
 * está nos chips logo abaixo, que existem nos dois casos.
 */
function GradeEstatica({ ferramentas }: { ferramentas: Ferramenta[] }) {
  return (
    <div
      className="relative flex h-full w-full items-center justify-center p-8"
      aria-hidden="true"
    >
      <div className="grid grid-cols-4 gap-4 sm:grid-cols-7">
        {ferramentas.map((ferramenta) => (
          <IconFrame key={ferramenta.slug} tone="invert" size="lg">
            <Glifo slug={ferramenta.slug} size={28} />
          </IconFrame>
        ))}
      </div>
    </div>
  );
}

export default function Ferramentas() {
  const hostRef = useRef<HTMLDivElement>(null);
  const emVista = useInView(hostRef, { once: true, amount: 0.2 });
  const movimentoReduzido = useReducedMotion();
  // Inicializador preguiçoso, não efeito: o site é só cliente (sem SSR), então
  // `document` já existe na primeira renderização e não há valor de servidor
  // pra sincronizar depois.
  const [webgl] = useState(() => temWebGL());
  const [activeIndex, setActiveIndex] = useState(0);

  const ferramentasCena = useMemo<FerramentaCena[]>(
    () =>
      site.ferramentas
        .filter((f) => f.slug in brandGlyphs)
        .map((f) => ({ nome: f.nome, glifo: brandGlyphs[f.slug as BrandGlyphSlug] })),
    [],
  );

  // Lista vazia = dado ainda não confirmado, mesma regra do resto de site.ts.
  if (site.ferramentas.length === 0) return null;

  const cena3dPermitida = emVista && !movimentoReduzido && webgl === true;
  const ativa = site.ferramentas[activeIndex];

  return (
    <Section id="ferramentas" tone="dark" labelledBy="ferramentas-title">
      <SectionHeader
        id="ferramentas-title"
        eyebrow="Ferramentas"
        title={
          <>
            As ferramentas ficam com a gente.{' '}
            <span className="text-on-dark-accent">Você fica com o resultado.</span>
          </>
        }
        description="Cada rede, cada gerenciador de anúncio e cada editor tem uma lógica própria. A gente opera todos eles todo dia. Você não precisa aprender nenhum."
      />

      <div
        ref={hostRef}
        className="relative isolate mx-auto aspect-square w-full max-w-xl overflow-hidden rounded-panel border border-white/10 bg-carbon-900/40"
      >
        <div className="hero-grid" aria-hidden="true" />
        {cena3dPermitida ? (
          <Suspense fallback={<GradeEstatica ferramentas={site.ferramentas} />}>
            <CenaFerramentas
              ferramentas={ferramentasCena}
              activeIndex={activeIndex}
              onSelecionar={setActiveIndex}
            />
          </Suspense>
        ) : (
          <GradeEstatica ferramentas={site.ferramentas} />
        )}
      </div>

      <RevealGroup as="ul" stagger={0.04} className="mt-10 flex flex-wrap justify-center gap-2.5">
        {site.ferramentas.map((ferramenta, i) => {
          const ativoAqui = i === activeIndex;
          return (
            <RevealItem key={ferramenta.slug} as="li">
              <button
                type="button"
                aria-pressed={ativoAqui}
                onClick={() => setActiveIndex(i)}
                className={`inline-flex items-center gap-2 rounded-control border px-4 py-2.5 text-sm font-semibold transition-colors duration-200 ${
                  ativoAqui
                    ? 'border-acid-400/50 bg-acid-400/10 text-on-dark'
                    : 'border-white/12 bg-white/5 text-on-dark-body hover:border-white/25 hover:text-on-dark'
                }`}
              >
                <Glifo slug={ferramenta.slug} size={18} />
                {ferramenta.nome}
              </button>
            </RevealItem>
          );
        })}
      </RevealGroup>

      {/* Mesma informação para quem usa mouse (clique no tile 3D) e quem usa
          teclado (chip com foco): o texto muda aqui nos dois casos. */}
      <p
        role="status"
        aria-live="polite"
        className="mx-auto mt-6 max-w-md text-center text-sm text-on-dark-body"
      >
        {ativa && (
          <>
            <span className="font-semibold text-on-dark">{ativa.nome}.</span> {ativa.faz}
          </>
        )}
      </p>

      <Reveal as="p" className="mx-auto mt-8 max-w-2xl text-center text-xs text-on-dark-muted">
        As marcas citadas pertencem aos respectivos donos. Não somos revendedores nem
        representantes de nenhuma delas.
      </Reveal>
    </Section>
  );
}
