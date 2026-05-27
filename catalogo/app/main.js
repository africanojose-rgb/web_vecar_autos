var firebaseConfig = {
  apiKey: "AIzaSyDXHzQ0ZHo3plZ3UbXDGncpgMkKqp4XZsw",
  authDomain: "vercar-autos.firebaseapp.com",
  projectId: "vercar-autos",
  storageBucket: "vercar-autos.firebasestorage.app",
  messagingSenderId: "967994933227",
  appId: "1:967994933227:web:fed4898d1440aa6ee123ae"
};

firebase.initializeApp(firebaseConfig);
var db = firebase.firestore();

function formatearCOP(numero) {
  return "$" + Math.round(numero).toLocaleString("es-CO");
}

function obtenerPrimeraFoto(fotos) {
  if (fotos && fotos.length > 0 && fotos[0]) {
    return fotos[0];
  }
  return "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80";
}

function crearCardHTML(vehiculo) {
  var data = vehiculo.data();
  var id = vehiculo.id;
  var foto = obtenerPrimeraFoto(data.fotos);
  var badge = "";
  if (data.estado) {
    var badgeClases = "bg-electric-blue text-white";
    var badgeTexto = data.estado;
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
  var transmisionTexto = data.transmision === "AT" ? "Automática" : data.transmision === "MC" ? "Mecánica" : data.transmision || "";
  return (
    '<div class="group bg-charcoal-deep rounded-xl overflow-hidden border border-outline-variant/30 hover:border-electric-blue/50 transition-all duration-500 flex flex-col animate-fade-in">' +
      '<div class="relative aspect-[16/10] overflow-hidden">' +
        '<img alt="' + data.marca + " " + data.linea + '" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700" src="' + foto + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80\'"/>' +
        '<div class="absolute top-4 left-4">' + badge + "</div>" +
      "</div>" +
      '<div class="p-6 flex flex-col flex-1">' +
        '<div class="mb-4">' +
          '<h3 class="font-headline-lg text-[22px] leading-tight mb-1">' + data.marca + " " + data.linea + " " + (data.version || "") + "</h3>" +
          '<p class="text-titanium-silver text-sm uppercase tracking-widest font-label-caps">' + data.anio + " &bull; " + (data.kilometraje ? data.kilometraje.toLocaleString("es-CO") + " km" : "") + "</p>" +
        "</div>" +
        '<div class="grid grid-cols-2 gap-y-3 mb-6 font-body-sm text-on-surface-variant">' +
          '<div class="flex items-center gap-2">' +
            '<span class="material-symbols-outlined text-base">settings_input_component</span>' +
            "<span>" + transmisionTexto + "</span>" +
          "</div>" +
          '<div class="flex items-center gap-2">' +
            '<span class="material-symbols-outlined text-base">palette</span>' +
            "<span>" + (data.color || "") + "</span>" +
          "</div>" +
        "</div>" +
        '<div class="mt-auto pt-6 border-t border-outline-variant/20 flex items-center justify-between">' +
          "<div>" +
            '<p class="text-[10px] uppercase font-bold text-on-surface-variant tracking-wider">Precio</p>' +
            '<p class="font-price-display text-electric-blue">' + formatearCOP(data.precioVenta) + "</p>" +
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
  if (!grid) return;
  if (vehiculos.length === 0) {
    grid.innerHTML =
      '<div class="col-span-full text-center py-20"><span class="material-symbols-outlined text-6xl text-on-surface-variant block mb-4">search_off</span><p class="text-on-surface-variant font-body-md">No se encontraron vehículos disponibles.</p></div>';
    if (contador) contador.textContent = "0";
    return;
  }
  grid.innerHTML = vehiculos.map(crearCardHTML).join("");
  if (contador) contador.textContent = vehiculos.length;
  grid.querySelectorAll(".ver-detalles-btn").forEach(function (btn) {
    btn.addEventListener("click", function () {
      window.location.href = "detalle.html#" + btn.dataset.id;
    });
  });
}

function cargarVehiculos() {
  var grid = document.getElementById("vehicle-grid");
  if (grid) {
    grid.innerHTML =
      '<div class="col-span-full text-center py-20"><div class="inline-block w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin"></div><p class="text-on-surface-variant font-body-sm mt-4">Cargando vehículos...</p></div>';
  }
  db.collection("vehiculos")
    .where("visibleWeb", "==", true)
    .orderBy("createdAt", "desc")
    .onSnapshot(function (snapshot) {
      var docs = snapshot.docs;
      window.todosLosVehiculos = docs;
      poblarMarcas(docs);
      renderizarCatalogo(docs);
    }, function (error) {
      console.error("Error al cargar vehículos:", error);
      if (grid) {
        grid.innerHTML =
          '<div class="col-span-full text-center py-20"><span class="material-symbols-outlined text-6xl text-error block mb-4">error</span><p class="text-on-surface-variant font-body-md">Error al cargar el catálogo. Verifica la conexión.</p></div>';
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
      return v.data().marca && v.data().marca.toLowerCase() === marca.value.toLowerCase();
    });
  }
  var transmisionesActivas = [];
  if (transmisionAT && transmisionAT.checked) transmisionesActivas.push("AT");
  if (transmisionMC && transmisionMC.checked) transmisionesActivas.push("MC");
  if (transmisionesActivas.length > 0) {
    filtrados = filtrados.filter(function (v) {
      return transmisionesActivas.indexOf(v.data().transmision) !== -1;
    });
  }
  if (precioMin && precioMin.value) {
    var pMin = parseFloat(precioMin.value);
    if (!isNaN(pMin)) {
      filtrados = filtrados.filter(function (v) { return v.data().precioVenta >= pMin; });
    }
  }
  if (precioMax && precioMax.value) {
    var pMax = parseFloat(precioMax.value);
    if (!isNaN(pMax)) {
      filtrados = filtrados.filter(function (v) { return v.data().precioVenta <= pMax; });
    }
  }
  if (sortBy && sortBy.value) {
    if (sortBy.value === "precio-desc") {
      filtrados.sort(function (a, b) { return b.data().precioVenta - a.data().precioVenta; });
    } else if (sortBy.value === "precio-asc") {
      filtrados.sort(function (a, b) { return a.data().precioVenta - b.data().precioVenta; });
    } else if (sortBy.value === "anio-desc") {
      filtrados.sort(function (a, b) { return (b.data().anio || 0) - (a.data().anio || 0); });
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
  renderizarCatalogo(window.todosLosVehiculos || []);
}

function cargarDetalle() {
  var id = window.location.hash.replace("#", "");
  if (!id) {
    document.getElementById("detalle-content").innerHTML =
      '<div class="text-center py-20"><p class="text-on-surface-variant">No se especificó un vehículo.</p><a class="text-electric-blue mt-4 inline-block" href="index.html">Volver al catálogo</a></div>';
    return;
  }
  document.getElementById("detalle-content").innerHTML =
    '<div class="text-center py-20"><div class="inline-block w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin"></div><p class="text-on-surface-variant font-body-sm mt-4">Cargando vehículo...</p></div>';
  db.collection("vehiculos").doc(id).get().then(function (doc) {
    if (!doc.exists) {
      document.getElementById("detalle-content").innerHTML =
        '<div class="text-center py-20"><span class="material-symbols-outlined text-6xl text-error block mb-4">search_off</span><p class="text-on-surface-variant">Vehículo no encontrado.</p><a class="text-electric-blue mt-4 inline-block" href="index.html">Volver al catálogo</a></div>';
      return;
    }
    renderizarDetalle(doc);
  }).catch(function (error) {
    console.error("Error al cargar detalle:", error);
    document.getElementById("detalle-content").innerHTML =
      '<div class="text-center py-20"><span class="material-symbols-outlined text-6xl text-error block mb-4">error</span><p class="text-on-surface-variant">Error al cargar el vehículo.</p><a class="text-electric-blue mt-4 inline-block" href="index.html">Volver al catálogo</a></div>';
  });
}

function renderizarDetalle(doc) {
  var data = doc.data();
  var fotos = data.fotos || [];
  var fotoPrincipal = fotos[0] || "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80";
  var transmisionTexto = data.transmision === "AT" ? "Automática" : data.transmision === "MC" ? "Mecánica" : data.transmision || "";
  var badge = "";
  if (data.estado) {
    var bg = data.estado === "VENDIDO" ? "bg-error-container" : "bg-status-gold";
    var txtColor = data.estado === "VENDIDO" ? "text-on-error-container" : "text-black";
    badge = '<span class="' + bg + " " + txtColor + ' font-label-caps text-label-caps px-3 py-1 rounded shadow-lg uppercase">' + data.estado + "</span>";
  }
  var thumbsHTML = "";
  fotos.forEach(function (f, i) {
    var isActive = i === 0;
    thumbsHTML +=
      '<button class="min-w-[120px] aspect-video rounded-lg overflow-hidden machined-edge ' + (isActive ? "ring-2 ring-electric-blue" : "opacity-60 hover:opacity-100") + ' transition-all" onclick="cambiarFoto(this)">' +
        '<img class="w-full h-full object-cover" src="' + f + '" loading="lazy" onerror="this.src=\'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80\'"/>' +
      "</button>";
  });
  if (fotos.length === 0) {
    thumbsHTML =
      '<button class="min-w-[120px] aspect-video rounded-lg overflow-hidden machined-edge ring-2 ring-electric-blue transition-all">' +
        '<img class="w-full h-full object-cover" src="https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80"/>' +
      "</button>";
  }
  document.getElementById("detalle-content").innerHTML =
    '<nav class="flex gap-2 mb-8 text-on-surface-variant font-body-sm text-body-sm">' +
      '<a class="hover:text-electric-blue" href="index.html">Inventario</a>' +
      '<span>/</span>' +
      '<span class="text-on-surface">' + data.marca + " " + data.linea + "</span>" +
    "</nav>" +
    '<div class="grid grid-cols-1 lg:grid-cols-12 gap-card-gap items-start">' +
      '<section class="lg:col-span-8 space-y-4">' +
        '<div class="relative aspect-[16/9] overflow-hidden rounded-xl machined-edge">' +
          '<img alt="' + data.marca + " " + data.linea + '" class="w-full h-full object-cover transition-all duration-700" id="main-image" src="' + fotoPrincipal + '" onerror="this.src=\'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80\'"/>' +
          '<div class="absolute top-4 right-4 flex gap-2">' + badge + "</div>" +
          '<button class="absolute left-4 top-1/2 -translate-y-1/2 glass-panel w-12 h-12 rounded-full flex items-center justify-center hover:bg-electric-blue transition-colors" onclick="navegarFoto(-1)">' +
            '<span class="material-symbols-outlined">chevron_left</span>' +
          "</button>" +
          '<button class="absolute right-4 top-1/2 -translate-y-1/2 glass-panel w-12 h-12 rounded-full flex items-center justify-center hover:bg-electric-blue transition-colors" onclick="navegarFoto(1)">' +
            '<span class="material-symbols-outlined">chevron_right</span>' +
          "</button>" +
        "</div>" +
        '<div class="flex gap-4 overflow-x-auto pb-2 custom-scrollbar" id="thumbnails">' + thumbsHTML + "</div>" +
      "</section>" +
      '<aside class="lg:col-span-4 sticky top-24 space-y-6">' +
        '<div class="p-8 bg-charcoal-deep rounded-xl machined-edge space-y-6">' +
          "<div>" +
            '<h1 class="font-headline-xl text-headline-xl text-on-surface mb-2">' + data.marca + " " + data.linea + " " + (data.version || "") + "</h1>" +
            '<p class="text-titanium-silver font-body-md text-body-md">' + (data.anio || "") + (data.kilometraje ? " &bull; " + data.kilometraje.toLocaleString("es-CO") + " km" : "") + "</p>" +
          "</div>" +
          '<div class="flex items-baseline gap-2">' +
            '<span class="text-electric-blue font-price-display text-price-display">' + formatearCOP(data.precioVenta) + "</span>" +
            '<span class="text-on-surface-variant font-body-sm text-body-sm"></span>' +
          "</div>" +
          '<div class="grid grid-cols-2 gap-4">' +
            '<button class="w-full py-4 bg-primary-container text-on-primary-container rounded-lg font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 glow-hover" onclick="window.open(\'https://wa.me/57XXXXXXXXX?text=Hola%2C%20me%20interesa%20' + encodeURIComponent(data.marca + " " + data.linea) + '\',\'_blank\')">' +
              '<span class="material-symbols-outlined">chat</span> WhatsApp' +
            "</button>" +
            '<button class="w-full py-4 border border-titanium-silver text-titanium-silver rounded-lg font-bold flex items-center justify-center gap-2 hover:bg-titanium-silver/10 transition-colors" onclick="navigator.clipboard.writeText(window.location.href)">' +
              '<span class="material-symbols-outlined">share</span> Compartir' +
            "</button>" +
          "</div>" +
        "</div>" +
        '<div class="grid grid-cols-2 gap-3">' +
          '<div class="p-4 bg-surface-container-high rounded-lg machined-edge">' +
            '<p class="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Kilometraje</p>' +
            '<p class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">' + (data.kilometraje ? data.kilometraje.toLocaleString("es-CO") + " km" : "N/A") + "</p>" +
          "</div>" +
          '<div class="p-4 bg-surface-container-high rounded-lg machined-edge">' +
            '<p class="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Transmisión</p>' +
            '<p class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">' + transmisionTexto + "</p>" +
          "</div>" +
          '<div class="p-4 bg-surface-container-high rounded-lg machined-edge">' +
            '<p class="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Color</p>' +
            '<p class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">' + (data.color || "N/A") + "</p>" +
          "</div>" +
          '<div class="p-4 bg-surface-container-high rounded-lg machined-edge">' +
            '<p class="font-label-caps text-label-caps text-on-surface-variant mb-1 uppercase">Cilindraje</p>' +
            '<p class="font-headline-lg-mobile text-headline-lg-mobile text-on-surface">' + (data.cilindraje || "N/A") + "</p>" +
          "</div>" +
        "</div>" +
      "</aside>" +
    "</div>" +
    '<div class="mt-20 grid grid-cols-1 lg:grid-cols-12 gap-card-gap">' +
      '<div class="lg:col-span-8 space-y-12">' +
        '<section>' +
          '<h2 class="font-headline-lg text-headline-lg mb-6 border-l-4 border-electric-blue pl-4">Descripción</h2>' +
          '<div class="text-on-surface-variant leading-relaxed">' +
            '<p>' + (data.descripcion || "Sin descripción disponible.") + "</p>" +
          "</div>" +
        "</section>" +
        '<section>' +
          '<h2 class="font-headline-lg text-headline-lg mb-6 border-l-4 border-electric-blue pl-4">Especificaciones</h2>' +
          '<div class="grid grid-cols-1 md:grid-cols-2 gap-y-4 gap-x-8">' +
            '<div class="flex justify-between py-4 border-b border-outline-variant/30"><span class="text-on-surface-variant">Marca</span><span class="font-bold">' + (data.marca || "N/A") + "</span></div>" +
            '<div class="flex justify-between py-4 border-b border-outline-variant/30"><span class="text-on-surface-variant">Línea</span><span class="font-bold">' + (data.linea || "N/A") + "</span></div>" +
            '<div class="flex justify-between py-4 border-b border-outline-variant/30"><span class="text-on-surface-variant">Versión</span><span class="font-bold">' + (data.version || "N/A") + "</span></div>" +
            '<div class="flex justify-between py-4 border-b border-outline-variant/30"><span class="text-on-surface-variant">Año</span><span class="font-bold">' + (data.anio || "N/A") + "</span></div>" +
            '<div class="flex justify-between py-4 border-b border-outline-variant/30"><span class="text-on-surface-variant">Transmisión</span><span class="font-bold">' + transmisionTexto + "</span></div>" +
            '<div class="flex justify-between py-4 border-b border-outline-variant/30"><span class="text-on-surface-variant">Color</span><span class="font-bold">' + (data.color || "N/A") + "</span></div>" +
            '<div class="flex justify-between py-4 border-b border-outline-variant/30"><span class="text-on-surface-variant">Cilindraje</span><span class="font-bold">' + (data.cilindraje || "N/A") + "</span></div>" +
            '<div class="flex justify-between py-4 border-b border-outline-variant/30"><span class="text-on-surface-variant">Kilometraje</span><span class="font-bold">' + (data.kilometraje ? data.kilometraje.toLocaleString("es-CO") + " km" : "N/A") + "</span></div>" +
          "</div>" +
        "</section>" +
      "</div>" +
    "</div>";
  window.detalleFotos = fotos;
  window.detalleFotoIndex = 0;
}

function cambiarFoto(el) {
  var img = el.querySelector("img");
  if (!img) return;
  var mainImg = document.getElementById("main-image");
  if (!mainImg) return;
  var src = img.src;
  mainImg.style.opacity = "0";
  setTimeout(function () {
    mainImg.src = src;
    mainImg.style.opacity = "1";
  }, 300);
  document.querySelectorAll("#thumbnails button").forEach(function (btn) {
    btn.classList.remove("ring-2", "ring-electric-blue", "opacity-100");
    btn.classList.add("opacity-60");
  });
  el.classList.add("ring-2", "ring-electric-blue", "opacity-100");
  el.classList.remove("opacity-60");
  var thumbs = document.querySelectorAll("#thumbnails button");
  for (var i = 0; i < thumbs.length; i++) {
    if (thumbs[i] === el) {
      window.detalleFotoIndex = i;
      break;
    }
  }
}

function navegarFoto(direccion) {
  var fotos = window.detalleFotos || [];
  if (fotos.length === 0) return;
  var idx = window.detalleFotoIndex || 0;
  idx = (idx + direccion + fotos.length) % fotos.length;
  window.detalleFotoIndex = idx;
  var mainImg = document.getElementById("main-image");
  if (!mainImg) return;
  mainImg.style.opacity = "0";
  setTimeout(function () {
    mainImg.src = fotos[idx] || "https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80";
    mainImg.style.opacity = "1";
  }, 300);
  var thumbs = document.querySelectorAll("#thumbnails button");
  thumbs.forEach(function (btn, i) {
    btn.classList.remove("ring-2", "ring-electric-blue", "opacity-100");
    btn.classList.add("opacity-60");
    if (i === idx) {
      btn.classList.add("ring-2", "ring-electric-blue", "opacity-100");
      btn.classList.remove("opacity-60");
      btn.scrollIntoView({ behavior: "smooth", block: "nearest", inline: "center" });
    }
  });
}

function poblarMarcas(docs) {
  var select = document.getElementById("filter-marca");
  if (!select) return;
  var marcas = {};
  docs.forEach(function (v) {
    var m = v.data().marca;
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
    });
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
