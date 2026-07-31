import { useState, useEffect, useRef } from "react";
import * as productService from "../services/productService";

export function useProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(true);
    const unsubscribe = productService.subscribeToProducts(
      (data) => {
        setProducts(data);
        setLoading(false);
      },
      (error) => {
        console.error("Error al cargar productos:", error);
        setLoading(false);
      }
    );
    return () => unsubscribe();
  }, []);

  return { products, loading, reload: () => {} };
}
