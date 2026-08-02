import { useEffect } from "react";
import { Link } from "react-router-dom";
import { Heart, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

export default function AuthRequiredModal({ isOpen, onClose }) {
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-gray-900/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            transition={{ type: "spring", duration: 0.5 }}
            className="relative z-10 w-full max-w-sm overflow-hidden rounded-2xl bg-white p-6 shadow-2xl"
          >
            <button
              onClick={onClose}
              className="absolute right-4 top-4 flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200 hover:text-gray-700"
            >
              <X className="h-4 w-4" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-red-50">
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 2, ease: "easeInOut" }}
                >
                  <Heart className="h-8 w-8 text-danger" fill="currentColor" />
                </motion.div>
              </div>

              <h2 className="mb-2 text-xl font-bold text-gray-900">
                Inicia sesión
              </h2>
              <p className="mb-6 text-sm text-gray-500">
                Inicia sesión para guardar productos en tu Lista de Deseos y acceder a ellos desde cualquier dispositivo.
              </p>

              <div className="flex w-full flex-col gap-3">
                <Link
                  to="/login"
                  onClick={onClose}
                  className="flex w-full items-center justify-center rounded-xl bg-primary py-3 text-sm font-semibold text-white transition-colors hover:bg-primary-hover shadow-sm"
                >
                  Iniciar sesión
                </Link>
                <Link
                  to="/register"
                  onClick={onClose}
                  className="flex w-full items-center justify-center rounded-xl border-2 border-primary py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-light"
                >
                  Crear cuenta
                </Link>
                <button
                  onClick={onClose}
                  className="mt-1 text-sm font-medium text-gray-400 hover:text-gray-600 transition-colors"
                >
                  Cancelar
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
