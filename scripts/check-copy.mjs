#!/usr/bin/env node
/**
 * Lint de copy. Não é um parser de AST — varre linha a linha, descarta o que
 * está dentro de comentário e sinaliza o que a política de conteúdo do
 * CLAUDE.md proíbe em texto visível:
 *
 *   1. Travessão (—) fora de comentário: a copy do site é escrita em frases
 *      curtas, sem travessão como muleta de raciocínio.
 *   2. Placeholder de telefone/nome conhecido, dos que já foram ao ar por
 *      engano antes (ex.: "(11) 99999-9999", "João Silva").
 *   3. Jargão de publicidade vazio, da lista negra do agente copywriter.
 *
 * Falso positivo se resolve reescrevendo a frase — esse é o efeito desejado.
 */

import { readFileSync, readdirSync, statSync } from 'node:fs';
import { extname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

/* fileURLToPath, e não `.pathname`: o caminho do projeto pode conter espaço,
   e `.pathname` devolveria o `%20` da URL sem decodificar, o que fazia o
   scandir de src/ falhar com ENOENT. Mesma resolução de gen-brand-glyphs.mjs. */
const ROOT = fileURLToPath(new URL('..', import.meta.url));

const TARGET_EXT = new Set(['.ts', '.tsx']);
const SKIP_DIRS = new Set(['node_modules', 'dist', '.git']);

const JARGAO = [
  'solução completa',
  'excelência',
  'parceiro estratégico',
  'transformar seu negócio',
  'não é apenas',
];

const PLACEHOLDERS = [/99999-9999/, /\bJoão Silva\b/];

/** Coleta arquivos-alvo: todo .ts/.tsx sob src/, mais index.html na raiz. */
function collectFiles(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    if (SKIP_DIRS.has(entry)) continue;
    const full = join(dir, entry);
    const stats = statSync(full);
    if (stats.isDirectory()) {
      collectFiles(full, acc);
    } else if (TARGET_EXT.has(extname(entry))) {
      acc.push(full);
    }
  }
  return acc;
}

const files = [...collectFiles(join(ROOT, 'src')), join(ROOT, 'index.html')];

/**
 * Remove comentário de uma linha e devolve o texto que sobrou para checar.
 * Mantém, via `state.inBlock`, se a linha começou dentro de um comentário de
 * bloco aberto por uma linha anterior.
 */
function stripComment(line, state) {
  let text = line;

  if (state.inBlock) {
    const end = text.indexOf('*' + '/');
    if (end === -1) return { text: '', state };
    text = text.slice(end + 2);
    state.inBlock = false;
  }

  // Comentários de bloco que abrem e fecham (ou só abrem) na mesma linha.
  // Repete até não sobrar abertura de bloco na linha, para pegar mais de um.
  for (;;) {
    const start = text.indexOf('/' + '*');
    if (start === -1) break;
    const end = text.indexOf('*' + '/', start + 2);
    if (end === -1) {
      text = text.slice(0, start);
      state.inBlock = true;
      break;
    }
    text = text.slice(0, start) + text.slice(end + 2);
  }

  // Comentário de linha `//`, exceto quando faz parte de `://` (URL).
  const lineCommentMatch = text.match(/(^|[^:])\/\/.*/);
  if (lineCommentMatch) {
    text = text.slice(0, lineCommentMatch.index + lineCommentMatch[1].length);
  }

  return { text, state };
}

function lintFile(path) {
  const raw = readFileSync(path, 'utf8');
  const lines = raw.split(/\r?\n/);
  const state = { inBlock: false };
  const violacoes = [];

  lines.forEach((rawLine, i) => {
    const lineNumber = i + 1;

    // Linha de continuação de JSDoc ("   * ...") é sempre comentário.
    if (state.inBlock === false && /^\s*\*(?!\/)/.test(rawLine)) {
      return;
    }

    const { text } = stripComment(rawLine, state);
    if (!text.trim()) return;

    if (text.includes('—')) {
      violacoes.push({ lineNumber, motivo: 'travessão em texto visível', trecho: text.trim() });
    }

    for (const jargao of JARGAO) {
      if (text.toLowerCase().includes(jargao)) {
        violacoes.push({ lineNumber, motivo: `jargão proibido: "${jargao}"`, trecho: text.trim() });
      }
    }

    for (const padrao of PLACEHOLDERS) {
      if (padrao.test(text)) {
        violacoes.push({ lineNumber, motivo: `placeholder conhecido: ${padrao}`, trecho: text.trim() });
      }
    }
  });

  return violacoes;
}

let totalViolacoes = 0;

for (const file of files) {
  const violacoes = lintFile(file);
  if (violacoes.length === 0) continue;

  totalViolacoes += violacoes.length;
  const relPath = file.replace(ROOT, '').replace(/\\/g, '/');
  console.error(`\n${relPath}`);
  for (const v of violacoes) {
    console.error(`  ${v.lineNumber}: ${v.motivo}`);
    console.error(`    ${v.trecho}`);
  }
}

if (totalViolacoes > 0) {
  console.error(`\ncheck:copy — ${totalViolacoes} violação(ões) encontrada(s).`);
  process.exit(1);
}

console.log('check:copy — nenhuma violação encontrada.');
