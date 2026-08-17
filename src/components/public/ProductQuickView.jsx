import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { X, Minus, Plus, ShoppingCart, Check } from "lucide-react";
import { motion } from "framer-motion";
import ProductImage from "../ui/ProductImage";
import { formatCurrency } from "../../utils/formatCurrency";
import { useCart } from "../../context/CartContext";
import FavoriteButton from "./FavoriteButton";
import BottomSheet from "../ui/BottomSheet";

export default function ProductQuickView({ product, onClose }) {
  const navigate = useNavigate();
  const { addToCart, isInCart } = useCart();
  const [quantity, setQuantity] = useState(1);
  const [isAdding, setIsAdding] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  
  const inCart = isInCart(product.id);
  const isOutOfStock = product.stock <= 0;
  
  const images = Array.isArray(product.images) && product.images.length > 0 
    ? product.images 
    : [null];
    
  // Handle ESC
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [onClose]);

  const handleAddToCart = () => {
    if (isOutOfStock) return;
    setIsAdding(true);
    addToCart(product, quantity);
    setTimeout(() => setIsAdding(false), 300);
  };

  const handleViewDetails = () => {
    onClose();
    navigate(`/catalogo/${product.id}`);
  };

  const decreaseQuantity = () => {
    if (quantity > 1) setQuantity(q => q - 1);
  };

  const increaseQuantity = () => {
    if (quantity < product.stock) setQuantity(q => q + 1);
  };

  // The content component shared by mobile and desktop
  const QuickViewContent = () => (
    <div className="flex h-full flex-col lg:flex-row lg:h-auto lg:max-h-[85vh] overflow-y-auto lg:overflow-hidden">
      {/* Left: Images */}
      <div className="flex-shrink-0 lg:w-1/2 p-4 lg:p-8 flex flex-col bg-gray-50 items-center justify-center relative">
        <div className="w-full max-w-[200px] sm:max-w-[250px] lg:max-w-[320px] aspect-square relative mb-4">
           <ProductImage
              image={images[currentImageIndex]}
              type="catalog"
              alt={product.name}
              className="h-full w-full object-contain"
              wrapperClassName="h-full w-full"
           />
           {isOutOfStock && (
             <div className="absolute top-4 left-4 rounded-full bg-danger px-3 py-1 text-xs font-bold text-white">
               AGOTADO
             </div>
           )}
        </div>
        
        {/* Thumbnails */}
        {images.length > 1 && (
          <div className="flex gap-2 overflow-x-auto pb-2 w-full justify-center">
            {images.map((img, idx) => (
              <button 
                key={idx}
                onClick={() => setCurrentImageIndex(idx)}
                className={`w-16 h-16 rounded-md border-2 overflow-hidden flex-shrink-0 ${currentImageIndex === idx ? 'border-primary' : 'border-transparent'}`}
              >
                <ProductImage image={img} type="catalog" className="w-full h-full object-cover" />
              </button>
            ))}
          </div>
        )}
      </div>

      {/* Right: Info */}
      <div className="flex-1 flex flex-col p-5 lg:p-8 overflow-y-auto">
        <div className="flex justify-between items-start mb-2">
           <div>
             {product.categoryName && (
               <span className="text-xs font-semibold text-primary uppercase tracking-wider mb-1 block">
                 {product.categoryName}
               </span>
             )}
             <h2 className="text-xl lg:text-2xl font-bold text-gray-900 leading-tight">
               {product.name}
             </h2>
           </div>
           <div className="hidden lg:block ml-4">
             <button onClick={onClose} className="p-2 bg-gray-100 hover:bg-gray-200 rounded-full transition-colors text-gray-500">
               <X size={20} />
             </button>
           </div>
        </div>

        <div className="text-2xl font-bold text-primary mb-4">
          {formatCurrency(product.salePrice)}
        </div>

        {/* Availability */}
        <div className="mb-6 flex items-center gap-2">
           <div className={`h-2.5 w-2.5 rounded-full ${isOutOfStock ? 'bg-danger' : product.stock <= 5 ? 'bg-warning' : 'bg-success'}`}></div>
           <span className="text-sm font-medium text-gray-700">
             {isOutOfStock ? 'Sin stock' : product.stock <= 5 ? `Últimas ${product.stock} unidades` : 'Disponible'}
           </span>
        </div>

        {/* Features */}
        {product.features && product.features.length > 0 && (
          <div className="mb-6">
            <h3 className="text-sm font-bold text-gray-800 mb-2">Características principales:</h3>
            <ul className="text-sm text-gray-600 space-y-1 mb-2">
               {product.features.slice(0, 4).map((f, i) => (
                 <li key={i} className="flex items-center before:content-['•'] before:mr-2 before:text-primary">
                   {f.name}: {f.value}
                 </li>
               ))}
            </ul>
            {product.features.length > 4 && (
              <button onClick={handleViewDetails} className="text-xs font-semibold text-primary hover:underline">
                Ver todos los detalles →
              </button>
            )}
          </div>
        )}

        <div className="mt-auto pt-6 border-t border-gray-100">
          <div className="flex items-end gap-4 mb-4">
            {/* Quantity */}
            {!isOutOfStock && (
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1">CANTIDAD</label>
                <div className="flex items-center rounded-lg border border-gray-200 bg-white">
                  <button 
                    onClick={decreaseQuantity}
                    disabled={quantity <= 1}
                    className="p-2 sm:p-2.5 text-gray-500 hover:text-primary hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-white rounded-l-lg"
                  >
                    <Minus size={18} />
                  </button>
                  <span className="w-10 sm:w-12 text-center text-sm font-bold text-gray-800">
                    {quantity}
                  </span>
                  <button 
                    onClick={increaseQuantity}
                    disabled={quantity >= product.stock}
                    className="p-2 sm:p-2.5 text-gray-500 hover:text-primary hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:hover:bg-white rounded-r-lg"
                  >
                    <Plus size={18} />
                  </button>
                </div>
              </div>
            )}

            {/* Favorite */}
            <div className="ml-auto mb-1">
              <FavoriteButton product={product} size="desktop" />
            </div>
          </div>

          <div className="flex flex-col gap-3">
             <motion.button
               onClick={handleAddToCart}
               disabled={isOutOfStock}
               whileTap={!isOutOfStock ? { scale: 0.98 } : {}}
               className={`flex w-full items-center justify-center gap-2 rounded-xl py-3.5 text-sm font-bold shadow-sm transition-colors ${
                 isOutOfStock 
                   ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                   : inCart
                   ? 'bg-[#FFC107] text-gray-900 hover:bg-[#ffb300]'
                   : 'bg-primary text-white hover:bg-primary-dark'
               }`}
             >
               {inCart ? <Check size={18} /> : <ShoppingCart size={18} />}
               {isOutOfStock ? 'AGOTADO' : inCart ? 'AGREGADO AL CARRITO' : 'AGREGAR AL CARRITO'}
             </motion.button>
             
             <button
               onClick={handleViewDetails}
               className="flex w-full items-center justify-center py-2 text-sm font-semibold text-gray-600 hover:text-primary transition-colors"
             >
               Ver detalles completos
             </button>
          </div>
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Desktop Modal */}
      <div className="hidden lg:flex fixed inset-0 z-50 items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={onClose}>
        <motion.div 
          initial={{ opacity: 0, scale: 0.95, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.95, y: 10 }}
          className="w-full max-w-4xl bg-white rounded-2xl shadow-2xl overflow-hidden relative"
          onClick={(e) => e.stopPropagation()}
        >
          <QuickViewContent />
        </motion.div>
      </div>

      {/* Mobile BottomSheet */}
      <div className="lg:hidden">
        <BottomSheet isOpen={true} onClose={onClose} title="Vista Rápida">
          <QuickViewContent />
        </BottomSheet>
      </div>
    </>
  );
}
