import Navbar from '../components/Navbar';
import HeroCalculadora from '../components/calculadora/HeroCalculadora';
import Calculadora from '../components/calculadora/Calculadora';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';

/**
 * A página é a calculadora.
 *
 * As seções de marketing da agência (Solutions, Trafego, Ia, Ferramentas,
 * Process, Plans, Testimonials, Faq, CTA) saíram da composição quando o projeto
 * mudou de rumo. Os arquivos continuam em `src/components/`, sem referência:
 * nada foi apagado, então voltar qualquer uma é reinserir o import. O
 * `WhatsAppFab` (com o chat da Ceci e o bot de triagem) também saiu, porque a
 * mensagem pré-escrita dele falava de planos que a página não oferece mais.
 */
export default function Home() {
  return (
    <div className="min-h-screen bg-surface-dark">
      {/* Primeiro alvo do Tab: permite pular a navegação repetida */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-frame focus:bg-acid-400 focus:px-5 focus:py-3 focus:font-semibold focus:text-carbon-950 focus:shadow-e3"
      >
        Pular para o conteúdo
      </a>

      <Navbar />

      <main id="main" tabIndex={-1}>
        <HeroCalculadora />
        <Calculadora />
      </main>

      <Footer />
      <CookieConsent />
    </div>
  );
}
