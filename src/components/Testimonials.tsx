import { motion } from 'framer-motion';
import { Star, Quote } from 'lucide-react';

export default function Testimonials() {
  const testimonials = [
    {
      text: "Hoje recebemos contatos semanalmente pelo Instagram. A estruturação foi fundamental para mudarmos de patamar.",
      author: "João Silva",
      role: "Corretor de Seguros",
      avatar: "JS"
    },
    {
      text: "Nosso atendimento ficou muito mais profissional e rápido. Economizamos horas utilizando IA para os primeiros contatos.",
      author: "Maria Fernandes",
      role: "Sócia da MF Seguros",
      avatar: "MF"
    },
    {
      text: "A consultoria me ajudou a entender meu público e hoje fecho negócios que antes passavam despercebidos. Excelente trabalho.",
      author: "Ricardo Gomes",
      role: "Especialista em Vida",
      avatar: "RG"
    }
  ];

  return (
    <section id="testimonials" className="py-24 bg-white">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-2xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-primary mb-4"
          >
            O que nossos clientes dizem
          </motion.h2>
        </div>

        <div className="grid md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-background rounded-2xl p-8 relative border border-gray-100"
            >
              <Quote className="absolute top-6 right-6 w-10 h-10 text-secondary/10" />
              <div className="flex gap-1 text-yellow-400 mb-6">
                {[...Array(5)].map((_, i) => (
                  <Star key={i} className="w-4 h-4 fill-current" />
                ))}
              </div>
              <p className="text-gray-700 italic mb-8 relative z-10">"{testimonial.text}"</p>
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-full bg-linear-to-br from-primary to-secondary text-white flex items-center justify-center font-bold text-lg">
                  {testimonial.avatar}
                </div>
                <div>
                  <h4 className="font-bold text-primary">{testimonial.author}</h4>
                  <p className="text-sm text-gray-500">{testimonial.role}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
