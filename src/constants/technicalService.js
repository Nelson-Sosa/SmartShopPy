// ─────────────────────────────────────────────────────────────
//  TECH SERVICE — Constantes centralizadas
//  Evita strings dispersos e inconsistentes en el módulo.
// ─────────────────────────────────────────────────────────────

/**
 * Estados del servicio técnico (flujo lineal con bifurcaciones)
 *
 * received → diagnosing → quoted → approved → repairing → ready → delivered
 *                                └─ rejected
 * También: cancelled (en cualquier momento antes de repairing/ready)
 */
export const TECH_STATUS = {
  RECEIVED: "received",
  DIAGNOSING: "diagnosing",
  QUOTED: "quoted",
  APPROVED: "approved",
  REPAIRING: "repairing",
  READY: "ready",
  DELIVERED: "delivered",
  REJECTED: "rejected",
  CANCELLED: "cancelled",
};

/** Config visual para cada estado */
export const TECH_STATUS_CONFIG = {
  [TECH_STATUS.RECEIVED]: {
    label: "Solicitud recibida",
    shortLabel: "Recibido",
    color: "bg-blue-50 text-blue-700 ring-blue-200",
    dotColor: "bg-blue-500",
    step: 0,
  },
  [TECH_STATUS.DIAGNOSING]: {
    label: "En diagnóstico",
    shortLabel: "Diagnóstico",
    color: "bg-amber-50 text-amber-700 ring-amber-200",
    dotColor: "bg-amber-500",
    step: 1,
  },
  [TECH_STATUS.QUOTED]: {
    label: "Presupuesto enviado",
    shortLabel: "Presupuesto",
    color: "bg-purple-50 text-purple-700 ring-purple-200",
    dotColor: "bg-purple-500",
    step: 2,
  },
  [TECH_STATUS.APPROVED]: {
    label: "Presupuesto aprobado",
    shortLabel: "Aprobado",
    color: "bg-emerald-50 text-emerald-700 ring-emerald-200",
    dotColor: "bg-emerald-500",
    step: 3,
  },
  [TECH_STATUS.REPAIRING]: {
    label: "En reparación",
    shortLabel: "Reparación",
    color: "bg-orange-50 text-orange-700 ring-orange-200",
    dotColor: "bg-orange-500",
    step: 4,
  },
  [TECH_STATUS.READY]: {
    label: "Listo para retirar",
    shortLabel: "Listo",
    color: "bg-teal-50 text-teal-700 ring-teal-200",
    dotColor: "bg-teal-500",
    step: 5,
  },
  [TECH_STATUS.DELIVERED]: {
    label: "Entregado",
    shortLabel: "Entregado",
    color: "bg-gray-100 text-gray-600 ring-gray-200",
    dotColor: "bg-gray-400",
    step: 6,
  },
  [TECH_STATUS.REJECTED]: {
    label: "Presupuesto rechazado",
    shortLabel: "Rechazado",
    color: "bg-red-50 text-red-700 ring-red-200",
    dotColor: "bg-red-500",
    step: -1,
  },
  [TECH_STATUS.CANCELLED]: {
    label: "Cancelado",
    shortLabel: "Cancelado",
    color: "bg-red-50 text-red-600 ring-red-200",
    dotColor: "bg-red-400",
    step: -1,
  },
};

/** Pasos del timeline que se muestran al cliente */
export const TECH_TIMELINE_STEPS = [
  TECH_STATUS.RECEIVED,
  TECH_STATUS.DIAGNOSING,
  TECH_STATUS.QUOTED,
  TECH_STATUS.APPROVED,
  TECH_STATUS.REPAIRING,
  TECH_STATUS.READY,
  TECH_STATUS.DELIVERED,
];

/** Estados visibles en el select del admin */
export const TECH_STATUS_OPTIONS = [
  { value: TECH_STATUS.RECEIVED, label: "Solicitud recibida" },
  { value: TECH_STATUS.DIAGNOSING, label: "En diagnóstico" },
  { value: TECH_STATUS.QUOTED, label: "Presupuesto enviado" },
  { value: TECH_STATUS.APPROVED, label: "Presupuesto aprobado" },
  { value: TECH_STATUS.REPAIRING, label: "En reparación" },
  { value: TECH_STATUS.READY, label: "Listo para retirar" },
  { value: TECH_STATUS.DELIVERED, label: "Entregado" },
  { value: TECH_STATUS.REJECTED, label: "Rechazado" },
  { value: TECH_STATUS.CANCELLED, label: "Cancelado" },
];

// ─────────────────────────────────────────────────────────────
//  TIPOS DE DISPOSITIVO
// ─────────────────────────────────────────────────────────────
export const DEVICE_TYPE = {
  PHONE: "phone",
  COMPUTER: "computer",
};

export const DEVICE_CONFIG = {
  [DEVICE_TYPE.PHONE]: {
    label: "Celular",
    icon: "📱",
    description: "Reparación y diagnóstico de celulares",
  },
  [DEVICE_TYPE.COMPUTER]: {
    label: "Notebook / PC",
    icon: "💻",
    description: "Mantenimiento, software y diagnóstico",
  },
};

// ─────────────────────────────────────────────────────────────
//  CATÁLOGO DE SERVICIOS (preparado para migrar a Firestore)
// ─────────────────────────────────────────────────────────────
export const SERVICES_CATALOG = {
  [DEVICE_TYPE.PHONE]: [
    {
      id: "phone_diagnosis",
      icon: "🩺",
      label: "Diagnóstico",
      description: "No sé qué problema tiene",
    },
    {
      id: "phone_screen",
      icon: "📱",
      label: "Cambio de pantalla",
      description: "Pantalla rota, táctil sin respuesta",
    },
    {
      id: "phone_battery",
      icon: "🔋",
      label: "Cambio de batería",
      description: "Batería que dura poco o no carga",
    },
    {
      id: "phone_charging",
      icon: "🔌",
      label: "Problemas de carga",
      description: "No carga o el puerto está dañado",
    },
    {
      id: "phone_software",
      icon: "⚙️",
      label: "Problemas de software",
      description: "Se cuelga, lento o no enciende",
    },
    {
      id: "phone_other",
      icon: "❓",
      label: "Otro problema",
      description: "Contanos qué está pasando",
    },
  ],
  [DEVICE_TYPE.COMPUTER]: [
    {
      id: "pc_diagnosis",
      icon: "🩺",
      label: "Diagnóstico",
      description: "No sé qué problema tiene",
    },
    {
      id: "pc_cleaning",
      icon: "🧹",
      label: "Limpieza y mantenimiento",
      description: "Limpieza interna y mantenimiento preventivo",
    },
    {
      id: "pc_windows",
      icon: "💿",
      label: "Formatear e instalar Windows",
      description: "Instalación o reinstalación de Windows",
    },
    {
      id: "pc_software",
      icon: "💻",
      label: "Instalación de software",
      description: "Programas, drivers y configuración",
    },
    {
      id: "pc_slow",
      icon: "⚡",
      label: "Equipo lento",
      description: "Optimización y revisión del rendimiento",
    },
    {
      id: "pc_other",
      icon: "❓",
      label: "Otro problema",
      description: "Contanos qué está pasando",
    },
  ],
};

/** Estado del presupuesto */
export const QUOTE_STATUS = {
  PENDING: "pending",
  APPROVED: "approved",
  REJECTED: "rejected",
};
