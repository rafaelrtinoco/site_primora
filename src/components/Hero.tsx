import { motion } from 'framer-motion';
import { ArrowRight, Camera, Globe, MessageCircle, Bot, LayoutDashboard } from 'lucide-react';

export default function Hero() {
  return (
    <section id="hero" className="relative pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden">
      
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10">
        <div className="absolute top-[-20%] right-[10%] w-[70%] h-[70%] rounded-full bg-accent/10 blur-[120px]" />
        <div className="absolute top-[20%] left-[10%] w-[50%] h-[50%] rounded-full bg-secondary/5 blur-[100px]" />
      </div>

      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 lg:gap-8 items-center">
          
          {/* Text Content */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="max-w-2xl"
          >
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-primary leading-tight mb-6">
              Potencialize sua <span className="text-transparent bg-clip-text bg-linear-to-r from-secondary to-accent">presença digital.</span>
            </h1>
            <p className="text-xl md:text-2xl text-gray-700 font-medium mb-4">
              Marketing, tecnologia e automação para corretores que desejam crescer no ambiente digital.
            </p>
            <p className="text-lg text-gray-500 mb-8 leading-relaxed">
              Transformamos a presença digital de corretores de seguros em uma estrutura profissional capaz de atrair clientes, gerar autoridade e automatizar atendimentos.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4">
              <a 
                href="#cta" 
                className="inline-flex items-center justify-center gap-2 px-8 py-4 rounded-full bg-linear-to-r from-primary to-secondary text-white font-semibold hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                Agendar Diagnóstico
                <ArrowRight className="w-5 h-5" />
              </a>
              <a 
                href="#solutions" 
                className="inline-flex items-center justify-center px-8 py-4 rounded-full bg-white border border-gray-200 text-gray-700 font-semibold hover:border-secondary hover:text-secondary hover:shadow-sm transition-all duration-300"
              >
                Conhecer Soluções
              </a>
            </div>
          </motion.div>

          {/* Visual Mockups */}
          <div className="relative h-125 w-full hidden md:block">
            <motion.div 
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="absolute inset-0"
            >
              {/* Central Dashboard Mockup */}
              <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md glass-card rounded-2xl p-6 z-20">
                <div className="flex items-center justify-between mb-6">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      <LayoutDashboard size={20} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-primary">Dashboard</h3>
                      <p className="text-xs text-gray-500">Métricas atualizadas</p>
                    </div>
                  </div>
                  <div className="px-3 py-1 bg-green-100 text-green-700 text-xs font-medium rounded-full">+24%</div>
                </div>
                <div className="space-y-4">
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="w-3/4 h-full bg-secondary rounded-full" />
                  </div>
                  <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div className="w-1/2 h-full bg-accent rounded-full" />
                  </div>
                </div>
              </div>

              {/* Floating Cards */}
              <motion.div 
                animate={{ y: [0, -10, 0] }}
                transition={{ repeat: Infinity, duration: 4, ease: "easeInOut" }}
                className="absolute top-10 left-0 glass-card p-4 rounded-xl flex items-center gap-4 z-30"
              >
                <div className="p-3 bg-pink-100 text-pink-600 rounded-lg">
                  <Camera size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Instagram Profissional</p>
                  <p className="text-xs text-gray-500">Post programado</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 10, 0] }}
                transition={{ repeat: Infinity, duration: 5, ease: "easeInOut", delay: 1 }}
                className="absolute bottom-10 right-0 glass-card p-4 rounded-xl flex items-center gap-4 z-30"
              >
                <div className="p-3 bg-blue-100 text-blue-600 rounded-lg">
                  <Bot size={24} />
                </div>
                <div>
                  <p className="text-sm font-semibold text-gray-800">Assistente IA</p>
                  <p className="text-xs text-gray-500">Atendendo lead...</p>
                </div>
              </motion.div>

              <motion.div 
                animate={{ y: [0, -8, 0] }}
                transition={{ repeat: Infinity, duration: 4.5, ease: "easeInOut", delay: 0.5 }}
                className="absolute top-32 right[-20px] glass-card p-4 rounded-xl flex items-center gap-3 z-10"
              >
                <div className="p-2 bg-green-100 text-green-600 rounded-lg">
                  <MessageCircle size={20} />
                </div>
                <p className="text-sm font-semibold text-gray-800">WhatsApp Integrado</p>
              </motion.div>

              <motion.div 
                animate={{ y: [0, 8, 0] }}
                transition={{ repeat: Infinity, duration: 3.5, ease: "easeInOut", delay: 1.5 }}
                className="absolute bottom-32 left[-10px] glass-card p-4 rounded-xl flex items-center gap-3 z-10"
              >
                <div className="p-2 bg-indigo-100 text-indigo-600 rounded-lg">
                  <Globe size={20} />
                </div>
                <p className="text-sm font-semibold text-gray-800">Site Otimizado</p>
              </motion.div>
              
            </motion.div>
          </div>
        </div>
      </div>
    </section>
  );
}
