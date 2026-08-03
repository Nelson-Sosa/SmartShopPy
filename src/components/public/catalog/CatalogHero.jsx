import { motion } from "framer-motion";

export default function CatalogHero() {
  const handleScrollToCatalog = () => {
    const el = document.getElementById("catalogo-completo");
    if (el) {
      el.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      onClick={handleScrollToCatalog}
      className="group relative flex h-full min-h-[260px] w-full cursor-pointer flex-col justify-center overflow-hidden rounded-2xl shadow-sm ring-1 ring-border"
    >
      {/* Imagen de Publicidad */}
      <img 
        src="/electronica.png" 
        alt="Ofertas Especiales" 
        className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-105" 
      />
      
      {/* Overlay sutil para mejorar contraste y hover state */}
      <div className="absolute inset-0 bg-black/5 transition-colors duration-300 group-hover:bg-transparent" />
      
    </motion.div>
  );
}
