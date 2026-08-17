import { memo } from "react";
import { motion } from "framer-motion";
import { ChevronRight, LayoutGrid, Wrench, Menu } from "lucide-react";
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

/**
 * Desktop sidebar — visible on lg+
 */
function CategoriesSidebarBase({ categories, selectedCategory, onSelectCategory }) {
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

const CategoriesSidebar = memo(CategoriesSidebarBase);
export default CategoriesSidebar;
