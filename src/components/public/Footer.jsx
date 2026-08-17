import { Link } from "react-router-dom";
import { 
  MessageCircle,
  LayoutGrid,
  Tag,
  Smartphone,
  Heart,
  ShoppingCart,
  Wrench,
  Search,
  Mail,
  Clock,
  Info,
  FileText,
  Shield,
  RefreshCw,
  HelpCircle,
  ShieldCheck,
  Truck,
  ChevronDown,
  ChevronUp
} from "lucide-react";
import { useState } from "react";
import BrandLogo from "../ui/BrandLogo";
import { BRAND } from "../../config/brand";

const FacebookIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
  </svg>
);

const InstagramIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <rect x="2" y="2" width="20" height="20" rx="5" ry="5"></rect>
    <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"></path>
    <line x1="17.5" y1="6.5" x2="17.51" y2="6.5"></line>
  </svg>
);

const YoutubeIcon = ({ size = 24 }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
    <path d="M22.54 6.42a2.78 2.78 0 0 0-1.94-2C18.88 4 12 4 12 4s-6.88 0-8.6.46a2.78 2.78 0 0 0-1.94 2A29 29 0 0 0 1 11.75a29 29 0 0 0 .46 5.33 2.78 2.78 0 0 0 1.94 2c1.72.46 8.6.46 8.6.46s6.88 0 8.6-.46a2.78 2.78 0 0 0 1.94-2 29 29 0 0 0 .46-5.33 29 29 0 0 0-.46-5.33z"></path>
    <polygon points="9.75 15.02 15.5 11.75 9.75 8.48 9.75 15.02"></polygon>
  </svg>
);

const FooterAccordion = ({ title, children, defaultOpen = false }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);
  
  return (
    <div className="border-b border-gray-800 md:border-none">
      <button 
        onClick={() => setIsOpen(!isOpen)}
        className="flex w-full items-center justify-between py-4 md:cursor-default md:py-0"
      >
        <h3 className="text-sm font-semibold uppercase tracking-wider text-white">
          {title}
        </h3>
        <div className="md:hidden text-gray-400">
          {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
        </div>
      </button>
      
      <div className={`overflow-hidden transition-all duration-300 md:max-h-none md:!block ${isOpen ? 'max-h-96 pb-4' : 'max-h-0'}`}>
        <div className="md:pt-4">
          {children}
        </div>
      </div>
    </div>
  );
};

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Top Main Section */}
      <div className="mx-auto max-w-[1600px] px-4 py-10 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4 lg:gap-12">
          
          {/* 1. Brand & Socials */}
          <div className="flex flex-col gap-6 md:col-span-1">
            <div className="flex flex-col gap-3">
              <BrandLogo size="lg" className="opacity-90" dark />
              <p className="text-sm text-gray-400">
                Tecnología, productos y soluciones para vos.
              </p>
            </div>
            
            <div className="flex items-center gap-4">
              <a href="#" className="rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-success hover:text-white">
                <MessageCircle size={20} />
              </a>
              <a href="#" className="rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-primary hover:text-white">
                <FacebookIcon size={20} />
              </a>
              <a href="#" className="rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-pink-600 hover:text-white">
                <InstagramIcon size={20} />
              </a>
              <a href="#" className="rounded-full bg-gray-800 p-2 text-gray-400 transition-colors hover:bg-danger hover:text-white">
                <YoutubeIcon size={20} />
              </a>
            </div>
          </div>

          {/* 2. Tienda */}
          <FooterAccordion title="Tienda" defaultOpen={true}>
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/catalogo" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <LayoutGrid size={16} /> Catálogo
                </Link>
              </li>
              <li>
                <Link to="/catalogo?category=ofertas" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <Tag size={16} /> Ofertas
                </Link>
              </li>
              <li>
                <Link to="/catalogo" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <Smartphone size={16} /> Productos
                </Link>
              </li>
              <li>
                <Link to="/catalogo/favoritos" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <Heart size={16} /> Favoritos
                </Link>
              </li>
              <li>
                <Link to="/catalogo/carrito" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <ShoppingCart size={16} /> Carrito
                </Link>
              </li>
            </ul>
          </FooterAccordion>

          {/* 3. Atención al Cliente */}
          <FooterAccordion title="Atención al cliente">
            <ul className="flex flex-col gap-3">
              <li>
                <Link to="/servicio-tecnico" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <Wrench size={16} /> Servicio Técnico
                </Link>
              </li>
              <li>
                <Link to="/servicio-tecnico/seguimiento" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <Search size={16} /> Consultar reparación
                </Link>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <Mail size={16} /> Contacto
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <MessageCircle size={16} /> WhatsApp
                </a>
              </li>
              <li>
                <span className="flex items-center gap-2 text-sm text-gray-400">
                  <Clock size={16} /> Horarios de atención
                </span>
              </li>
            </ul>
          </FooterAccordion>

          {/* 4. Información */}
          <FooterAccordion title="Información">
            <ul className="flex flex-col gap-3">
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <Info size={16} /> Sobre nosotros
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <FileText size={16} /> Términos y condiciones
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <Shield size={16} /> Política de privacidad
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <RefreshCw size={16} /> Política de cambios
                </a>
              </li>
              <li>
                <a href="#" className="flex items-center gap-2 text-sm text-gray-400 transition-colors hover:text-primary-light">
                  <HelpCircle size={16} /> Preguntas frecuentes
                </a>
              </li>
            </ul>
          </FooterAccordion>

        </div>

        {/* Mobile Info Badges (Shown only on small screens for reference) */}
        <div className="mt-8 flex flex-col gap-4 md:hidden">
           <div className="flex items-center gap-3 rounded-lg bg-gray-800/50 p-4">
              <ShieldCheck className="text-primary-light" size={24} />
              <div>
                <p className="text-sm font-medium text-white">Compra 100% segura</p>
                <p className="text-xs text-gray-400">Protegemos tus datos</p>
              </div>
           </div>
           <div className="flex items-center gap-3 rounded-lg bg-gray-800/50 p-4">
              <Truck className="text-primary-light" size={24} />
              <div>
                <p className="text-sm font-medium text-white">Envíos a todo el país</p>
                <p className="text-xs text-gray-400">Rápidos y confiables</p>
              </div>
           </div>
           <div className="flex items-center gap-3 rounded-lg bg-gray-800/50 p-4">
              <Wrench className="text-primary-light" size={24} />
              <div>
                <p className="text-sm font-medium text-white">Servicio técnico</p>
                <p className="text-xs text-gray-400">Especialistas a tu servicio</p>
              </div>
           </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800 bg-gray-950">
        <div className="mx-auto flex max-w-[1600px] flex-col items-center justify-between gap-6 px-4 py-6 md:flex-row sm:px-6 lg:px-8">
          
          <div className="text-center md:text-left">
            <p className="text-sm text-gray-400">
              &copy; {new Date().getFullYear()} {BRAND.name}. Todos los derechos reservados.
            </p>
          </div>


          <div className="hidden items-center gap-2 text-sm text-gray-400 md:flex">
             <ShieldCheck size={18} className="text-primary-light" />
             <span>Sitio protegido por SSL</span>
          </div>

        </div>
      </div>
    </footer>
  );
}
