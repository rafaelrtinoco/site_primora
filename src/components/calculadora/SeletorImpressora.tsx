import { useState } from 'react';
import { Lightning, SlidersHorizontal } from '@phosphor-icons/react';
import CampoNumero from './CampoNumero';
import CampoSelect from './CampoSelect';
import {
  IMPRESSORA_MANUAL,
  MULTIPLICADOR_MATERIAL,
  impressoras,
  type Impressora,
  type Material,
} from '../../content/impressoras';
import { formatarBRL, lerNumero, type ResultadoCustoHora } from '../../lib/calculadora';

type Props = {
  impressoraId: string;
  onImpressoraId: (id: string) => void;
  material: Material;
  onMaterial: (material: Material) => void;
  tarifaKwh: string;
  onTarifaKwh: (valor: string) => void;
  precoMaquina: string;
  onPrecoMaquina: (valor: string) => void;
  vidaUtilHoras: string;
  onVidaUtilHoras: (valor: string) => void;
  custoHoraManual: string;
  onCustoHoraManual: (valor: string) => void;
  /** `null` no modo manual, quando não há modelo escolhido. */
  impressora: Impressora | null;
  custoHora: ResultadoCustoHora | null;
  /** Horas desta peça. Mora aqui porque é tempo de máquina. */
  tempoHoras: string;
  onTempoHoras: (valor: string) => void;
};

const OPCOES_IMPRESSORA = [
  ...impressoras.map((i) => ({ valor: i.id, rotulo: i.nome })),
  { valor: IMPRESSORA_MANUAL, rotulo: 'Outra, informar o custo da hora' },
];

const OPCOES_MATERIAL = (Object.keys(MULTIPLICADOR_MATERIAL) as Material[]).map((id) => ({
  valor: id,
  rotulo: MULTIPLICADOR_MATERIAL[id].nome,
}));

export default function SeletorImpressora({
  impressoraId,
  onImpressoraId,
  material,
  onMaterial,
  tarifaKwh,
  onTarifaKwh,
  precoMaquina,
  onPrecoMaquina,
  vidaUtilHoras,
  onVidaUtilHoras,
  custoHoraManual,
  onCustoHoraManual,
  impressora,
  custoHora,
  tempoHoras,
  onTempoHoras,
}: Props) {
  const [ajustando, setAjustando] = useState(false);
  const manual = impressoraId === IMPRESSORA_MANUAL;
  const fatorMaterial = MULTIPLICADOR_MATERIAL[material];
  const horas = lerNumero(tempoHoras);

  return (
    <>
      <CampoSelect
        rotulo="Qual a sua impressora?"
        valor={impressoraId}
        onChange={onImpressoraId}
        opcoes={OPCOES_IMPRESSORA}
        ajuda="Preenche sozinho o consumo de energia e a depreciação por hora."
      />

      <CampoNumero
        rotulo="Tempo de impressão"
        valor={tempoHoras}
        onChange={onTempoHoras}
        sufixo="horas"
        placeholder="5"
        ajuda="Duração total informada pelo slicer."
      />

      {manual ? (
        <CampoNumero
          rotulo="Custo da hora"
          valor={custoHoraManual}
          onChange={onCustoHoraManual}
          prefixo="R$"
          placeholder="2,00"
          sufixo="/h"
          ajuda="Energia elétrica mais depreciação da máquina."
        />
      ) : (
        custoHora && (
          /* Memória de cálculo visível: o número que entra no custo da peça é
             o mesmo que a pessoa consegue conferir aqui, parcela por parcela.
             Caixa, e não campo, porque ele é resultado e não entrada. */
          <div className="rounded-frame border border-white/12 bg-white/5 p-4 sm:col-span-2">
            <p className="flex items-center gap-2 text-sm font-medium text-on-dark-body">
              <Lightning
                size={16}
                weight="duotone"
                aria-hidden="true"
                className="text-acid-400"
              />
              Custo da hora
            </p>
            <p className="mt-1 text-2xl font-bold tabular-nums text-on-dark">
              {formatarBRL(custoHora.custoHora)}
              <span className="ml-1 text-base font-medium text-on-dark-muted">/h</span>
            </p>
            <p className="mt-2 text-xs leading-relaxed text-on-dark-muted">
              {formatarBRL(custoHora.custoEnergiaHora)} de energia com{' '}
              {Math.round(custoHora.consumoW)} W médios, mais{' '}
              {formatarBRL(custoHora.custoDepreciacaoHora)} de depreciação.
            </p>
            {horas > 0 && (
              <p className="mt-2 border-t border-white/10 pt-2 text-xs text-on-dark-body">
                Nesta peça, {horas.toLocaleString('pt-BR')} h de máquina custam{' '}
                <strong className="font-semibold text-on-dark">
                  {formatarBRL(custoHora.custoHora * horas)}
                </strong>
                .
              </p>
            )}
          </div>
        )
      )}

      {!manual && impressora && (
        <div className="sm:col-span-2">
          <button
            type="button"
            onClick={() => setAjustando((aberto) => !aberto)}
            aria-expanded={ajustando}
            aria-controls="ajuste-maquina"
            className="inline-flex items-center gap-2 text-sm font-semibold text-acid-400 transition-colors duration-200 hover:text-acid-500"
          >
            <SlidersHorizontal size={16} weight="duotone" aria-hidden="true" />
            {ajustando ? 'Fechar ajuste' : 'Ajustar energia e depreciação'}
          </button>

          {ajustando && (
            <div id="ajuste-maquina" className="mt-4 grid gap-5 sm:grid-cols-2">
              <CampoSelect
                rotulo="Material"
                valor={material}
                onChange={(v) => onMaterial(v as Material)}
                opcoes={OPCOES_MATERIAL}
                ajuda={
                  fatorMaterial.estimado
                    ? 'Consumo do PETG é interpolado, não medido.'
                    : 'Consumo medido pelo fabricante.'
                }
              />
              <CampoNumero
                rotulo="Tarifa de energia"
                valor={tarifaKwh}
                onChange={onTarifaKwh}
                prefixo="R$"
                sufixo="/kWh"
                ajuda="Copie da sua conta de luz. Padrão: média nacional."
              />
              <CampoNumero
                rotulo="Preço da máquina"
                valor={precoMaquina}
                onChange={onPrecoMaquina}
                prefixo="R$"
                ajuda="Quanto você pagou. Padrão: preço de referência do modelo."
              />
              <CampoNumero
                rotulo="Vida útil estimada"
                valor={vidaUtilHoras}
                onChange={onVidaUtilHoras}
                sufixo="horas"
                ajuda="Horas de trabalho até a troca. Padrão: 2.000 h."
              />
              <p className="text-xs leading-relaxed text-on-dark-muted sm:col-span-2">
                {impressora.origem === 'fabricante'
                  ? `Consumo de ${impressora.nome} publicado pelo fabricante, medido imprimindo.`
                  : `Consumo de ${impressora.nome} estimado a partir de medição de terceiros.`}{' '}
                É consumo médio durante a impressão, não potência de placa: o pico de
                aquecimento da mesa é muito maior e dura poucos minutos.
              </p>
            </div>
          )}
        </div>
      )}
    </>
  );
}
