import { useState, useMemo, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { 
  Search, Heart, SlidersHorizontal, X, ArrowLeft, 
  ImageIcon, LayoutGrid, List, CheckSquare, Trash2, 
  ShoppingCart, Package, Check, Tag, ChevronLeft, ChevronRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import toast from "react-hot-toast";

import { useWishlist } from "../../context/WishlistContext";
import { useCart } from "../../context/CartContext";
import { useAuth } from "../../context/AuthContext";

import WishlistCard from "../../components/wishlist/WishlistCard";
import BottomSheet from "../../components/ui/BottomSheet";
import WishlistRecommendations from "../../components/wishlist/WishlistRecommendations";

const SORT_OPTIONS = [
  { value: "newest", label: "Más recientes" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
  { value: "name-asc", label: "Nombre A-Z" },
  { value: "name-desc", label: "Nombre Z-A" },
  { value: "available", label: "Disponibles" },
];

const ITEMS_PER_PAGE = 12;

export default function Wishlist() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { wishlistItems, loading, wishlistCount, removeMultipleFromWishlist } = useWishlist();
  const { cartItems, addToCart } = useCart();
  
  const [search, setSearch] = useState("");
  const [sort, setSort] = useState("newest");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [showFilters, setShowFilters] = useState(false);
  const [viewMode, setViewMode] = useState("grid"); // grid | list
  const [selectedItems, setSelectedItems] = useState(new Set());
  const [currentPage, setCurrentPage] = useState(1);

  // Extraer categorías únicas de los ítems en wishlist
  const categories = useMemo(() => {
    const cats = new Set(wishlistItems.map((item) => item.categoryName).filter(Boolean));
    return Array.from(cats).sort();
  }, [wishlistItems]);

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

    if (categoryFilter !== "all") {
      result = result.filter(p => p.categoryName === categoryFilter);
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
  }, [wishlistItems, search, sort, categoryFilter]);

  // Paginación
  const totalPages = Math.ceil(filtered.length / ITEMS_PER_PAGE);
  const paginatedItems = useMemo(() => {
    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    return filtered.slice(start, start + ITEMS_PER_PAGE);
  }, [filtered, currentPage]);

  // Resetear paginación si cambia el filtro
  useEffect(() => {
    setCurrentPage(1);
  }, [search, sort, categoryFilter]);

  // Estadísticas reales
  const inCartCount = useMemo(() => {
    return wishlistItems.filter(wItem => cartItems.some(cItem => cItem.id === (wItem.productId || wItem.id))).length;
  }, [wishlistItems, cartItems]);

  const availableCount = useMemo(() => {
    return wishlistItems.filter(wItem => wItem.stock > 0).length;
  }, [wishlistItems]);

  const handleSelectToggle = (id) => {
    const newSet = new Set(selectedItems);
    if (newSet.has(id)) newSet.delete(id);
    else newSet.add(id);
    setSelectedItems(newSet);
  };

  const handleSelectAll = () => {
    if (selectedItems.size === paginatedItems.length) {
      setSelectedItems(new Set());
    } else {
      setSelectedItems(new Set(paginatedItems.map(p => p.productId || p.id)));
    }
  };

  const handleBulkAddToCart = async () => {
    if (selectedItems.size === 0) return;
    const itemsToAdd = wishlistItems.filter(p => selectedItems.has(p.productId || p.id) && p.stock > 0);
    
    if (itemsToAdd.length === 0) {
      toast.error("Los productos seleccionados no tienen stock.");
      return;
    }

    let added = 0;
    for (const item of itemsToAdd) {
      // Verificar si no está ya en el carrito
      if (!cartItems.some(cItem => cItem.id === (item.productId || item.id))) {
        addToCart({ id: item.productId || item.id, ...item });
        added++;
      }
    }
    
    if (added > 0) {
      toast.success(`${added} productos agregados al carrito`);
    } else {
      toast.success("Los productos ya estaban en tu carrito");
    }
    setSelectedItems(new Set());
  };

  const handleBulkDelete = async () => {
    if (selectedItems.size === 0) return;
    if (window.confirm(`¿Estás seguro de eliminar ${selectedItems.size} productos de tu lista de deseos?`)) {
      await removeMultipleFromWishlist(Array.from(selectedItems));
      setSelectedItems(new Set());
    }
  };

  if (!user) {
    return (
      <div className="flex flex-col items-center justify-center py-20 px-4 text-center">
        <div className="mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-red-50">
          <Heart className="h-10 w-10 text-danger" fill="currentColor" />
        </div>
        <h2 className="mb-3 text-2xl font-bold text-gray-900">Tu Lista de Deseos</h2>
        <p className="mb-8 max-w-sm text-gray-500">
          Inicia sesión para guardar productos en tu Lista de Deseos y acceder a ellos desde cualquier dispositivo.
        </p>
        <div className="flex flex-col sm:flex-row gap-4 w-full max-w-sm">
          <Link to="/login" className="flex-1 rounded-xl bg-primary py-3 px-6 text-sm font-semibold text-white transition-colors hover:bg-primary-hover shadow-sm">
            Iniciar sesión
          </Link>
          <Link to="/catalogo" className="flex-1 rounded-xl bg-white border border-border py-3 px-6 text-sm font-semibold text-gray-700 transition-colors hover:bg-gray-50">
            Seguir explorando
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6 lg:space-y-8 max-w-7xl mx-auto pb-10">
      
      {/* Botón volver */}
      <button onClick={() => navigate("/catalogo")} className="inline-flex items-center gap-1.5 text-sm font-medium text-gray-500 transition-colors hover:text-primary">
        <ArrowLeft className="h-4 w-4" />
        Volver al catálogo
      </button>

      {/* Hero Header Premium */}
      <motion.div 
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl bg-gradient-to-r from-gray-900 to-gray-800 px-6 py-10 sm:px-10 sm:py-14 shadow-lg text-white"
      >
        <div className="absolute top-0 right-0 -mt-10 -mr-10 opacity-10">
          <Heart className="h-64 w-64" fill="currentColor" />
        </div>
        <div className="relative z-10 max-w-2xl">
          <div className="flex items-center gap-3 mb-4">
             <div className="flex items-center justify-center h-10 w-10 rounded-full bg-white/20 backdrop-blur-sm">
               <Heart className="h-5 w-5 text-white" fill="currentColor" />
             </div>
             <span className="text-sm font-medium tracking-wider uppercase text-gray-300">Mi Lista de Deseos</span>
          </div>
          <h1 className="text-3xl font-extrabold sm:text-5xl mb-4">
            Tus favoritos, en un solo lugar
          </h1>
          <p className="text-gray-300 text-lg mb-8 max-w-xl">
            Guarda tus productos favoritos y encuéntralos fácilmente para cuando estés listo para comprar.
          </p>
          <div className="flex flex-wrap gap-4">
            <Link to="/catalogo" className="inline-flex items-center justify-center rounded-xl bg-white text-gray-900 px-6 py-3 text-sm font-bold transition-all hover:bg-gray-100 shadow-md hover:scale-105 active:scale-95">
              Seguir comprando
            </Link>
            {!loading && wishlistCount > 0 && (
              <button 
                onClick={() => {
                   setSelectedItems(new Set(wishlistItems.map(p => p.productId || p.id)));
                   setTimeout(() => handleBulkAddToCart(), 100);
                }}
                className="inline-flex items-center justify-center rounded-xl bg-white/10 backdrop-blur-sm border border-white/20 text-white px-6 py-3 text-sm font-bold transition-all hover:bg-white/20 shadow-md hover:scale-105 active:scale-95 gap-2"
              >
                <ShoppingCart className="h-4 w-4" />
                Agregar todos al carrito
              </button>
            )}
          </div>
        </div>
      </motion.div>

      {/* Stats Panel */}
      {!loading && wishlistCount > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }} className="bg-white rounded-2xl p-5 border border-border shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-red-50 flex items-center justify-center shrink-0">
              <Heart className="h-6 w-6 text-danger" fill="currentColor" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Productos guardados</p>
              <p className="text-2xl font-bold text-gray-900">{wishlistCount}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} className="bg-white rounded-2xl p-5 border border-border shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-emerald-50 flex items-center justify-center shrink-0">
              <Package className="h-6 w-6 text-emerald-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Disponibles</p>
              <p className="text-2xl font-bold text-gray-900">{availableCount}</p>
            </div>
          </motion.div>
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }} className="bg-white rounded-2xl p-5 border border-border shadow-sm flex items-center gap-4">
            <div className="h-12 w-12 rounded-full bg-blue-50 flex items-center justify-center shrink-0">
              <ShoppingCart className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">En carrito</p>
              <p className="text-2xl font-bold text-gray-900">{inCartCount}</p>
            </div>
          </motion.div>
        </div>
      )}

      {/* Toolbar Sticky */}
      {(!loading && wishlistCount > 0) && (
        <div className="sticky top-0 z-40 bg-[#F8FAFC]/90 backdrop-blur-md pb-4 pt-2 -mx-4 px-4 sm:-mx-0 sm:px-0">
          <div className="bg-white border border-border shadow-sm rounded-2xl p-3 flex flex-col lg:flex-row gap-3 lg:items-center">
            
            {/* Buscador */}
            <div className="relative flex-1">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos favoritos..."
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full rounded-xl border border-gray-200 bg-gray-50 py-2.5 pl-10 pr-10 text-[16px] text-gray-800 placeholder-gray-500 outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20 sm:text-sm font-medium"
              />
              {search && (
                <button onClick={() => setSearch("")} className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600">
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Filtros rápidos Mobile */}
            <div className="flex gap-2 lg:hidden">
               <button
                  onClick={() => setShowFilters(true)}
                  className="flex-1 flex items-center justify-center gap-2 rounded-xl border border-gray-200 bg-white py-2.5 text-sm font-medium text-gray-700 shadow-sm"
               >
                  <SlidersHorizontal className="h-4 w-4" />
                  Filtrar / Ordenar
               </button>
            </div>

            {/* Filtros Desktop */}
            <div className="hidden lg:flex items-center gap-3 shrink-0">
              <div className="flex items-center gap-2">
                <Tag className="h-4 w-4 text-gray-400" />
                <select
                  value={categoryFilter}
                  onChange={(e) => setCategoryFilter(e.target.value)}
                  className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all focus:border-primary focus:bg-white cursor-pointer"
                >
                  <option value="all">Todas las categorías</option>
                  {categories.map((cat) => (
                    <option key={cat} value={cat}>{cat}</option>
                  ))}
                </select>
              </div>

              <div className="h-6 w-px bg-gray-200 mx-1"></div>

              <select
                value={sort}
                onChange={(e) => setSort(e.target.value)}
                className="rounded-xl border border-gray-200 bg-gray-50 px-4 py-2.5 text-sm font-medium text-gray-700 outline-none transition-all focus:border-primary focus:bg-white cursor-pointer"
              >
                {SORT_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>

              <div className="h-6 w-px bg-gray-200 mx-1"></div>

              <div className="flex bg-gray-100 rounded-xl p-1">
                <button onClick={() => setViewMode("grid")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "grid" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-900"}`}>
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button onClick={() => setViewMode("list")} className={`p-1.5 rounded-lg transition-colors ${viewMode === "list" ? "bg-white shadow-sm text-primary" : "text-gray-500 hover:text-gray-900"}`}>
                  <List className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
          
          {/* Barra de Acciones Múltiples (Si hay selección) */}
          <AnimatePresence>
            {selectedItems.size > 0 && (
              <motion.div 
                initial={{ opacity: 0, height: 0, marginTop: 0 }}
                animate={{ opacity: 1, height: "auto", marginTop: 12 }}
                exit={{ opacity: 0, height: 0, marginTop: 0 }}
                className="bg-primary-light/30 border border-primary/20 rounded-2xl p-3 flex items-center justify-between overflow-hidden"
              >
                <div className="flex items-center gap-3">
                  <span className="text-sm font-semibold text-primary">{selectedItems.size} seleccionados</span>
                  <button onClick={() => setSelectedItems(new Set())} className="text-xs font-medium text-gray-500 hover:text-gray-900">
                    Cancelar
                  </button>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={handleBulkDelete} className="flex items-center gap-1.5 rounded-lg bg-white px-3 py-1.5 text-xs font-medium text-danger shadow-sm ring-1 ring-border hover:bg-red-50 transition-colors">
                    <Trash2 className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Eliminar</span>
                  </button>
                  <button onClick={handleBulkAddToCart} className="flex items-center gap-1.5 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-primary-hover transition-colors">
                    <ShoppingCart className="h-3.5 w-3.5" />
                    <span className="hidden sm:inline">Agregar al carrito</span>
                  </button>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* Opciones Avanzadas Mobile Bottom Sheet */}
      <BottomSheet isOpen={showFilters} onClose={() => setShowFilters(false)} title="Filtros y Orden">
        <div className="space-y-6">
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Categoría</h4>
            <div className="flex flex-col gap-2">
               <button
                  onClick={() => { setCategoryFilter("all"); setShowFilters(false); }}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${categoryFilter === "all" ? "bg-primary-light text-primary ring-1 ring-primary/30" : "bg-gray-50 text-gray-600"}`}
                >
                  Todas
                  {categoryFilter === "all" && <div className="h-2 w-2 rounded-full bg-primary" />}
                </button>
              {categories.map((cat) => (
                <button
                  key={cat}
                  onClick={() => { setCategoryFilter(cat); setShowFilters(false); }}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${categoryFilter === cat ? "bg-primary-light text-primary ring-1 ring-primary/30" : "bg-gray-50 text-gray-600"}`}
                >
                  {cat}
                  {categoryFilter === cat && <div className="h-2 w-2 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Ordenar por</h4>
            <div className="flex flex-col gap-2">
              {SORT_OPTIONS.map((opt) => (
                <button
                  key={opt.value}
                  onClick={() => { setSort(opt.value); setShowFilters(false); }}
                  className={`flex w-full items-center justify-between rounded-xl px-4 py-3 text-sm font-medium transition-colors ${sort === opt.value ? "bg-primary-light text-primary ring-1 ring-primary/30" : "bg-gray-50 text-gray-600"}`}
                >
                  {opt.label}
                  {sort === opt.value && <div className="h-2 w-2 rounded-full bg-primary" />}
                </button>
              ))}
            </div>
          </div>
          <div>
            <h4 className="text-sm font-semibold text-gray-900 mb-3">Vista</h4>
             <div className="grid grid-cols-2 gap-2">
                <button onClick={() => { setViewMode("grid"); setShowFilters(false); }} className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium ${viewMode === "grid" ? "bg-primary-light text-primary ring-1 ring-primary/30" : "bg-gray-50 text-gray-600"}`}>
                  <LayoutGrid className="h-4 w-4" /> Cuadrícula
                </button>
                <button onClick={() => { setViewMode("list"); setShowFilters(false); }} className={`flex items-center justify-center gap-2 rounded-xl py-3 text-sm font-medium ${viewMode === "list" ? "bg-primary-light text-primary ring-1 ring-primary/30" : "bg-gray-50 text-gray-600"}`}>
                  <List className="h-4 w-4" /> Lista
                </button>
             </div>
          </div>
        </div>
      </BottomSheet>

      {/* Loading Skeletons Premium */}
      {loading && (
        <div className={`grid gap-4 sm:gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1"}`}>
          {Array.from({ length: 8 }).map((_, i) => (
            <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border">
              <div className="aspect-square animate-pulse bg-gray-100" />
              <div className="space-y-3 p-4">
                <div className="h-4 w-1/3 animate-pulse rounded-md bg-gray-100" />
                <div className="h-5 w-3/4 animate-pulse rounded-md bg-gray-100" />
                <div className="h-6 w-1/2 animate-pulse rounded-md bg-gray-100 mt-2" />
                <div className="mt-4 h-10 w-full animate-pulse rounded-xl bg-gray-100" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Empty state (No tiene productos guardados) */}
      {!loading && wishlistCount === 0 && (
        <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="flex flex-col items-center justify-center py-24 px-4 text-center bg-white rounded-3xl border border-border shadow-sm">
          <div className="mb-8 relative">
             <motion.div 
               animate={{ scale: [1, 1.2, 1], rotate: [0, 10, -10, 0] }} 
               transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
               className="relative flex h-32 w-32 items-center justify-center rounded-full bg-red-50"
             >
              <Heart className="h-16 w-16 text-danger" fill="currentColor" strokeWidth={1} />
             </motion.div>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-3">
            Todavía no tienes productos favoritos
          </h3>
          <p className="max-w-md text-gray-500 mb-10 text-lg">
            Explora nuestro catálogo y guarda los productos que más te interesen para comprarlos después.
          </p>
          <Link
            to="/catalogo"
            className="inline-flex items-center gap-2 rounded-xl bg-primary px-8 py-4 text-base font-bold text-white transition-all hover:bg-primary-hover hover:scale-105 active:scale-95 shadow-lg shadow-primary/30"
          >
            Explorar catálogo
          </Link>
        </motion.div>
      )}

      {/* Empty state (Búsqueda sin resultados) */}
      {!loading && wishlistCount > 0 && filtered.length === 0 && (
        <div className="flex flex-col items-center justify-center py-20 text-center bg-white rounded-3xl border border-border">
          <div className="mb-4 flex h-20 w-20 items-center justify-center rounded-full bg-gray-50">
            <Search className="h-10 w-10 text-gray-300" />
          </div>
          <h3 className="text-xl font-bold text-gray-800">
            No se encontraron resultados
          </h3>
          <p className="mt-2 text-gray-500 max-w-sm">
            No encontramos ningún producto que coincida con tus filtros de búsqueda actual.
          </p>
          <button
            onClick={() => { setSearch(""); setCategoryFilter("all"); }}
            className="mt-8 rounded-xl bg-gray-900 text-white px-6 py-3 text-sm font-semibold hover:bg-gray-800 transition-colors"
          >
            Limpiar filtros
          </button>
        </div>
      )}

      {/* Header Grid (Seleccionar todo) */}
      {!loading && paginatedItems.length > 0 && (
         <div className="flex items-center mb-4 pl-1">
           <button onClick={handleSelectAll} className="flex items-center gap-2 text-sm font-medium text-gray-600 hover:text-primary transition-colors">
              <CheckSquare className="h-5 w-5" />
              {selectedItems.size === paginatedItems.length ? "Deseleccionar todo" : "Seleccionar todo de esta página"}
           </button>
         </div>
      )}

      {/* Product grid / list */}
      {!loading && paginatedItems.length > 0 && (
        <motion.div 
          layout
          className={`grid gap-4 sm:gap-6 ${viewMode === "grid" ? "grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4" : "grid-cols-1 lg:grid-cols-2"}`}
        >
          {paginatedItems.map((product) => (
            <motion.div
              layout
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              key={product.productId || product.id}
              className="h-full"
            >
              <WishlistCard 
                product={product} 
                isSelected={selectedItems.has(product.productId || product.id)}
                onSelectToggle={handleSelectToggle}
              />
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* Paginación */}
      {!loading && totalPages > 1 && (
        <div className="mt-12 flex justify-center">
          <div className="flex items-center gap-2 bg-white px-2 py-2 rounded-2xl border border-border shadow-sm">
            <button
              onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="flex items-center justify-center h-10 w-10 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            <div className="flex items-center gap-1 px-2">
              {Array.from({ length: totalPages }).map((_, i) => (
                <button
                  key={i}
                  onClick={() => setCurrentPage(i + 1)}
                  className={`flex items-center justify-center h-10 w-10 rounded-xl text-sm font-semibold transition-colors ${
                    currentPage === i + 1
                      ? "bg-primary text-white shadow-md shadow-primary/20"
                      : "text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  {i + 1}
                </button>
              ))}
            </div>
            <button
              onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="flex items-center justify-center h-10 w-10 rounded-xl text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:hover:bg-transparent transition-colors"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        </div>
      )}

      {/* Recomendaciones (Si hay favoritos, mostrar basadas en ellas) */}
      {!loading && (
        <WishlistRecommendations wishlistItems={wishlistItems} />
      )}
    </div>
  );
}
