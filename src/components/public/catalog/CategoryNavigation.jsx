import { memo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import {
  Home,
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
  LayoutGrid,
} from "lucide-react";

// Map of category name keywords to lucide icons
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

function CategoryNavigationBase({ categories = [], selectedCategory, onSelectCategory }) {
  const navigate = useNavigate();
  const [hoveredItem, setHoveredItem] = useState(null);

  const navItems = [
    { id: "home", label: "Inicio", icon: Home, action: () => navigate("/catalogo") },
    ...categories.map((cat) => ({
      id: cat,
      label: cat,
      icon: getIconForCategory(cat),
      action: () => onSelectCategory(cat),
    })),
    { id: "servicio", label: "Servicio Técnico", icon: Wrench, action: () => {} },
  ];

  return (
    <nav className="border-b border-border bg-white">
      <div className="mx-auto max-w-[1600px] px-4 sm:px-6 lg:px-8">
        <div className="hide-scrollbar flex items-center gap-0.5 overflow-x-auto py-0">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = item.id === selectedCategory;

            return (
              <button
                key={item.id}
                onClick={item.action}
                onMouseEnter={() => setHoveredItem(item.id)}
                onMouseLeave={() => setHoveredItem(null)}
                className={`relative flex shrink-0 items-center gap-1.5 px-3.5 py-3 text-xs font-medium transition-colors sm:px-4 sm:text-sm ${
                  isActive
                    ? "text-primary"
                    : "text-gray-500 hover:text-gray-800"
                }`}
              >
                <Icon className="h-3.5 w-3.5 sm:h-4 sm:w-4" />
                <span className="whitespace-nowrap">{item.label}</span>

                {/* Animated underline */}
                {(isActive || hoveredItem === item.id) && (
                  <motion.div
                    layoutId="nav-underline"
                    className="absolute inset-x-0 -bottom-px h-0.5 rounded-full bg-primary"
                    transition={{ type: "spring", stiffness: 350, damping: 30 }}
                  />
                )}
              </button>
            );
          })}
        </div>
      </div>
    </nav>
  );
}

const CategoryNavigation = memo(CategoryNavigationBase);
export default CategoryNavigation;
