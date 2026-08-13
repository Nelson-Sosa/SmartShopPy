import { motion } from "framer-motion";
import { Wrench, CheckCircle2, ArrowRight } from "lucide-react";
import { useNavigate } from "react-router-dom";

const SERVICES = [
  "Cambio de Pantalla o Batería",
  "Reparación de Hardware",
  "Mantenimiento Preventivo",
  "Formateo y Software",
  "Limpieza Interna",
];

export default function TechnicalServiceCard() {
  const navigate = useNavigate();

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.5, delay: 0.2, ease: "easeOut" }}
      className="flex h-full flex-col rounded-2xl bg-white p-5 shadow-[0_2px_12px_rgba(0,0,0,0.06)] ring-1 ring-border sm:p-6"
    >
      {/* Icon & Title */}
      <div className="mb-4 flex items-center gap-3">
        <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-amber-50 text-amber-600">
          <Wrench className="h-5 w-5" />
        </div>
        <h3 className="text-sm font-bold text-gray-800 sm:text-base">
          Servicio Técnico
        </h3>
      </div>

      {/* Description */}
      <p className="mb-4 text-xs leading-relaxed text-gray-500 sm:text-sm">
        ¿Tu celular, computadora o notebook necesita reparación?
      </p>

      {/* Service List */}
      <ul className="mb-5 flex-1 space-y-2.5">
        {SERVICES.map((service) => (
          <motion.li
            key={service}
            className="flex items-center gap-2.5 text-xs text-gray-600 sm:text-sm"
            whileHover={{ x: 2 }}
            transition={{ duration: 0.15 }}
          >
            <CheckCircle2 className="h-4 w-4 shrink-0 text-success" />
            <span>{service}</span>
          </motion.li>
        ))}
      </ul>

      {/* CTA Button */}
      <button
        onClick={() => navigate("/servicio-tecnico")}
        className="mt-auto flex w-full items-center justify-center gap-2 rounded-xl bg-amber-50 px-4 py-2.5 text-xs font-semibold text-amber-700 transition-all hover:bg-amber-100 hover:shadow-sm active:scale-[0.97] sm:text-sm"
      >
        Solicitar Servicio
        <ArrowRight className="h-3.5 w-3.5" />
      </button>
    </motion.div>
  );
}
