import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { ChevronRight, Trash2, HeartOff, Package } from "lucide-react";
import ProductImage from "../ui/ProductImage";
import { formatCurrency } from "../../utils/formatCurrency";
import AddToCartButton from "../public/AddToCartButton";
import WishlistDeleteModal from "./WishlistDeleteModal";
import { useWishlist } from "../../context/WishlistContext";

export default function WishlistCard({ product }) {
  const navigate = useNavigate();
  const { removeFromWishlist } = useWishlist();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // We stored a snapshot of the product when it was added to wishlist
  const image =
    Array.isArray(product.images) && product.images.length > 0
      ? product.images[0]
      : null;
  const isOutOfStock = product.stock <= 0;

  return (
    <>
      <div className="group relative flex h-full flex-col rounded-xl bg-white shadow-sm ring-1 ring-border transition-all hover:z-20 hover:shadow-md">
        {/* Contenedor de la imagen */}
        <div className="relative aspect-square rounded-t-xl bg-gray-50">
          <div className="absolute inset-0 overflow-hidden rounded-t-xl">
            {image ? (
               <ProductImage
                image={image}
                type="catalog"
                alt={product.name}
                className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
                wrapperClassName="h-full w-full"
              />
            ) : (
              <div className="flex h-full w-full items-center justify-center bg-gray-100 text-gray-400">
                <Package className="h-10 w-10 opacity-50" />
              </div>
            )}
          </div>

          {/* Badge de categoría */}
          {product.categoryName && (
            <span className="absolute left-2 top-2 z-10 rounded-full bg-white/90 px-2 py-0.5 text-[10px] font-medium text-gray-600 shadow-sm backdrop-blur-sm sm:px-2.5 sm:text-[11px]">
              {product.categoryName}
            </span>
          )}

          {/* Overlay agotado */}
          {isOutOfStock && (
            <div className="absolute inset-0 z-10 flex items-center justify-center rounded-t-xl bg-black/40">
              <span className="rounded-full bg-danger px-3 py-1 text-xs font-semibold text-white shadow">
                Agotado
              </span>
            </div>
          )}
          
          {/* Botón flotante para eliminar (Desktop - Hover) */}
          <button
            onClick={() => setShowDeleteModal(true)}
            className="absolute right-2 top-2 z-20 flex h-8 w-8 items-center justify-center rounded-full bg-white/90 text-gray-400 opacity-0 shadow-sm backdrop-blur-sm transition-all hover:text-danger group-hover:opacity-100 sm:flex hidden"
            aria-label="Quitar de favoritos"
          >
            <HeartOff className="h-4 w-4" />
          </button>
        </div>

        {/* Info del producto */}
        <div className="flex flex-1 flex-col p-3 sm:p-4 relative z-20">
          {/* Acciones rápidas (Agregar al carrito) */}
          {!isOutOfStock && (
            <div className="absolute -top-5 right-3 z-30">
              <AddToCartButton product={{id: product.productId, ...product}} size="mobile" className="bg-white shadow-md hover:bg-gray-50 rounded-full border border-gray-100" />
            </div>
          )}

          <h3 className="line-clamp-2 text-xs font-semibold leading-snug text-gray-800 sm:text-sm pt-2">
            {product.name}
          </h3>
          
          <div className="mt-1 flex items-baseline gap-2 sm:mt-1.5">
            <p className="text-sm font-bold text-primary sm:text-base">
              {formatCurrency(product.salePrice)}
            </p>
            {product.originalPrice && product.originalPrice > product.salePrice && (
              <p className="text-[10px] text-gray-400 line-through sm:text-xs">
                {formatCurrency(product.originalPrice)}
              </p>
            )}
          </div>

          <div className="mt-auto pt-3 flex flex-col gap-2">
            <button
              onClick={() => navigate(`/catalogo/${product.productId}`)}
              className="flex w-full items-center justify-center gap-1 rounded-lg bg-primary-light py-1.5 text-xs font-medium text-primary transition-colors hover:bg-primary hover:text-white sm:py-2.5 sm:text-sm"
            >
              Ver detalles
              <ChevronRight className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
            </button>
            
            {/* Botón eliminar (Mobile) */}
            <button
              onClick={() => setShowDeleteModal(true)}
              className="flex w-full items-center justify-center gap-1.5 rounded-lg border border-border py-1.5 text-xs font-medium text-gray-500 transition-colors hover:bg-gray-50 hover:text-danger sm:hidden"
            >
              <Trash2 className="h-3.5 w-3.5" />
              Quitar de favoritos
            </button>
          </div>
        </div>
      </div>

      <WishlistDeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={() => removeFromWishlist(product.productId)}
        productName={product.name}
      />
    </>
  );
}
