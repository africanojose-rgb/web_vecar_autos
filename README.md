# Vecar Autos — Catálogo Web

Sitio web para la exhibición y venta de vehículos de lujo y alto rendimiento. Catálogo dinámico conectado a Firebase Firestore con actualización en tiempo real.

## Características

- Catálogo de vehículos en tiempo real desde Firebase Firestore
- Filtros por marca, transmisión y rango de precio
- Vista detalle con galería de imágenes, especificaciones técnicas y descripción
- Botón de WhatsApp directo por vehículo
- Enlace a Google Maps con ubicación del showroom
- Redes sociales: Instagram y TikTok
- Diseño oscuro premium con Tailwind CSS
- Totalmente responsive

## Tecnologías

- **HTML5** + **CSS3** (Tailwind CSS vía CDN)
- **JavaScript** (vanilla)
- **Firebase Firestore** — base de datos en tiempo real
- **Python HTTP Server** — servidor local para desarrollo

## Requisitos

- Python 3
- Navegador web moderno
- Cuenta de Firebase con Firestore habilitado

## Ejecutar localmente

```bash
cd catalogo
python3 -m http.server 8080
```

Abrir en el navegador: `http://localhost:8080`

## Estructura del proyecto

```
web2/
├── catalogo/
│   ├── index.html          → Página principal (listado de vehículos)
│   ├── detalle.html        → Página de detalle del vehículo
│   ├── app/
│   │   └── main.js         → Lógica Firebase, filtros, renderizado
│   └── styles/
│       └── main.css        → Estilos personalizados
├── stitch_vecar_autos_premium_showroom_WEB/
│   └── ...                 → Diseños originales (referencia)
├── README.md
└── requirements.txt
```

## Firebase

### Reglas de seguridad (Firestore)

```
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /vehiculos/{vehiculosId} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### Índice compuesto requerido

| Campo | Dirección |
|---|---|
| `visibleWeb` | Ascendente |
| `createdAt` | Descendente |

Crear desde: [Firebase Console > Firestore > Índices](https://console.firebase.google.com/project/vercar-autos/firestore/indexes)

## Estructura del documento en Firestore

| Campo | Tipo | Descripción |
|---|---|---|
| `marca` | string | Ej: "audi" |
| `linea` | string | Ej: "Q5" |
| `version` | string | Ej: "HYBRIDA" |
| `anio` | int | Ej: 2023 |
| `precioVenta` | int | Precio en COP |
| `kilometraje` | int | Kilometraje |
| `transmision` | string | "AT" o "MC" |
| `color` | string | Color exterior |
| `cilindraje` | string | Ej: "2.0" |
| `estado` | string | DISPONIBLE, SEPARADO, VENDIDO, ALISTAMIENTO |
| `descripcion` | string | Descripción del vehículo |
| `fotos` | array | URLs de imágenes |
| `visibleWeb` | boolean | true = visible en catálogo |
| `createdAt` | timestamp | Fecha de creación |
| `placa` | string | Placa del vehículo |

## Despliegue

### Firebase Hosting

```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Directorio público: catalogo
firebase deploy
```

### Netlify

Arrastrar la carpeta `catalogo/` a [netlify.com](https://netlify.com)

## Contacto

- **Dirección:** Cl. 129 #53a31, Bogotá
- **WhatsApp:** [Enlace directo](https://wa.me/57XXXXXXXXX)
- **Instagram:** [@vecarautos](https://www.instagram.com/vecarautos)
- **TikTok:** [@vecar.autos](https://www.tiktok.com/@vecar.autos)

## Licencia

Uso interno — Vecar Autos
# web_vecar_autos
