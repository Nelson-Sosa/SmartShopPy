import { useRef, useState } from "react";
import { Plus, X, GripVertical, Cpu } from "lucide-react";
import { sanitizeText } from "../../utils/productValidation";

/**
 * ProductSpecifications
 *
 * Manages a list of technical specifications as ordered key-value pairs.
 * Data structure: [{ id: string, name: string, value: string }]
 *
 * Features:
 *  - Add / Remove rows
 *  - Inline editing of name and value
 *  - Drag & drop reordering (HTML5 native, no external deps)
 *  - Row-level error display
 *
 * Architecture notes:
 *  - `id` field is stable across renames — ready for future features:
 *    SEO structured data, product comparator, advanced filters, CSV export.
 *  - Empty rows (name AND value both blank) are stripped before submission
 *    by the parent (ProductForm), not here, to allow in-progress editing UX.
 */

function generateId() {
  return `spec_${Date.now()}_${Math.random().toString(36).slice(2, 7)}`;
}

// Quick presets to help the vendor get started fast
const SPEC_PRESETS = [
  { name: "Pantalla", value: "" },
  { name: "Procesador", value: "" },
  { name: "Memoria RAM", value: "" },
  { name: "Almacenamiento", value: "" },
  { name: "Cámara Principal", value: "" },
  { name: "Batería", value: "" },
  { name: "Sistema Operativo", value: "" },
  { name: "Conectividad", value: "" },
  { name: "Dimensiones", value: "" },
  { name: "Peso", value: "" },
  { name: "Color", value: "" },
  { name: "Material", value: "" },
  { name: "Voltaje", value: "" },
  { name: "Garantía", value: "" },
];

export default function ProductSpecifications({ specifications = [], onChange, errors }) {
  const [showPresets, setShowPresets] = useState(false);
  const dragIndex = useRef(null);
  const dragOverIndex = useRef(null);

  // ── Add ────────────────────────────────────────────────────────────────────

  function addBlank() {
    onChange([...specifications, { id: generateId(), name: "", value: "" }]);
    setShowPresets(false);
  }

  function addPreset(preset) {
    onChange([...specifications, { id: generateId(), name: preset.name, value: preset.value }]);
    setShowPresets(false);
  }

  // ── Update ─────────────────────────────────────────────────────────────────

  function updateField(index, field, raw) {
    const next = specifications.map((s, i) =>
      i === index ? { ...s, [field]: raw } : s
    );
    onChange(next);
  }

  function handleBlur(index, field) {
    const trimmed = sanitizeText(specifications[index][field]);
    updateField(index, field, trimmed);
  }

  // ── Remove ─────────────────────────────────────────────────────────────────

  function remove(index) {
    onChange(specifications.filter((_, i) => i !== index));
  }

  // ── Drag & Drop ────────────────────────────────────────────────────────────

  function handleDragStart(index) {
    dragIndex.current = index;
  }

  function handleDragEnter(index) {
    dragOverIndex.current = index;
  }

  function handleDragEnd() {
    const from = dragIndex.current;
    const to = dragOverIndex.current;
    if (from === null || to === null || from === to) {
      dragIndex.current = null;
      dragOverIndex.current = null;
      return;
    }
    const next = [...specifications];
    const [moved] = next.splice(from, 1);
    next.splice(to, 0, moved);
    onChange(next);
    dragIndex.current = null;
    dragOverIndex.current = null;
  }

  // ── Render ─────────────────────────────────────────────────────────────────

  return (
    <div className="space-y-3">
      {/* Column headers — only show when there's at least one row */}
      {specifications.length > 0 && (
        <div className="grid grid-cols-[28px_1fr_1fr_28px] items-center gap-2 px-1">
          <span /> {/* drag handle col */}
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Nombre
          </span>
          <span className="text-xs font-semibold uppercase tracking-wider text-gray-400">
            Valor
          </span>
          <span /> {/* delete col */}
        </div>
      )}

      {/* Spec rows */}
      <div className="space-y-2">
        {specifications.map((spec, i) => {
          const rowError = errors?.[i];
          return (
            <div
              key={spec.id}
              draggable
              onDragStart={() => handleDragStart(i)}
              onDragEnter={() => handleDragEnter(i)}
              onDragEnd={handleDragEnd}
              onDragOver={(e) => e.preventDefault()}
              className={`group grid grid-cols-[28px_1fr_1fr_28px] items-start gap-2 rounded-xl border bg-white p-2 transition-colors ${
                rowError
                  ? "border-red-300 bg-red-50/30"
                  : "border-gray-200 hover:border-gray-300"
              }`}
            >
              {/* Drag handle */}
              <div className="flex h-9 cursor-grab items-center justify-center text-gray-300 hover:text-gray-500 active:cursor-grabbing">
                <GripVertical className="h-4 w-4" />
              </div>

              {/* Name field */}
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={spec.name}
                  onChange={(e) => updateField(i, "name", e.target.value)}
                  onBlur={() => handleBlur(i, "name")}
                  placeholder="Ej: Pantalla"
                  maxLength={100}
                  className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    rowError && !spec.name
                      ? "border-red-300 focus:border-red-400 focus:ring-red/20"
                      : "border-gray-200 focus:border-primary focus:ring-primary/20"
                  }`}
                />
              </div>

              {/* Value field */}
              <div className="flex flex-col gap-1">
                <input
                  type="text"
                  value={spec.value}
                  onChange={(e) => updateField(i, "value", e.target.value)}
                  onBlur={() => handleBlur(i, "value")}
                  placeholder="Ej: 6.1″ OLED 2556×1179"
                  maxLength={500}
                  className={`w-full rounded-lg border px-3 py-2 text-sm text-gray-800 placeholder-gray-400 focus:outline-none focus:ring-2 ${
                    rowError && !spec.value
                      ? "border-red-300 focus:border-red-400 focus:ring-red/20"
                      : "border-gray-200 focus:border-primary focus:ring-primary/20"
                  }`}
                />
                {rowError && (
                  <p className="text-xs text-red-500">{rowError}</p>
                )}
              </div>

              {/* Delete button */}
              <button
                type="button"
                onClick={() => remove(i)}
                className="flex h-9 items-center justify-center rounded-lg text-gray-300 transition-colors hover:text-red-500"
                title="Eliminar especificación"
              >
                <X className="h-4 w-4" />
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty state hint */}
      {specifications.length === 0 && (
        <div className="flex items-center gap-3 rounded-xl border border-dashed border-gray-200 bg-gray-50 p-4">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary-light">
            <Cpu className="h-4 w-4 text-primary" />
          </div>
          <p className="text-xs leading-relaxed text-gray-500">
            Agregá las especificaciones técnicas del producto. Estas se muestran
            como una tabla en la vista del cliente.
          </p>
        </div>
      )}

      {/* Add controls */}
      <div className="relative">
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            onClick={() => setShowPresets((v) => !v)}
            className="inline-flex items-center gap-1.5 rounded-lg border border-dashed border-gray-300 bg-white px-4 py-2 text-sm font-medium text-gray-600 transition-colors hover:border-primary hover:text-primary"
          >
            <Plus className="h-4 w-4" />
            Agregar especificación
          </button>

          {specifications.length > 0 && (
            <span className="inline-flex items-center rounded-full bg-gray-100 px-2.5 py-1 text-xs font-medium text-gray-500">
              {specifications.length} especificación{specifications.length !== 1 ? "es" : ""}
            </span>
          )}
        </div>

        {/* Presets dropdown */}
        {showPresets && (
          <div className="absolute left-0 top-full z-20 mt-2 w-72 overflow-hidden rounded-2xl bg-white shadow-xl ring-1 ring-gray-200">
            {/* Blank row */}
            <div className="border-b border-gray-100 p-2">
              <button
                type="button"
                onClick={addBlank}
                className="flex w-full items-center gap-2 rounded-xl px-3 py-2.5 text-sm font-semibold text-primary transition-colors hover:bg-primary-light"
              >
                <Plus className="h-4 w-4" />
                Fila en blanco
              </button>
            </div>
            {/* Preset list */}
            <div className="p-2">
              <p className="px-3 pb-1.5 pt-0.5 text-[11px] font-bold uppercase tracking-widest text-gray-400">
                Campos comunes
              </p>
              <div className="max-h-52 overflow-y-auto">
                {SPEC_PRESETS.map((p) => (
                  <button
                    key={p.name}
                    type="button"
                    onClick={() => addPreset(p)}
                    className="flex w-full items-center gap-2 rounded-xl px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-50 hover:text-gray-900"
                  >
                    <span className="h-1.5 w-1.5 shrink-0 rounded-full bg-primary/40" />
                    {p.name}
                  </button>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
