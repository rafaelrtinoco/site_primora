import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Solutions from '../components/Solutions';
import Assessoria from '../components/Assessoria';
import Process from '../components/Process';
import Plans from '../components/Plans';
import Testimonials from '../components/Testimonials';
import Faq from '../components/Faq';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import CookieConsent from '../components/CookieConsent';
import WhatsAppFab from '../components/WhatsAppFab';

export default function Home() {
  return (
    <div className="min-h-screen bg-surface-muted">
      {/* Primeiro alvo do Tab: permite pular a navegação repetida */}
      <a
        href="#main"
        className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-4 focus:z-[100] focus:rounded-frame focus:bg-surface focus:px-5 focus:py-3 focus:font-semibold focus:text-ink-brand focus:shadow-e3"
      >
        Pular para o conteúdo
      </a>

      <Navbar />

      <main id="main" tabIndex={-1}>
        <Hero />
        <Solutions />
        <Assessoria />
        <Process />
        <Plans />
        <Testimonials />
        <Faq />
        {/* FreeAudit foi fundida aqui: era uma seção inteira com a mesma
            mensagem, imediatamente antes, cujo único botão rolava até esta. */}
        <CTA />
      </main>

      <Footer />
      <WhatsAppFab />
      <CookieConsent />
    </div>
  );
}
