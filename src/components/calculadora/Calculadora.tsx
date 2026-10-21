import { useMemo, useState, type ReactNode } from 'react';
import {
  ArrowCounterClockwise,
  Clock,
  Info,
  Percent,
  Stack,
  TrendUp,
  type Icon,
} from '@phosphor-icons/react';
import Section from '../ui/Section';
import SectionHeader from '../ui/SectionHeader';
import IconFrame from '../ui/IconFrame';
import { Reveal } from '../ui/Reveal';
import CampoNumero from './CampoNumero';
import SeletorImpressora from './SeletorImpressora';
import Precificador from './Precificador';
import {
  TARIFA_KWH_PADRAO,
  VIDA_UTIL_HORAS_PADRAO,
  impressoras,
  type Material,
} from '../../content/impressoras';
import {
  calcularCusto,
  calcularCustoHora,
  formatarBRL,
  formatarPct,
  lerNumero,
} from '../../lib/calculadora';

/** Valores que a referência traz como recomendados. */
const PADRAO = { reservaFalhas: '10', lucroDesejado: '50' };

/** A mais vendida da lista abre selecionada, para o campo não nascer vazio. */
const IMPRESSORA_INICIAL = impressoras[1];

/** Peça de exemplo, para quem quer ver a conta funcionando antes de medir a sua.
    Sem custo da hora: ele agora sai do modelo de impressora selecionado. */
const EXEMPLO = {
  pesoPeca: '120',
  precoRolo: '120',
  tempoHoras: '5',
};

/** Bloco de campos com título, para separar filamento, máquina e margens. */
function Grupo({
  titulo,
  icone: Icone,
  etiqueta,
  children,
}: {
  titulo: string;
  icone: Icon;
  etiqueta: string;
  children: ReactNode;
}) {
  return (
    <fieldset className="card-dark p-5 md:p-6">
      <legend className="sr-only">{titulo}</legend>
      <div className="mb-5 flex items-center justify-between gap-3 border-b border-white/10 pb-4">
        <p className="flex items-center gap-2.5 text-sm font-bold uppercase tracking-[0.12em] text-on-dark">
          <Icone size={18} weight="duotone" aria-hidden="true" className="text-acid-400" />
          {titulo}
        </p>
        <span className="shrink-0 rounded-control border border-white/12 px-3 py-1 text-xs text-on-dark-muted">
          {etiqueta}
        </span>
      </div>
      <div className="grid gap-5 sm:grid-cols-2">{children}</div>
    </fieldset>
  );
}

export default function Calculadora() {
  const [pesoPeca, setPesoPeca] = useState('');
  const [precoRolo, setPrecoRolo] = useState('');
  const [tempoHoras, setTempoHoras] = useState('');
  const [reservaFalhas, setReservaFalhas] = useState(PADRAO.reservaFalhas);
  const [lucroDesejado, setLucroDesejado] = useState(PADRAO.lucroDesejado);

  /* Máquina: o modelo escolhido preenche consumo e depreciação, e o custo da
     hora passa a ser resultado em vez de pergunta. `custoHoraManual` só entra
     em cena quando a pessoa escolhe "Outra". */
  const [impressoraId, setImpressoraId] = useState(IMPRESSORA_INICIAL.id);
  const [material, setMaterial] = useState<Material>('pla');
  const [tarifaKwh, setTarifaKwh] = useState(String(TARIFA_KWH_PADRAO));
  const [precoMaquina, setPrecoMaquina] = useState(String(IMPRESSORA_INICIAL.precoBrl));
  const [vidaUtilHoras, setVidaUtilHoras] = useState(String(VIDA_UTIL_HORAS_PADRAO));
  const [custoHoraManual, setCustoHoraManual] = useState('');

  const impressora = impressoras.find((i) => i.id === impressoraId) ?? null;

  const custoHoraCalculado = useMemo(
    () =>
      impressora
        ? calcularCustoHora({
            impressora,
            material,
            tarifaKwh: lerNumero(tarifaKwh),
            precoMaquina: lerNumero(precoMaquina),
            vidaUtilHoras: lerNumero(vidaUtilHoras),
          })
        : null,
    [impressora, material, tarifaKwh, precoMaquina, vidaUtilHoras],
  );

  const custoHoraEfetivo = custoHoraCalculado
    ? custoHoraCalculado.custoHora
    : lerNumero(custoHoraManual);

  /* Trocar de modelo traz o preço de referência do novo: máquina diferente,
     preço diferente. Quem já tinha corrigido o valor corrige de novo, o que é
     melhor do que manter o preço da máquina anterior em silêncio. */
  function trocarImpressora(id: string) {
    setImpressoraId(id);
    const nova = impressoras.find((i) => i.id === id);
    if (nova) setPrecoMaquina(String(nova.precoBrl));
  }

  const custo = useMemo(
    () =>
      calcularCusto({
        pesoPecaG: lerNumero(pesoPeca),
        precoRoloKg: lerNumero(precoRolo),
        tempoHoras: lerNumero(tempoHoras),
        custoHora: custoHoraEfetivo,
        reservaFalhasPct: lerNumero(reservaFalhas),
        lucroDesejadoPct: lerNumero(lucroDesejado),
      }),
    [pesoPeca, precoRolo, tempoHoras, custoHoraEfetivo, reservaFalhas, lucroDesejado],
  );

  /* A peça só conta como informada quando tem custo de verdade. Sem isso, um
     peso digitado sem preço de rolo mostraria R$ 0,00 como se fosse resultado. */
  const temDados = custo.custoTotal > 0;

  function limpar() {
    setPesoPeca('');
    setPrecoRolo('');
    setTempoHoras('');
    setReservaFalhas(PADRAO.reservaFalhas);
    setLucroDesejado(PADRAO.lucroDesejado);
    trocarImpressora(IMPRESSORA_INICIAL.id);
    setMaterial('pla');
    setTarifaKwh(String(TARIFA_KWH_PADRAO));
    setVidaUtilHoras(String(VIDA_UTIL_HORAS_PADRAO));
    setCustoHoraManual('');
  }

  function preencherExemplo() {
    setPesoPeca(EXEMPLO.pesoPeca);
    setPrecoRolo(EXEMPLO.precoRolo);
    setTempoHoras(EXEMPLO.tempoHoras);
  }

  return (
    /* Duas seções irmãs, não aninhadas: cada <Section> dona do próprio ritmo
       vertical e do próprio fundo. O custo de produção desce como prop, que
       aqui é mais honesto que um CustomEvent: o Precificador depende do número
       para existir, e o contrato de evento do projeto é para enriquecimento,
       nunca para dependência. */
    <>
    <Section id="calculadora" tone="dark" labelledBy="calculadora-title">
      <SectionHeader
        id="calculadora-title"
        eyebrow="Passo 1 · Custo da peça"
        title={
          <>
            Quanto custa produzir,{' '}
            <span className="text-on-dark-accent">e por quanto vender direto.</span>
          </>
        }
        description="Comece pelo peso da peça e pelo preço do rolo de filamento. A conta mostra o custo real de produzir e um preço para vender direto, sem marketplace: WhatsApp, Instagram, feira ou encomenda. O resultado atualiza enquanto você digita."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_22rem] lg:items-start">
        {/* ---- Entradas ---- */}
        <form
          className="grid gap-5"
          onSubmit={(e) => e.preventDefault()}
          aria-label="Dados da peça"
        >
          <Grupo titulo="Filamento" icone={Stack} etiqueta="Obrigatório">
            <CampoNumero
              rotulo="Peso da peça"
              valor={pesoPeca}
              onChange={setPesoPeca}
              sufixo="g"
              placeholder="120"
              obrigatorio
              ajuda="Gramas de filamento da peça fatiada."
            />
            <CampoNumero
              rotulo="Preço do rolo"
              valor={precoRolo}
              onChange={setPrecoRolo}
              prefixo="R$"
              placeholder="120,00"
              obrigatorio
              ajuda="Valor pago por 1.000 g, ou seja, 1 kg."
            />
          </Grupo>

          <Grupo titulo="Impressora" icone={Clock} etiqueta="Opcional">
            <SeletorImpressora
              impressoraId={impressoraId}
              onImpressoraId={trocarImpressora}
              material={material}
              onMaterial={setMaterial}
              tarifaKwh={tarifaKwh}
              onTarifaKwh={setTarifaKwh}
              precoMaquina={precoMaquina}
              onPrecoMaquina={setPrecoMaquina}
              vidaUtilHoras={vidaUtilHoras}
              onVidaUtilHoras={setVidaUtilHoras}
              custoHoraManual={custoHoraManual}
              onCustoHoraManual={setCustoHoraManual}
              impressora={impressora}
              custoHora={custoHoraCalculado}
              tempoHoras={tempoHoras}
              onTempoHoras={setTempoHoras}
            />
          </Grupo>

          <Grupo titulo="Margens e segurança" icone={Percent} etiqueta="Recomendado">
            <CampoNumero
              rotulo="Reserva para falhas"
              valor={reservaFalhas}
              onChange={setReservaFalhas}
              sufixo="%"
              destaque={formatarPct(lerNumero(reservaFalhas))}
              ajuda="Cobre o material perdido numa impressão que falhou. Padrão: 10%."
            />
            <CampoNumero
              rotulo="Lucro desejado"
              valor={lucroDesejado}
              onChange={setLucroDesejado}
              sufixo="%"
              destaque={formatarPct(lerNumero(lucroDesejado))}
              ajuda="Aplicado sobre o custo da peça. Padrão: 50% a 100%."
            />
          </Grupo>

          <div className="flex flex-wrap gap-3">
            <button
              type="button"
              onClick={preencherExemplo}
              className="inline-flex items-center gap-2 rounded-control border border-white/25 px-5 py-3 text-sm font-semibold text-on-dark transition-colors duration-200 hover:border-acid-400 hover:text-acid-400"
            >
              Preencher com exemplo de 120 g
            </button>
            <button
              type="button"
              onClick={limpar}
              className="inline-flex items-center gap-2 rounded-control px-5 py-3 text-sm font-semibold text-on-dark-body transition-colors duration-200 hover:text-acid-400"
            >
              <ArrowCounterClockwise size={16} weight="bold" aria-hidden="true" />
              Limpar
            </button>
          </div>
        </form>

        {/* ---- Resultado ---- */}
        <aside
          className="card-dark p-6 lg:sticky lg:top-28"
          aria-label="Resultado do cálculo"
        >
          <p className="mb-5 flex items-center gap-2.5 border-b border-white/10 pb-4 text-sm font-bold uppercase tracking-[0.12em] text-on-dark">
            <TrendUp size={18} weight="duotone" aria-hidden="true" className="text-acid-400" />
            Resultado
          </p>

          {temDados ? (
            <>
              <dl className="divide-y divide-white/5">
                <div className="flex items-baseline justify-between gap-3 py-2">
                  <dt className="text-sm text-on-dark-muted">Filamento</dt>
                  <dd className="text-sm tabular-nums text-on-dark-body">
                    {formatarBRL(custo.custoFilamento)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 py-2">
                  <dt className="text-sm text-on-dark-muted">Máquina</dt>
                  <dd className="text-sm tabular-nums text-on-dark-body">
                    {formatarBRL(custo.custoImpressora)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 py-2">
                  <dt className="text-sm text-on-dark-muted">Reserva para falhas</dt>
                  <dd className="text-sm tabular-nums text-on-dark-body">
                    {formatarBRL(custo.reservaFalhas)}
                  </dd>
                </div>
                <div className="flex items-baseline justify-between gap-3 py-3">
                  <dt className="text-sm font-semibold text-on-dark">Custo da peça</dt>
                  <dd className="text-base font-semibold tabular-nums text-on-dark">
                    {formatarBRL(custo.custoTotal)}
                  </dd>
                </div>
              </dl>

              <div className="mt-5 rounded-frame border border-acid-400/30 bg-acid-400/8 p-4">
                <p className="text-xs uppercase tracking-[0.16em] text-on-dark-muted">
                  Preço para venda direta
                </p>
                <p className="mt-1 text-3xl font-bold tabular-nums text-acid-400">
                  {formatarBRL(custo.precoSugerido)}
                </p>
                <p className="mt-1 text-xs text-on-dark-body">
                  Custo mais {formatarPct(lerNumero(lucroDesejado))} de lucro. Serve para
                  vender por conta própria, sem comissão de plataforma.
                </p>
              </div>

              {/* Ponte para o passo 2. O custo já desce como prop, então aqui
                  basta dizer isso em voz alta: iniciante não adivinha que as
                  duas seções conversam. */}
              <p className="mt-5 border-t border-white/10 pt-5 text-xs leading-relaxed text-on-dark-muted">
                Vai vender em marketplace? A comissão, a taxa por item e o imposto mudam
                esse número.{' '}
                <a
                  href="#precificador"
                  className="font-semibold text-acid-400 underline underline-offset-4 transition-colors duration-200 hover:text-acid-500"
                >
                  Siga para o passo 2
                </a>
                , que já recebe o custo de {formatarBRL(custo.custoTotal)} calculado aqui.
              </p>
            </>
          ) : (
            <div className="py-8 text-center">
              <IconFrame icon={Info} size="lg" tone="invert" />
              <p className="mt-4 font-semibold text-on-dark">Aguardando dados da peça</p>
              <p className="mt-2 text-sm text-on-dark-body">
                Preencha o peso da peça e o preço do rolo para calcular seu custo.
              </p>
              <button
                type="button"
                onClick={preencherExemplo}
                className="mt-4 text-sm font-semibold text-acid-400 underline underline-offset-4 transition-colors duration-200 hover:text-acid-500"
              >
                Preencher com exemplo de 120 g
              </button>
            </div>
          )}
        </aside>
      </div>

      <Reveal
        as="p"
        className="mx-auto mt-12 max-w-3xl text-center text-xs leading-relaxed text-on-dark-muted"
      >
        O custo cobre filamento, energia, depreciação da máquina e reserva para falhas.
        Embalagem, imposto e comissão de plataforma ficam para o passo 2, porque dependem
        de onde você vende.
      </Reveal>
    </Section>

    <Precificador custoProducao={custo.custoTotal} />
    </>
  );
}
