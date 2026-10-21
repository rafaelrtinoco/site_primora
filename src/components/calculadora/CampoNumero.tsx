import { useId } from 'react';
import { campoClassesEscuro } from '../ui/estilosCompartilhados';

type Props = {
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  /** Texto curto abaixo do campo, explicando de onde sai o número. */
  ajuda?: string;
  /** Unidade colada à esquerda, como o "R$" de um preço. */
  prefixo?: string;
  /** Unidade colada à direita, como "g", "horas" ou "%". */
  sufixo?: string;
  placeholder?: string;
  obrigatorio?: boolean;
  /** Valor em destaque no canto do rótulo, usado nos campos de percentual. */
  destaque?: string;
};

/**
 * Campo numérico da calculadora.
 *
 * O valor trafega como string, e não como number, de propósito: com number o
 * campo não pode ficar vazio, e apagar o conteúdo para digitar outro valor
 * viraria um 0 teimoso no meio da edição. A conversão acontece uma vez só, em
 * `lerNumero`, na hora de calcular.
 *
 * `inputMode="decimal"` abre o teclado numérico no celular sem recorrer a
 * `type="number"`, que traz as setinhas de incremento e rejeita vírgula em
 * parte dos navegadores.
 */
export default function CampoNumero({
  rotulo,
  valor,
  onChange,
  ajuda,
  prefixo,
  sufixo,
  placeholder,
  obrigatorio = false,
  destaque,
}: Props) {
  const id = useId();
  const ajudaId = ajuda ? `${id}-ajuda` : undefined;

  return (
    <div>
      <div className="mb-2 flex items-baseline justify-between gap-3">
        <label htmlFor={id} className="text-sm font-medium text-on-dark-body">
          {rotulo}
          {obrigatorio && (
            <span className="ml-1 text-acid-400" aria-hidden="true">
              *
            </span>
          )}
        </label>
        {destaque && (
          <span className="text-sm font-bold text-acid-400 tabular-nums">{destaque}</span>
        )}
      </div>

      <div className="relative">
        {prefixo && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-sm font-semibold text-on-dark-muted"
          >
            {prefixo}
          </span>
        )}

        <input
          id={id}
          type="text"
          inputMode="decimal"
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          aria-describedby={ajudaId}
          required={obrigatorio}
          className={`${campoClassesEscuro} tabular-nums ${prefixo ? 'pl-11' : ''} ${
            sufixo ? 'pr-16' : ''
          }`}
        />

        {sufixo && (
          <span
            aria-hidden="true"
            className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-sm text-on-dark-muted"
          >
            {sufixo}
          </span>
        )}
      </div>

      {ajuda && (
        <p id={ajudaId} className="mt-2 text-xs text-on-dark-muted">
          {ajuda}
        </p>
      )}
    </div>
  );
}
