import { useState, useEffect, useMemo, useRef, useCallback } from "react";
import { Search, SlidersHorizontal, X, Package } from "lucide-react";
import { useSearchParams } from "react-router-dom";
import { subscribeToActiveProducts } from "../../services/publicProductService";
import ProductCard from "../../components/public/ProductCard";
import BottomSheet from "../../components/ui/BottomSheet";
import PublicCatalogLayout from "../../components/public/catalog/PublicCatalogLayout";
import FeaturedProducts from "../../components/public/catalog/FeaturedProducts";

const SORT_OPTIONS = [
  { value: "newest", label: "Más recientes" },
  { value: "price-asc", label: "Menor precio" },
  { value: "price-desc", label: "Mayor precio" },
];

export default function Catalog() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);

  // Estados locales sincronizados con la URL
  const [search, setSearch] = useState(searchParams.get("q") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "all");
  const [sort, setSort] = useState("newest");
  const [showFilters, setShowFilters] = useState(false);
  
  const [visibleCount, setVisibleCount] = useState(20);

  // Sincronizar URL hacia el estado local
  useEffect(() => {
    setSearch(searchParams.get("q") || "");
    setSelectedCategory(searchParams.get("category") || "all");
  }, [searchParams]);

  // Actualizar URL cuando cambia la categoría desde la sidebar
  const handleSelectCategory = (cat) => {
    setSelectedCategory(cat);
    if (cat === "all") {
      searchParams.delete("category");
    } else {
      searchParams.set("category", cat);
    }
    setSearchParams(searchParams);
  };

  useEffect(() => {
    setLoading(true);
    const unsubscribe = subscribeToActiveProducts(
      (data) => {
        setProducts(data);
        const cats = [...new Set(data.map((p) => p.categoryName).filter(Boolean))];
        setCategories(cats.sort());
        setLoading(false);
      },
      (error) => {
        console.error("Error subscribing to products:", error);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  const filtered = useMemo(() => {
    let result = [...products];

    if (search.trim()) {
      const q = search.toLowerCase().trim();
      result = result.filter(
        (p) =>
          p.name.toLowerCase().includes(q) ||
          (p.description && p.description.toLowerCase().includes(q)) ||
          (p.categoryName && p.categoryName.toLowerCase().includes(q))
      );
    }

    if (selectedCategory !== "all") {
      result = result.filter((p) => p.categoryName === selectedCategory);
    }

    switch (sort) {
      case "price-asc":
        result.sort((a, b) => (a.salePrice ?? 0) - (b.salePrice ?? 0));
        break;
      case "price-desc":
        result.sort((a, b) => (b.salePrice ?? 0) - (a.salePrice ?? 0));
        break;
      default:
        result.sort((a, b) => ((b.createdAt?.toMillis?.() ?? 0)) - ((a.createdAt?.toMillis?.() ?? 0)));
    }

    return result;
  }, [products, search, selectedCategory, sort]);

  // Infinite Scroll Observer
  const observer = useRef();
  const lastElementRef = useCallback((node) => {
    if (loading) return;
    if (observer.current) observer.current.disconnect();
    
    observer.current = new IntersectionObserver(entries => {
      if (entries[0].isIntersecting && visibleCount < filtered.length) {
        setVisibleCount(prev => prev + 20);
      }
    });
    
    if (node) observer.current.observe(node);
  }, [loading, filtered.length, visibleCount]);

  // Reset visibleCount when filters change
  useEffect(() => {
    setVisibleCount(20);
  }, [search, selectedCategory, sort]);

  const visibleProducts = filtered.slice(0, visibleCount);

  return (
    <div className="space-y-8 sm:space-y-10">
      
      {/* Nuevo Hero Layout con Sidebar y Service Card */}
      <PublicCatalogLayout
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={handleSelectCategory}
      />

      {/* Carrusel de Productos Destacados (Oculto temporalmente) */}
      {/* <FeaturedProducts products={products} loading={loading} /> */}

      {/* Catálogo Completo */}
      <div id="catalogo-completo" className="scroll-mt-32 space-y-4 sm:space-y-6">
        <div>
          <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
            Catálogo de productos
          </h2>
          <p className="mt-1 text-sm text-gray-500">
            Explorá todos nuestros productos disponibles
          </p>
        </div>

        {/* Sticky Search + Filter bar */}
        <div className="sticky top-24 z-30 space-y-2 bg-white/95 pb-3 pt-2 backdrop-blur-sm sm:space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-4">
            
            {/* Buscador móvil (oculto en lg porque está en el header) */}
            <div className="relative w-full lg:hidden">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar productos..."
                value={search}
                onChange={(e) => {
                  setSearch(e.target.value);
                  if (e.target.value) {
                    searchParams.set("q", e.target.value);
                  } else {
                    searchParams.delete("q");
                  }
                  setSearchParams(searchParams);
                }}
                className="w-full rounded-xl border border-border bg-white py-3 pl-10 pr-10 text-[16px] text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20 sm:text-sm"
              />
              {search && (
                <button
                  onClick={() => {
                    setSearch("");
                    searchParams.delete("q");
                    setSearchParams(searchParams);
                  }}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>

            {/* Breadcrumb de filtros activos y Botón Ordenar */}
            <div className="flex w-full flex-row-reverse sm:flex-row items-center justify-between sm:w-auto gap-4">
              
              {/* Resultados info */}
              <div className="text-xs text-gray-500 hidden sm:block">
                Mostrando <span className="font-semibold text-gray-800">{filtered.length}</span> resultados
              </div>

              {/* Botón Ordenar */}
              <div className="shrink-0 flex items-center gap-2">
                <button
                  onClick={() => setShowFilters(true)}
                  className="flex items-center justify-center gap-2 rounded-lg bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-border transition-colors hover:bg-gray-50 hover:text-gray-900 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" />
                  <span>Filtros</span>
                </button>

                <div className="hidden items-center gap-2 lg:flex">
                  <span className="text-sm font-medium text-gray-500">Ordenar por:</span>
                  <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="rounded-lg border border-border bg-white px-3 py-2 text-sm font-medium text-gray-700 shadow-sm outline-none transition-all hover:bg-gray-50 focus:border-primary focus:ring-2 focus:ring-primary/20"
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
          </div>
        </div>

        {/* Bottom Sheet para Filtros y Orden (Mobile) */}
        <BottomSheet 
          isOpen={showFilters} 
          onClose={() => setShowFilters(false)}
          title="Filtros y Orden"
        >
          <div className="space-y-6">
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-800">Ordenar por</h3>
              <div className="flex flex-col gap-2">
                {SORT_OPTIONS.map((opt) => (
                  <button
                    key={opt.value}
                    onClick={() => {
                      setSort(opt.value);
                      setShowFilters(false);
                    }}
                    className={`flex w-full items-center justify-between rounded-lg px-4 py-3 text-sm font-medium transition-colors ${
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
            
            <div>
              <h3 className="mb-3 text-sm font-semibold text-gray-800">Categorías</h3>
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => {
                    handleSelectCategory("all");
                    setShowFilters(false);
                  }}
                  className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                    selectedCategory === "all"
                      ? "bg-primary text-white"
                      : "bg-gray-50 text-gray-600 ring-1 ring-border hover:bg-primary-light"
                  }`}
                >
                  Todas
                </button>
                {categories.map((cat) => (
                  <button
                    key={cat}
                    onClick={() => {
                      handleSelectCategory(cat);
                      setShowFilters(false);
                    }}
                    className={`rounded-full px-4 py-2 text-sm font-medium transition-colors ${
                      selectedCategory === cat
                        ? "bg-primary text-white"
                        : "bg-gray-50 text-gray-600 ring-1 ring-border hover:bg-primary-light"
                    }`}
                  >
                    {cat}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </BottomSheet>

        {/* Loading Skeletons */}
        {loading && (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {Array.from({ length: 10 }).map((_, i) => (
              <div key={i} className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border">
                <div className="aspect-square animate-pulse bg-gray-100" />
                <div className="space-y-3 p-4">
                  <div className="h-3 w-3/4 animate-pulse rounded bg-gray-100" />
                  <div className="h-4 w-1/2 animate-pulse rounded bg-gray-100" />
                  <div className="mt-4 h-9 w-full animate-pulse rounded-xl bg-gray-100" />
                </div>
              </div>
            ))}
          </div>
        )}

        {/* Empty state */}
        {!loading && filtered.length === 0 && (
          <div className="flex flex-col items-center justify-center py-20 rounded-2xl border border-dashed border-gray-300 bg-gray-50">
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-white shadow-sm">
              {search || selectedCategory !== "all" ? (
                <Search className="h-8 w-8 text-gray-400" />
              ) : (
                <Package className="h-8 w-8 text-gray-400" />
              )}
            </div>
            <h3 className="mt-5 text-base font-semibold text-gray-800">
              {search || selectedCategory !== "all"
                ? "No encontramos productos"
                : "No hay productos disponibles"}
            </h3>
            <p className="mt-1.5 max-w-sm text-center text-sm text-gray-500">
              {search || selectedCategory !== "all"
                ? "Intenta con otros términos de búsqueda o seleccioná 'Todas' las categorías."
                : "Los productos aparecerán aquí cuando estén publicados."}
            </p>
            {(search || selectedCategory !== "all") && (
              <button
                onClick={() => {
                  setSearch("");
                  searchParams.delete("q");
                  handleSelectCategory("all");
                }}
                className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover active:scale-95"
              >
                <X className="h-4 w-4" />
                Limpiar filtros
              </button>
            )}
          </div>
        )}

        {/* Product grid */}
        {!loading && filtered.length > 0 && (
          <div className="grid grid-cols-2 gap-4 sm:gap-6 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5">
            {visibleProducts.map((product, index) => {
              if (visibleProducts.length === index + 1) {
                return (
                  <div ref={lastElementRef} key={product.id} className="h-full">
                    <ProductCard product={product} />
                  </div>
                );
              } else {
                return <ProductCard key={product.id} product={product} />;
              }
            })}
          </div>
        )}

        {/* Loading more indicator */}
        {!loading && visibleCount < filtered.length && (
          <div className="flex justify-center py-8">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent shadow-sm" />
          </div>
        )}
      </div>
    </div>
  );
}

