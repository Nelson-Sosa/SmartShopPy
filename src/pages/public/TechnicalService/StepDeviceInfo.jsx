import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, ImagePlus, X, Loader2 } from "lucide-react";
import { useState, useRef } from "react";
import toast from "react-hot-toast";
import { uploadImage } from "../../../services/cloudinary/uploadImage";
import { DEVICE_CONFIG, SERVICES_CATALOG } from "../../../constants/technicalService";

const schema = z.object({
  brand: z.string().min(1, "Ingresá la marca del equipo"),
  model: z.string().optional(),
  customerProblem: z
    .string()
    .min(10, "Describí el problema con al menos 10 caracteres")
    .max(500, "Máximo 500 caracteres"),
});

const MAX_IMAGES = 3;

export default function StepDeviceInfo({ formData, onNext, onBack }) {
  const { deviceType, serviceType } = formData;
  const deviceCfg = DEVICE_CONFIG[deviceType];
  const services = SERVICES_CATALOG[deviceType] || [];
  const selectedService = services.find((s) => s.id === serviceType);

  const [images, setImages] = useState(formData.images || []);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef(null);

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      brand: formData.brand || "",
      model: formData.model || "",
      customerProblem: formData.customerProblem || "",
    },
  });

  const problemValue = watch("customerProblem") || "";

  const handleImageAdd = async (e) => {
    const files = Array.from(e.target.files || []);
    if (!files.length) return;

    if (images.length + files.length > MAX_IMAGES) {
      toast.error(`Podés subir máximo ${MAX_IMAGES} fotos`);
      return;
    }

    setUploading(true);
    try {
      const uploaded = await Promise.all(files.map((f) => uploadImage(f)));
      setImages((prev) => [
        ...prev,
        ...uploaded.map((u) => ({ url: u.url, publicId: u.publicId })),
      ]);
    } catch (err) {
      toast.error(err.message || "Error al subir la imagen");
    } finally {
      setUploading(false);
      if (fileInputRef.current) fileInputRef.current.value = "";
    }
  };

  const removeImage = (idx) => {
    setImages((prev) => prev.filter((_, i) => i !== idx));
  };

  const onSubmit = (data) => {
    onNext({ ...data, images });
  };

  return (
    <div className="max-w-lg mx-auto">
      {/* Breadcrumb mini */}
      <div className="mb-5 flex items-center gap-2 text-xs text-gray-400">
        <span>{deviceCfg?.icon} {deviceCfg?.label}</span>
        <span>›</span>
        <span className="text-primary font-medium">
          {selectedService?.icon} {selectedService?.label}
        </span>
      </div>

      <h2 className="text-xl font-bold text-gray-800 sm:text-2xl mb-1">
        Información del equipo
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Completá los datos para que podamos ayudarte mejor
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4">
          {/* Marca */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Marca <span className="text-danger">*</span>
            </label>
            <input
              {...register("brand")}
              type="text"
              placeholder="Ej: Samsung, Lenovo, HP..."
              autoComplete="off"
              className={`w-full rounded-xl border px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all
                focus:border-primary focus:ring-2 focus:ring-primary/20
                ${errors.brand ? "border-danger bg-red-50" : "border-border bg-white"}`}
            />
            {errors.brand && (
              <p className="mt-1 text-xs text-danger">{errors.brand.message}</p>
            )}
          </div>

          {/* Modelo */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Modelo{" "}
              <span className="text-xs font-normal text-gray-400">(opcional)</span>
            </label>
            <input
              {...register("model")}
              type="text"
              placeholder="Ej: IdeaPad 3, Galaxy A52..."
              autoComplete="off"
              className="w-full rounded-xl border border-border bg-white px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all focus:border-primary focus:ring-2 focus:ring-primary/20"
            />
          </div>

          {/* Descripción del problema */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Contanos qué le pasa <span className="text-danger">*</span>
            </label>
            <textarea
              {...register("customerProblem")}
              rows={4}
              placeholder="Ej: La notebook está muy lenta y a veces se apaga sola..."
              className={`w-full resize-none rounded-xl border px-4 py-3 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all
                focus:border-primary focus:ring-2 focus:ring-primary/20
                ${errors.customerProblem ? "border-danger bg-red-50" : "border-border bg-white"}`}
            />
            <div className="flex items-start justify-between mt-1">
              {errors.customerProblem ? (
                <p className="text-xs text-danger">{errors.customerProblem.message}</p>
              ) : (
                <span />
              )}
              <span
                className={`text-xs tabular-nums ${
                  problemValue.length > 450 ? "text-danger" : "text-gray-400"
                }`}
              >
                {problemValue.length}/500
              </span>
            </div>
          </div>

          {/* Fotos opcionales */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Fotos{" "}
              <span className="text-xs font-normal text-gray-400">
                (opcional, máx. {MAX_IMAGES})
              </span>
            </label>

            {images.length > 0 && (
              <div className="mb-3 flex flex-wrap gap-2">
                {images.map((img, idx) => (
                  <div key={idx} className="relative h-20 w-20 rounded-xl overflow-hidden border border-border">
                    <img
                      src={img.url}
                      alt={`Foto ${idx + 1}`}
                      className="h-full w-full object-cover"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(idx)}
                      className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/60 text-white hover:bg-black/80 transition-colors"
                    >
                      <X className="h-3 w-3" />
                    </button>
                  </div>
                ))}
              </div>
            )}

            {images.length < MAX_IMAGES && (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  multiple
                  onChange={handleImageAdd}
                  className="hidden"
                  id="tech-image-upload"
                />
                <label
                  htmlFor="tech-image-upload"
                  className={`flex cursor-pointer items-center justify-center gap-2 rounded-xl border-2 border-dashed px-4 py-3 text-sm
                    transition-colors hover:border-primary hover:bg-primary-light/20
                    ${uploading ? "pointer-events-none opacity-60" : "border-border text-gray-500"}`}
                >
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin text-primary" />
                      <span className="text-primary">Subiendo...</span>
                    </>
                  ) : (
                    <>
                      <ImagePlus className="h-4 w-4" />
                      Agregar foto del problema
                    </>
                  )}
                </label>
              </>
            )}
          </div>
        </div>

        {/* Botones */}
        <div className="mt-8 flex items-center gap-3">
          <button
            type="button"
            onClick={onBack}
            className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 active:scale-95"
          >
            <ArrowLeft className="h-4 w-4" />
            Volver
          </button>
          <button
            type="submit"
            disabled={uploading}
            className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover active:scale-95 disabled:opacity-60"
          >
            Continuar
          </button>
        </div>
      </form>
    </div>
  );
}
