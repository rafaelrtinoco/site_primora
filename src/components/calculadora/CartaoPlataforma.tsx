import { useState } from 'react';
import { ArrowSquareOut, SlidersHorizontal, WarningCircle } from '@phosphor-icons/react';
import CampoNumero from './CampoNumero';
import type { Marketplace } from '../../content/marketplaces';
import {
  formatarBRL,
  formatarPct,
  type ResultadoPlataforma,
} from '../../lib/calculadora';

type Props = {
  marketplace: Marketplace;
  resultado: ResultadoPlataforma;
  /** Texto cru dos campos de ajuste, vazio enquanto o padrão da faixa valer. */
  ajustePercentual: string;
  ajusteFixo: string;
  onAjustePercentual: (valor: string) => void;
  onAjusteFixo: (valor: string) => void;
  adicionalLigado: boolean;
  onAdicional: (ligado: boolean) => void;
  /** Some com os números enquanto não houver peça informada. */
  temDados: boolean;
};

function Linha({
  rotulo,
  valor,
  forte = false,
}: {
  rotulo: string;
  valor: string;
  forte?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-1.5">
      <dt className={`text-sm ${forte ? 'text-on-dark' : 'text-on-dark-muted'}`}>
        {rotulo}
      </dt>
      <dd
        className={`tabular-nums ${
          forte ? 'text-base font-semibold text-on-dark' : 'text-sm text-on-dark-body'
        }`}
      >
        {valor}
      </dd>
    </div>
  );
}

export default function CartaoPlataforma({
  marketplace,
  resultado,
  ajustePercentual,
  ajusteFixo,
  onAjustePercentual,
  onAjusteFixo,
  adicionalLigado,
  onAdicional,
  temDados,
}: Props) {
  const [ajustando, setAjustando] = useState(false);
  const painelId = `ajuste-${marketplace.id}`;
  const prejuizo = temDados && resultado.lucroReal < 0;

  return (
    <article className="card-dark flex flex-col p-6">
      <header className="mb-5 border-b border-white/10 pb-4">
        <h3 className="text-lg font-bold text-on-dark">{marketplace.nome}</h3>
        <p className="mt-1 text-xs text-on-dark-muted">
          Taxas vigentes desde {marketplace.vigenteDesde}
        </p>
      </header>

      {temDados ? (
        <>
          {/* O lucro real é o número que a pessoa veio buscar, então ele vem
              primeiro e em corpo maior, antes da memória de cálculo. */}
          <div className="mb-5">
            <p className="text-xs uppercase tracking-[0.16em] text-on-dark-muted">
              {prejuizo ? 'Prejuízo por peça' : 'Sobra por peça'}
            </p>
            {/* Cor não é o único sinal do prejuízo: o rótulo acima e o aviso
                abaixo dizem a mesma coisa em texto. danger-border, e não
                danger-ink, porque o ink é escuro demais sobre carbon-950. */}
            <p
              className={`mt-1 text-3xl font-bold tabular-nums ${
                prejuizo ? 'text-danger-border' : 'text-acid-400'
              }`}
            >
              {formatarBRL(resultado.lucroReal)}
            </p>
            <p className="mt-1 text-sm text-on-dark-body">
              Margem de {formatarPct(resultado.margemRealPct)} sobre o preço de venda
            </p>
          </div>

          {prejuizo && (
            <p className="mb-5 flex items-start gap-2 rounded-frame border border-danger-border/40 bg-danger-border/10 p-3 text-sm text-danger-border">
              <WarningCircle size={18} weight="duotone" aria-hidden="true" className="mt-0.5 shrink-0" />
              <span>
                Esse preço não cobre a produção mais as taxas. Suba o preço ou reduza o
                custo da peça.
              </span>
            </p>
          )}

          <dl className="mb-5 divide-y divide-white/5">
            <Linha
              rotulo={`Comissão (${formatarPct(resultado.percentualAplicado)})`}
              valor={`- ${formatarBRL(resultado.comissao)}`}
            />
            <Linha rotulo="Taxa por item" valor={`- ${formatarBRL(resultado.taxaFixa)}`} />
            {marketplace.adicional && adicionalLigado && (
              <Linha
                rotulo={marketplace.adicional.rotulo}
                valor={`- ${formatarBRL(resultado.adicional)}`}
              />
            )}
            <Linha
              rotulo={`Total de taxas (${formatarPct(resultado.pesoTaxasPct)})`}
              valor={`- ${formatarBRL(resultado.taxasTotais)}`}
            />
            <Linha rotulo="Você recebe" valor={formatarBRL(resultado.liquido)} forte />
          </dl>
        </>
      ) : (
        <p className="mb-5 text-sm text-on-dark-muted">
          Informe o peso da peça e o preço do rolo para ver quanto sobra aqui.
        </p>
      )}

      <div className="mt-auto">
        {marketplace.adicional && (
          <label className="mb-4 flex cursor-pointer items-start gap-3 text-sm text-on-dark-body">
            <input
              type="checkbox"
              checked={adicionalLigado}
              onChange={(e) => onAdicional(e.target.checked)}
              className="mt-0.5 size-4 shrink-0 accent-acid-400"
            />
            <span>
              {marketplace.adicional.rotulo}
              <span className="mt-0.5 block text-xs text-on-dark-muted">
                {marketplace.adicional.descricao}
              </span>
            </span>
          </label>
        )}

        <button
          type="button"
          onClick={() => setAjustando((aberto) => !aberto)}
          aria-expanded={ajustando}
          aria-controls={painelId}
          className="inline-flex items-center gap-2 text-sm font-semibold text-acid-400 transition-colors duration-200 hover:text-acid-500"
        >
          <SlidersHorizontal size={16} weight="duotone" aria-hidden="true" />
          {ajustando ? 'Fechar ajuste' : 'Ajustar as taxas'}
        </button>

        {ajustando && (
          <div id={painelId} className="mt-4 grid gap-4 sm:grid-cols-2">
            <CampoNumero
              rotulo="Comissão"
              valor={ajustePercentual}
              onChange={onAjustePercentual}
              sufixo="%"
              placeholder={formatarPct(resultado.percentualAplicado).replace('%', '')}
              ajuda="Deixe vazio para usar a faixa da plataforma."
            />
            <CampoNumero
              rotulo="Taxa por item"
              valor={ajusteFixo}
              onChange={onAjusteFixo}
              prefixo="R$"
              placeholder={resultado.taxaFixa.toFixed(2).replace('.', ',')}
              ajuda="Deixe vazio para usar a faixa da plataforma."
            />
          </div>
        )}

        <p className="mt-4 text-xs leading-relaxed text-on-dark-muted">
          {marketplace.observacao}
        </p>

        <a
          href={marketplace.fonte}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-1.5 text-xs font-semibold text-on-dark-body transition-colors duration-200 hover:text-acid-400"
        >
          Conferir na fonte
          <ArrowSquareOut size={13} weight="bold" aria-hidden="true" />
        </a>
      </div>
    </article>
  );
}
