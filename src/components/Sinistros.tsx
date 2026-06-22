import { motion } from 'framer-motion';
import { 
  FileText, 
  Files, 
  FilePlus, 
  Search, 
  MessageCircle, 
  Clock, 
  ShieldCheck, 
  DollarSign, 
  Bell, 
  CheckCircle 
} from 'lucide-react';

export default function Sinistros() {
  const steps = [
    {
      icon: <FileText size={24} />,
      title: 'Recebimento do Aviso',
      description: 'Recepção e registro inicial do aviso de sinistro.',
    },
    {
      icon: <Files size={24} />,
      title: 'Documentação',
      description: 'Orientação ao segurado sobre documentos necessários.',
    },
    {
      icon: <FilePlus size={24} />,
      title: 'Abertura do Processo',
      description: 'Cadastro e abertura junto à seguradora.',
    },
    {
      icon: <Search size={24} />,
      title: 'Acompanhamento de Vistorias',
      description: 'Monitoramento das análises técnicas e inspeções.',
    },
    {
      icon: <MessageCircle size={24} />,
      title: 'Intermediação',
      description: 'Comunicação entre segurado, corretora, seguradora e terceiros envolvidos.',
    },
    {
      icon: <Clock size={24} />,
      title: 'Controle de Prazos',
      description: 'Gestão de pendências, retornos e vencimentos.',
    },
    {
      icon: <ShieldCheck size={24} />,
      title: 'Coberturas e Franquias',
      description: 'Esclarecimento de coberturas contratadas, franquias e procedimentos.',
    },
    {
      icon: <DollarSign size={24} />,
      title: 'Indenizações',
      description: 'Acompanhamento de pagamentos, reembolsos e reparos.',
    },
    {
      icon: <Bell size={24} />,
      title: 'Atualizações ao Cliente',
      description: 'Informações constantes sobre o andamento do processo.',
    },
    {
      icon: <CheckCircle size={24} />,
      title: 'Encerramento',
      description: 'Conferência final e validação do encerramento do sinistro.',
    },
  ];

  return (
    <section id="sinistros" className="py-24 bg-background">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center max-w-3xl mx-auto mb-16">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-4xl font-bold text-primary mb-6"
          >
            Gestão e Acompanhamento de Sinistros
          </motion.h2>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-lg text-gray-500 leading-relaxed"
          >
            Acompanhamos todo o processo de sinistro, proporcionando mais tranquilidade ao segurado, agilidade para a corretora e uma comunicação clara durante todas as etapas.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
          {steps.map((step, index) => (
            <motion.div
              key={step.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-md border border-transparent hover:border-secondary transition-all duration-300 hover:-translate-y-1 flex flex-col items-center text-center"
            >
              <div className="w-14 h-14 rounded-full bg-secondary/10 text-secondary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                {step.icon}
              </div>
              <h3 className="font-bold text-primary mb-3 text-lg leading-tight">
                {step.title}
              </h3>
              <p className="text-sm text-gray-500 leading-relaxed">
                {step.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
