document.addEventListener("DOMContentLoaded", function () {
  var nav = document.querySelector("nav");
  if (nav) {
    window.addEventListener("scroll", function () {
      if (window.scrollY > 50) {
        nav.classList.add("bg-black/90");
        nav.classList.remove("bg-surface/70");
      } else {
        nav.classList.remove("bg-black/90");
        nav.classList.add("bg-surface/70");
      }
    }, { passive: true });
  }
  if (document.getElementById("vehicle-grid")) {
    cargarVehiculos();
    var limpiarBtn = document.getElementById("limpiar-filtros");
    if (limpiarBtn) {
      limpiarBtn.addEventListener("click", limpiarFiltros);
    }
    var aplicarBtn = document.getElementById("aplicar-filtros");
    if (aplicarBtn) {
      aplicarBtn.addEventListener("click", function (e) {
        e.preventDefault();
        filtrarVehiculos();
      });
    }
    var filterInputs = document.querySelectorAll("#filter-form input, #filter-form select");
    filterInputs.forEach(function (el) {
      el.addEventListener("change", filtrarVehiculos);
    });
    var sortBy = document.getElementById("sort-by");
    if (sortBy) {
      sortBy.addEventListener("change", filtrarVehiculos);
    }
  }
  if (document.getElementById("detalle-content")) {
    cargarDetalle();
  }
});
