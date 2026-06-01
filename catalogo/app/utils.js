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
