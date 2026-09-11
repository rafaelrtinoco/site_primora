import { useEffect, useRef } from 'react';
import { criarCenaFerramentas, type ControleCena, type FerramentaCena } from './construirCena';

type Props = {
  ferramentas: FerramentaCena[];
  activeIndex: number;
  onSelecionar: (indice: number) => void;
};

/**
 * Alvo do React.lazy em Ferramentas.tsx. É a única peça que importa `three`
 * (via construirCena.ts), então nada aqui pesa no bundle inicial: o chunk só
 * é buscado quando a seção entra perto da viewport.
 *
 * Este componente cuida só do ciclo de vida: cria a cena no mount, garante
 * que ela some do WebGL no unmount, e pausa o loop de render quando a seção
 * sai da tela ou a aba fica oculta. A montagem/desmontagem imperativa da
 * cena em si vive em construirCena.ts.
 */
export default function CenaFerramentas({ ferramentas, activeIndex, onSelecionar }: Props) {
  const hostRef = useRef<HTMLDivElement>(null);
  const controleRef = useRef<ControleCena | null>(null);

  // Sempre a versão mais recente do callback, sem recriar a cena a cada
  // renderização do componente pai. Atribuição em efeito, não durante o
  // render: o React 19 proíbe mutar ref fora de evento/efeito.
  const onSelecionarRef = useRef(onSelecionar);
  useEffect(() => {
    onSelecionarRef.current = onSelecionar;
  });

  useEffect(() => {
    const host = hostRef.current;
    if (!host) return;

    const controle = criarCenaFerramentas(host, ferramentas, {
      onSelecionar: (indice) => onSelecionarRef.current(indice),
    });
    controleRef.current = controle;

    // Loop pausa fora da viewport (rolou pra frente na página) e com a aba
    // oculta. O gate de "só monta perto da viewport" já fica em
    // Ferramentas.tsx; isto aqui cobre o que acontece depois de montado.
    const intersectionObserver = new IntersectionObserver(
      ([entrada]) => {
        if (entrada.isIntersecting) controle.retomar();
        else controle.pausar();
      },
      { threshold: 0.1 },
    );
    intersectionObserver.observe(host);

    function aoMudarVisibilidade() {
      if (document.hidden) controle.pausar();
      else controle.retomar();
    }
    document.addEventListener('visibilitychange', aoMudarVisibilidade);

    return () => {
      intersectionObserver.disconnect();
      document.removeEventListener('visibilitychange', aoMudarVisibilidade);
      controleRef.current = null;
      controle.dispose();
    };
    // ferramentas vem de site.ts e não muda em runtime: só a montagem inicial importa.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    controleRef.current?.selecionar(activeIndex);
  }, [activeIndex]);

  return <div ref={hostRef} className="size-full" aria-hidden="true" />;
}
