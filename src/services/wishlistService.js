import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
  writeBatch,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";

const wishlistCol = (uid) => collection(db, "users", uid, "wishlist");
const wishlistDoc = (uid, productId) => doc(db, "users", uid, "wishlist", productId);

/**
 * Suscripción en tiempo real a la wishlist del usuario.
 * @returns unsubscribe function
 */
export function subscribeToWishlist(uid, onData, onError) {
  const q = query(wishlistCol(uid), orderBy("createdAt", "desc"));
  return onSnapshot(
    q,
    (snapshot) => {
      const items = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));
      onData(items);
    },
    (err) => {
      if (onError) onError(err);
    }
  );
}

/**
 * Agrega un producto a la wishlist.
 * Guarda un snapshot de los datos relevantes del producto para
 * mostrar la card correctamente aunque el producto cambie.
 */
export async function addToWishlist(uid, product) {
  const ref = wishlistDoc(uid, product.id);
  await setDoc(ref, {
    productId: product.id,
    name: product.name || "",
    images: product.images || [],
    salePrice: product.salePrice ?? null,
    originalPrice: product.originalPrice ?? null,
    stock: product.stock ?? 0,
    categoryName: product.categoryName || "",
    categoryId: product.categoryId || "",
    brand: product.brand || "",
    status: product.status || "active",
    createdAt: serverTimestamp(),
  });
}

/**
 * Elimina un producto de la wishlist.
 */
export async function removeFromWishlist(uid, productId) {
  const ref = wishlistDoc(uid, productId);
  await deleteDoc(ref);
}

/**
 * Elimina múltiples productos de la lista de deseos simultáneamente (Batch delete)
 * @param {string} uid - ID del usuario logueado
 * @param {string[]} itemIds - Array de IDs de productos a eliminar
 * @returns {Promise<void>}
 */
export async function removeMultipleFromWishlist(uid, itemIds) {
  if (!uid || !itemIds || itemIds.length === 0) return;

  try {
    const batch = writeBatch(db);
    itemIds.forEach((itemId) => {
      const ref = wishlistDoc(uid, itemId);
      batch.delete(ref);
    });
    
    await batch.commit();
  } catch (error) {
    console.error("Error al eliminar múltiples de wishlist:", error);
    throw error;
  }
}
