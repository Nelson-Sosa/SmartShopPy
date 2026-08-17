import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, ChevronRight, LayoutGrid, Wrench, Menu } from "lucide-react";
import { getIconForCategory } from "../../../utils/categoryIcons";

function SidebarItem({ label, icon: Icon, isActive, onClick, accent }) {
  const activeClasses = isActive
    ? "bg-primary-light text-primary font-semibold"
    : accent === "amber"
    ? "text-amber-600 hover:bg-amber-50"
    : "text-gray-600 hover:bg-gray-50 hover:text-gray-800";

  return (
    <motion.button
      onClick={onClick}
      whileHover={{ x: 3 }}
      transition={{ duration: 0.15 }}
      className={`flex w-full items-center gap-3 px-4 py-2.5 text-left text-[13px] transition-colors ${activeClasses}`}
    >
      <Icon className="h-4 w-4 shrink-0" />
      <span className="flex-1 truncate">{label}</span>
      <ChevronRight className="h-3.5 w-3.5 shrink-0 opacity-40" />
    </motion.button>
  );
}

export default function MobileMenuDrawer({ isOpen, onClose, categories, selectedCategory, onSelectCategory }) {
  // Lock body scroll when open
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
        <div className="fixed inset-0 z-50 lg:hidden">
          {/* Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="absolute inset-0 bg-black/40 backdrop-blur-sm"
            onClick={onClose}
          />

          {/* Drawer panel */}
          <motion.div
            initial={{ x: "-100%" }}
            animate={{ x: 0 }}
            exit={{ x: "-100%" }}
            transition={{ type: "spring", stiffness: 300, damping: 30 }}
            className="absolute inset-y-0 left-0 flex w-[280px] max-w-[85vw] flex-col bg-white shadow-2xl"
          >
            {/* Drawer header */}
            <div className="flex items-center justify-between border-b border-border px-4 py-4">
              <div className="flex items-center gap-2">
                <Menu className="h-5 w-5 text-primary" />
                <h3 className="text-base font-bold text-gray-800">Menú</h3>
              </div>
              <button
                onClick={onClose}
                className="flex h-8 w-8 items-center justify-center rounded-full bg-gray-100 text-gray-500 transition-colors hover:bg-gray-200"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            {/* Category list */}
            <div className="sidebar-scroll flex-1 overflow-y-auto py-2">
              <SidebarItem
                label="Todas las categorías"
                icon={LayoutGrid}
                isActive={selectedCategory === "all"}
                onClick={() => {
                  onSelectCategory("all");
                  onClose();
                }}
              />

              <div className="mx-4 my-1 border-t border-gray-100" />

              {categories.map((cat) => (
                <SidebarItem
                  key={cat}
                  label={cat}
                  icon={getIconForCategory(cat)}
                  isActive={selectedCategory === cat}
                  onClick={() => {
                    onSelectCategory(cat);
                    onClose();
                  }}
                />
              ))}

              <div className="mx-4 my-1 border-t border-gray-100" />

              <SidebarItem
                label="Servicio Técnico"
                icon={Wrench}
                isActive={false}
                onClick={() => onClose()}
                accent="amber"
              />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
