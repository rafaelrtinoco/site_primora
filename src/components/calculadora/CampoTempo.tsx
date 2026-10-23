import { useId, useRef } from 'react';
import { campoClassesEscuro } from '../ui/estilosCompartilhados';

type Props = {
  horas: string;
  onHoras: (valor: string) => void;
  minutos: string;
  onMinutos: (valor: string) => void;
  /** Texto curto abaixo do campo, explicando de onde sai o número. */
  ajuda?: string;
};

/**
 * Tempo de impressão, em horas e minutos.
 *
 * São dois campos, e não um único texto no formato "hh:mm", por causa do
 * teclado do celular: `inputMode="decimal"` abre o teclado numérico, e esse
 * teclado não tem a tecla de dois pontos. Um campo único em "hh:mm" obrigaria
 * `inputMode="text"`, ou seja, teclado alfabético completo para digitar número,
 * justamente em quem mais precisa do numérico. Dois campos numéricos funcionam
 * em qualquer teclado e não têm ambiguidade de leitura.
 *
 * Mesmo assim o campo de horas aceita "5:30" e "5h30": no desktop a pessoa
 * copia a duração inteira do slicer, e separar à mão é trabalho que o
 * componente faz melhor. Digitar só o separador move o foco para os minutos,
 * então o formato "hh:mm" funciona tecla por tecla também.
 *
 * O valor trafega como string pelo mesmo motivo do `CampoNumero`: com number o
 * campo não pode ficar vazio. A conversão para horas decimais acontece uma vez,
 * em `lerTempoHoras`.
 */
export default function CampoTempo({
  horas,
  onHoras,
  minutos,
  onMinutos,
  ajuda,
}: Props) {
  const id = useId();
  const ajudaId = ajuda ? `${id}-ajuda` : undefined;
  const minutosRef = useRef<HTMLInputElement>(null);

  /* Separador digitado ou colado no campo de horas: "5:30" vira 5 e 30, "5:"
     apenas leva o foco adiante. Sem isso, o ":" seria descartado a cada tecla
     e "5:30" chegaria ao estado como "530". */
  function receberHoras(texto: string) {
    const separador = texto.search(/[:hH]/);

    if (separador === -1) {
      onHoras(texto);
      return;
    }

    onHoras(texto.slice(0, separador));

    const resto = texto.slice(separador + 1).replace(/\D/g, '');
    if (resto !== '') onMinutos(resto);

    minutosRef.current?.focus();
  }

  return (
    <div role="group" aria-labelledby={`${id}-rotulo`} aria-describedby={ajudaId}>
      <p
        id={`${id}-rotulo`}
        className="mb-2 text-sm font-medium text-on-dark-body"
      >
        Tempo de impressão
      </p>

      <div className="flex items-center gap-2">
        <div className="relative flex-1">
          <input
            id={`${id}-horas`}
            type="text"
            inputMode="decimal"
            aria-label="Horas de impressão"
            value={horas}
            onChange={(e) => receberHoras(e.target.value)}
            placeholder="5"
            className={`${campoClassesEscuro} pr-8 tabular-nums`}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-on-dark-muted"
          >
            h
          </span>
        </div>

        <div className="relative flex-1">
          <input
            ref={minutosRef}
            id={`${id}-minutos`}
            type="text"
            inputMode="numeric"
            aria-label="Minutos de impressão"
            value={minutos}
            onChange={(e) => onMinutos(e.target.value)}
            placeholder="30"
            className={`${campoClassesEscuro} pr-12 tabular-nums`}
          />
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-on-dark-muted"
          >
            min
          </span>
        </div>
      </div>

      {ajuda && (
        <p id={ajudaId} className="mt-2 text-xs text-on-dark-muted">
          {ajuda}
        </p>
      )}
    </div>
  );
}
