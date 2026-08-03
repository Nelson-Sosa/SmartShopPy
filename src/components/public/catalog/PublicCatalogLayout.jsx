import { useState } from "react";
import CategoriesSidebar from "./CategoriesSidebar";
import CatalogHero from "./CatalogHero";
import TechnicalServiceCard from "./TechnicalServiceCard";

export default function PublicCatalogLayout({ categories, selectedCategory, onSelectCategory }) {
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const toggleDrawer = () => setIsDrawerOpen((prev) => !prev);

  return (
    <div className="flex flex-col gap-4 sm:gap-6 lg:flex-row lg:items-stretch">
      {/* Columna Izquierda: Sidebar (Fija en Desktop, Drawer en Mobile) */}
      <CategoriesSidebar
        categories={categories}
        selectedCategory={selectedCategory}
        onSelectCategory={onSelectCategory}
        isDrawerOpen={isDrawerOpen}
        onDrawerToggle={toggleDrawer}
      />

      {/* Columnas Central y Derecha (Apiladas en tablet/mobile) */}
      <div className="flex min-w-0 flex-1 flex-col gap-4 sm:gap-6 md:flex-row md:items-stretch">
        
        {/* Columna Central: Hero Banner */}
        <div className="flex-1">
          <CatalogHero />
        </div>

        {/* Columna Derecha: Servicio Técnico */}
        <div className="md:w-[260px] lg:w-[280px] shrink-0">
          <TechnicalServiceCard />
        </div>

      </div>
    </div>
  );
}
