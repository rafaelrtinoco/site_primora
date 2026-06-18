const fs = require('fs');
const path = require('path');

const dirs = [
  'src/components',
  'src/pages',
  'src/assets/logos',
  'src/assets/icons',
  'src/assets/images',
  'src/hooks',
  'src/utils'
];

dirs.forEach(d => fs.mkdirSync(path.join(process.cwd(), d), { recursive: true }));

const components = [
  'Navbar.tsx', 'Hero.tsx', 'Partner.tsx', 'DigitalStructure.tsx',
  'Solutions.tsx', 'Process.tsx', 'Plans.tsx', 'Testimonials.tsx',
  'Faq.tsx', 'CTA.tsx', 'Footer.tsx'
];

components.forEach(c => {
  const name = c.replace('.tsx', '');
  fs.writeFileSync(path.join(process.cwd(), 'src/components', c), 
    `export default function ${name}() {
  return (
    <section id="${name.toLowerCase()}" className="py-16">
      <div className="container mx-auto px-4">
        <h2 className="text-3xl font-bold text-primary mb-8">${name}</h2>
      </div>
    </section>
  );
}
`
  );
});

fs.writeFileSync(path.join(process.cwd(), 'src/pages/Home.tsx'),
`import Navbar from '../components/Navbar';
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

export default function Home() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      <main>
        <Hero />
        <Partner />
        <DigitalStructure />
        <Solutions />
        <Process />
        <Plans />
        <Testimonials />
        <Faq />
        <CTA />
      </main>
      <Footer />
    </div>
  );
}
`
);

fs.writeFileSync(path.join(process.cwd(), 'src/App.tsx'),
`import Home from './pages/Home';

function App() {
  return <Home />;
}

export default App;
`
);

fs.writeFileSync(path.join(process.cwd(), 'src/main.tsx'),
`import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)
`
);
