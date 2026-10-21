import { useMemo, useState } from 'react';
import { Package, Receipt, Tag, WarningCircle } from '@phosphor-icons/react';
import Section from '../ui/Section';
import SectionHeader from '../ui/SectionHeader';
import { Reveal } from '../ui/Reveal';
import CampoNumero from './CampoNumero';
import CampoSelect from './CampoSelect';
import { marketplaces } from '../../content/marketplaces';
import {
  calcularPrecoSugerido,
  formatarBRL,
  formatarPct,
  lerNumero,
} from '../../lib/calculadora';

type Props = {
  /** Custo de produção vindo da calculadora acima. */
  custoProducao: number;
};

const SEM_MARKETPLACE = 'nenhum';

const OPCOES_MARKETPLACE = [
  ...marketplaces.map((m) => ({ valor: m.id, rotulo: m.nome })),
  { valor: SEM_MARKETPLACE, rotulo: 'Outro, informar as taxas' },
];

/**
 * Alíquota nominal da primeira faixa de cada anexo do Simples Nacional.
 *
 * Peça impressa vendida pronta cai no Anexo I (comércio); quem fabrica sob
 * encomenda pode cair no Anexo II. As faixas seguem as mesmas de 2025, e a
 * transição de CBS e IBS não muda o DAS em 2026.
 *
 * É alíquota NOMINAL da primeira faixa. Acima de R$ 180 mil de receita em 12
 * meses entra a parcela a deduzir e a alíquota efetiva passa a ser menor que a
 * nominal da faixa. Quem precisa do número exato pega com a contabilidade, e
 * por isso o campo é editável.
 */
const SIMPLES = { anexoI: 4, anexoII: 4.5, anexoIII: 6 };

function Linha({
  rotulo,
  valor,
  sinal = '',
  forte = false,
}: {
  rotulo: string;
  valor: string;
  sinal?: string;
  forte?: boolean;
}) {
  return (
    <div className="flex items-baseline justify-between gap-3 py-2">
      <dt className={`text-sm ${forte ? 'font-semibold text-on-dark' : 'text-on-dark-muted'}`}>
        {rotulo}
      </dt>
      <dd
        className={`tabular-nums ${
          forte ? 'text-base font-semibold text-on-dark' : 'text-sm text-on-dark-body'
        }`}
      >
        {sinal}
        {valor}
      </dd>
    </div>
  );
}

export default function Precificador({ custoProducao }: Props) {
  /* Vazio significa "usa o custo que veio da calculadora de cima". Só vira
     número próprio quando a pessoa decide precificar outra coisa. */
  const [custoManual, setCustoManual] = useState('');
  const [embalagem, setEmbalagem] = useState('');
  /* String, e não MarketplaceId: o select também carrega SEM_MARKETPLACE. */
  const [marketplaceId, setMarketplaceId] = useState<string>(marketplaces[0].id);
  const [comissao, setComissao] = useState('');
  const [taxaFixa, setTaxaFixa] = useState('');
  const [imposto, setImposto] = useState('0');
  const [margem, setMargem] = useState('20');

  const marketplace =
    marketplaces.find((m) => m.id === marketplaceId) ?? null;
  const semMarketplace = marketplaceId === SEM_MARKETPLACE;

  const custoProduto =
    custoManual.trim() === '' ? custoProducao : lerNumero(custoManual);

  const resultado = useMemo(
    () =>
      calcularPrecoSugerido({
        custoProduto,
        embalagem: lerNumero(embalagem),
        /* No modo "Outro" não há faixa para consultar, então campo vazio vale
           zero em vez de delegar. */
        comissaoPct:
          comissao.trim() === '' ? (semMarketplace ? 0 : null) : lerNumero(comissao),
        taxaFixa:
          taxaFixa.trim() === '' ? (semMarketplace ? 0 : null) : lerNumero(taxaFixa),
        impostoPct: lerNumero(imposto),
        margemPct: lerNumero(margem),
        marketplace: semMarketplace ? null : marketplace,
      }),
    [custoProduto, embalagem, comissao, taxaFixa, imposto, margem, marketplace, semMarketplace],
  );

  const temCusto = custoProduto > 0;

  return (
    <Section id="precificador" tone="darkAlt" labelledBy="precificador-title">
      <SectionHeader
        id="precificador-title"
        eyebrow="Passo 2 · Preço no marketplace"
        title={
          <>
            Por quanto anunciar para a margem{' '}
            <span className="text-on-dark-accent">sobreviver às taxas.</span>
          </>
        }
        description="Só precisa deste passo quem vai vender em marketplace. Você diz a margem que quer e a conta devolve o preço que entrega essa margem depois da comissão, da taxa por item e do imposto. O custo já vem pronto do passo 1."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_24rem] lg:items-start">
        <form
          className="card-dark grid gap-5 p-5 sm:grid-cols-2 md:p-6"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Dados da precificação"
        >
          <div className="sm:col-span-2">
            <p className="flex items-center gap-2.5 border-b border-white/10 pb-4 text-sm font-bold uppercase tracking-[0.12em] text-on-dark">
              <Package size={18} weight="duotone" aria-hidden="true" className="text-acid-400" />
              Custo
            </p>
          </div>

          <CampoNumero
            rotulo="Custo do produto"
            valor={custoManual}
            onChange={setCustoManual}
            prefixo="R$"
            placeholder={custoProducao > 0 ? custoProducao.toFixed(2).replace('.', ',') : '40,00'}
            ajuda={
              custoProducao > 0
                ? 'Já vem da calculadora acima. Edite para precificar outra peça.'
                : 'Preencha a calculadora acima ou informe o custo aqui.'
            }
          />
          <CampoNumero
            rotulo="Embalagem"
            valor={embalagem}
            onChange={setEmbalagem}
            prefixo="R$"
            placeholder="0,00"
            ajuda="Caixa, plástico, etiqueta. Por unidade."
          />

          <div className="sm:col-span-2 mt-2">
            <p className="flex items-center gap-2.5 border-b border-white/10 pb-4 text-sm font-bold uppercase tracking-[0.12em] text-on-dark">
              <Receipt size={18} weight="duotone" aria-hidden="true" className="text-acid-400" />
              Taxas e imposto
            </p>
          </div>

          <div className="sm:col-span-2">
            <CampoSelect
              rotulo="Onde você vai vender"
              valor={marketplaceId}
              onChange={setMarketplaceId}
              opcoes={OPCOES_MARKETPLACE}
              ajuda={
                semMarketplace
                  ? 'Informe a comissão e a taxa por item nos campos abaixo.'
                  : 'Preenche a comissão e a taxa por item pela faixa de preço.'
              }
            />
          </div>

          <CampoNumero
            rotulo="Comissão do marketplace"
            valor={comissao}
            onChange={setComissao}
            sufixo="%"
            placeholder={
              semMarketplace ? '0' : formatarPct(resultado.comissaoPctAplicada).replace('%', '')
            }
            ajuda={semMarketplace ? 'Percentual cobrado sobre a venda.' : 'Vazio usa a faixa da plataforma.'}
          />
          <CampoNumero
            rotulo="Taxa por item vendido"
            valor={taxaFixa}
            onChange={setTaxaFixa}
            prefixo="R$"
            placeholder={
              semMarketplace ? '0,00' : resultado.taxaFixa.toFixed(2).replace('.', ',')
            }
            ajuda={semMarketplace ? 'Valor fixo por unidade.' : 'Vazio usa a faixa da plataforma.'}
          />

          <CampoNumero
            rotulo="Imposto sobre a venda"
            valor={imposto}
            onChange={setImposto}
            sufixo="%"
            ajuda={`Simples Nacional: ${formatarPct(SIMPLES.anexoI)} no Anexo I, ${formatarPct(SIMPLES.anexoII)} no Anexo II. Deixe 0 se não recolhe.`}
          />
          <CampoNumero
            rotulo="Margem de lucro desejada"
            valor={margem}
            onChange={setMargem}
            sufixo="%"
            destaque={formatarPct(lerNumero(margem))}
            ajuda="Sobre o preço de venda, não sobre o custo."
          />
        </form>

        <aside
          className="card-dark p-6 lg:sticky lg:top-28"
          aria-label="Preço de venda sugerido"
        >
          <p className="mb-5 flex items-center gap-2.5 border-b border-white/10 pb-4 text-sm font-bold uppercase tracking-[0.12em] text-on-dark">
            <Tag size={18} weight="duotone" aria-hidden="true" className="text-acid-400" />
            Preço sugerido
          </p>

          {!temCusto ? (
            <p className="py-6 text-sm text-on-dark-body">
              Informe o custo do produto, ou preencha a calculadora acima, para ver o
              preço sugerido.
            </p>
          ) : !resultado.viavel ? (
            /* Soma de percentuais a partir de 100% não tem preço possível: todo
               real a mais de preço gera um real a mais de taxa e margem. */
            <div className="py-2">
              <p className="flex items-start gap-2 rounded-frame border border-danger-border/40 bg-danger-border/10 p-3 text-sm text-danger-border">
                <WarningCircle
                  size={18}
                  weight="duotone"
                  aria-hidden="true"
                  className="mt-0.5 shrink-0"
                />
                <span>
                  Comissão, imposto e margem somam{' '}
                  {formatarPct(resultado.somaPercentual)}. A partir de 100% não existe
                  preço possível, porque cada real a mais de preço vira taxa e margem
                  na mesma proporção. Reduza a margem ou a comissão.
                </span>
              </p>
            </div>
          ) : (
            <>
              <p className="text-4xl font-bold tabular-nums text-acid-400">
                {formatarBRL(resultado.precoVenda)}
              </p>
              <p className="mt-2 text-sm text-on-dark-body">
                Anunciando por esse valor, sobram{' '}
                <strong className="font-semibold text-on-dark">
                  {formatarBRL(resultado.lucro)}
                </strong>{' '}
                por peça.
              </p>

              {resultado.faixaInstavel && (
                <p className="mt-4 flex items-start gap-2 rounded-frame border border-white/12 bg-white/5 p-3 text-xs leading-relaxed text-on-dark-body">
                  <WarningCircle
                    size={16}
                    weight="duotone"
                    aria-hidden="true"
                    className="mt-0.5 shrink-0 text-acid-400"
                  />
                  <span>
                    Esse preço cai bem no degrau de faixa da plataforma, onde a comissão
                    muda junto com a taxa por item. Confira a faixa no cartão da
                    plataforma e, se precisar, fixe a comissão no campo ao lado.
                  </span>
                </p>
              )}

              {/* A memória de cálculo é a prova: a margem conferida no fim tem
                  que bater com a que foi pedida. Se não bater, a conta está
                  errada e fica visível. */}
              <dl className="mt-5 divide-y divide-white/5 border-t border-white/10 pt-2">
                <Linha
                  rotulo="Preço de venda"
                  valor={formatarBRL(resultado.precoVenda)}
                  forte
                />
                <Linha
                  rotulo={`Comissão (${formatarPct(resultado.comissaoPctAplicada)})`}
                  valor={formatarBRL(resultado.comissao)}
                  sinal="- "
                />
                <Linha
                  rotulo="Taxa por item"
                  valor={formatarBRL(resultado.taxaFixa)}
                  sinal="- "
                />
                <Linha
                  rotulo={`Imposto (${formatarPct(lerNumero(imposto))})`}
                  valor={formatarBRL(resultado.imposto)}
                  sinal="- "
                />
                <Linha
                  rotulo="Produto e embalagem"
                  valor={formatarBRL(resultado.custosDiretos)}
                  sinal="- "
                />
                <Linha rotulo="Lucro" valor={formatarBRL(resultado.lucro)} forte />
              </dl>

              <p className="mt-4 rounded-frame border border-acid-400/30 bg-acid-400/8 p-3 text-xs leading-relaxed text-on-dark-body">
                Margem conferida:{' '}
                <strong className="font-semibold text-acid-400">
                  {formatarPct(resultado.margemConferida)}
                </strong>{' '}
                do preço de venda, que é a margem que você pediu.
              </p>
            </>
          )}
        </aside>
      </div>

      <Reveal
        as="p"
        className="mx-auto mt-10 max-w-3xl text-center text-xs leading-relaxed text-on-dark-muted"
      >
        A margem é calculada sobre o preço de venda, e não como markup sobre o custo.
        Somar a margem ao custo e deixar a plataforma descontar o percentual depois
        devolve menos do que você pediu, e é por isso que a conta aqui é uma divisão.
        A alíquota do Simples muda com a receita dos últimos 12 meses: confirme a sua
        com a contabilidade.
      </Reveal>
    </Section>
  );
}
