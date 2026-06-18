import { motion } from 'framer-motion';
import { Share2, Video, Laptop, TrendingUp } from 'lucide-react';

export default function Solutions() {
  const solutions = [
    {
      title: 'Gestão de Redes Sociais',
      icon: <Share2 className="w-8 h-8" />,
      features: ['Planejamento editorial', 'Calendário mensal', 'Posts estratégicos', 'Stories', 'Relatórios'],
      color: 'bg-blue-50 text-blue-600'
    },
    {
      title: 'Produção de Vídeos',
      icon: <Video className="w-8 h-8" />,
      features: ['Captação profissional', 'Reels', 'Stories', 'Motion graphics', 'Legendas'],
      color: 'bg-indigo-50 text-indigo-600'
    },
    {
      title: 'Site Inteligente',
      icon: <Laptop className="w-8 h-8" />,
      features: ['Landing Page', 'Site institucional', 'Chat IA', 'Integração WhatsApp', 'Agendamento'],
      color: 'bg-cyan-50 text-cyan-600'
    },
    {
      title: 'Consultoria Estratégica',
      icon: <TrendingUp className="w-8 h-8" />,
      features: ['Diagnóstico digital', 'Posicionamento', 'Funil comercial', 'Treinamento'],
      color: 'bg-emerald-50 text-emerald-600'
    }
  ];

  return (
    <section id="solutions" className="py-24 bg-white relative">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-primary mb-6"
          >
            Soluções completas para corretores modernos
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500"
          >
            Tudo o que você precisa para se destacar no ambiente digital, centralizado em um só lugar com tecnologia e acompanhamento profissional.
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {solutions.map((solution, index) => (
            <motion.div
              key={solution.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              whileHover={{ y: -8 }}
              className="bg-white rounded-2xl p-8 border border-gray-100 shadow-sm hover:shadow-xl transition-all duration-300"
            >
              <div className={`w-16 h-16 rounded-xl flex items-center justify-center mb-6 ${solution.color}`}>
                {solution.icon}
              </div>
              <h3 className="text-xl font-bold text-primary mb-4">{solution.title}</h3>
              <ul className="space-y-3">
                {solution.features.map((feature) => (
                  <li key={feature} className="flex items-center text-gray-600">
                    <span className="w-1.5 h-1.5 rounded-full bg-secondary mr-3" />
                    {feature}
                  </li>
                ))}
              </ul>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
