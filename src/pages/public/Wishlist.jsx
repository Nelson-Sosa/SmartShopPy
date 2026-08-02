import { useState, useMemo } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Search, Heart, SlidersHorizontal, X, ArrowLeft, Image as ImageIcon } from "lucide-react";
import { motion } from "framer-motion";
import { useWishlist } from "../../context/WishlistContext";
import WishlistCard from "../../components/wishlist/WishlistCard";
import BottomSheet from "../../components/ui/BottomSheet";
import { useAuth } from "../../context/AuthContext";

const SORT_OPTIONS = [
  { value: "newest", label: "Más recientes" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "name-asc", label: "Nombre A-Z" },
  { value: "name-desc", label: "Nombre Z-A" },
  { value: "available", label: "Disponibles" },
];

export default function Wishlist() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishlistItems, loading, wishlistCount } = useWishlist();
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);

  const filtered = useMemo(() => {
    let result = [...wishlistItems];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q))
      );
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => (a.salePrice ?? 0) - (b.salePrice ?? 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.salePrice ?? 0) - (a.salePrice ?? 0));
        break;
      case "name-asc":
        result.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case "name-desc":
        result.sort((a, b) => b.name.localeCompare(a.name));
        break;
      case "available":
        result.sort((a, b) => {
          const aAvailable = a.stock > 0 ? 1 : 0;
          const bAvailable = b.stock > 0 ? 1 : 0;
          return bAvailable - aAvailable;
        });
        break;
      case "newest":
      default:
        result.sort((a, b) => ((b.createdAt?.toMillis?.() ?? 0)) - ((a.createdAt?.toMillis?.() ?? 0)));
    }

    return result;
  }, [wishlistItems, search, sort]);

  // Si no hay usuario logueado, mostrar un CTA bonito en vez de redirigir bruscamente
  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <Heart className="h-10 w-10 text-danger" fill="currentColor" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-900">
          Tu Lista de Deseos
        </h2>
        <p className="mb-8 max-w-sm text-gray-500">
          Inicia sesión para guardar productos en tu Lista de Deseos y acceder a ellos desde cualquier dispositivo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Link
            to="/login"
            className="flex-1 rounded-xl bg-primary py-3 px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover shadow-sm"
          >
            Iniciar sesión
          </Link>
          <Link
            to="/catalogo"
            className="flex-1 rounded-xl bg-white border border-border py-3 px-6 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50"
          >
            Seguir explorando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-4 sm:space-y-6">
      {/* Botón volver */}
      <button
        onClick={() => navigate(-1)}
        className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary"
      >
        <ArrowLeft className="h-4 w-4" />
        Volver
      </button>

      {/* Header */}
      <div>
        <h1 className="flex items-center gap-2 text-xl font-bold text-gray-800 sm:text-2xl">
          <Heart className="h-6 w-6 text-danger" fill="currentColor" />
          Mi Lista de Deseos {!loading && `(${wishlistCount})`}
        </h1>
        <p className="mt-1 text-sm text-gray-500">
          Tus productos guardados para comprarlos más tarde
        </p>
      </div>

      {/* Controls: Search + Filter */}
      {(!loading && wishlistCount > 0) && (
        <div className="sticky top-0 z-30 space-y-2 bg-white/90 backdrop-blur-sm pb-3 pt-1 sm:space-y-3">
          <div className="flex items-center gap-3">
            <div className="relative flex-1 lg:max-w-lg">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar en favoritos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-border bg-white py-2.5 pl-10 pr-10 text-[16px] text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm"
              />
              {search && (
                <button
                  onClick={() => setSearch("")}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Botón Ordenar (Mobile) */}
            <button
              onClick={() => setShowFilters(true)}
              className="flex items-center justify-center h-10 w-10 shrink-0 rounded-xl bg-white text-gray-600 shadow-sm ring-1 ring-border transition-colors hover:bg-primary-light hover:text-primary lg:hidden"
            >
              <SlidersHorizontal className="h-4 w-4" />
            </button>

            {/* Select Ordenar (Desktop) */}
            <div className="hidden items-center gap-2 lg:flex shrink-0">
              <span className="text-sm font-medium text-gray-500">Ordenar por:</span>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-border bg-white px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </div>
      )}

      {/* Bottom Sheet para Orden (Mobile) */}
      <BottomSheet 
        isOpen={showFilters} 
        onClose={() => setShowFilters(false)}
        title="Ordenar favoritos"
      >
        <div className="space-y-4">
          <div className="flex flex-col gap-2">
            {SORT_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                onClick={() => {
                  setSort(opt.value);
                  setShowFilters(false);
                }}
                className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${
                  sort === opt.value
                    ? "bg-primary-light text-primary ring-1 ring-primary/30"
                    : "bg-gray-50 text-gray-600 hover:bg-gray-100"
                }`}
              >
                {opt.label}
                {sort === opt.value && <div className="h-2 w-2 rounded-full bg-primary" />}
              </button>
            ))}
          </div>
        </div>
      </BottomSheet>

      {/* Loading Skeletons */}
      {loading && (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {Array.from({ length: 4 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-xl bg-white shadow-sm ring-1 ring-border">
              <div className="aspect-square animate-pulse bg-gray-100" />
              <div className="space-y-2 p-3 sm:p-4">
                <div className="h-4 w-3/4 animate-pulse rounded bg-gray-100" />
                <div className="h-5 w-1/2 animate-pulse rounded bg-gray-100 mt-2" />
                <div className="mt-4 h-9 w-full animate-pulse rounded-lg bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state (No tiene productos guardados) */}
      {!loading && wishlistCount === 0 && (
        <div className="flex flex-col items-center justify-center py-16 px-4 text-center bg-white rounded-2xl border border-border">
          <div className="mb-6 flex relative">
             <div className="absolute -inset-1 rounded-full bg-primary-light/50 blur-lg"></div>
             <div className="relative flex h-24 w-24 items-center justify-center rounded-full bg-primary-light shadow-sm">
              <ImageIcon className="h-10 w-10 text-primary opacity-50 absolute left-4 bottom-4" />
              <Heart className="h-12 w-12 text-primary z-10" fill="currentColor" strokeWidth={1.5} />
             </div>
          </div>
          <h3 className="text-xl font-bold text-gray-900 mb-2">
            Todavía no guardaste productos
          </h3>
          <p className="max-w-md text-gray-500 mb-8 leading-relaxed">
            Explorá nuestro catálogo y guardá tus productos favoritos para comprarlos más tarde.
          </p>
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-3 text-sm font-bold text-white transition-all hover:bg-primary-hover hover:scale-105 active:scale-95 shadow-md shadow-primary/20"
          >
            Explorar catálogo
          </Link>
        </div>
      )}

      {/* Empty state (Búsqueda sin resultados) */}
      {!loading && wishlistCount > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center">
          <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-gray-100">
            <Search className="h-8 w-8 text-gray-400" />
          </div>
          <h3 className="text-base font-semibold text-gray-800">
            No se encontraron coincidencias
          </h3>
          <p className="mt-1 text-sm text-gray-500">
            Intenta con otros términos de búsqueda.
          </p>
          <button
            onClick={() => setSearch("")}
            className="mt-6 text-sm font-medium text-primary hover:text-primary-hover"
          >
            Limpiar búsqueda
          </button>
        </div>
      )}

      {/* Product grid */}
      {!loading && filtered.length > 0 && (
        <motion.div 
          layout
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4"
        >
          {filtered.map((product) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.2 }}
              key={product.productId}
              className="h-full"
            >
              <WishlistCard product={product} />
            </motion.div>
          ))}
        </motion.div>
      )}
    </div>
  );
}
