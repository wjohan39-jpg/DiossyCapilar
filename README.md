# 🌿 Diossy Capilar

> Marca colombiana de productos capilares naturales — Medellín, Antioquia, 2025

![Estado](https://img.shields.io/badge/estado-en%20desarrollo-yellow)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Node.js](https://img.shields.io/badge/Node.js-%3E%3D18-brightgreen?logo=node.js)
![SQLite](https://img.shields.io/badge/SQLite-003B57?logo=sqlite&logoColor=white)
![INVIMA](https://img.shields.io/badge/Registro-INVIMA-2ecc71)

---

## 📋 Descripción

Sitio web completo para **Diossy Capilar**, emprendimiento colombiano de cuidado capilar natural fundado por dos mujeres del Suroeste Antioqueño. Todos los productos cuentan con Registro INVIMA y Cámara de Comercio. La web presenta el catálogo, precios, galería multimedia, formulario de contacto vía WhatsApp y un backend con sistema de pedidos y panel de administración.

---

## 🗂️ Estructura del proyecto

```
diossy-capilar/
│
├── 📄 inicio.html              # Página principal (SPA)
│
├── 📁 css/
│   └── diossy.css              # Estilos globales — variables, componentes, responsive
│
├── 📁 js/
│   └── diossy.js               # Lógica del frontend
│
├── 📁 multimedia/              # Imágenes, videos y logo
│   ├── logo-removebg-preview.png
│   ├── fotoHero2.png
│   ├── shampoo banano.png
│   ├── shampoo zanahoria.png
│   ├── shampoobiotina.png
│   ├── shampoocebolla.png
│   ├── locionromero.png
│   ├── BananoFondo.jpg
│   ├── ZanahoriaFondo.jpg
│   ├── BiotinaFondo.jpg
│   ├── CebollaFondo.jpg
│   ├── RomeroFondo.jpg
│   ├── Modelo1.jpg
│   ├── Modelo2.jpeg
│   ├── Diossy_Capilar_Video1.mp4
│   ├── video_shampo_cebolla.mp4
│   ├── video_shampoo_Zanahoria.mp4
│   ├── DiossyLineaCapilar.mp4
│   ├── videoGir.mp4
│   ├── VideoDiossy.mp4
│   └── VideoArrastre.mp4
│
└── 📁 backend/                 # API REST (en desarrollo)
    ├── server/index.js
    ├── routes/
    │   ├── auth.js             # Registro, login, perfil
    │   ├── products.js         # Catálogo y CRUD de productos
    │   └── orders.js           # Pedidos y estadísticas
    ├── middleware/auth.js       # JWT + roles
    ├── database/
    │   ├── init.js             # Inicialización y seed
    │   └── db.js               # Conexión singleton SQLite
    ├── .env.example
    └── package.json
```

---

## 🛍️ Catálogo de productos

| Producto | Ingredientes clave | Kit | Individual |
|---|---|---|---|
| 🍌 Shampoo y Tratamiento de Banano | Banano, L-Arginina, Keratina, Cacao, Coco | $65.000 | Shampoo $30.000 / Tratamiento $35.000 |
| 🥕 Shampoo y Tratamiento de Zanahoria | Zanahoria, Argán, Guaraná, Biotina | $60.000 | $30.000 c/u |
| ✨ Shampoo y Tratamiento de Biotina | Cannabis, Biotina, Arroz, Fitoestimulinas | $60.000 | $30.000 c/u |
| 🧅 Shampoo y Tratamiento de Cebolla | Azufre natural, Vitamina C, Aceites naturales | $60.000 | $30.000 c/u |
| 🌿 Loción de Romero | Romero, Quina, Ortiga, Biotina, B5, Ginko Biloba | — | $25.000 |

> Envíos a toda Colombia · Productos desde $25.000

---

## ✅ Estado del desarrollo

### Frontend — Completado

- [x] **`inicio.html`** — página principal SPA con todas las secciones
- [x] **`css/diossy.css`** — sistema de variables CSS, modo oscuro, responsive completo
- [x] **`js/diossy.js`** — toda la lógica interactiva en JavaScript vanilla

**Secciones implementadas:**

| Sección | Descripción |
|---|---|
| Loader | Pantalla de carga animada con logo y spinner |
| Header | Navegación sticky con logo, links, botones y toggle modo oscuro |
| Hero | Fondo con parallax (`background-attachment: fixed`), overlay oscuro y CTA |
| Estadísticas | Contadores animados con `IntersectionObserver` (500+ clientas, 9 productos, 100% INVIMA, 2 fundadoras) |
| Carrusel Productos | 5 slides con barras de beneficios animadas (Hidratación, Suavidad, Brillo, Crecimiento) y botón compartir |
| Carrusel Precios | 5 slides con precios kit/individual y link directo a WhatsApp por producto. Auto-avance cada 6s |
| Sección Marca | Misión, Visión, Objetivos, Valores y sellos (natural, cruelty-free, eco, INVIMA) |
| Testimonios | Grid 2 columnas con 4 reseñas reales de clientas |
| Galería | Carrusel con 7 videos MP4 + 2 fotos, pausa de video al cambiar slide y contador `X / 9` |
| CTA Final | Llamado a la acción centrado con links a productos y contacto |
| FAQ | Acordeón con 6 preguntas frecuentes, animado con `max-height` CSS |
| Redes Sociales | Cards de Instagram y Facebook con gradientes reales + acceso directo a WhatsApp |
| Footer / Contacto | Info de la empresa + formulario que genera mensaje pre-cargado en WhatsApp |
| Chat burbuja | Se abre automáticamente a los 5s, se cierra a los 15s, reabre con clic |
| Toast | Notificación flotante reutilizable con ícono configurable |
| FAB flotantes | Botón WhatsApp (verde) + botón "volver arriba" (aparece al bajar 400px) |
| Modo oscuro | Toggle con persistencia en `localStorage`, paleta completa adaptada |

### Backend — En desarrollo

- [x] Base de datos SQLite — productos, kits, usuarios, pedidos, testimonios, galería, settings
- [x] Sistema de pedidos con link WhatsApp generado automáticamente
- [x] Autenticación JWT (registro, login, roles `admin` / `customer`)
- [x] API REST: productos, kits, categorías
- [x] API REST: pedidos, tracking, estadísticas del dashboard
- [ ] Panel de administración (UI)
- [ ] Subida de imágenes con multer
- [ ] Notificaciones de estado de pedido

---

## 🎨 Diseño

### Paleta de colores

| Variable CSS | Color | Uso principal |
|---|---|---|
| `--color-verde-oscuro` | `#1a4a2e` | Header, hero, footer, botones primarios |
| `--color-verde` | `#2ecc71` | Acentos, barras de beneficios, puntos activos |
| `--color-menta` | `#fdf0f5` | Fondo general de la página |
| `--color-uva` | `#c9a0dc` | Bordes decorativos, sección marca y precios |
| `--color-zanahoria` | `#f4a261` | Acento secundario cálido |
| `--color-dorado` | `#ffe066` | Calificación de estrellas |

### Tipografía

- **Títulos:** `Playfair Display` (Google Fonts) — serif elegante con variante itálica
- **Cuerpo:** `Nunito` (Google Fonts) — sans-serif redondeada y legible

### Responsive

| Breakpoint | Cambios principales |
|---|---|
| `≤ 1024px` | Sellos y valores en 2 columnas, encabezados en 1 columna |
| `≤ 768px` | Header plegado, carruseles apilados verticalmente, grids a 1 columna |
| `≤ 480px` | Sellos en 1 columna, navegación ultra-compacta |

---

## 🚀 Cómo abrir el frontend

No requiere instalación. Solo servir los archivos estáticamente:

```bash
# Python
python -m http.server 8080

# Node.js
npx serve .

# VS Code — extensión "Live Server" → botón "Go Live"
```

Luego abrir `http://localhost:8080/inicio.html`

---

## ⚙️ Backend — Instalación

### Requisitos

- Node.js >= 18
- npm >= 9

```bash
# 1. Entrar a la carpeta
cd backend

# 2. Instalar dependencias
npm install

# 3. Configurar entorno
cp .env.example .env
# Editar .env con tus valores

# 4. Crear base de datos con datos reales
npm run init-db

# 5. Iniciar servidor
npm run dev   # desarrollo
npm start     # producción
```

API disponible en `http://localhost:3000`

---

## 📡 API REST

### Autenticación — `/api/auth`

| Método | Ruta | Descripción |
|---|---|---|
| `POST` | `/register` | Registrar cliente |
| `POST` | `/login` | Iniciar sesión → devuelve JWT |
| `GET` | `/me` | Perfil del usuario autenticado |
| `PUT` | `/profile` | Actualizar nombre y teléfono |
| `PUT` | `/change-password` | Cambiar contraseña |

### Productos — `/api/products`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `GET` | `/` | No | Listar productos activos (`?category`, `?featured`, `?search`) |
| `GET` | `/kits` | No | Kits con sus productos incluidos |
| `GET` | `/categories` | No | Categorías con conteo |
| `GET` | `/:slug` | No | Detalle de un producto |
| `GET` | `/admin/all` | Admin | Todos los productos incluyendo inactivos |
| `POST` | `/` | Admin | Crear producto |
| `PUT` | `/:id` | Admin | Editar producto |
| `DELETE` | `/:id` | Admin | Desactivar (soft delete) |

### Pedidos — `/api/orders`

| Método | Ruta | Auth | Descripción |
|---|---|---|---|
| `POST` | `/` | No | Crear pedido → devuelve link WhatsApp listo |
| `GET` | `/track/:numero` | No | Rastrear pedido por número |
| `GET` | `/my` | Cliente | Mis pedidos |
| `GET` | `/` | Admin | Todos los pedidos (paginados) |
| `GET` | `/:id` | Admin | Detalle de pedido con ítems |
| `PUT` | `/:id/status` | Admin | Cambiar estado del pedido |
| `GET` | `/admin/stats` | Admin | Estadísticas: ingresos, top productos, pedidos recientes |

### Flujo de estados

```
pendiente → confirmado → preparando → enviado → entregado
                                             ↘ cancelado
```

---

## 💬 Integración WhatsApp

Cada producto en el carrusel de precios tiene un botón que abre WhatsApp con un mensaje pre-cargado específico para ese producto. El formulario de contacto construye el mensaje con nombre, correo y consulta del usuario. El backend genera mensajes similares al confirmar pedidos vía API.

**Número:** `+57 312 778 6165`

---

## 🛠️ Stack tecnológico

**Frontend**
- HTML5 semántico (`<article>`, `<section>`, `<figure>`, `<blockquote>`, `<address>`)
- CSS3 con variables nativas, Grid, Flexbox, animaciones `@keyframes` y `@media` queries
- JavaScript ES6+ vanilla — sin frameworks ni dependencias externas
- APIs del navegador: `IntersectionObserver`, `Web Share API`, `Clipboard API`, `localStorage`
- Google Fonts con `preconnect` para carga optimizada

**Backend**
- Node.js + Express
- SQLite con `better-sqlite3` (WAL mode, foreign keys)
- `jsonwebtoken` — autenticación JWT
- `bcryptjs` — hash de contraseñas
- `multer` — subida de imágenes (próximamente)
- `express-rate-limit` — protección de endpoints

---

## 🌐 Redes sociales

| Red | Enlace |
|---|---|
| 📸 Instagram | [@diossycapilar](https://www.instagram.com/diossycapilar?igsh=azJwajNycjkzNHJj) |
| 👍 Facebook | [Diossy Capilar](https://www.facebook.com/share/1HSxqC48Gy/) |
| 💬 WhatsApp | [+57 312 778 6165](https://wa.me/573127786165) |

---

## 📞 Contacto del negocio

**Diossy Capilar** — Medellín, Antioquia, Colombia  
📱 [+57 312 778 6165](https://wa.me/573127786165)  
🌿 Productos 100% naturales · Registro INVIMA · Libre de crueldad animal

---

*© 2025–2026 Diossy Capilar. Todos los derechos reservados.*  
*Desarrollado por [wjohan39-jpg](https://github.com/wjohan39-jpg)*
