import { useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import StepDeviceType from "./StepDeviceType";
import StepServiceType from "./StepServiceType";
import StepDeviceInfo from "./StepDeviceInfo";
import StepContactInfo from "./StepContactInfo";
import StepSummary from "./StepSummary";
import StepConfirmation from "./StepConfirmation";

const STEPS = ["device", "service", "info", "contact", "summary"];

// Animación de slide entre pasos
const variants = {
  enter: (dir) => ({ x: dir > 0 ? 40 : -40, opacity: 0 }),
  center: { x: 0, opacity: 1 },
  exit: (dir) => ({ x: dir > 0 ? -40 : 40, opacity: 0 }),
};

export default function TechnicalServiceWizard() {
  const [stepIndex, setStepIndex] = useState(0);
  const [direction, setDirection] = useState(1);
  const [confirmed, setConfirmed] = useState(null); // { id, trackingCode }

  // Datos acumulados del formulario
  const [formData, setFormData] = useState({
    deviceType: null,
    serviceType: null,
    serviceLabel: null,
    brand: "",
    model: "",
    customerProblem: "",
    images: [],
    customerName: "",
    customerPhone: "",
    customerEmail: "",
  });

  const goNext = (newData = {}) => {
    setFormData((prev) => ({ ...prev, ...newData }));
    setDirection(1);
    setStepIndex((i) => Math.min(i + 1, STEPS.length - 1));
  };

  const goBack = () => {
    setDirection(-1);
    setStepIndex((i) => Math.max(i - 1, 0));
  };

  const handleConfirmed = (result) => {
    setConfirmed(result);
  };

  // Una vez confirmado mostramos la pantalla de éxito
  if (confirmed) {
    return <StepConfirmation result={confirmed} formData={formData} />;
  }

  const currentStep = STEPS[stepIndex];
  const progress = ((stepIndex) / (STEPS.length - 1)) * 100;

  return (
    <div className="min-h-[60vh]">
      {/* Barra de progreso */}
      <div className="mb-6">
        <div className="flex items-center justify-between mb-2">
          <span className="text-xs font-medium text-gray-500">
            Paso {stepIndex + 1} de {STEPS.length}
          </span>
          <span className="text-xs font-medium text-primary">
            {Math.round(progress)}%
          </span>
        </div>
        <div className="h-1.5 w-full rounded-full bg-gray-100">
          <motion.div
            className="h-full rounded-full bg-primary"
            initial={{ width: 0 }}
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.3, ease: "easeOut" }}
          />
        </div>
      </div>

      {/* Contenido del paso */}
      <AnimatePresence mode="wait" custom={direction}>
        <motion.div
          key={currentStep}
          custom={direction}
          variants={variants}
          initial="enter"
          animate="center"
          exit="exit"
          transition={{ duration: 0.22, ease: "easeInOut" }}
        >
          {currentStep === "device" && (
            <StepDeviceType formData={formData} onNext={goNext} />
          )}
          {currentStep === "service" && (
            <StepServiceType
              formData={formData}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {currentStep === "info" && (
            <StepDeviceInfo
              formData={formData}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {currentStep === "contact" && (
            <StepContactInfo
              formData={formData}
              onNext={goNext}
              onBack={goBack}
            />
          )}
          {currentStep === "summary" && (
            <StepSummary
              formData={formData}
              onBack={goBack}
              onConfirmed={handleConfirmed}
            />
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}
