import { DEVICE_CONFIG, SERVICES_CATALOG } from "../../../constants/technicalService";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.06 } },
};
const item = {
  hidden: { opacity: 0, y: 12 },
  show: { opacity: 1, y: 0, transition: { duration: 0.25 } },
};

export default function StepServiceType({ formData, onNext, onBack }) {
  const { deviceType } = formData;
  const deviceCfg = DEVICE_CONFIG[deviceType];
  const services = SERVICES_CATALOG[deviceType] || [];

  return (
    <div>
      <div className="mb-6 text-center">
        <div className="inline-flex items-center gap-2 rounded-full bg-primary-light px-3 py-1 text-xs font-semibold text-primary mb-3">
          <span>{deviceCfg?.icon}</span>
          <span>{deviceCfg?.label}</span>
        </div>
        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
          ¿Qué necesitás?
        </h2>
        <p className="mt-1 text-sm text-gray-500">
          Elegí el servicio más parecido a tu problema
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-3 sm:grid-cols-2 max-w-xl mx-auto"
      >
        {services.map((svc) => (
          <motion.button
            key={svc.id}
            variants={item}
            onClick={() =>
              onNext({ serviceType: svc.id, serviceLabel: svc.label })
            }
            className="group flex items-center gap-4 rounded-xl border-2 border-border bg-white p-4 text-left
                       shadow-sm transition-all duration-200
                       hover:border-primary hover:bg-primary-light/30 hover:shadow-md
                       focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]"
          >
            <span className="shrink-0 text-3xl leading-none select-none group-hover:scale-110 transition-transform">
              {svc.icon}
            </span>
            <div className="min-w-0">
              <p className="font-semibold text-gray-800 text-sm sm:text-base truncate">
                {svc.label}
              </p>
              <p className="text-xs text-gray-500 mt-0.5 leading-snug">
                {svc.description}
              </p>
            </div>
          </motion.button>
        ))}
      </motion.div>

      <div className="mt-8 max-w-xl mx-auto">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-700 transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Cambiar equipo
        </button>
      </div>
    </div>
  );
}
