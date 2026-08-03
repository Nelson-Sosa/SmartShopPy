import { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
  ArrowLeft,
  ImageOff,
  Package,
  CheckCircle2,
  XCircle,
  ZoomIn,
  X,
  ChevronLeft,
  ChevronRight,
  Truck,
  ShieldCheck,
} from "lucide-react";
import { getActiveProductById } from "../../services/publicProductService";
import { formatCurrency } from "../../utils/formatCurrency";
import { getDetailImage, getThumbImage, getZoomImage } from "../../lib/cloudinary";
import WhatsAppButton from "../../components/public/WhatsAppButton";
import FavoriteButton from "../../components/public/FavoriteButton";
import AddToCartButton from "../../components/public/AddToCartButton";

// ---------------------------------------------------------------------------
// Lightbox — Zoom modal sin librerías externas
// ---------------------------------------------------------------------------
function ZoomLightbox({ images, initialIndex, onClose }) {
  const [current, setCurrent] = useState(initialIndex);

  const handleKey = useCallback(
    (e) => {
      if (e.key === "Escape") onClose();
      if (e.key === "ArrowRight") setCurrent((i) => (i + 1) % images.length);
      if (e.key === "ArrowLeft") setCurrent((i) => (i - 1 + images.length) % images.length);
    },
    [images.length, onClose]
  );

  useEffect(() => {
    document.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [handleKey]);

  const zoomSrc = getZoomImage(images[current]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/90 backdrop-blur-sm" onClick={onClose}>
      <button onClick={onClose} className="absolute right-4 top-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20" aria-label="Cerrar zoom">
        <X className="h-5 w-5" />
      </button>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setCurrent((i) => (i - 1 + images.length) % images.length); }}
          className="absolute left-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Imagen anterior"
        >
          <ChevronLeft className="h-5 w-5" />
        </button>
      )}

      <div className="relative max-h-[90vh] max-w-[90vw]" onClick={(e) => e.stopPropagation()}>
        {zoomSrc ? (
          <img src={zoomSrc} alt={`Zoom imagen ${current + 1}`} className="max-h-[90vh] max-w-[90vw] object-contain" draggable={false} />
        ) : (
          <div className="flex h-64 w-64 items-center justify-center">
            <ImageOff className="h-12 w-12 text-gray-400" />
          </div>
        )}
      </div>

      {images.length > 1 && (
        <button
          onClick={(e) => { e.stopPropagation(); setCurrent((i) => (i + 1) % images.length); }}
          className="absolute right-4 z-10 flex h-10 w-10 items-center justify-center rounded-full bg-white/10 text-white transition-colors hover:bg-white/20"
          aria-label="Imagen siguiente"
        >
          <ChevronRight className="h-5 w-5" />
        </button>
      )}

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 flex -translate-x-1/2 gap-1.5">
          {images.map((_, i) => (
            <button
              key={i}
              onClick={(e) => { e.stopPropagation(); setCurrent(i); }}
              className={`h-1.5 rounded-full transition-all ${i === current ? "w-5 bg-white" : "w-1.5 bg-white/40"}`}
              aria-label={`Ir a imagen ${i + 1}`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Página principal — Layout estilo Compulandia
// ---------------------------------------------------------------------------
export default function ProductPublicDetail() {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [selectedImage, setSelectedImage] = useState(0);
  const [lightboxOpen, setLightboxOpen] = useState(false);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    getActiveProductById(id)
      .then((data) => {
        if (!data) { setNotFound(true); return; }
        setProduct(data);
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [id]);

  // ── Loading skeleton ──────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="space-y-4">
        <div className="h-5 w-64 animate-pulse rounded bg-gray-100" />
        <div className="grid gap-8 lg:grid-cols-[minmax(0,440px)_1fr]">
          <div className="aspect-square animate-pulse rounded-2xl bg-gray-100" />
          <div className="space-y-4 pt-2">
            <div className="h-4 w-24 animate-pulse rounded bg-gray-100" />
            <div className="h-8 w-3/4 animate-pulse rounded bg-gray-100" />
            <div className="h-10 w-1/3 animate-pulse rounded bg-gray-100" />
            <div className="h-px bg-gray-100" />
            <div className="space-y-2">
              {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className="h-4 animate-pulse rounded bg-gray-100" style={{ width: `${70 + i * 5}%` }} />
              ))}
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── Not found ─────────────────────────────────────────────────────────────
  if (notFound || !product) {
    return (
      <div className="flex flex-col items-center justify-center py-20">
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary-light">
          <Package className="h-8 w-8 text-primary" />
        </div>
        <h3 className="mt-5 text-base font-semibold text-gray-800">Producto no encontrado</h3>
        <p className="mt-1.5 text-sm text-gray-500">El producto que buscás no está disponible o fue desactivado.</p>
        <button
          onClick={() => navigate("/catalogo")}
          className="mt-6 inline-flex items-center gap-1.5 rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white transition-colors hover:bg-primary-hover"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver al catálogo
        </button>
      </div>
    );
  }

  const images = Array.isArray(product.images) ? product.images : [];
  const mainImageUrl = images.length > 0 ? getDetailImage(images[selectedImage]) : null;
  const isOutOfStock = product.stock <= 0;

  // Clean specs & attributes — filter out empty rows
  const specs = (product.specifications || []).filter(
    (s) => s?.name?.trim() && s?.value?.trim()
  );
  const attributes = (product.attributes || []).filter(
    (a) => a?.name?.trim() && (a.values || []).some((v) => v?.trim())
  );

  return (
    <div className="space-y-6 pb-10">

      {/* ── Breadcrumb ────────────────────────────────────────────────── */}
      <nav className="flex items-center gap-1.5 text-sm text-gray-500">
        <button onClick={() => navigate("/catalogo")} className="transition-colors hover:text-primary">
          Inicio
        </button>
        {product.categoryName && (
          <>
            <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />
            <button
              onClick={() => navigate(`/catalogo?category=${encodeURIComponent(product.categoryName)}`)}
              className="transition-colors hover:text-primary"
            >
              {product.categoryName}
            </button>
          </>
        )}
        <ChevronRight className="h-3.5 w-3.5 shrink-0 text-gray-300" />
        <span className="max-w-[220px] truncate font-medium text-gray-700">{product.name}</span>
      </nav>

      {/* ── Main grid: Image + Info ──────────────────────────────────── */}
      <div className="grid gap-8 lg:grid-cols-[minmax(0,440px)_1fr]">

        {/* LEFT — Image gallery */}
        <div className="mx-auto w-full max-w-sm sm:max-w-md lg:mx-0 lg:max-w-none">
          {/* Main image */}
          <div className="group relative overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border">
            <div className="relative aspect-square bg-white">
              {mainImageUrl ? (
                <>
                  <img
                    src={mainImageUrl}
                    alt={product.name}
                    className="h-full w-full object-contain p-4"
                    decoding="async"
                    loading="eager"
                    fetchPriority="high"
                  />
                  <button
                    onClick={() => setLightboxOpen(true)}
                    className="absolute bottom-3 right-3 flex items-center gap-1.5 rounded-lg bg-black/60 px-3 py-1.5 text-xs font-medium text-white opacity-0 transition-opacity group-hover:opacity-100 hover:bg-black/80"
                    aria-label="Ampliar imagen"
                  >
                    <ZoomIn className="h-3.5 w-3.5" />
                    Ampliar
                  </button>
                </>
              ) : (
                <div className="flex h-full flex-col items-center justify-center gap-2 text-gray-300">
                  <ImageOff className="h-16 w-16" />
                  <span className="text-sm">Sin imagen</span>
                </div>
              )}
            </div>
          </div>

          {/* Thumbnails */}
          {images.length > 1 && (
            <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
              {images.map((img, i) => {
                const thumbUrl = getThumbImage(img, 64);
                return (
                  <button
                    key={i}
                    onClick={() => setSelectedImage(i)}
                    className={`h-16 w-16 shrink-0 overflow-hidden rounded-xl border-2 bg-white transition-all ${
                      i === selectedImage
                        ? "border-primary shadow-md"
                        : "border-transparent opacity-60 hover:opacity-100"
                    }`}
                    aria-label={`Ver imagen ${i + 1}`}
                  >
                    {thumbUrl ? (
                      <img src={thumbUrl} alt={`${product.name} ${i + 1}`} className="h-full w-full object-contain p-1" loading="eager" decoding="async" />
                    ) : (
                      <div className="flex h-full w-full items-center justify-center bg-gray-50">
                        <ImageOff className="h-4 w-4 text-gray-300" />
                      </div>
                    )}
                  </button>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT — Product info */}
        <div className="flex flex-col">
          <div className="rounded-2xl bg-white p-6 shadow-sm ring-1 ring-border">

            {/* Category + availability */}
            <div className="flex flex-wrap items-center justify-between gap-2">
              {product.categoryName && (
                <button
                  onClick={() => navigate(`/catalogo?category=${encodeURIComponent(product.categoryName)}`)}
                  className="text-xs font-semibold uppercase tracking-wider text-primary transition-colors hover:text-primary-hover"
                >
                  {product.categoryName}
                </button>
              )}
              <span className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
                isOutOfStock ? "bg-red-50 text-red-600" : "bg-emerald-50 text-emerald-700"
              }`}>
                {isOutOfStock
                  ? <><XCircle className="h-3.5 w-3.5" />Sin stock</>
                  : <><CheckCircle2 className="h-3.5 w-3.5" />Hay existencias</>
                }
              </span>
            </div>

            {/* Product name */}
            <h1 className="mt-2 text-xl font-bold leading-snug text-gray-900 sm:text-2xl lg:text-[1.6rem]">
              {product.name}
            </h1>

            {/* Price */}
            <p className="mt-3 text-3xl font-extrabold text-primary sm:text-4xl">
              {formatCurrency(product.salePrice)}
            </p>

            {/* Badges */}
            <div className="mt-4 flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-amber-400 px-3 py-1.5 text-xs font-bold text-white shadow-sm">
                <Truck className="h-3.5 w-3.5" />
                Envíos a todo el Paraguay
              </span>
              <span className="inline-flex items-center gap-1.5 rounded-lg bg-emerald-50 px-3 py-1.5 text-xs font-semibold text-emerald-700">
                <ShieldCheck className="h-3.5 w-3.5" />
                Garantía incluida
              </span>
            </div>

            <div className="my-5 border-t border-gray-100" />

            {/* ── Especificaciones Técnicas — bullet list (Compulandia style) ── */}
            {specs.length > 0 && (
              <ul className="space-y-1.5">
                {specs.map((spec, i) => (
                  <li key={spec.id || i} className="flex items-start gap-2 text-sm text-gray-700">
                    <span className="mt-1.5 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />
                    <span>
                      <span className="font-semibold text-gray-900">{spec.name}:</span>{" "}
                      {spec.value}
                    </span>
                  </li>
                ))}
              </ul>
            )}

            {/* ── Variantes — pill selectors ── */}
            {attributes.length > 0 && (
              <div className={`space-y-4 ${specs.length > 0 ? "mt-5 border-t border-gray-100 pt-5" : ""}`}>
                {attributes.map((attr, i) => {
                  const values = (attr.values || []).filter((v) => v?.trim());
                  return (
                    <div key={i}>
                      <p className="mb-2 text-sm font-semibold text-gray-800">{attr.name}</p>
                      <div className="flex flex-wrap gap-2">
                        {values.map((v, j) => (
                          <span
                            key={j}
                            className="rounded-xl border-2 border-border bg-white px-4 py-1.5 text-sm font-medium text-gray-700 shadow-sm transition-colors hover:border-primary hover:text-primary"
                          >
                            {v}
                          </span>
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            )}

            <div className="my-5 border-t border-gray-100" />

            {/* ── CTA Buttons ── */}
            <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
              {!isOutOfStock && (
                <div className="flex-1">
                  <AddToCartButton
                    product={product}
                    size="desktop"
                    className="w-full justify-center rounded-xl py-3 text-sm font-bold"
                  />
                </div>
              )}
              <div className="flex-1">
                <WhatsAppButton
                  productName={product.name}
                  productPrice={formatCurrency(product.salePrice)}
                  variant="inline"
                />
              </div>
              <div className="shrink-0 self-stretch rounded-xl border border-border bg-gray-50 px-3 flex items-center justify-center">
                <FavoriteButton product={product} size="desktop" />
              </div>
            </div>

          </div>
        </div>
      </div>

      {/* ── Descripción — sección ancho completo debajo del grid ── */}
      {product.description && (
        <div className="overflow-hidden rounded-2xl bg-white shadow-sm ring-1 ring-border">
          <div className="border-b border-border bg-gray-50/60 px-6 py-4">
            <h2 className="text-base font-bold text-gray-800">Descripción</h2>
          </div>
          <div className="px-6 py-5">
            <p className="whitespace-pre-wrap text-sm leading-relaxed text-gray-700">
              {product.description}
            </p>
          </div>
        </div>
      )}

      {/* Lightbox */}
      {lightboxOpen && images.length > 0 && (
        <ZoomLightbox
          images={images}
          initialIndex={selectedImage}
          onClose={() => setLightboxOpen(false)}
        />
      )}
    </div>
  );
}
