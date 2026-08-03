import { memo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  X,
  ChevronRight,
  LayoutGrid,
  Laptop,
  Smartphone,
  MonitorPlay,
  Gamepad2,
  Headphones,
  Cable,
  Printer,
  Camera,
  Monitor,
  Cpu,
  Speaker,
  Keyboard,
  Mouse,
  HardDrive,
  Tablet,
  Watch,
  Armchair,
  Wrench,
  Tag,
  Menu,
} from "lucide-react";

// Same icon mapping as CategoryNavigation — keeps visual consistency
const CATEGORY_ICON_MAP = {
  notebook: Laptop,
  laptop: Laptop,
  celular: Smartphone,
  telefono: Smartphone,
  smartphone: Smartphone,
  televisor: MonitorPlay,
  tv: MonitorPlay,
  monitor: Monitor,
  gaming: Gamepad2,
  gamer: Gamepad2,
  juego: Gamepad2,
  consola: Gamepad2,
  auricular: Headphones,
  audio: Speaker,
  parlante: Speaker,
  cable: Cable,
  red: Cable,
  impresora: Printer,
  insumo: Printer,
  camara: Camera,
  filmacion: Camera,
  tablet: Tablet,
  procesador: Cpu,
  componente: Cpu,
  teclado: Keyboard,
  mouse: Mouse,
  disco: HardDrive,
  almacenamiento: HardDrive,
  reloj: Watch,
  silla: Armchair,
  mesa: Armchair,
  accesorio: Tag,
  tecnologia: Cpu,
  electrodomestico: Monitor,
};

function getIconForCategory(categoryName) {
  if (!categoryName) return LayoutGrid;
  const lower = categoryName.toLowerCase();
  for (const [keyword, icon] of Object.entries(CATEGORY_ICON_MAP)) {
    if (lower.includes(keyword)) return icon;
  }
  return LayoutGrid;
}

/**
 * Desktop sidebar — visible on lg+
 */
function DesktopSidebar({ categories, selectedCategory, onSelectCategory }) {
  return (
    <div className="hidden lg:flex lg:w-[220px] lg:shrink-0 lg:flex-col">
      <div className="rounded-2xl bg-white shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-border">
        {/* Header */}
        <div className="flex items-center gap-2 border-b border-border px-4 py-3">
          <Menu className="h-4 w-4 text-primary" />
          <h3 className="text-sm font-bold text-gray-800">Categorías</h3>
        </div>

        {/* Category list */}
        <div className="sidebar-scroll max-h-[320px] overflow-y-auto py-1">
          {/* "Todas" option */}
          <SidebarItem
            label="Todas las categorías"
            icon={LayoutGrid}
            isActive={selectedCategory === "all"}
            onClick={() => onSelectCategory("all")}
          />

          {/* Separator */}
          <div className="mx-4 my-1 border-t border-gray-100" />

          {/* Dynamic categories */}
          {categories.map((cat) => (
            <SidebarItem
              key={cat}
              label={cat}
              icon={getIconForCategory(cat)}
              isActive={selectedCategory === cat}
              onClick={() => onSelectCategory(cat)}
            />
          ))}

          {/* Separator */}
          <div className="mx-4 my-1 border-t border-gray-100" />

          {/* Service link */}
          <SidebarItem
            label="Servicio Técnico"
            icon={Wrench}
            isActive={false}
            onClick={() => {}}
            accent="amber"
          />
        </div>
      </div>
    </div>
  );
}

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

/**
 * Mobile drawer — visible below lg
 */
function MobileDrawer({ isOpen, onClose, categories, selectedCategory, onSelectCategory }) {
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
            className="absolute inset-0 drawer-overlay"
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
                <h3 className="text-base font-bold text-gray-800">Categorías</h3>
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

/**
 * Toggle button for mobile — shown below lg only
 */
function SidebarToggleButton({ onClick }) {
  return (
    <button
      onClick={onClick}
      className="flex items-center gap-2 rounded-xl bg-white px-3 py-2 text-sm font-medium text-gray-600 shadow-sm ring-1 ring-border transition-all hover:bg-gray-50 hover:shadow-md lg:hidden"
    >
      <Menu className="h-4 w-4" />
      <span className="hidden sm:inline">Categorías</span>
    </button>
  );
}

function CategoriesSidebarBase({ categories, selectedCategory, onSelectCategory, isDrawerOpen, onDrawerToggle }) {
  return (
    <>
      {/* Desktop sidebar */}
      <DesktopSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />

      {/* Mobile toggle button */}
      <SidebarToggleButton onClick={onDrawerToggle} />

      {/* Mobile drawer */}
      <MobileDrawer
        isOpen={isDrawerOpen}
        onClose={onDrawerToggle}
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
      />
    </>
  );
}

const CategoriesSidebar = memo(CategoriesSidebarBase);
export default CategoriesSidebar;
