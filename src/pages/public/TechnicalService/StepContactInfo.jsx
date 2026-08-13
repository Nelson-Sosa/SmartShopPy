import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { ArrowLeft, Phone, User, Mail } from "lucide-react";

const schema = z.object({
  customerName: z
    .string()
    .min(2, "Ingresá tu nombre completo")
    .max(80, "Nombre demasiado largo"),
  customerPhone: z
    .string()
    .min(7, "Ingresá un número de WhatsApp válido")
    .max(20, "Número demasiado largo")
    .regex(/^[\d\s\+\-\(\)]+$/, "Solo números, espacios y +"),
  customerEmail: z
    .string()
    .email("Ingresá un email válido")
    .optional()
    .or(z.literal("")),
});

export default function StepContactInfo({ formData, onNext, onBack }) {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({
    resolver: zodResolver(schema),
    defaultValues: {
      customerName: formData.customerName || "",
      customerPhone: formData.customerPhone || "",
      customerEmail: formData.customerEmail || "",
    },
  });

  const onSubmit = (data) => {
    onNext({
      ...data,
      customerEmail: data.customerEmail?.trim() || "",
    });
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 sm:text-2xl mb-1">
        Tus datos de contacto
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Te avisamos por WhatsApp cuando revisemos tu equipo
      </p>

      <form onSubmit={handleSubmit(onSubmit)} noValidate>
        <div className="space-y-4">
          {/* Nombre */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Tu nombre <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <User className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register("customerName")}
                type="text"
                placeholder="Juan Pérez"
                autoComplete="name"
                className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  ${errors.customerName ? "border-danger bg-red-50" : "border-border bg-white"}`}
              />
            </div>
            {errors.customerName && (
              <p className="mt-1 text-xs text-danger">{errors.customerName.message}</p>
            )}
          </div>

          {/* WhatsApp */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              WhatsApp <span className="text-danger">*</span>
            </label>
            <div className="relative">
              <Phone className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register("customerPhone")}
                type="tel"
                placeholder="0981 XXX XXX"
                autoComplete="tel"
                inputMode="tel"
                className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  ${errors.customerPhone ? "border-danger bg-red-50" : "border-border bg-white"}`}
              />
            </div>
            {errors.customerPhone && (
              <p className="mt-1 text-xs text-danger">{errors.customerPhone.message}</p>
            )}
            <p className="mt-1 text-xs text-gray-400">
              Principal medio de contacto para notificarte
            </p>
          </div>

          {/* Email (opcional) */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1.5">
              Email{" "}
              <span className="text-xs font-normal text-gray-400">(opcional)</span>
            </label>
            <div className="relative">
              <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <input
                {...register("customerEmail")}
                type="email"
                placeholder="tu@email.com"
                autoComplete="email"
                inputMode="email"
                className={`w-full rounded-xl border py-3 pl-10 pr-4 text-sm text-gray-800 placeholder-gray-400 outline-none transition-all
                  focus:border-primary focus:ring-2 focus:ring-primary/20
                  ${errors.customerEmail ? "border-danger bg-red-50" : "border-border bg-white"}`}
              />
            </div>
            {errors.customerEmail && (
              <p className="mt-1 text-xs text-danger">{errors.customerEmail.message}</p>
            )}
          </div>
        </div>

        {/* Aviso de privacidad minimalista */}
        <p className="mt-4 text-xs text-gray-400 leading-relaxed">
          Solo usamos tus datos para contactarte sobre tu reparación. No compartimos tu información.
        </p>

        {/* Botones */}
        <div className="mt-6 flex items-center gap-3">
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
            className="flex-1 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover active:scale-95"
          >
            Revisar solicitud
          </button>
        </div>
      </form>
    </div>
  );
}
