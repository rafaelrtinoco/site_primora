import { useId } from 'react';
import { CaretDown } from '@phosphor-icons/react';
import { campoClassesEscuro } from '../ui/estilosCompartilhados';

type Opcao = { valor: string; rotulo: string };

type Props = {
  rotulo: string;
  valor: string;
  onChange: (valor: string) => void;
  opcoes: Opcao[];
  ajuda?: string;
};

/**
 * Select da calculadora, com a mesma moldura do CampoNumero.
 *
 * `appearance-none` troca a setinha nativa pelo caret do Phosphor, porque a
 * nativa do macOS e do Windows ignora a cor do tema e aparece cinza no meio do
 * campo escuro. O elemento continua sendo um <select> de verdade, então
 * teclado e leitor de tela seguem funcionando sem nada a mais.
 */
export default function CampoSelect({
  rotulo,
  valor,
  onChange,
  opcoes,
  ajuda,
}: Props) {
  const id = useId();
  const ajudaId = ajuda ? `${id}-ajuda` : undefined;

  return (
    <div>
      <label htmlFor={id} className="mb-2 block text-sm font-medium text-on-dark-body">
        {rotulo}
      </label>

      <div className="relative">
        <select
          id={id}
          value={valor}
          onChange={(e) => onChange(e.target.value)}
          aria-describedby={ajudaId}
          className={`${campoClassesEscuro} cursor-pointer appearance-none pr-11`}
        >
          {opcoes.map((opcao) => (
            /* O <option> herda o fundo do sistema, não o do campo: sem a cor
               explícita, a lista aberta sai com texto claro sobre branco em
               parte dos navegadores. */
            <option key={opcao.valor} value={opcao.valor} className="bg-carbon-900 text-on-dark">
              {opcao.rotulo}
            </option>
          ))}
        </select>

        <CaretDown
          size={16}
          weight="bold"
          aria-hidden="true"
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-on-dark-muted"
        />
      </div>

      {ajuda && (
        <p id={ajudaId} className="mt-2 text-xs text-on-dark-muted">
          {ajuda}
        </p>
      )}
    </div>
  );
}
