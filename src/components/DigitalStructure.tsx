import { motion } from 'framer-motion';
import { Camera, LayoutTemplate, MessageSquareCode, Video, Target, Headset } from 'lucide-react';

export default function DigitalStructure() {
  const features = [
    { icon: <Camera size={24} />, title: 'Instagram Profissional' },
    { icon: <LayoutTemplate size={24} />, title: 'Site Moderno' },
    { icon: <MessageSquareCode size={24} />, title: 'Chat IA 24h' },
    { icon: <Video size={24} />, title: 'Produção de Vídeos' },
    { icon: <Target size={24} />, title: 'Estratégia Personalizada' },
    { icon: <Headset size={24} />, title: 'Suporte Contínuo' },
  ];

  return (
    <section id="estrutura" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-primary mb-4"
          >
            Sua estrutura digital pronta em poucos dias
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 leading-relaxed"
          >
            Tudo o que você precisa para captar clientes, fortalecer sua marca e automatizar atendimentos em um único parceiro.
          </motion.p>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="bg-white/80 backdrop-blur-md p-6 rounded-2xl shadow-sm hover:shadow-lg border border-white/40 transition-all text-center flex flex-col items-center justify-center gap-4"
            >
              <div className="w-12 h-12 rounded-full bg-secondary/10 text-secondary flex items-center justify-center">
                {feature.icon}
              </div>
              <h3 className="font-semibold text-gray-800 text-sm md:text-base">{feature.title}</h3>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
