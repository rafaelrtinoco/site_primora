import Navbar from '../components/Navbar';
import Hero from '../components/Hero';
import Partner from '../components/Partner';
import DigitalStructure from '../components/DigitalStructure';
import Solutions from '../components/Solutions';
import Process from '../components/Process';
import Plans from '../components/Plans';
import Testimonials from '../components/Testimonials';
import Faq from '../components/Faq';
import CTA from '../components/CTA';
import Footer from '../components/Footer';
import Sinistros from '../components/Sinistros';
import FreeAudit from '../components/FreeAudit';

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Partner />
        <Solutions />
        <Sinistros />
        <DigitalStructure />
        <Process />
        <Plans />
        <Testimonials />
        <Faq />
        <FreeAudit />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
