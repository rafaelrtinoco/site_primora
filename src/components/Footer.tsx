import { ShieldCheck, Camera, Share2, Mail, MapPin, Phone } from 'lucide-react';
import P from '/somente_p.png'

export default function Footer() {
  return (
    <footer className="bg-primary pt-20 pb-10 border-t border-white/10">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12 mb-16">
          
          {/* Brand */}
          <div className="lg:col-span-1">
            <a href="#" className="flex items-center gap-2 mb-6">
              
              <span className="font-bold text-xl tracking-tight text-white">
               <img src={P} alt="Logo Primora" className="h-16 w-auto" />
              </span>
            </a>
            <p className="text-gray-400 text-sm leading-relaxed mb-6">
              Parceira de crescimento digital para corretores de seguros. Elevando o padrão de autoridade no mercado segurador.
            </p>
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/5 border border-white/10">
              <ShieldCheck className="w-4 h-4 text-accent" />
              <span className="text-xs font-semibold text-blue-100 uppercase">Parceiro ABA Seguros</span>
            </div>
          </div>

          {/* Links */}
          <div>
            <h4 className="text-white font-semibold mb-6">Navegação</h4>
            <ul className="space-y-4">
              <li><a href="#solutions" className="text-gray-400 hover:text-secondary transition-colors text-sm">Soluções</a></li>
              <li><a href="#process" className="text-gray-400 hover:text-secondary transition-colors text-sm">Como Funciona</a></li>
              <li><a href="#plans" className="text-gray-400 hover:text-secondary transition-colors text-sm">Planos</a></li>
              <li><a href="#faq" className="text-gray-400 hover:text-secondary transition-colors text-sm">FAQ</a></li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-white font-semibold mb-6">Contato</h4>
            <ul className="space-y-4">
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Mail className="w-4 h-4 text-secondary" />
                <span>contato@primorasolucoes.com.br</span>
              </li>
              <li className="flex items-center gap-3 text-gray-400 text-sm">
                <Phone className="w-4 h-4 text-secondary" />
                <span>(11) 99999-9999</span>
              </li>
              <li className="flex items-start gap-3 text-gray-400 text-sm">
                <MapPin className="w-4 h-4 text-secondary shrink-0 mt-0.5" />
                <span>São Paulo, SP<br/>Brasil</span>
              </li>
            </ul>
          </div>

          {/* Social */}
          <div>
            <h4 className="text-white font-semibold mb-6">Redes Sociais</h4>
            <div className="flex items-center gap-4">
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-secondary hover:text-white hover:border-secondary transition-all">
                <Camera className="w-5 h-5" />
              </a>
              <a href="#" className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-gray-400 hover:bg-secondary hover:text-white hover:border-secondary transition-all">
                <Share2 className="w-5 h-5" />
              </a>
            </div>
          </div>

        </div>

        <div className="border-t border-white/10 pt-8 flex flex-col md:flex-row items-center justify-between gap-4">
          <p className="text-gray-500 text-sm">
            © {new Date().getFullYear()} Primora Soluções. Todos os direitos reservados.
          </p>
          <div className="flex gap-6 text-sm">
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Termos de Uso</a>
            <a href="#" className="text-gray-500 hover:text-white transition-colors">Privacidade</a>
          </div>
        </div>
      </div>
    </footer>
  );
}
