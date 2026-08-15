import { memo, useState } from "react";
import { Eye } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useNavigate, useSearchParams, useLocation } from "react-router-dom";

function QuickViewButtonBase({ product, size = "desktop", className = "" }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [searchParams, setSearchParams] = useSearchParams();
  const [isHovered, setIsHovered] = useState(false);
  const [isAnimating, setIsAnimating] = useState(false);

  const handleClick = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    setIsAnimating(true);
    
    setTimeout(() => {
      setIsAnimating(false);
      // If we are not in the catalog, navigate to catalog with quickview param
      if (!location.pathname.startsWith("/catalogo")) {
        navigate(`/catalogo?quickview=${product.id}`);
      } else {
        searchParams.set("quickview", product.id);
        setSearchParams(searchParams);
      }
    }, 250);
  };

  const buttonSize = size === "mobile" ? "h-[38px] w-[38px]" : "h-[40px] w-[40px]";
  const iconSize = size === "mobile" ? 18 : 20;

  return (
    <div 
      className={`relative inline-flex items-center justify-center ${className}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onFocus={() => setIsHovered(true)}
      onBlur={() => setIsHovered(false)}
    >
      <AnimatePresence>
        {isHovered && (
          <motion.div
            initial={{ opacity: 0, y: 10, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.9 }}
            transition={{ duration: 0.2 }}
            className="absolute bottom-full left-1/2 -translate-x-1/2 mb-2 whitespace-nowrap rounded-md bg-gray-900 px-3 py-1.5 text-xs font-medium text-white shadow-lg pointer-events-none z-50 origin-bottom"
            role="tooltip"
          >
            Vista rápida
            <div className="absolute left-1/2 top-full -mt-1 h-2 w-2 -translate-x-1/2 rotate-45 bg-gray-900"></div>
          </motion.div>
        )}
      </AnimatePresence>

      <motion.button
        onClick={handleClick}
        whileTap={{ scale: 0.9 }}
        animate={isAnimating ? { scale: [1, 1.2, 1] } : {}}
        transition={{ duration: 0.2 }}
        aria-label="Vista rápida"
        className={`flex items-center justify-center rounded-full transition-colors duration-200 focus:outline-none ${buttonSize} bg-transparent text-gray-600 hover:bg-[#FFC107] hover:text-gray-900`}
      >
        <Eye size={iconSize} strokeWidth={1.5} />
      </motion.button>
    </div>
  );
}

const QuickViewButton = memo(QuickViewButtonBase);
export default QuickViewButton;
