import { DEVICE_CONFIG, DEVICE_TYPE } from "../../../constants/technicalService";
import { motion } from "framer-motion";

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.08 } },
};
const item = {
  hidden: { opacity: 0, y: 16 },
  show: { opacity: 1, y: 0, transition: { duration: 0.3 } },
};

export default function StepDeviceType({ onNext }) {
  const devices = [DEVICE_TYPE.PHONE, DEVICE_TYPE.COMPUTER];

  return (
    <div>
      <div className="mb-8 text-center">
        <h2 className="text-xl font-bold text-gray-800 sm:text-2xl">
          ¿Qué equipo necesitás reparar?
        </h2>
        <p className="mt-1.5 text-sm text-gray-500">
          Elegí el tipo de equipo para continuar
        </p>
      </div>

      <motion.div
        variants={container}
        initial="hidden"
        animate="show"
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 max-w-xl mx-auto"
      >
        {devices.map((type) => {
          const cfg = DEVICE_CONFIG[type];
          return (
            <motion.button
              key={type}
              variants={item}
              onClick={() => onNext({ deviceType: type })}
              className="group flex flex-col items-center gap-4 rounded-2xl border-2 border-border bg-white p-6 text-center
                         shadow-sm transition-all duration-200
                         hover:border-primary hover:shadow-md hover:scale-[1.02]
                         focus:outline-none focus-visible:ring-2 focus-visible:ring-primary active:scale-[0.98]
                         sm:p-8"
            >
              <span className="text-5xl sm:text-6xl leading-none select-none group-hover:scale-110 transition-transform duration-200">
                {cfg.icon}
              </span>
              <div>
                <p className="text-lg font-bold text-gray-800 sm:text-xl">
                  {cfg.label}
                </p>
                <p className="mt-1 text-sm text-gray-500 leading-snug">
                  {cfg.description}
                </p>
              </div>
              <span className="mt-auto inline-flex items-center gap-1 text-xs font-semibold text-primary opacity-0 group-hover:opacity-100 transition-opacity">
                Seleccionar →
              </span>
            </motion.button>
          );
        })}
      </motion.div>
    </div>
  );
}
