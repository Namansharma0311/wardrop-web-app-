export function isCapacitor() {
  try {
    return window.location.protocol === "capacitor:";
  } catch {
    return false;
  }
}

function isAndroid() {
  try {
    return /android/i.test(navigator.userAgent);
  } catch {
    return false;
  }
}

const SERVER_PORT = 4000;
const SERVER_IP = isCapacitor() && isAndroid() ? "10.0.2.2" : "192.168.1.6";

export const API_BASE = isCapacitor()
  ? `http://${SERVER_IP}:${SERVER_PORT}/api`
  : "/api";

export const UPLOADS_BASE = isCapacitor()
  ? `http://${SERVER_IP}:${SERVER_PORT}`
  : "";

export function imageUrl(path) {
  if (!path) return null;
  if (path.startsWith("http")) return path;
  return `${UPLOADS_BASE}${path}`;
}
