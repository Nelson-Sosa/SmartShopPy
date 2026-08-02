import {
  collection,
  doc,
  setDoc,
  deleteDoc,
  onSnapshot,
  serverTimestamp,
  query,
  orderBy,
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
