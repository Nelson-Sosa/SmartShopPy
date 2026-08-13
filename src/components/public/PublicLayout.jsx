import { Outlet, Link, useLocation, useNavigate, useSearchParams } from "react-router-dom";
import { LogIn, LogOut, ShoppingCart, Heart, Search } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { useCart } from "../../context/CartContext";
import { useWishlist } from "../../context/WishlistContext";
import { useAuth } from "../../context/AuthContext";
import { useCategories } from "../../hooks/useCategories";
import WhatsappFloat from "./WhatsappFloat";
import CategoryNavigation from "./catalog/CategoryNavigation";
import MyRepairsPanel from "./MyRepairsPanel";
import { BRAND } from "../../config/brand";

export default function PublicLayout() {
  const location = useLocation();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { cartCount } = useCart();
  const { wishlistCount } = useWishlist();
  const { user, logout } = useAuth();
  const { categories } = useCategories();
  
  const [searchValue, setSearchValue] = useState(searchParams.get("q") || "");

  const isWishlistRoute = location.pathname.includes("/favoritos");
  const isCartRoute = location.pathname.includes("/carrito");
  // Determinar si estamos en la ruta exacta del catálogo para marcar la categoría seleccionada
  const isCatalogRoot = location.pathname === "/catalogo" || location.pathname === "/catalogo/";
  const currentCategory = isCatalogRoot ? (searchParams.get("category") || "all") : null;

  const handleLogout = async () => {
    await logout();
    navigate("/catalogo");
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchValue.trim()) {
      navigate(`/catalogo?q=${encodeURIComponent(searchValue.trim())}`);
    } else {
      navigate(`/catalogo`);
    }
  };

  const handleSelectCategory = (cat) => {
    if (cat === "all") {
      navigate("/catalogo");
    } else {
      navigate(`/catalogo?category=${encodeURIComponent(cat)}`);
    }
  };

  // Extraer solo los nombres de las categorías activas (o todas)
  const categoryNames = categories.map(c => c.name).sort();

  // Obtener la inicial del usuario para el avatar
  const userInitial = user?.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user?.email
    ? user.email.charAt(0).toUpperCase()
    : "U";
  
  return (
    <div className="min-h-screen bg-background-secondary">
      <header className="sticky top-0 z-40 border-b border-border bg-white/80 shadow-sm backdrop-blur-md">
        <div className="mx-auto flex h-24 max-w-[1600px] items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/catalogo" className="flex items-center gap-3 min-w-0">
            <img
              src={BRAND.logo}
              alt={BRAND.name}
              className="h-24 w-auto shrink-0 object-contain"
            />
            <div className="min-w-0">
              <p className="truncate text-base font-extrabold tracking-tight text-gray-800 sm:text-lg">
                {BRAND.name}
              </p>
              <p className="-mt-0.5 truncate text-[11px] font-medium text-gray-500">
                Catálogo de productos
              </p>
            </div>
          </Link>

          {/* Buscador central prominente (solo Desktop) */}
          <div className="hidden lg:flex flex-1 max-w-xl mx-8">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                type="text"
                placeholder="Buscar por nombre, descripción o categoría..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="w-full rounded-xl border border-border bg-gray-50 py-2.5 pl-10 pr-4 text-[15px] text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-primary focus:bg-white focus:ring-2 focus:ring-primary/20"
              />
            </form>
          </div>

          <div className="flex items-center gap-3">
            {/* Panel de Mis Reparaciones */}
            <MyRepairsPanel />

            <Link 
              to="/catalogo/favoritos"
              className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer ${isWishlistRoute ? 'bg-red-50 text-danger ring-1 ring-danger/20' : 'bg-gray-50 text-gray-600 hover:bg-red-50 hover:text-danger'}`}
            >
              <Heart className={`h-5 w-5 ${isWishlistRoute ? 'fill-danger/20' : ''}`} />
              <AnimatePresence>
                {wishlistCount > 0 && (
                  <motion.span 
                    key={wishlistCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-danger text-[10px] font-bold text-white shadow-sm ring-2 ring-white"
                  >
                    {wishlistCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>

            <Link 
              to="/catalogo/carrito"
              className={`relative flex h-10 w-10 shrink-0 items-center justify-center rounded-full transition-colors cursor-pointer ${isCartRoute ? 'bg-primary-light text-primary ring-1 ring-primary/20' : 'bg-gray-50 text-gray-600 hover:bg-gray-100 hover:text-gray-900'}`}
            >
              <ShoppingCart className="h-5 w-5" />
              <AnimatePresence>
                {cartCount > 0 && (
                  <motion.span 
                    key={cartCount}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    exit={{ scale: 0 }}
                    className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-primary text-[10px] font-bold text-white shadow-sm ring-2 ring-white"
                  >
                    {cartCount}
                  </motion.span>
                )}
              </AnimatePresence>
            </Link>
            
            {user ? (
              <div className="flex items-center gap-2">
                <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-primary text-sm font-bold text-white shadow-sm">
                  {userInitial}
                </div>
                <button
                  onClick={handleLogout}
                  className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-danger hover:text-danger hover:shadow-md"
                >
                  <LogOut className="h-4 w-4" />
                  <span className="hidden sm:inline">Cerrar</span>
                </button>
              </div>
            ) : (
              <Link
                to="/login"
                className="inline-flex shrink-0 items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-2 text-sm font-medium text-gray-600 shadow-sm transition-all hover:border-primary hover:text-primary hover:shadow-md"
              >
                <LogIn className="h-4 w-4" />
                <span className="hidden sm:inline">Entrar</span>
              </Link>
            )}
          </div>
        </div>
      </header>

      {/* Navegación de Categorías Horizontal */}
      <CategoryNavigation 
        categories={categoryNames} 
        selectedCategory={currentCategory} 
        onSelectCategory={handleSelectCategory}
      />

      <main className="mx-auto max-w-[1600px] px-4 py-6 sm:px-6 lg:px-8 lg:py-8">
        <Outlet />
      </main>

      <WhatsappFloat />

      <footer className="border-t border-border bg-white py-6 text-center text-xs text-gray-400">
        &copy; {new Date().getFullYear()} {BRAND.name} - {BRAND.fullName} &mdash; Todos los derechos reservados.
      </footer>
    </div>
  );
}
