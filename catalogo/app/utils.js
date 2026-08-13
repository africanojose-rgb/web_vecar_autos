const WHATSAPP_NUMBER = '573112568613';

function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function whatsappUrl(mensaje) {
  return 'https://wa.me/' + WHATSAPP_NUMBER + '?text=' + encodeURIComponent(mensaje);
}

function formatearCOP(numero) {
  if (numero == null || isNaN(numero)) return "$0";
  return "$" + Math.round(numero).toLocaleString("es-CO");
}

function obtenerPrimeraFoto(fotos) {
  if (fotos && fotos.length > 0 && fotos[0]) {
    return fotos[0];
  }
  return "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80";
}
