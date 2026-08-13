function cargarDetalle() {
  var id = window.location.hash.replace("#", "");
  if (!id) {
    document.getElementById("detalle-content").innerHTML =
      '<div class="text-center py-20"><p class="text-on-surface-variant">No se especificó un vehículo.</p><a class="text-electric-blue mt-4 inline-block" href="index.html">Volver al catálogo</a></div>';
    return;
  }
  var detalleContent = document.getElementById("detalle-content");
  detalleContent.innerHTML =
    '<div class="text-center py-20"><div class="inline-block w-8 h-8 border-2 border-electric-blue border-t-transparent rounded-full animate-spin"></div><p class="text-on-surface-variant font-body-sm mt-4">Cargando vehículo...</p></div>';
  var timeout = setTimeout(function () {
    detalleContent.innerHTML =
      '<div class="text-center py-20"><span class="material-symbols-outlined text-6xl text-error block mb-4">error</span><p class="text-on-surface-variant mb-4">La carga está tomando más de lo esperado.</p><button class="bg-electric-blue text-white px-6 py-2 rounded-lg font-bold text-sm cursor-pointer" onclick="cargarDetalle()">Reintentar</button></div>';
  }, 15000);
  supabase.from("vehiculos")
    .select("*")
    .eq("id", id)
    .single()
    .then(function (result) {
      clearTimeout(timeout);
      if (result.error) {
        if (result.error.code === "PGRST116") {
var mensajeWhatsApp = "Hola, estoy interesado en el vehículo " + (data.marca || "") + " " + (data.linea || "") + (data.version ? " " + data.version : "") + " (" + (data.anio || "") + ") por valor de $" + (data.precio_venta != null ? data.precio_venta.toLocaleString("es-CO") : "") + ". ¿Está disponible?";
  var waUrl = whatsappUrl(mensajeWhatsApp);
  document.getElementById("detalle-content").innerHTML =
            '<div class="text-center py-20"><span class="material-symbols-outlined text-6xl text-error block mb-4">search_off</span><p class="text-on-surface-variant">Vehículo no encontrado.</p><a class="text-electric-blue mt-4 inline-block" href="index.html">Volver al catálogo</a></div>';
          return;
        }
        throw result.error;
      }
      if (!result.data) {
        document.getElementById("detalle-content").innerHTML =
          '<div class="text-center py-20"><span class="material-symbols-outlined text-6xl text-error block mb-4">search_off</span><p class="text-on-surface-variant">Vehículo no encontrado.</p><a class="text-electric-blue mt-4 inline-block" href="index.html">Volver al catálogo</a></div>';
        return;
      }
      renderizarDetalle(result.data);
    })
    .catch(function (error) {
      clearTimeout(timeout);
      console.error("Error al cargar detalle:", error);
      document.getElementById("detalle-content").innerHTML =
        '<div class="text-center py-20"><span class="material-symbols-outlined text-6xl text-error block mb-4">error</span><p class="text-on-surface-variant">Error al cargar el vehículo.</p><a class="text-electric-blue mt-4 inline-block" href="index.html">Volver al catálogo</a></div>';
    });
}

function renderizarDetalle(vehiculo) {
  var data = vehiculo;
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
        '<img class="w-full h-full object-cover" src="' + f + '" loading="lazy" onerror="this.onerror=null;this.src=\'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80\'"/>' +
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
          '<img alt="' + data.marca + " " + data.linea + '" class="w-full h-full object-cover transition-all duration-700" id="main-image" src="' + fotoPrincipal + '" onerror="this.onerror=null;this.src=\'https://images.unsplash.com/photo-1583121274602-3e2820c69888?w=800&q=80\'"/>' +
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
            '<span class="text-electric-blue font-price-display text-price-display">' + formatearCOP(data.precio_venta) + "</span>" +
            '<span class="text-on-surface-variant font-body-sm text-body-sm"></span>' +
          "</div>" +
          '<div class="grid grid-cols-2 gap-4">' +
            '<button class="w-full py-4 bg-primary-container text-on-primary-container rounded-lg font-bold flex items-center justify-center gap-2 transition-transform active:scale-95 glow-hover" onclick="window.open(\'' + waUrl + '\',\'_blank\')">' +
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
  var thumbs = document.querySelectorAll("#thumbnails button");
  thumbs.forEach(function (btn) {
    btn.classList.remove("ring-2", "ring-electric-blue", "opacity-100");
    btn.classList.add("opacity-60");
  });
  el.classList.add("ring-2", "ring-electric-blue", "opacity-100");
  el.classList.remove("opacity-60");
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
