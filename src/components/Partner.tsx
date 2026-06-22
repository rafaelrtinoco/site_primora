import { motion } from 'framer-motion';
import { ShieldCheck } from 'lucide-react';

export default function Partner() {
  return (
    <section id="partner" className="py-20 bg-primary text-white">
      <div className="container mx-auto px-4 lg:px-8">
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto text-center"
        >
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 border border-white/20 mb-8 backdrop-blur-sm">
            <ShieldCheck className="w-5 h-5 text-accent" />
            <span className="text-sm font-semibold title-secondary text-blue-100 uppercase">
              Parceiro Estratégico ABA Seguros
            </span>
          </div>
          
          <h2 className="text-2xl md:text-3xl lg:text-4xl font-medium leading-relaxed text-blue-50">
            Unimos experiência em corretagem de seguros, marketing digital e inteligência artificial para ajudar profissionais do mercado segurador a crescer de forma estruturada.
          </h2>
        </motion.div>
      </div>
    </section>
  );
}
