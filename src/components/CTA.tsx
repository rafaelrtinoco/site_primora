import { motion } from 'framer-motion';
import { ArrowRight, Mail } from 'lucide-react';

export default function CTA() {
  return (
    <section id="cta" className="py-24 relative overflow-hidden">
      {/* Background Gradient */}
      <div className="absolute inset-0 bg-linear-to-br from-primary via-[#052b7a] to-secondary z-0" />
      
      {/* Decorative Blur */}
      <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[100px] z-0" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-secondary/30 rounded-full blur-[100px] z-0" />

      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center max-w-6xl mx-auto">
          
          {/* Text Content */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-4xl md:text-5xl font-bold text-white mb-6 leading-tight">
              Transforme sua presença digital.
            </h2>
            <p className="text-lg text-blue-100 mb-8 max-w-lg">
              Seja referência no mercado de seguros com tecnologia, automação e posicionamento estratégico.
            </p>
            
            <div className="flex items-center gap-4 text-white/80">
              <Mail className="w-6 h-6" />
              <span>contato@primorasolucoes.com.br</span>
            </div>
          </motion.div>

          {/* Form Card */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-white rounded-3xl p-8 shadow-2xl"
          >
            <h3 className="text-2xl font-bold text-primary mb-6">Agendar Diagnóstico Gratuito</h3>
            <form action="https://formsubmit.co/contato@primorasolucoes.com.br" method="POST" className="space-y-4">
              <input type="hidden" name="_subject" value="Novo Lead - Diagnóstico Primora" />
              <input type="hidden" name="_captcha" value="false" />
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Nome Completo</label>
                <input 
                  type="text" 
                  name="name" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                  placeholder="João Silva"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">E-mail Profissional</label>
                <input 
                  type="email" 
                  name="email" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                  placeholder="joao@corretora.com.br"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">WhatsApp</label>
                <input 
                  type="tel" 
                  name="phone" 
                  required 
                  className="w-full px-4 py-3 rounded-xl border border-gray-200 focus:outline-none focus:ring-2 focus:ring-secondary/50 focus:border-secondary transition-all"
                  placeholder="(00) 00000-0000"
                />
              </div>

              <button 
                type="submit"
                className="w-full flex items-center justify-center gap-2 bg-linear-to-r from-primary to-secondary text-white font-bold py-4 rounded-xl hover:shadow-lg hover:-translate-y-1 transition-all duration-300 mt-6"
              >
                Solicitar Contato
                <ArrowRight className="w-5 h-5" />
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
