/**
 * Formats a Firestore timestamp or Date object to a relative "time ago" string.
 * @param {Object|Date|number} dateInput - Firestore Timestamp, Date object, or milliseconds
 * @returns {string} - Relative time string like "Guardado hace 3 días"
 */
export function timeAgo(dateInput) {
  if (!dateInput) return "";

  let date;
  if (dateInput.toDate && typeof dateInput.toDate === "function") {
    date = dateInput.toDate(); // Firestore timestamp
  } else if (dateInput instanceof Date) {
    date = dateInput;
  } else if (typeof dateInput === "number") {
    date = new Date(dateInput);
  } else {
    return "";
  }

  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return "Guardado hace un momento";
  }

  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `Guardado hace ${diffInMinutes} minuto${diffInMinutes !== 1 ? 's' : ''}`;
  }

  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `Guardado hace ${diffInHours} hora${diffInHours !== 1 ? 's' : ''}`;
  }

  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    if (diffInDays === 1) return "Guardado ayer";
    return `Guardado hace ${diffInDays} días`;
  }

  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `Guardado hace ${diffInMonths} mes${diffInMonths !== 1 ? 'es' : ''}`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `Guardado hace ${diffInYears} año${diffInYears !== 1 ? 's' : ''}`;
}
