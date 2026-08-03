import { useState, useCallback } from "react";
import { Link } from "react-router-dom";
import { Trash2, ShoppingCart, Check, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import ProductImage from "../ui/ProductImage";
import { formatCurrency } from "../../utils/formatCurrency";
import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import WishlistDeleteModal from "./WishlistDeleteModal";
import { timeAgo } from "../../utils/dateUtils";

export default function WishlistCard({ product, isSelected, onSelectToggle }) {
  const { removeFromWishlist } = useWishlist();
  const { addToCart, isInCart } = useCart();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  const image = Array.isArray(product.images) && product.images.length > 0 ? product.images[0] : null;
  const stock = product.stock ?? 0;
  const isOutOfStock = stock <= 0;
  const inCart = isInCart(product.productId || product.id);
  
  const handleAddToCart = useCallback(async (e) => {
    e.preventDefault();
    e.stopPropagation();
    if (isOutOfStock) return;
    
    setIsAdding(true);
    // Simular un pequeño delay de red para la animación de loading
    await new Promise(r => setTimeout(r, 400));
    
    addToCart({ id: product.productId || product.id, ...product });
    setIsAdding(false);
    toast.success("Agregado al carrito");
  }, [addToCart, product, isOutOfStock]);

  const addedAtStr = product.createdAt ? timeAgo(product.createdAt) : "";

  return (
    <>
      <motion.div 
        whileHover={{ y: -6 }}
        className="group relative flex h-full flex-col overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border transition-all duration-300 hover:shadow-xl"
      >
        {/* Checkbox de selección múltiple */}
        <div className="absolute left-3 top-3 z-30 opacity-0 group-hover:opacity-100 transition-opacity focus-within:opacity-100">
           <input 
              type="checkbox"
              checked={isSelected}
              onChange={() => onSelectToggle(product.productId || product.id)}
              className="h-5 w-5 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary"
              title="Seleccionar producto"
           />
        </div>
        {isSelected && (
          <div className="absolute left-3 top-3 z-30">
            <input 
                type="checkbox"
                checked={isSelected}
                onChange={() => onSelectToggle(product.productId || product.id)}
                className="h-5 w-5 cursor-pointer rounded border-gray-300 text-primary focus:ring-primary"
                title="Deseleccionar producto"
            />
          </div>
        )}

        {/* Overlay hover sutil sobre la imagen */}
        <div className="absolute inset-0 z-20 pointer-events-none bg-gradient-to-t from-black/5 via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100" />

        {/* Botón flotante para eliminar (Desktop - Hover) */}
        <button
          onClick={(e) => { e.preventDefault(); setShowDeleteModal(true); }}
          className="absolute right-3 top-3 z-30 flex h-9 w-9 items-center justify-center rounded-full bg-white text-gray-400 opacity-0 shadow-sm transition-all hover:text-danger hover:scale-110 group-hover:opacity-100"
          aria-label="Quitar de favoritos"
        >
          <Trash2 className="h-4 w-4" />
        </button>

        {/* Imagen */}
        <Link to={`/catalogo/${product.productId || product.id}`} className="relative aspect-square bg-gray-50 overflow-hidden block">
            {image ? (
              <ProductImage
                image={image}
                type="catalog"
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-105"
                wrapperClassName="h-full w-full"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-300">
                <span className="text-sm">Sin imagen</span>
              </div>
            )}
            
            {/* Badge solo cuando está sin stock */}
            {isOutOfStock && (
              <div className="absolute bottom-2 left-2 z-20">
                <span className="rounded-full bg-danger px-2.5 py-0.5 text-[11px] font-bold text-white shadow-sm">
                  Sin stock
                </span>
              </div>
            )}
        </Link>

        {/* Información */}
        <div className="flex flex-1 flex-col p-4 z-20 bg-white">
          <Link to={`/catalogo/${product.productId || product.id}`} className="flex-1">
            <span className="text-[11px] font-medium text-gray-500 uppercase tracking-wide">
              {product.categoryName || "Sin categoría"}
            </span>
            <h3 className="mt-1 line-clamp-2 text-sm font-semibold text-gray-800 leading-snug group-hover:text-primary transition-colors">
              {product.name}
            </h3>
            
            {/* Precio */}
            <div className="mt-2.5 flex items-end gap-2">
              <span className="text-lg font-bold text-gray-900">
                {formatCurrency(product.salePrice)}
              </span>
              {/* Si hay precio original (futuro) */}
              {product.originalPrice && product.originalPrice > product.salePrice && (
                <span className="text-xs text-gray-400 line-through mb-0.5">
                  {formatCurrency(product.originalPrice)}
                </span>
              )}
            </div>
          </Link>
          
          <div className="mt-3 text-[11px] text-gray-400">
            {addedAtStr}
          </div>

          {/* Acciones */}
          <div className="mt-4 flex flex-col gap-2">
            <button
              onClick={handleAddToCart}
              disabled={isOutOfStock || isAdding || inCart}
              className={`flex w-full items-center justify-center gap-2 rounded-xl py-2.5 text-sm font-semibold transition-all ${
                inCart 
                  ? "bg-emerald-50 text-emerald-600 border border-emerald-200"
                  : isOutOfStock
                  ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                  : "bg-primary text-white hover:bg-primary-hover shadow-md hover:shadow-lg active:scale-95"
              }`}
            >
              {isAdding ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : inCart ? (
                <>
                  <Check className="h-4 w-4" />
                  Agregado
                </>
              ) : (
                <>
                  <ShoppingCart className="h-4 w-4" />
                  Agregar al carrito
                </>
              )}
            </button>
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex w-full items-center justify-center gap-2 rounded-xl py-2 text-xs font-medium text-gray-500 hover:bg-red-50 hover:text-danger transition-colors sm:hidden"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Eliminar
            </button>
          </div>
        </div>
      </motion.div>

      <WishlistDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => removeFromWishlist(product.productId || product.id)}
        productName={product.name}
      />
    </>
  );
}
