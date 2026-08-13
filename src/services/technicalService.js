/**
 * technicalService.js — Servicio Firestore para Servicio Técnico
 *
 * Colección: technical_services
 *
 * Acceso:
 *   - Cualquiera puede crear y leer (clientes sin cuenta)
 *   - Solo admin puede actualizar diagnóstico/estado/precio
 *   - El cliente puede aceptar/rechazar presupuesto (campos limitados)
 */

import {
  collection,
  doc,
  getDoc,
  getDocs,
  addDoc,
  updateDoc,
  query,
  orderBy,
  where,
  limit,
  startAfter,
  serverTimestamp,
} from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { TECH_STATUS, QUOTE_STATUS } from "../constants/technicalService";

const COLLECTION = "technical_services";

// ─────────────────────────────────────────────────────────────
//  TRACKING CODE GENERATOR
//  Genera un código local ST-XXXXX sin necesitar una colección
//  extra de contadores en Firestore (evita permisos adicionales).
//  Combina timestamp base-36 + random para unicidad práctica.
// ─────────────────────────────────────────────────────────────

/**
 * Genera un tracking code único tipo ST-XXXXX.
 * @returns {string} e.g. "ST-A4Z9K"
 */
function generateTrackingCode() {
  const ts = Date.now().toString(36).slice(-3).toUpperCase();   // 3 chars from timestamp
  const rnd = Math.random().toString(36).slice(2, 5).toUpperCase(); // 3 random chars
  return `ST-${ts}${rnd}`;
}

// ─────────────────────────────────────────────────────────────
//  CREATE — Crea solicitud de servicio técnico
// ─────────────────────────────────────────────────────────────

/**
 * Crea una nueva solicitud de servicio técnico.
 *
 * @param {Object} data - Datos del formulario del cliente
 * @param {string} data.deviceType  - "phone" | "computer"
 * @param {string} data.serviceType - ID del servicio (ej. "pc_slow")
 * @param {string} data.serviceLabel - Label legible (ej. "Equipo lento")
 * @param {string} data.brand       - Marca del equipo
 * @param {string} [data.model]     - Modelo del equipo
 * @param {string} data.customerProblem - Descripción del problema
 * @param {Array}  [data.images]    - [{ url, publicId }]
 * @param {string} data.customerName
 * @param {string} data.customerPhone
 * @param {string} [data.customerEmail]
 * @param {string} [data.customerId] - UID Firebase si está logueado
 *
 * @returns {Promise<{ id: string, trackingCode: string }>}
 */
export async function createTechnicalService(data) {
  const trackingCode = await generateTrackingCode();

  const docData = {
    trackingCode,
    status: TECH_STATUS.RECEIVED,

    // Equipo
    deviceType: data.deviceType,
    brand: data.brand?.trim() || "",
    model: data.model?.trim() || "",
    serviceType: data.serviceType,
    serviceLabel: data.serviceLabel,

    // Problema
    customerProblem: data.customerProblem?.trim() || "",
    images: data.images || [],

    // Cliente
    customerName: data.customerName?.trim() || "",
    customerPhone: data.customerPhone?.trim() || "",
    customerEmail: data.customerEmail?.trim() || null,
    customerId: data.customerId || null,

    // Admin — vacíos al crear
    diagnostic: "",
    technicalNotes: "",
    quote: null,
    quoteStatus: null,
    quoteApprovedAt: null,
    quoteRejectedAt: null,
    assignedTechnician: "",

    // Historial
    history: [
      {
        action: "Solicitud creada",
        timestamp: new Date().toISOString(),
        userId: data.customerId || null,
      },
    ],

    // Timestamps
    createdAt: serverTimestamp(),
    updatedAt: serverTimestamp(),
    deliveredAt: null,
    createdBy: data.customerId || null,
  };

  const colRef = collection(db, COLLECTION);
  const docRef = await addDoc(colRef, docData);

  return { id: docRef.id, trackingCode };
}

// ─────────────────────────────────────────────────────────────
//  READ — Consulta pública por tracking code (sin auth)
// ─────────────────────────────────────────────────────────────

/**
 * Busca una solicitud por su tracking code (acceso público).
 * @param {string} trackingCode - Ej. "ST-00482"
 * @returns {Promise<Object|null>}
 */
export async function getTechnicalServiceByCode(trackingCode) {
  if (!trackingCode) return null;
  const normalized = trackingCode.trim().toUpperCase();
  const q = query(
    collection(db, COLLECTION),
    where("trackingCode", "==", normalized),
    limit(1)
  );
  const snapshot = await getDocs(q);
  if (snapshot.empty) return null;
  const d = snapshot.docs[0];
  return { id: d.id, ...d.data() };
}

/**
 * Obtiene una solicitud por su ID de documento.
 * @param {string} id
 * @returns {Promise<Object|null>}
 */
export async function getTechnicalServiceById(id) {
  const snap = await getDoc(doc(db, COLLECTION, id));
  if (!snap.exists()) return null;
  return { id: snap.id, ...snap.data() };
}

// ─────────────────────────────────────────────────────────────
//  LIST — Lista paginada para el panel admin
// ─────────────────────────────────────────────────────────────

/**
 * Obtiene lista paginada de solicitudes (admin only).
 *
 * @param {Object} options
 * @param {string|null} options.statusFilter  - Filtro por estado
 * @param {string|null} options.deviceFilter  - Filtro por tipo de dispositivo
 * @param {number}      options.pageSize
 * @param {Object|null} options.lastDoc       - Cursor para paginación
 *
 * @returns {Promise<{ services: Array, lastDoc: Object|null, hasMore: boolean }>}
 */
export async function getTechnicalServices({
  statusFilter = null,
  deviceFilter = null,
  pageSize = 20,
  lastDoc = null,
} = {}) {
  const constraints = [];

  if (statusFilter && statusFilter !== "all") {
    constraints.push(where("status", "==", statusFilter));
  }
  if (deviceFilter && deviceFilter !== "all") {
    constraints.push(where("deviceType", "==", deviceFilter));
  }

  constraints.push(orderBy("createdAt", "desc"));
  constraints.push(limit(pageSize + 1));

  if (lastDoc) constraints.push(startAfter(lastDoc));

  const q = query(collection(db, COLLECTION), ...constraints);
  const snapshot = await getDocs(q);

  const docs = snapshot.docs.slice(0, pageSize);
  const hasMore = snapshot.docs.length > pageSize;

  return {
    services: docs.map((d) => ({ id: d.id, ...d.data() })),
    lastDoc: docs.length > 0 ? docs[docs.length - 1] : null,
    hasMore,
  };
}

// ─────────────────────────────────────────────────────────────
//  UPDATE — Admin actualiza diagnóstico / estado / presupuesto
// ─────────────────────────────────────────────────────────────

/**
 * Actualiza campos de la solicitud y registra en el historial.
 *
 * @param {string} id - ID del documento
 * @param {Object} updates - Campos a actualizar
 * @param {string} [userId] - UID del admin
 * @param {string} [historyAction] - Texto para el historial
 *
 * @returns {Promise<void>}
 */
export async function updateTechnicalService(id, updates, userId = null, historyAction = null) {
  const docRef = doc(db, COLLECTION, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) throw new Error("SERVICE_NOT_FOUND");

  const current = snap.data();
  const now = new Date().toISOString();

  const historyEntry = historyAction
    ? { action: historyAction, timestamp: now, userId }
    : null;

  const payload = {
    ...updates,
    updatedAt: serverTimestamp(),
  };

  if (historyEntry) {
    payload.history = [...(current.history || []), historyEntry];
  }

  await updateDoc(docRef, payload);
}

// ─────────────────────────────────────────────────────────────
//  QUOTE RESPONSE — Cliente acepta o rechaza presupuesto
// ─────────────────────────────────────────────────────────────

/**
 * El cliente acepta o rechaza el presupuesto.
 * Solo se puede operar si quoteStatus === "pending".
 *
 * @param {string} id        - ID del documento
 * @param {boolean} accepted - true = aceptar, false = rechazar
 *
 * @returns {Promise<void>}
 */
export async function respondToQuote(id, accepted) {
  const docRef = doc(db, COLLECTION, id);
  const snap = await getDoc(docRef);
  if (!snap.exists()) throw new Error("SERVICE_NOT_FOUND");

  const current = snap.data();
  if (current.quoteStatus !== QUOTE_STATUS.PENDING) {
    throw new Error("QUOTE_NOT_PENDING");
  }

  const now = new Date().toISOString();
  const action = accepted ? "Cliente aprobó el presupuesto" : "Cliente rechazó el presupuesto";

  await updateDoc(docRef, {
    quoteStatus: accepted ? QUOTE_STATUS.APPROVED : QUOTE_STATUS.REJECTED,
    status: accepted ? TECH_STATUS.APPROVED : TECH_STATUS.REJECTED,
    quoteApprovedAt: accepted ? serverTimestamp() : null,
    quoteRejectedAt: !accepted ? serverTimestamp() : null,
    updatedAt: serverTimestamp(),
    history: [
      ...(current.history || []),
      { action, timestamp: now, userId: null },
    ],
  });
}

// ─────────────────────────────────────────────────────────────
//  SUMMARY — Resumen para el Dashboard admin
// ─────────────────────────────────────────────────────────────

/**
 * Cuenta solicitudes activas agrupadas por estado.
 * @returns {Promise<{ received: number, diagnosing: number, quoted: number, total: number }>}
 */
export async function getTechnicalServicesSummary() {
  const activeStatuses = [
    TECH_STATUS.RECEIVED,
    TECH_STATUS.DIAGNOSING,
    TECH_STATUS.QUOTED,
    TECH_STATUS.APPROVED,
    TECH_STATUS.REPAIRING,
    TECH_STATUS.READY,
  ];

  const q = query(
    collection(db, COLLECTION),
    where("status", "in", activeStatuses)
  );
  const snapshot = await getDocs(q);
  const active = snapshot.docs.map((d) => ({ id: d.id, ...d.data() }));

  return {
    received: active.filter((s) => s.status === TECH_STATUS.RECEIVED).length,
    diagnosing: active.filter((s) => s.status === TECH_STATUS.DIAGNOSING).length,
    quoted: active.filter((s) => s.status === TECH_STATUS.QUOTED).length,
    total: active.length,
  };
}
