import { useState, useEffect, useMemo } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, Package } from "lucide-react";
import { getActiveProducts } from "../../services/publicProductService";
import ProductCard from "../public/ProductCard";

export default function WishlistRecommendations({ wishlistItems }) {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  // Extraer las categorías de los productos en la wishlist
  const wishlistCategoryIds = useMemo(() => {
    const ids = new Set(wishlistItems.map((item) => item.categoryId).filter(Boolean));
    return ids;
  }, [wishlistItems]);

  const wishlistProductIds = useMemo(() => {
    return new Set(wishlistItems.map((item) => item.productId));
  }, [wishlistItems]);

  useEffect(() => {
    let isMounted = true;
    setLoading(true);

    getActiveProducts()
      .then((allActive) => {
        if (!isMounted) return;
        
        // Filtramos los que NO están en la wishlist
        const notInWishlist = allActive.filter(p => !wishlistProductIds.has(p.id));

        // Priorizamos los de las mismas categorías
        const sameCategory = notInWishlist.filter(p => wishlistCategoryIds.has(p.categoryId));
        const otherCategory = notInWishlist.filter(p => !wishlistCategoryIds.has(p.categoryId));

        // Unimos (primero los recomendados por categoría, luego el resto)
        const recommended = [...sameCategory, ...otherCategory].slice(0, 10); // Máximo 10
        
        setProducts(recommended);
        setLoading(false);
      })
      .catch((err) => {
        console.error("Error cargando recomendaciones:", err);
        if (isMounted) setLoading(false);
      });

    return () => {
      isMounted = false;
    };
  }, [wishlistCategoryIds, wishlistProductIds]);

  if (loading) {
    return (
      <div className="mt-16 border-t border-border pt-10">
        <div className="h-6 w-48 animate-pulse rounded bg-gray-100 mb-6" />
        <div className="flex gap-4 overflow-hidden">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="h-72 min-w-[240px] animate-pulse rounded-2xl bg-gray-100" />
          ))}
        </div>
      </div>
    );
  }

  if (products.length === 0) return null;

  return (
    <div className="mt-16 border-t border-border pt-10 pb-8">
      <div className="flex items-center justify-between mb-6">
        <h3 className="text-xl font-bold text-gray-900">
          También podría interesarte
        </h3>
        {/* Aquí podríamos agregar controles del slider si quisiéramos implementarlos manuales */}
      </div>

      <div className="flex gap-4 overflow-x-auto pb-4 snap-x snap-mandatory hide-scrollbar">
        {products.map((product) => (
          <div key={product.id} className="min-w-[240px] max-w-[260px] snap-start shrink-0">
            {/* Reutilizamos la tarjeta del catálogo original para consistencia visual con la tienda */}
            <ProductCard product={product} />
          </div>
        ))}
      </div>

      <style>{`
        .hide-scrollbar::-webkit-scrollbar {
          display: none;
        }
        .hide-scrollbar {
          -ms-overflow-style: none;
          scrollbar-width: none;
        }
      `}</style>
    </div>
  );
}
