import { ArrowRight } from '@phosphor-icons/react';
import Button from '../ui/Button';
import { Reveal, RevealGroup, RevealItem } from '../ui/Reveal';
import Simbolo from '/praxis-simbolo-720.webp';

/* O que cada passo resolve. Substituiu a lista de comissões que ficava aqui:
   o público é quem está começando em impressão 3D, e abrir a página com
   "20% + R$ 4 até R$ 79,99" cobra um repertório que essa pessoa ainda não
   tem. A tabela de taxas segue existindo, no passo 2, onde faz sentido. */
const RESUMO = [
  {
    nome: 'Passo 1',
    regra: 'Filamento, energia e desgaste da sua impressora viram o custo real da peça.',
  },
  {
    nome: 'Passo 2',
    regra: 'Comissão, taxa por item e imposto entram para achar o preço de anúncio.',
  },
  {
    nome: '7 impressoras',
    regra: 'Consumo já preenchido, da Ender 3 V3 SE à Bambu Lab P1S.',
  },
];

export default function HeroCalculadora() {
  return (
    <section
      id="hero"
      aria-labelledby="hero-title"
      className="relative isolate overflow-hidden bg-surface-dark"
    >
      <div className="hero-mesh" aria-hidden="true" />
      <div className="hero-grid" aria-hidden="true" />

      {/* Mesma textura do hero anterior: o símbolo é fundo, não ilustração.
          fetchPriority baixo para não disputar com o h1, que é o LCP. */}
      <img
        src={Simbolo}
        alt=""
        aria-hidden="true"
        width={720}
        height={720}
        decoding="async"
        fetchPriority="low"
        className="hero-symbol -right-[18%] top-[6%] w-[min(78vw,640px)] md:-right-[8%]"
      />

      <div className="container mx-auto px-4 pb-16 pt-36 md:pb-24 md:pt-48 lg:px-8">
        <Reveal as="p" className="eyebrow mb-6 text-on-dark-accent">
          Calculadora de custos para impressão 3D
        </Reveal>

        {/* Sem animar opacidade: este h1 é o LCP da página. */}
        <h1 id="hero-title" className="hero-title text-on-dark">
          <span className="block">Você sabe quanto</span>
          <span className="block">custa sua peça.</span>
          <span className="block text-on-dark-accent">Sabe quanto sobra?</span>
        </h1>

        <Reveal as="p" className="hero-sub mt-8 text-on-dark-body">
          Em dois passos. Primeiro você descobre quanto custa produzir a peça e por quanto
          vender direto. Depois, se for anunciar em marketplace, a segunda conta devolve o
          preço que mantém sua margem de pé depois das taxas.
        </Reveal>

        <Reveal as="div" className="mt-10">
          <Button href="#calculadora" size="lg" icon={ArrowRight}>
            Calcular minha peça
          </Button>
        </Reveal>

        <RevealGroup
          as="ul"
          stagger={0.06}
          className="mt-14 grid gap-4 border-t border-white/10 pt-8 sm:grid-cols-3"
        >
          {RESUMO.map((item) => (
            <RevealItem as="li" key={item.nome}>
              <p className="text-sm font-bold text-on-dark">{item.nome}</p>
              <p className="mt-1 text-sm text-on-dark-muted">{item.regra}</p>
            </RevealItem>
          ))}
        </RevealGroup>
      </div>
    </section>
  );
}
