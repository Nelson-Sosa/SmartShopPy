import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  useMemo,
  useRef,
} from "react";
import toast from "react-hot-toast";
import { useAuth } from "./AuthContext";
import {
  subscribeToWishlist,
  addToWishlist as addToWishlistService,
  removeFromWishlist as removeFromWishlistService,
  removeMultipleFromWishlist as removeMultipleFromWishlistService,
} from "../services/wishlistService";
import AuthRequiredModal from "../components/wishlist/AuthRequiredModal";

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { user } = useAuth();
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);
  const unsubRef = useRef(null);

  // Suscripción en tiempo real cuando el usuario está autenticado
  useEffect(() => {
    // Limpiar suscripción anterior
    if (unsubRef.current) {
      unsubRef.current();
      unsubRef.current = null;
    }

    if (!user?.uid) {
      setWishlistItems([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    unsubRef.current = subscribeToWishlist(
      user.uid,
      (items) => {
        setWishlistItems(items);
        setLoading(false);
      },
      (err) => {
        console.error("[Wishlist] Error en suscripción:", err);
        setLoading(false);
      }
    );

    return () => {
      if (unsubRef.current) {
        unsubRef.current();
        unsubRef.current = null;
      }
    };
  }, [user?.uid]);

  const isInWishlist = useCallback(
    (productId) => wishlistItems.some((item) => item.productId === productId),
    [wishlistItems]
  );

  const addToWishlist = useCallback(
    async (product) => {
      if (!user?.uid) {
        setShowAuthModal(true);
        return;
      }
      try {
        await addToWishlistService(user.uid, product);
        toast.success("Producto agregado a tu Lista de Deseos ❤️", {
          duration: 2500,
          style: {
            borderRadius: "12px",
            background: "#1e293b",
            color: "#fff",
            fontSize: "14px",
          },
        });
      } catch (err) {
        console.error("[Wishlist] Error al agregar:", err);
        toast.error("No se pudo agregar a favoritos");
      }
    },
    [user?.uid]
  );

  const removeFromWishlist = useCallback(
    async (productId) => {
      if (!user?.uid) return;
      try {
        await removeFromWishlistService(user.uid, productId);
        toast("Eliminado de tu Lista de Deseos", {
          icon: "🗑️",
          duration: 2000,
          style: {
            borderRadius: "12px",
            background: "#1e293b",
            color: "#fff",
            fontSize: "14px",
          },
        });
      } catch (err) {
        console.error("[Wishlist] Error al eliminar:", err);
        toast.error("No se pudo eliminar de favoritos");
      }
    },
    [user?.uid]
  );

  const removeMultipleFromWishlist = useCallback(
    async (productIds) => {
      if (!user?.uid) return;
      try {
        await removeMultipleFromWishlistService(user.uid, productIds);
        toast.success(`${productIds.length} productos eliminados`);
      } catch (err) {
        console.error("[Wishlist] Error al eliminar múltiples:", err);
        toast.error("No se pudo eliminar los productos");
      }
    },
    [user?.uid]
  );

  const closeAuthModal = useCallback(() => setShowAuthModal(false), []);

  const wishlistCount = useMemo(() => wishlistItems.length, [wishlistItems]);

  const value = useMemo(
    () => ({
      wishlistItems,
      wishlistCount,
      loading,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      removeMultipleFromWishlist,
      showAuthModal,
      closeAuthModal,
    }),
    [
      wishlistItems,
      wishlistCount,
      loading,
      isInWishlist,
      addToWishlist,
      removeFromWishlist,
      removeMultipleFromWishlist,
      showAuthModal,
      closeAuthModal,
    ]
  );

  return (
    <WishlistContext.Provider value={value}>
      {children}
      <AuthRequiredModal isOpen={showAuthModal} onClose={closeAuthModal} />
    </WishlistContext.Provider>
  );
}

export function useWishlist() {
  const context = useContext(WishlistContext);
  if (!context) {
    throw new Error("useWishlist must be used within a WishlistProvider");
  }
  return context;
}
