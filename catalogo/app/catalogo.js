function crearCardHTML(vehiculo) {
  var data = vehiculo;
  var id = escapeHtml(vehiculo.id);
  var foto = escapeHtml(obtenerPrimeraFoto(data.fotos));
  var badge = "";
  if (data.estado) {
    var badgeClases = "bg-electric-blue text-white";
    var badgeTexto = escapeHtml(data.estado);
    if (data.estado === "DISPONIBLE" || data.estado === "VIRTUAL") {
      badgeClases = "bg-electric-blue text-white";
      badgeTexto = "Disponible";
    } else if (data.estado === "SEPARADO") {
      badgeClases = "bg-status-gold text-black";
      badgeTexto = "Separado";
    } else if (data.estado === "VENDIDO") {
      badgeClases = "bg-error-container text-on-error-container";
      badgeTexto = "Vendido";
    } else if (data.estado === "ALISTAMIENTO") {
      badgeClases = "bg-surface-container-high text-on-surface";
      badgeTexto = "En alistamiento";
    }
    badge = '<span class="' + badgeClases + ' text-[10px] font-bold uppercase px-3 py-1 rounded-full tracking-widest">' + badgeTexto + "</span>";
  }
  var transmisionTexto = data.transmision === "AT" ? "Automática" : data.transmision === "MC" ? "Mecánica" : escapeHtml(data.transmision || "");
  var marcaLinea = escapeHtml(data.marca) + " " + escapeHtml(data.linea);
  return (
    '<div class="group bg-charcoal-deep rounded-xl overflow-hidden border border-outline-variant/30 hover:border-electric-blue/50 transition-all duration-500 flex flex-col animate-fade-in">' +
      '<div class="relative aspect-[16/10] overflow-hidden">' +
        '<img alt="' + marcaLinea + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="' + foto + '" loading="lazy" onerror="this.onerror=null;this.src=\'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80\'"/>' +
        '<div class="absolute top-4 left-4">' + badge + "</div>" +
      "</div>" +
      '<div class="p-6 flex flex-col flex-1">' +
        '<div class="mb-4">' +
          '<h3 class="font-headline-lg text-[22px] leading-tight mb-1">' + marcaLinea + " " + escapeHtml(data.version || "") + "</h3>" +
          '<p class="text-titanium-silver text-sm uppercase tracking-widest font-label-caps">' + escapeHtml(data.anio) + " &bull; " + (data.kilometraje ? data.kilometraje.toLocaleString("es-CO") + " km" : "") + "</p>" +
        "</div>" +
        '<div class="grid grid-cols-2 gap-y-3 mb-6 font-body-sm text-on-surface-variant">' +
          '<div class="flex items-center gap-2">' +
            '<span class="material-symbols-outlined text-base">settings_input_component</span>' +
            "<span>" + transmisionTexto + "</span>" +
          "</div>" +
          '<div class="flex items-center gap-2">' +
            '<span class="material-symbols-outlined text-base">palette</span>' +
            "<span>" + escapeHtml(data.color || "") + "</span>" +
          "</div>" +
        "</div>" +
        '<div class="mt-auto pt-6 border-t border-outline-variant/20 flex items-center justify-between">' +
          "<div>" +
            '<p class="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Precio</p>' +
            '<p class="font-price-display text-electric-blue">' + formatearCOP(data.precio_venta) + "</p>" +
          "</div>" +
          '<button class="bg-white/10 hover:bg-electric-blue text-white px-6 py-2 rounded-lg font-bold transition-all text-sm transition-glow ver-detalles-btn" data-id="' + id + '">Ver detalles</button>' +
        "</div>" +
      "</div>" +
    "</div>"
  );
}

function renderizarCatalogo(vehiculos) {
  var grid = document.getElementById("vehicle-grid");
  var contador = document.getElementById("result-count");
  var loadMore = document.getElementById("load-more");
  if (!grid) return;
  window.ultimosFiltrados = vehiculos;
  if (vehiculos.length === 0) {
    grid.innerHTML =
      '<div class="col-span-full text-center py-20"><span class="material-symbols-outlined text-6xl text-on-surface-variant block mb-4">search_off</span><p class="text-on-surface-variant font-body-md">No se encontraron vehículos disponibles.</p></div>';
    if (contador) contador.textContent = "0";
    if (loadMore) loadMore.style.display = "none";
    return;
  }
  var mostrar = vehiculos.slice(0, visibleCount);
  grid.innerHTML = mostrar.map(crearCardHTML).join("");
  if (contador) contador.textContent = vehiculos.length;
  grid.querySelectorAll(".ver-detalles-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.location.href = "detalle.html#" + btn.dataset.id;
    });
  });
  if (loadMore) {
    if (visibleCount >= vehiculos.length) {
      loadMore.style.display = "none";
    } else {
      loadMore.style.display = "inline-flex";
      var restantes = vehiculos.length - visibleCount;
      loadMore.textContent = "Cargar m\u00e1s (" + restantes + " restantes)";
    }
  }
}

function cargarMas() {
  visibleCount += PAGE_SIZE;
  renderizarCatalogo(window.ultimosFiltrados || []);
}

function cargarVehiculos() {
  var grid = document.getElementById("vehicle-grid");
  if (grid) {
    grid.innerHTML =
      '<div class="col-span-full text-center py-20"><div class="inline-block w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin"></div><p class="text-on-surface-variant font-body-sm mt-4">Cargando vehículos...</p></div>';
  }
  supabase.from("vehiculos")
    .select("id, marca, linea, version, anio, cilindraje, color, transmision, kilometraje, precio_venta, estado, descripcion, fotos, created_at")
    .order("created_at", { ascending: false })
    .then(function (result) {
      if (result.error) {
        throw result.error;
      }
      var rows = result.data || [];
      window.todosLosVehiculos = rows;
      visibleCount = PAGE_SIZE;
      poblarMarcas(rows);
      renderizarCatalogo(rows);
    })
    .catch(function (error) {
      console.error("Error al cargar vehículos:", error);
      if (grid) {
        grid.innerHTML =
          '<div class="col-span-full text-center py-20"><span class="material-symbols-outlined text-6xl text-error block mb-4">error</span><p class="text-on-surface-variant font-body-md mb-4">Error al cargar el catálogo. Verifica la conexión.</p><button class="bg-electric-blue text-white px-6 py-2 rounded-lg font-bold text-sm cursor-pointer" onclick="cargarVehiculos()">Reintentar</button></div>';
      }
    });
}

function filtrarVehiculos() {
  var docs = window.todosLosVehiculos || [];
  var marca = document.getElementById("filter-marca");
  var transmisionAT = document.getElementById("filter-at");
  var transmisionMC = document.getElementById("filter-mc");
  var precioMin = document.getElementById("filter-precio-min");
  var precioMax = document.getElementById("filter-precio-max");
  var sortBy = document.getElementById("sort-by");
  var filtrados = docs.slice();
  if (marca && marca.value && marca.value !== "todas") {
    filtrados = filtrados.filter(function (v) {
      return v.marca && v.marca.toLowerCase() === marca.value.toLowerCase();
    });
  }
  var transmisionesActivas = [];
  if (transmisionAT && transmisionAT.checked) transmisionesActivas.push("AT");
  if (transmisionMC && transmisionMC.checked) transmisionesActivas.push("MC");
  if (transmisionesActivas.length > 0) {
    filtrados = filtrados.filter(function (v) {
      return transmisionesActivas.indexOf(v.transmision) !== -1;
    });
  }
  if (precioMin && precioMin.value) {
    var pMin = parseFloat(precioMin.value);
    if (!isNaN(pMin)) {
      filtrados = filtrados.filter(function (v) { return v.precio_venta >= pMin; });
    }
  }
  if (precioMax && precioMax.value) {
    var pMax = parseFloat(precioMax.value);
    if (!isNaN(pMax)) {
      filtrados = filtrados.filter(function (v) { return v.precio_venta <= pMax; });
    }
  }
  visibleCount = PAGE_SIZE;
  if (sortBy && sortBy.value) {
    if (sortBy.value === "precio-desc") {
      filtrados.sort(function (a, b) { return b.precio_venta - a.precio_venta; });
    } else if (sortBy.value === "precio-asc") {
      filtrados.sort(function (a, b) { return a.precio_venta - b.precio_venta; });
    } else if (sortBy.value === "anio-desc") {
      filtrados.sort(function (a, b) { return (b.anio || 0) - (a.anio || 0); });
    }
  }
  renderizarCatalogo(filtrados);
}

function limpiarFiltros() {
  document.querySelectorAll("#filter-form input, #filter-form select").forEach(function (el) {
    if (el.type === "checkbox") el.checked = false;
    else if (el.type === "range") el.value = "0";
    else el.value = "";
  });
  document.querySelectorAll("#filter-form input[type='number']").forEach(function (el) { el.value = ""; });
  var marcaSelect = document.getElementById("filter-marca");
  if (marcaSelect) marcaSelect.value = "todas";
  var sortBy = document.getElementById("sort-by");
  if (sortBy) sortBy.value = "";
  visibleCount = PAGE_SIZE;
  renderizarCatalogo(window.todosLosVehiculos || []);
}

function poblarMarcas(docs) {
  var select = document.getElementById("filter-marca");
  if (!select) return;
  select.innerHTML = '<option value="todas">Todas las Marcas</option>';
  var marcas = {};
  docs.forEach(function (v) {
    var m = v.marca;
    if (m) marcas[m] = true;
  });
  var marcasArray = Object.keys(marcas).sort();
  marcasArray.forEach(function (m) {
    var opt = document.createElement("option");
    opt.value = m.toLowerCase();
    opt.textContent = m;
    select.appendChild(opt);
  });
}
