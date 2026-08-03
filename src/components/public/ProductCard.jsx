import { memo } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight } from "lucide-react";
import { motion } from "framer-motion";
import ProductImage from "../ui/ProductImage";
import { formatCurrency } from "../../utils/formatCurrency";
import AddToCartButton from "./AddToCartButton";
import QuickViewButton from "./QuickViewButton";
import FavoriteButton from "./FavoriteButton";

function ProductCardBase({ product }) {
  const navigate = useNavigate();
  const image =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : null;
  const isOutOfStock = product.stock <= 0;

  return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.95 }}
      whileInView={{ opacity: 1, scale: 1 }}
      viewport={{ once: true, margin: "-50px" }}
      transition={{ duration: 0.4 }}
      className="group relative flex h-full flex-col rounded-2xl bg-white shadow-[0_2px_8px_rgba(0,0,0,0.06)] ring-1 ring-border transition-all duration-300 hover:z-20 hover:-translate-y-1 hover:shadow-xl"
    >
      {/* Contenedor de la imagen y acciones flotantes */}
      <div className="relative aspect-square rounded-t-2xl bg-gray-50">
        
        {/* Envoltorio con overflow-hidden SOLO para la imagen (evita que el zoom se salga) */}
        <div className="absolute inset-0 overflow-hidden rounded-t-2xl">
          <ProductImage
          image={image}
          type="catalog"
          alt={product.name}
          className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          wrapperClassName="h-full w-full"
        />
        </div>

        {/* Badge de categoría */}
        {product.categoryName && (
          <span className="absolute left-2 top-2 z-10 rounded-full bg-white/90 px-2.5 py-1 text-[10px] font-semibold text-gray-700 shadow-sm backdrop-blur-sm sm:px-3 sm:text-[11px]">
            {product.categoryName}
          </span>
        )}

        {/* Overlay agotado */}
        {isOutOfStock && (
          <div className="absolute inset-0 z-10 flex items-center justify-center rounded-t-2xl bg-black/40 backdrop-blur-[1px]">
            <span className="rounded-full bg-danger px-4 py-1.5 text-xs font-bold tracking-wide text-white shadow-lg">
              AGOTADO
            </span>
          </div>
        )}

      </div>

      {/* Info del producto */}
      <div className="flex flex-1 flex-col p-3 sm:p-5 relative z-20">
        {/* Acciones rápidas */}
        {!isOutOfStock && (
          <div className="mb-3.5 flex flex-row justify-center gap-1.5 sm:gap-2">
            <AddToCartButton product={product} size="desktop" className="hidden sm:flex" />
            <AddToCartButton product={product} size="mobile" className="sm:hidden" />
            
            <QuickViewButton product={product} size="desktop" className="hidden sm:flex" />
            <QuickViewButton product={product} size="mobile" className="sm:hidden" />

            <FavoriteButton product={product} size="desktop" className="hidden sm:flex" />
            <FavoriteButton product={product} size="mobile" className="sm:hidden" />
          </div>
        )}

        <h3 className="line-clamp-2 text-xs font-semibold leading-relaxed text-gray-800 sm:text-[15px]">
          {product.name}
        </h3>
        <p className="mt-1.5 text-sm font-bold text-primary sm:mt-2 sm:text-[17px]">
          {formatCurrency(product.salePrice)}
        </p>

        <div className="mt-auto pt-3 sm:pt-4">
          <button
            onClick={() => navigate(`/catalogo/${product.id}`)}
            className="flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary-light py-2 text-xs font-semibold text-primary transition-colors hover:bg-primary hover:text-white sm:py-2.5 sm:text-sm"
          >
            Ver detalles
            <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}

const ProductCard = memo(ProductCardBase);
export default ProductCard;
