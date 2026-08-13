import { DEVICE_TYPE } from "../../../constants/technicalService";
import { motion } from "framer-motion";
import { ArrowRight, ShieldCheck, Clock, Star } from "lucide-react";

const DEVICES = [
  {
    type: DEVICE_TYPE.PHONE,
    label: "Celular",
    description: "Reparación y diagnóstico profesional de celulares y smartphones.",
    buttonLabel: "Seleccionar celular",
    image: "/images/device-phone.jpg",
  },
  {
    type: DEVICE_TYPE.COMPUTER,
    label: "Notebook / PC",
    description: "Mantenimiento, software, diagnóstico y reparación de computadoras.",
    buttonLabel: "Seleccionar notebook / PC",
    image: "/images/device-laptop.jpg",
  },
];

const TRUST_BADGES = [
  { icon: ShieldCheck, title: "Servicio profesional", desc: "Técnicos capacitados" },
  { icon: Clock,       title: "Respuesta rápida",    desc: "Te contactamos por WhatsApp" },
  { icon: Star,        title: "Garantía de servicio", desc: "Trabajos con garantía" },
];

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.1 } },
};
const card = {
  hidden: { opacity: 0, y: 24 },
  show:   { opacity: 1, y: 0, transition: { duration: 0.35, ease: "easeOut" } },
};

export default function StepDeviceType({ onNext }) {
  return (
    <div className="py-2">
      {/* Header */}
      <div className="mb-10 text-center">
        <span className="mb-3 inline-block text-xs font-bold uppercase tracking-widest text-primary">
          Servicio Técnico
        </span>
        <div className="mx-auto mb-2 h-0.5 w-8 rounded-full bg-primary" />
        <h2 className="text-2xl font-extrabold text-gray-900 sm:text-3xl">
          ¿Qué{" "}
          <span className="text-primary">equipo</span>{" "}
          necesitás reparar?
        </h2>
        <p className="mt-2 text-sm text-gray-500">
          Seleccioná el tipo de equipo para continuar con tu solicitud de servicio técnico.
        </p>
      </div>

      {/* Cards */}
      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-5 sm:grid-cols-2 max-w-2xl mx-auto"
      >
        {DEVICES.map((device) => (
          <motion.div
            key={device.type}
            variants={card}
            className="group flex flex-col rounded-2xl border border-border bg-white shadow-sm transition-all duration-300 hover:shadow-lg hover:-translate-y-1"
          >
            {/* Device image in circular lavender container */}
            <div className="flex items-center justify-center pt-8 pb-4">
              <div className="flex h-36 w-36 items-center justify-center rounded-full bg-primary-light/60 overflow-hidden">
                <img
                  src={device.image}
                  alt={device.label}
                  className="h-full w-full object-contain p-4 drop-shadow-md transition-transform duration-300 group-hover:scale-105"
                />
              </div>
            </div>

            {/* Text content */}
            <div className="flex flex-col flex-1 px-6 pb-6 text-center">
              <h3 className="mb-1 text-lg font-extrabold text-gray-900">
                {device.label}
              </h3>
              <div className="mx-auto mb-4 h-0.5 w-8 rounded-full bg-primary" />
              <p className="mb-6 text-sm text-gray-500 leading-relaxed flex-1">
                {device.description}
              </p>

              {/* CTA Button */}
              <button
                onClick={() => onNext({ deviceType: device.type })}
                className="flex w-full items-center justify-center gap-2 rounded-xl bg-primary-light px-4 py-3 text-sm font-semibold text-primary transition-all duration-200 hover:bg-primary hover:text-white active:scale-[0.98]"
              >
                {device.buttonLabel}
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Trust Badges */}
      <motion.div
        initial={{ opacity: 0, y: 16 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4, duration: 0.35 }}
        className="mt-10 grid grid-cols-3 gap-3 max-w-2xl mx-auto"
      >
        {TRUST_BADGES.map(({ icon: Icon, title, desc }) => (
          <div key={title} className="flex flex-col items-center gap-1.5 text-center">
            <div className="flex h-9 w-9 items-center justify-center rounded-full border border-border bg-white shadow-sm">
              <Icon className="h-4 w-4 text-primary" />
            </div>
            <p className="text-xs font-semibold text-gray-700 leading-tight">{title}</p>
            <p className="text-[10px] text-gray-400 leading-tight">{desc}</p>
          </div>
        ))}
      </motion.div>
    </div>
  );
}

