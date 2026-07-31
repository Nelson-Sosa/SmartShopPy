import { doc, getDoc } from "firebase/firestore";
import { db } from "../firebase/firebaseConfig";
import { BRAND } from "../config/brand";

const SETTINGS_DOC = "settings";
const BUSINESS_DOC = "business";

export async function getBusinessSettings() {
  try {
    const snap = await getDoc(doc(db, SETTINGS_DOC, BUSINESS_DOC));
    if (snap.exists()) {
      return snap.data();
    }
  } catch {
    // Firestore read failed, fall through to defaults
  }
  return {
    whatsappNumber: import.meta.env.VITE_WHATSAPP_NUMBER || "",
    businessName: BRAND.name,
  };
}

export async function getWhatsappNumber() {
  const settings = await getBusinessSettings();
  return settings.whatsappNumber || "";
}
