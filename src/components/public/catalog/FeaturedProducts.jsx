import { memo, useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import { ChevronLeft, ChevronRight, Star } from "lucide-react";
import ProductCard from "../ProductCard";

function FeaturedProductsBase({ products = [], loading = false }) {
  const scrollRef = useRef(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(false);

  // Get featured products: newest 10 that have images
  const featured = products
    .filter((p) => Array.isArray(p.images) && p.images.length > 0)
    .slice(0, 10);

  // Update scroll button visibility
  const updateScrollButtons = () => {
    const el = scrollRef.current;
    if (!el) return;
    setCanScrollLeft(el.scrollLeft > 10);
    setCanScrollRight(el.scrollLeft < el.scrollWidth - el.clientWidth - 10);
  };

  useEffect(() => {
    updateScrollButtons();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener("scroll", updateScrollButtons, { passive: true });
      window.addEventListener("resize", updateScrollButtons);
    }
    return () => {
      if (el) el.removeEventListener("scroll", updateScrollButtons);
      window.removeEventListener("resize", updateScrollButtons);
    };
  }, [featured.length]);

  const scroll = (direction) => {
    const el = scrollRef.current;
    if (!el) return;
    const cardWidth = el.querySelector(":first-child")?.offsetWidth || 240;
    const gap = 16;
    const distance = (cardWidth + gap) * 2;
    el.scrollBy({ left: direction === "left" ? -distance : distance, behavior: "smooth" });
  };

  if (loading || featured.length === 0) return null;

  return (
    <motion.section
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, delay: 0.3, ease: "easeOut" }}
      className="mt-8"
    >
      {/* Section header */}
      <div className="mb-4 flex items-center justify-between sm:mb-5">
        <div className="flex items-center gap-2.5">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-amber-50 text-amber-500">
            <Star className="h-4 w-4" />
          </div>
          <h2 className="text-base font-bold text-gray-800 sm:text-lg">
            Productos Destacados
          </h2>
        </div>

        {/* Scroll buttons — desktop */}
        <div className="hidden items-center gap-1.5 sm:flex">
          <button
            onClick={() => scroll("left")}
            disabled={!canScrollLeft}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm ring-1 ring-border transition-all hover:bg-gray-50 hover:shadow-md disabled:opacity-30 disabled:hover:bg-white disabled:hover:shadow-sm"
          >
            <ChevronLeft className="h-4 w-4" />
          </button>
          <button
            onClick={() => scroll("right")}
            disabled={!canScrollRight}
            className="flex h-8 w-8 items-center justify-center rounded-full bg-white text-gray-500 shadow-sm ring-1 ring-border transition-all hover:bg-gray-50 hover:shadow-md disabled:opacity-30 disabled:hover:bg-white disabled:hover:shadow-sm"
          >
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Carousel */}
      <div className="relative">
        {/* Left fade gradient */}
        {canScrollLeft && (
          <div className="pointer-events-none absolute inset-y-0 left-0 z-10 hidden w-12 bg-gradient-to-r from-background-secondary to-transparent sm:block" />
        )}

        <div
          ref={scrollRef}
          className="featured-scroll hide-scrollbar -mx-1 flex gap-3 overflow-x-auto px-1 pb-2 sm:gap-4"
        >
          {featured.map((product) => (
            <div
              key={product.id}
              className="w-[160px] shrink-0 sm:w-[200px] lg:w-[220px]"
            >
              <ProductCard product={product} />
            </div>
          ))}
        </div>

        {/* Right fade gradient */}
        {canScrollRight && (
          <div className="pointer-events-none absolute inset-y-0 right-0 z-10 hidden w-12 bg-gradient-to-l from-background-secondary to-transparent sm:block" />
        )}
      </div>
    </motion.section>
  );
}

const FeaturedProducts = memo(FeaturedProductsBase);
export default FeaturedProducts;
