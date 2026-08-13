import { useState } from "react";
import { ArrowLeft, Send, Loader2 } from "lucide-react";
import { motion } from "framer-motion";
import toast from "react-hot-toast";
import { createTechnicalService } from "../../../services/technicalService";
import { useAuth } from "../../../context/AuthContext";
import { DEVICE_CONFIG } from "../../../constants/technicalService";

function SummaryRow({ label, value }) {
  if (!value) return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="w-28 shrink-0 font-medium text-gray-500">{label}</span>
      <span className="text-gray-800 min-w-0 break-words">{value}</span>
    </div>
  );
}

function SummarySection({ title, children }) {
  return (
    <div>
      <p className="text-xs font-semibold uppercase tracking-wider text-gray-400 mb-2">
        {title}
      </p>
      <div className="rounded-xl bg-gray-50 border border-border p-4 space-y-2.5">
        {children}
      </div>
    </div>
  );
}

export default function StepSummary({ formData, onBack, onConfirmed }) {
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  const deviceCfg = DEVICE_CONFIG[formData.deviceType];

  const handleSubmit = async () => {
    setLoading(true);
    try {
      const result = await createTechnicalService({
        ...formData,
        customerId: user?.uid || null,
      });
      onConfirmed(result);
    } catch (err) {
      console.error("[TechService] Error al crear solicitud:", err);
      toast.error("Ocurrió un error al enviar tu solicitud. Intentá de nuevo.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-lg mx-auto">
      <h2 className="text-xl font-bold text-gray-800 sm:text-2xl mb-1">
        Revisá tu solicitud
      </h2>
      <p className="text-sm text-gray-500 mb-6">
        Confirmá los datos antes de enviar
      </p>

      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.25 }}
        className="space-y-4"
      >
        <SummarySection title="Equipo">
          <SummaryRow label="Tipo" value={`${deviceCfg?.icon} ${deviceCfg?.label}`} />
          <SummaryRow label="Marca" value={formData.brand} />
          {formData.model && <SummaryRow label="Modelo" value={formData.model} />}
          <SummaryRow label="Servicio" value={formData.serviceLabel} />
        </SummarySection>

        <SummarySection title="Problema">
          <p className="text-sm text-gray-700 leading-relaxed">
            {formData.customerProblem}
          </p>
          {formData.images?.length > 0 && (
            <div className="flex gap-2 mt-2">
              {formData.images.map((img, i) => (
                <img
                  key={i}
                  src={img.url}
                  alt={`Foto ${i + 1}`}
                  className="h-14 w-14 rounded-lg object-cover border border-border"
                />
              ))}
            </div>
          )}
        </SummarySection>

        <SummarySection title="Contacto">
          <SummaryRow label="Nombre" value={formData.customerName} />
          <SummaryRow label="WhatsApp" value={formData.customerPhone} />
          {formData.customerEmail && (
            <SummaryRow label="Email" value={formData.customerEmail} />
          )}
        </SummarySection>
      </motion.div>

      {/* Botones */}
      <div className="mt-8 flex items-center gap-3">
        <button
          onClick={onBack}
          disabled={loading}
          className="flex items-center gap-1.5 rounded-xl border border-border bg-white px-4 py-3 text-sm font-medium text-gray-600 transition-all hover:bg-gray-50 disabled:opacity-50 active:scale-95"
        >
          <ArrowLeft className="h-4 w-4" />
          Volver
        </button>

        <button
          onClick={handleSubmit}
          disabled={loading}
          className="flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white shadow-sm transition-all hover:bg-primary-hover disabled:opacity-60 active:scale-95"
        >
          {loading ? (
            <>
              <Loader2 className="h-4 w-4 animate-spin" />
              Enviando...
            </>
          ) : (
            <>
              <Send className="h-4 w-4" />
              Enviar solicitud
            </>
          )}
        </button>
      </div>
    </div>
  );
}
