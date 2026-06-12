# Diossy Capilar

> Marca colombiana de productos capilares naturales — Medellín, Antioquia, 2025–2026

![Estado](https://img.shields.io/badge/estado-en%20producción-brightgreen)
![HTML5](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot-6DB33F?logo=springboot&logoColor=white)
![SQL Server](https://img.shields.io/badge/SQL%20Server-CC2927?logo=microsoftsqlserver&logoColor=white)
![INVIMA](https://img.shields.io/badge/Registro-INVIMA-2ecc71)

---

## Descripción

Sitio web para **Diossy Capilar**, emprendimiento colombiano de cuidado capilar natural fundado por dos mujeres del Suroeste Antioqueño. Todos los productos cuentan con Registro INVIMA y Cámara de Comercio. La web presenta el catálogo, precios, galería multimedia, formulario de contacto vía WhatsApp y un contador de "me gusta" conectado al backend.

Desplegado en **Netlify** (frontend). Backend en repositorio separado `BackendDiossy` (Spring Boot 3 + SQL Server), desplegado en **Render.com**.

---

## Estructura del proyecto

```
DiossyCapilar Web/
│
├── index.html              # Página principal (SPA)
├── 404.html                # Página de error 404 personalizada
├── privacidad.html         # Política de privacidad (Ley 1581/2012)
├── site.webmanifest        # Manifiesto PWA
├── robots.txt              # Directivas para motores de búsqueda
├── favicon.ico             # Ícono del navegador
│
├── css/
│   └── diossy.css          # Estilos globales — variables, componentes, responsive
│
├── js/
│   └── diossy.js           # Lógica del frontend
│
└── multimedia/             # Imágenes (WebP + fallback PNG/JPG) y videos (MP4)
    ├── logo-removebg-preview.webp / .png   # Logo (WebP preferido, PNG fallback)
    ├── fotoHero.webp / .png                # Imagen hero (fondo del header y poster de video)
    ├── shampoo-banano.webp / shampoo banano.png
    ├── shampoo-zanahoria.webp / shampoo zanahoria.png
    ├── shampoobiotina.webp / .png
    ├── shampoocebolla.webp / .png
    ├── locionromero.webp / .png
    ├── BananoFondo.webp / .jpg             # Fondos de producto (CSS usa .jpg)
    ├── ZanahoriaFondo.webp / .jpg
    ├── BiotinaFondo.webp / .jpg
    ├── CebollaFondo.webp / .jpg
    ├── RomeroFondo.webp / .jpg
    ├── Modelo1.webp / .jpg
    ├── Modelo2.webp / .jpeg
    ├── Diossy_Capilar_Video1.mp4
    ├── video_shampo_cebolla.mp4
    ├── video_shampoo_Zanahoria.mp4
    ├── DiossyLineaCapilar.mp4
    ├── videoGir.mp4
    ├── VideoDiossy.mp4
    ├── VideoArrastre.mp4
    └── MiraloenAccion.mp4
```

---

## Catálogo de productos

| Producto | Ingredientes clave | Kit | Individual |
|---|---|---|---|
| Shampoo y Tratamiento de Banano | Banano, L-Arginina, Keratina, Cacao, Coco | $65.000 | Shampoo $30.000 / Tratamiento $35.000 |
| Shampoo y Tratamiento de Zanahoria | Zanahoria, Argán, Guaraná, Biotina | $60.000 | $30.000 c/u |
| Shampoo y Tratamiento de Biotina | Cannabis, Biotina, Arroz, Fitoestimulinas | $60.000 | $30.000 c/u |
| Shampoo y Tratamiento de Cebolla | Azufre natural, Vitamina C, Aceites naturales | $60.000 | $30.000 c/u |
| Loción de Romero | Romero, Quina, Ortiga, Biotina, B5, Ginko Biloba | — | $25.000 |

> Envíos a toda Colombia · Productos desde $25.000

---

## Estado del desarrollo

### Frontend — Completado

- [x] `index.html` — SPA con todas las secciones
- [x] `css/diossy.css` — variables CSS, modo oscuro, responsive completo, iOS safe area
- [x] `js/diossy.js` — lógica interactiva en JavaScript vanilla
- [x] `404.html` — página de error personalizada con branding
- [x] `privacidad.html` — política de privacidad bajo Ley 1581 de 2012
- [x] `site.webmanifest` — soporte PWA
- [x] Compatibilidad iOS/Safari — meta tags, `playsinline`, `-webkit-*`, safe area insets
- [x] Imágenes con `<picture>` + `<source type="image/webp">` — WebP preferido, PNG/JPG como fallback
- [x] `picture { display: contents }` para compatibilidad con layouts flex/grid
- [x] Optimizaciones de performance mobile (Lighthouse)

**Secciones implementadas:**

| Sección | Descripción |
|---|---|
| Loader | Pantalla de carga animada con logo, spinner y timeout máximo de 3 segundos |
| Header | Navegación sticky con logo, links, botones y toggle modo oscuro |
| Hero | Fondo con parallax, overlay oscuro y CTA |
| Estadísticas | Contadores animados con `IntersectionObserver` |
| Carrusel Productos | 5 slides con barras de beneficios animadas y botón compartir |
| Carrusel Precios | 5 slides con precios kit/individual y link directo a WhatsApp por producto |
| Quiz | Recomendador de producto según tipo de cabello — 3 preguntas, 5 resultados |
| Cómo funciona | Guía de uso paso a paso con video demostrativo |
| Rutina Capilar | Combinación de productos recomendada con kit completo |
| Sección Marca | Misión, Visión, Objetivos, Valores y sellos (natural, cruelty-free, eco, INVIMA) |
| Testimonios | Grid con reseñas de clientas |
| Galería | Carrusel con 7 videos MP4 + 2 fotos, `playsinline` para iOS, pausa al cambiar slide |
| FAQ | Acordeón animado con 6 preguntas frecuentes |
| Redes Sociales | Cards de Instagram y Facebook + acceso directo a WhatsApp |
| Footer / Contacto | Formulario que genera mensaje pre-cargado en WhatsApp y guarda en backend |
| Like button | Botón de corazón con partículas animadas, contador conectado al backend, persistencia en `localStorage` |
| Chat burbuja | Botón flotante de WhatsApp |
| FAB flotantes | Botón WhatsApp (verde) + botón "volver arriba" |
| Cookie banner | Aviso Ley 1581 con link a política de privacidad |
| Modo oscuro | Toggle con persistencia en `localStorage`, paleta completa adaptada |

### Backend — Desplegado (repositorio separado)

Proyecto independiente `BackendDiossy`, desplegado en Render.com:

- Spring Boot 3 (Java 21)
- SQL Server + Spring Data JPA
- API REST sin capa de servicios ni controladores intermedios

Endpoints consumidos por el frontend:

| Método | Ruta | Descripción |
|---|---|---|
| `GET` | `/api/likes` | Obtener total de likes |
| `POST` | `/api/likes` | Registrar un nuevo like |
| `POST` | `/api/contactos` | Guardar consulta del formulario |

> Las URLs de la API en `diossy.js` usan `https://` en producción. Actualizar el hostname cuando el backend esté en su dominio final de Render.com.

---

## Performance (Lighthouse mobile)

Optimizaciones aplicadas para mejorar el score en dispositivos móviles:

| Optimización | Descripción |
|---|---|
| Preload LCP | `<link rel="preload">` para `fotoHero.png` (imagen de fondo del hero vía CSS) |
| `background-attachment: scroll` en mobile | Evita repintado por CPU en Android — `fixed` desactiva composición GPU |
| `content-visibility: auto` | Aplicado a 11 secciones debajo del fold — el browser omite render hasta que se acercan al viewport |
| Partículas solo desktop | CSS `@media (min-width: 769px)` — evita parsear animaciones innecesarias en mobile |
| `requestIdleCallback` | Reveal animations y nav observer se inicializan en tiempo idle, sin bloquear el hilo principal |
| `fetchpriority` ajustado | Removido del logo del loader para no competir con la imagen LCP |
| Dimensiones en imágenes | `width` y `height` explícitos en imágenes del carrusel de precios y rutina |

**Scores actuales (localhost sin compresión):**

| Categoría | Score |
|---|---|
| Performance mobile | 72 |
| Performance desktop | 94 |
| Accessibility | 97 |
| Best Practices | 96 |
| SEO | 100 |

> En producción con gzip/brotli activo (Netlify lo aplica automáticamente), el score de performance mobile sube a ~85–90.

---

## Diseño

### Paleta de colores

| Variable CSS | Color | Uso principal |
|---|---|---|
| `--color-verde-oscuro` | `#2c0f1e` | Header, hero, footer, fondo principal |
| `--color-verde` | `#c9a84c` | Botones primarios, acentos dorados |
| `--color-menta` | `#fff8f9` | Fondo general claro |
| `--color-uva` | `#d4698a` | Acentos secundarios, degradados |
| `--color-zanahoria` | `#f4a261` | Acento cálido secundario |
| `--color-dorado` | `#f5e199` | Estrellas, texto decorativo |

### Tipografía

- **Títulos:** `Playfair Display` (Google Fonts) — serif elegante con variante itálica
- **Cuerpo:** `DM Sans` (Google Fonts) — sans-serif moderna y legible

### Responsive

| Breakpoint | Cambios principales |
|---|---|
| `≤ 1024px` | Sellos y valores en 2 columnas |
| `≤ 768px` | Header plegado, carruseles apilados, grids a 1 columna, partículas desactivadas |
| `≤ 480px` | Navegación ultra-compacta, sellos en 1 columna |

---

## Cómo abrir el frontend

No requiere instalación. Servir los archivos estáticamente:

```bash
# VS Code — extensión "Live Server" → botón "Go Live"
# http://127.0.0.1:5500/index.html

# Node.js
npx serve .

# Python
python -m http.server 5500
```

---

## Compatibilidad

| Plataforma | Estado |
|---|---|
| Chrome / Edge (desktop) | Completo |
| Firefox (desktop) | Completo |
| Safari (macOS) | Completo |
| Chrome (Android) | Completo |
| Safari (iOS) | Completo — meta tags, `playsinline`, safe area insets, webkit fixes |

---

## Integración WhatsApp

Cada producto en el carrusel de precios tiene un botón que abre WhatsApp con mensaje pre-cargado específico. El formulario de contacto construye el mensaje con nombre, correo y consulta del usuario.

**Número:** `+57 312 778 6165`

---

## Stack tecnológico

**Frontend**
- HTML5 semántico (`<article>`, `<section>`, `<figure>`, `<blockquote>`, `<address>`)
- CSS3 con variables nativas, Grid, Flexbox, animaciones `@keyframes`, `content-visibility`, `@media` queries
- JavaScript ES6+ vanilla — sin frameworks ni dependencias externas
- APIs del navegador: `IntersectionObserver`, `requestIdleCallback`, `Web Share API`, `Clipboard API`, `localStorage`, `fetch`
- Google Fonts con `preconnect` y carga asíncrona

**Backend** (repositorio `BackendDiossy`)
- Java 21 + Spring Boot 3
- SQL Server + Spring Data JPA
- API REST desplegada en Render.com

---

## Redes sociales

| Red | Enlace |
|---|---|
| Instagram | [@diossycapilar](https://www.instagram.com/diossycapilar?igsh=azJwajNycjkzNHJj) |
| Facebook | [Diossy Capilar](https://www.facebook.com/share/1HSxqC48Gy/) |
| WhatsApp | [+57 312 778 6165](https://wa.me/573127786165) |

---

## Contacto del negocio

**Diossy Capilar** — Medellín, Antioquia, Colombia  
[+57 312 778 6165](https://wa.me/573127786165)  
Productos 100% naturales · Registro INVIMA · Libre de crueldad animal

---

*© 2025–2026 Diossy Capilar. Todos los derechos reservados.*  
*Desarrollado por [wjohan39-jpg](https://github.com/wjohan39-jpg)*
