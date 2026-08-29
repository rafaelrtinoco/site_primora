import { Megaphone, Browsers, PenNib } from '@phosphor-icons/react';
import Section from './ui/Section';
import SectionHeader from './ui/SectionHeader';
import IconFrame from './ui/IconFrame';
import { RevealGroup, RevealItem } from './ui/Reveal';

const socialMedia = [
  {
    grupo: 'Estratégia e planejamento',
    itens: [
      'Estratégia de conteúdo',
      'Planejamento editorial mensal',
      'Calendário de publicações',
      'Campanhas sazonais',
    ],
  },
  {
    grupo: 'Produção de conteúdo',
    itens: [
      'Instagram, Facebook e demais redes',
      'Conteúdos institucionais',
      'Roteiros para vídeos e Reels',
      'Ideias e roteiros para Stories',
    ],
  },
  {
    grupo: 'Gestão das redes',
    itens: [
      'Programação e publicação',
      'Organização do feed',
      'Gestão de Stories',
      'Comentários e mensagens recebidas',
    ],
  },
  {
    grupo: 'Análise e otimização',
    itens: [
      'Alcance, engajamento e crescimento',
      'Formatos com melhor desempenho',
      'Relatórios periódicos',
      'Ajustes na estratégia',
    ],
  },
];

const sites = [
  'Site institucional',
  'Landing pages',
  'Páginas para geração de leads',
  'Formulários e canais de contato',
  'Otimização da experiência do usuário',
  'Atualização de conteúdos',
];

const artes = [
  'Artes para redes sociais',
  'Stories e Reels',
  'Banners digitais e para sites',
  'Materiais para campanhas comerciais',
  'Artes para WhatsApp',
  'Apresentações comerciais',
  'Materiais institucionais',
  'Peças para datas comemorativas',
];

function Bullet({ children }: { children: string }) {
  return (
    <li className="flex items-start gap-2.5 text-sm text-ink-muted">
      <span
        className="mt-2 size-1.5 shrink-0 rounded-full bg-brand-400"
        aria-hidden="true"
      />
      {children}
    </li>
  );
}

export default function Solutions() {
  return (
    <Section id="solutions" labelledBy="solutions-title">
      <SectionHeader
        id="solutions-title"
        eyebrow="Marketing"
        title="Presença digital que constrói autoridade"
        description="Planejamento, produção e acompanhamento — não é postar por postar, é construir reputação no mercado segurador."
      />

      {/* Layout assimétrico de propósito: um grid uniforme de 4 cards iguais
          trata assuntos de pesos diferentes como se fossem equivalentes. */}
      <RevealGroup className="grid gap-6 lg:grid-cols-3">
        <RevealItem className="card p-8 lg:col-span-2">
          <IconFrame icon={Megaphone} size="lg" />
          <h3 className="mb-2 mt-6 text-xl font-bold text-ink-strong">
            Social Media completo
          </h3>
          <p className="mb-8 text-sm text-ink-muted">
            Todo o processo de planejamento, produção, publicação e
            acompanhamento das redes da corretora.
          </p>

          <div className="grid gap-x-8 gap-y-7 sm:grid-cols-2">
            {socialMedia.map((bloco) => (
              <div key={bloco.grupo}>
                <h4 className="eyebrow mb-3 text-ink-brand">{bloco.grupo}</h4>
                <ul className="space-y-2">
                  {bloco.itens.map((item) => (
                    <Bullet key={item}>{item}</Bullet>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </RevealItem>

        <RevealItem className="card flex flex-col p-8">
          <IconFrame icon={Browsers} size="lg" />
          <h3 className="mb-2 mt-6 text-xl font-bold text-ink-strong">
            Sites e Landing Pages
          </h3>
          <p className="mb-6 text-sm text-ink-muted">
            Páginas construídas para transformar visita em contato.
          </p>
          <ul className="space-y-2">
            {sites.map((item) => (
              <Bullet key={item}>{item}</Bullet>
            ))}
          </ul>
        </RevealItem>

        <RevealItem className="card p-8 lg:col-span-3">
          <div className="flex flex-col gap-6 md:flex-row md:items-start md:gap-8">
            <IconFrame icon={PenNib} size="lg" />
            <div className="grow">
              <h3 className="mb-2 text-xl font-bold text-ink-strong">
                Artes digitais
              </h3>
              <p className="mb-6 max-w-2xl text-sm text-ink-muted">
                Peças sob medida para cada canal, mantendo a identidade da
                corretora consistente em todos os pontos de contato.
              </p>
              <ul className="grid gap-x-8 gap-y-2 sm:grid-cols-2 lg:grid-cols-4">
                {artes.map((item) => (
                  <Bullet key={item}>{item}</Bullet>
                ))}
              </ul>
            </div>
          </div>
        </RevealItem>
      </RevealGroup>
    </Section>
  );
}
