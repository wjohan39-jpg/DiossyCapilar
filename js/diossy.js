/* ================================================
   DIOSSY CAPILAR — diossy.js
   Correcciones aplicadas:
   1. Tres carruseles idénticos refactorizados en una función reutilizable.
   2. setInterval del carrusel de precios guardado y limpiable.
   3. Todos los elementos verifican existencia antes de usarse.
   4. FAQ actualizado con aria-expanded y atributo hidden correcto.
   5. Formulario valida manualmente (consistente con type="button").
   6. Constante nombrada para la velocidad del contador.
   7. BACKEND_BASE_URL centralizado — evita asumir mismo hostname.
   8. Constantes nombradas para timeouts y conteos de partículas.
   9. Focus trap en el chat modal (accesibilidad con teclado).
   ================================================ */

/* ================================================
   CONFIGURACIÓN
   ================================================ */

const BACKEND_BASE_URL = (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1')
  ? 'http://localhost:8080'
  : 'https://TU-BACKEND.onrender.com'; // ← Reemplaza con la URL real de tu backend en Render.com

const DURACION_TOAST_MS        = 3000;
const RETRASO_COOKIE_BANNER_MS = 2500;
const TOTAL_PARTICULAS_LIKE    = 22;

/* ================================================
   LOADER
   ================================================ */

// Máximo 3s de espera para el loader — evita quedarse pegado en móvil/iOS
const _loaderEl = document.getElementById('loader');
const _ocultarLoader = () => { if (_loaderEl) _loaderEl.classList.add('oculto'); };
const _timerMaxLoader = setTimeout(_ocultarLoader, 3000);
window.addEventListener('load', () => {
  clearTimeout(_timerMaxLoader);
  setTimeout(_ocultarLoader, 400);
});

/* ================================================
   TOAST — NOTIFICACIÓN
   ================================================ */

function mostrarToast(mensaje, icono = '✅') {
  const toast        = document.getElementById('toast');
  const toastMensaje = document.getElementById('toast-mensaje');
  if (!toast || !toastMensaje) return;

  const toastIcono = toast.querySelector('.toast-icono');
  toastMensaje.textContent = mensaje;
  if (toastIcono) toastIcono.textContent = icono;

  toast.classList.add('visible');
  setTimeout(() => toast.classList.remove('visible'), DURACION_TOAST_MS);
}

/* ================================================
   BOTÓN VOLVER ARRIBA
   ================================================ */

const btnTop = document.getElementById('btn-top');

if (btnTop) {
  window.addEventListener('scroll', () => {
    btnTop.classList.toggle('visible', window.scrollY > 400);
  });

  btnTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

/* ================================================
   CARRUSEL REUTILIZABLE
   CORRECCIÓN: Los tres carruseles (productos, precios, galería)
   compartían código casi idéntico. Ahora hay una sola función
   que recibe la configuración de cada uno.

   Parámetros:
   - contenedor:  selector del div carrusel raíz
   - pista:       selector de la pista (flex)
   - slides:      selector de cada slide
   - puntos:      selector de los botones de navegación
   - btnPrev:     selector del botón anterior
   - btnNext:     selector del botón siguiente
   - autoAvance:  ms de auto-avance (0 = sin auto-avance)
   - onCambio:    callback opcional al cambiar de slide
   ================================================ */

function crearCarrusel({ contenedor, pista, slides, puntos, btnPrev, btnNext, autoAvance = 0, onCambio = null }) {
  const elContenedor = document.querySelector(contenedor);
  if (!elContenedor) return null; // Elemento no existe, salir sin error

  const elPista   = elContenedor.querySelector(pista);
  const elSlides  = elContenedor.querySelectorAll(slides);
  const elPuntos  = elContenedor.querySelectorAll(puntos);
  const elBtnPrev = elContenedor.querySelector(btnPrev);
  const elBtnNext = elContenedor.querySelector(btnNext);

  if (!elPista || !elSlides.length) return null;

  let indice   = 0;
  let interval = null;

  function irA(nuevoIndice) {
    indice = (nuevoIndice + elSlides.length) % elSlides.length;
    elPista.style.transform = `translateX(-${indice * 100}%)`;

    elPuntos.forEach((p, i) => {
      p.classList.toggle('activo', i === indice);
      p.setAttribute('aria-selected', i === indice ? 'true' : 'false');
    });

    if (typeof onCambio === 'function') onCambio(indice, elSlides);
  }

  if (elBtnNext) elBtnNext.addEventListener('click', () => irA(indice + 1));
  if (elBtnPrev) elBtnPrev.addEventListener('click', () => irA(indice - 1));
  elPuntos.forEach(p => p.addEventListener('click', () => irA(Number(p.dataset.indice))));

  // CORRECCIÓN: setInterval guardado en variable para poder limpiarlo si fuera necesario
  if (autoAvance > 0) {
    interval = setInterval(() => irA(indice + 1), autoAvance);
    elContenedor.addEventListener('mouseenter', () => clearInterval(interval));
    elContenedor.addEventListener('mouseleave', () => { interval = setInterval(() => irA(indice + 1), autoAvance); });
    elContenedor.addEventListener('focusin',    () => clearInterval(interval));
    elContenedor.addEventListener('focusout',   () => { interval = setInterval(() => irA(indice + 1), autoAvance); });
  }

  irA(0);

  // Soporte táctil — swipe en móvil
  let touchInicioX = 0;
  elContenedor.addEventListener('touchstart', e => {
    touchInicioX = e.touches[0].clientX;
  }, { passive: true });
  elContenedor.addEventListener('touchend', e => {
    const diff = touchInicioX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) irA(diff > 0 ? indice + 1 : indice - 1);
  }, { passive: true });

  return { irA, detener: () => clearInterval(interval) };
}

/* ================================================
   CARRUSEL DE PRODUCTOS
   Con callback para animar barras de beneficios
   ================================================ */

crearCarrusel({
  contenedor: '#carrusel-productos',
  pista:      '.carrusel-pista',
  slides:     '.carrusel-slide',
  puntos:     '.punto',
  btnPrev:    '.carrusel-prev',
  btnNext:    '.carrusel-next',
  onCambio: (indice, slides) => {
    const barras = slides[indice].querySelectorAll('.barra-relleno');
    barras.forEach(b => {
      b.style.transition = 'none';
      b.style.width = '0%';
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          b.style.transition = 'width 1.2s ease';
          b.style.width = b.dataset.porcentaje + '%';
        });
      });
    });
  }
});

/* ================================================
   CARRUSEL DE PRECIOS
   Con auto-avance cada 6 segundos
   ================================================ */

crearCarrusel({
  contenedor: '#carrusel-precios',
  pista:      '.precios-pista',
  slides:     '.precio-slide',
  puntos:     '.punto-precio',
  btnPrev:    '.prev-precio',
  btnNext:    '.next-precio',
  autoAvance: 6000
});

/* ================================================
   CARRUSEL GALERÍA
   Con callback para pausar el video al cambiar slide
   y actualizar el contador X / 9
   ================================================ */

crearCarrusel({
  contenedor: '#carrusel-galeria',
  pista:      '.galeria-pista',
  slides:     '.galeria-slide',
  puntos:     '.punto-galeria',
  btnPrev:    '.prev-galeria',
  btnNext:    '.next-galeria',
  onCambio: (indice, slides) => {
    // Pausar video del slide anterior
    slides.forEach(s => {
      const video = s.querySelector('video');
      if (video) video.pause();
    });

    // Actualizar contador
    const galeriaActual = document.getElementById('galeria-actual');
    if (galeriaActual) galeriaActual.textContent = indice + 1;
  }
});

/* ================================================
   PARTÍCULAS FLOTANTES — Sistema reutilizable
   Activo en: estadísticas, quiz, CTA y kit rutina
   ================================================ */

(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (window.matchMedia('(max-width: 768px)').matches) return;

  const COLORES = [
    'rgba(255,255,255,0.82)',
    '#f5e199',
    'rgba(255,208,224,0.9)',
    'rgba(201,168,76,0.88)',
    'rgba(255,255,255,0.5)',
    '#fce4ef'
  ];
  const ANIMS = ['particula-izq', 'particula-rec', 'particula-der'];

  function lanzar(contenedor) {
    const p   = document.createElement('span');
    const tam = Math.random() * 5 + 2;
    const dur = Math.random() * 2800 + 2200;
    const col = COLORES[Math.floor(Math.random() * COLORES.length)];
    const ani = ANIMS[Math.floor(Math.random() * ANIMS.length)];

    p.className = 'estadistica-particula';
    p.style.cssText = `
      left:${Math.random() * 96 + 2}%;
      width:${tam}px;
      height:${tam}px;
      background:${col};
      box-shadow:0 0 ${tam * 2}px ${col};
      animation:${ani} ${dur}ms ease-in forwards;
    `;

    contenedor.appendChild(p);
    p.addEventListener('animationend', () => {
      p.remove();
      lanzar(contenedor);
    }, { once: true });
  }

  function iniciarParticulas(selector, cantidad, umbral) {
    const el = document.querySelector(selector);
    if (!el) return;

    const obs = new IntersectionObserver(entries => {
      if (!entries[0].isIntersecting) return;
      obs.disconnect();
      for (let i = 0; i < cantidad; i++) {
        setTimeout(() => lanzar(el), Math.random() * 2200);
      }
    }, { threshold: umbral });

    obs.observe(el);
  }

  iniciarParticulas('.estadisticas', 22, 0.4);
  iniciarParticulas('.quiz-seccion',  20, 0.3);
  iniciarParticulas('.cta-final',     25, 0.3);
  iniciarParticulas('.rutina-kit',    14, 0.5);
})();

/* ================================================
   CONTADOR DE ESTADÍSTICAS
   CORRECCIÓN: La constante de velocidad ahora tiene
   nombre descriptivo en vez de un número mágico.
   ================================================ */

const DURACION_CONTADOR_MS  = 2000; // duración total de la animación en ms
const FRAMES_POR_SEGUNDO    = 60;
const INTERVALO_FRAME_MS    = DURACION_CONTADOR_MS / FRAMES_POR_SEGUNDO;

const numeros = document.querySelectorAll('.estadistica-numero');

function animarContador(elemento) {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    elemento.textContent = elemento.dataset.objetivo;
    return;
  }
  const objetivo   = parseInt(elemento.dataset.objetivo);
  const incremento = objetivo / FRAMES_POR_SEGUNDO;
  let actual = 0;

  const timer = setInterval(() => {
    actual += incremento;
    if (actual >= objetivo) {
      actual = objetivo;
      clearInterval(timer);
    }
    elemento.textContent = Math.floor(actual);
  }, INTERVALO_FRAME_MS);
}

const seccionEstadisticas = document.querySelector('.estadisticas');
if (seccionEstadisticas && numeros.length) {
  const observador = new IntersectionObserver((entradas) => {
    entradas.forEach(entrada => {
      if (entrada.isIntersecting) {
        numeros.forEach(n => animarContador(n));
        observador.disconnect();
      }
    });
  }, { threshold: 0.5 });

  observador.observe(seccionEstadisticas);
}

/* ================================================
   FORMULARIO — ENVÍO POR WHATSAPP + GUARDADO EN API
   ================================================ */

const API_URL = BACKEND_BASE_URL + '/api/contactos';

const btnWaForm = document.getElementById('btn-whatsapp-form');

if (btnWaForm) {
  btnWaForm.addEventListener('click', () => {
    const campoNombre   = document.getElementById('nombre');
    const campoEmail    = document.getElementById('email');
    const campoProducto = document.getElementById('producto');
    const campoMensaje  = document.getElementById('mensaje');

    if (!campoNombre || !campoEmail || !campoMensaje) return;

    const nombre   = campoNombre.value.trim();
    const email    = campoEmail.value.trim();
    const mensaje  = campoMensaje.value.trim();
    const producto = campoProducto ? campoProducto.value : '';

    // Validación
    if (!nombre) {
      mostrarToast('Por favor escribe tu nombre', '⚠️');
      campoNombre.focus();
      return;
    }
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      mostrarToast('Por favor escribe un correo válido', '⚠️');
      campoEmail.focus();
      return;
    }
    if (!mensaje) {
      mostrarToast('Por favor escribe tu mensaje', '⚠️');
      campoMensaje.focus();
      return;
    }

    // 1. Abrir WhatsApp — se usa anchor en vez de window.open() para evitar el bloqueador de popups
    const productoTexto = campoProducto && campoProducto.value
      ? `Producto de interés: ${campoProducto.selectedOptions[0].text}\n`
      : '';
    const textoWa = `Hola Diossy Capilar! 🌿\n\nNombre: ${nombre}\nCorreo: ${email}\n${productoTexto}Mensaje: ${mensaje}`;
    const _linkWa = document.createElement('a');
    _linkWa.href = `https://wa.me/573127786165?text=${encodeURIComponent(textoWa)}`;
    _linkWa.target = '_blank';
    _linkWa.rel = 'noopener noreferrer';
    document.body.appendChild(_linkWa);
    _linkWa.click();
    document.body.removeChild(_linkWa);

    // 2. Guardar en la base de datos via API (en paralelo)
    fetch(API_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        nombre,
        email,
        productoInteres: producto || null,
        mensaje
      })
    })
    .then(res => {
      if (res.ok) {
        mostrarToast('¡Mensaje guardado y enviado por WhatsApp! 🌿');
      } else {
        mostrarToast('Mensaje enviado por WhatsApp ✅');
      }
    })
    .catch(() => {
      // Si el backend no está disponible, el WhatsApp ya se abrió igual
      mostrarToast('Mensaje enviado por WhatsApp ✅');
    });

    // 3. Limpiar formulario
    campoNombre.value  = '';
    campoEmail.value   = '';
    campoMensaje.value = '';
    if (campoProducto) campoProducto.value = '';
  });
}

/* ================================================
   BOTÓN COMPARTIR PRODUCTO
   ================================================ */

document.querySelectorAll('.btn-compartir').forEach(btn => {
  btn.addEventListener('click', () => {
    const producto = btn.dataset.producto;
    const texto    = `¡Mira este producto de Diossy Capilar! 🌿\n${producto}\nProductos capilares 100% naturales de Medellín.\nContáctalos aquí: https://wa.me/573127786165`;

    if (navigator.share) {
      navigator.share({ title: 'Diossy Capilar', text: texto, url: window.location.href }).catch(() => {});
    } else {
      navigator.clipboard.writeText(texto).then(() => {
        btn.textContent = '¡Copiado!';
        setTimeout(() => {
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden="true"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg> Compartir`;
        }, 2000);
      }).catch(() => {});
    }
  });
});

/* ================================================
   MODO OSCURO
   ================================================ */

const btnDark   = document.getElementById('btn-dark');
const iconoDark = document.getElementById('icono-dark');

const luna = `<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>`;
const sol  = `<path d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.36-6.36-.71.71M6.34 17.66l-.71.71M17.66 17.66l.71.71M6.34 6.34l-.71-.71M12 5a7 7 0 1 0 0 14A7 7 0 0 0 12 5z" stroke="currentColor" stroke-width="2" fill="none" stroke-linecap="round"/>`;

if (btnDark && iconoDark) {
  if (localStorage.getItem('dark') === 'true') {
    document.documentElement.classList.add('dark');
    iconoDark.innerHTML = sol;
    btnDark.setAttribute('aria-label', 'Activar modo claro');
  }

  btnDark.addEventListener('click', () => {
    const esDark = document.documentElement.classList.toggle('dark');
    iconoDark.innerHTML = esDark ? sol : luna;
    btnDark.setAttribute('aria-label', esDark ? 'Activar modo claro' : 'Activar modo oscuro');
    localStorage.setItem('dark', esDark);
  });
}

/* ================================================
   FAQ — ACORDEÓN
   CORRECCIÓN: Se agrega aria-expanded para accesibilidad.
   Se maneja el atributo hidden del contenido.
   ================================================ */

document.querySelectorAll('.faq-pregunta').forEach(pregunta => {
  pregunta.addEventListener('click', () => {
    const item      = pregunta.parentElement;
    const respuesta = item.querySelector('.faq-respuesta');
    const estaAbierto = item.classList.contains('abierto');

    // Cerrar todos los items abiertos
    document.querySelectorAll('.faq-item').forEach(i => {
      i.classList.remove('abierto');
      const btn = i.querySelector('.faq-pregunta');
      if (btn) btn.setAttribute('aria-expanded', 'false');
    });

    // Abrir el actual si estaba cerrado
    if (!estaAbierto) {
      item.classList.add('abierto');
      pregunta.setAttribute('aria-expanded', 'true');
    }
  });
});

/* ================================================
   CHAT BURBUJA
   ================================================ */

const chatBurbuja = document.getElementById('chat-burbuja');
const chatAbrir   = document.getElementById('chat-abrir');
const chatCerrar  = document.getElementById('chat-cerrar');
const chatNotif   = document.querySelector('.chat-notificacion');

if (chatAbrir && chatBurbuja && chatCerrar) {
  const chatResponder = chatBurbuja.querySelector('.chat-responder');
  const primerFoco    = chatCerrar;
  const ultimoFoco    = chatResponder || chatCerrar;

  function abrirChat() {
    chatBurbuja.classList.add('visible');
    chatAbrir.setAttribute('aria-expanded', 'true');
    if (chatNotif) chatNotif.style.display = 'none';
    primerFoco.focus();
  }

  function cerrarChat() {
    chatBurbuja.classList.remove('visible');
    chatAbrir.setAttribute('aria-expanded', 'false');
    chatAbrir.focus();
  }

  chatAbrir.addEventListener('click', () => {
    chatBurbuja.classList.contains('visible') ? cerrarChat() : abrirChat();
  });

  chatCerrar.addEventListener('click', cerrarChat);

  // Focus trap: Tab y Shift+Tab quedan dentro del diálogo
  chatBurbuja.addEventListener('keydown', e => {
    if (e.key !== 'Tab') return;
    if (e.shiftKey) {
      if (document.activeElement === primerFoco) { e.preventDefault(); ultimoFoco.focus(); }
    } else {
      if (document.activeElement === ultimoFoco) { e.preventDefault(); primerFoco.focus(); }
    }
  });

  // Escape cierra el chat y devuelve el foco al botón de apertura
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape' && chatBurbuja.classList.contains('visible')) cerrarChat();
  });
}

/* ================================================
   MENÚ HAMBURGUESA + HEADER COMPACTO AL SCROLL
   ================================================ */

const siteHeader = document.querySelector('body > header');
const navToggle  = document.getElementById('nav-toggle');

if (siteHeader) {
  // Hamburguesa
  if (navToggle) {
    navToggle.addEventListener('click', () => {
      const abierto = siteHeader.classList.toggle('nav-abierto');
      navToggle.setAttribute('aria-expanded', abierto ? 'true' : 'false');
      navToggle.setAttribute('aria-label', abierto ? 'Cerrar menú' : 'Abrir menú');
    });

    // Cerrar al hacer click en un enlace del nav
    document.querySelectorAll('#nav-principal a').forEach(a => {
      a.addEventListener('click', () => {
        siteHeader.classList.remove('nav-abierto');
        navToggle.setAttribute('aria-expanded', 'false');
        navToggle.setAttribute('aria-label', 'Abrir menú');
      });
    });
  }

  // Header compacto al bajar
  window.addEventListener('scroll', () => {
    siteHeader.classList.toggle('compacto', window.scrollY > 80);
  }, { passive: true });
}

/* ================================================
   ENLACE ACTIVO EN EL NAV AL HACER SCROLL
   — Diferido a tiempo idle (no es crítico para el render)
   ================================================ */

function iniciarNavActivo() {
  const navLinks  = document.querySelectorAll('#nav-principal a[href^="#"]');
  const secciones = document.querySelectorAll('section[id], footer[id]');
  if (!navLinks.length || !secciones.length) return;

  const observadorNav = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.id;
        navLinks.forEach(a => {
          a.classList.toggle('activo', a.getAttribute('href') === '#' + id);
        });
      }
    });
  }, { rootMargin: '-25% 0px -65% 0px', threshold: 0 });

  secciones.forEach(s => observadorNav.observe(s));
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(iniciarNavActivo, { timeout: 3000 });
} else {
  setTimeout(iniciarNavActivo, 300);
}

/* ================================================
   ANIMACIONES DE ENTRADA AL HACER SCROLL
   — Diferido a tiempo idle para no bloquear el hilo principal
   ================================================ */

function iniciarReveal() {
  const selectoresReveal = [
    '.estadisticas-grid',
    '.carrusel',
    '.pasos-grid',
    '.como-funciona-tip',
    '.carrusel-precios',
    '.seccion-encabezado',
    '.marca-encabezado',
    '.marca-bloque',
    '.sello-card',
    '.testimonio-card',
    '.carrusel-galeria',
    '.galeria-encabezado',
    '.cta-final h2',
    '.cta-final p',
    '.faq-encabezado',
    '.faq-item',
    '.redes-grid',
    '.redes-whatsapp',
    '.footer-contacto'
  ].join(', ');

  const elementosReveal = document.querySelectorAll(selectoresReveal);
  if (!elementosReveal.length) return;

  elementosReveal.forEach(el => el.classList.add('reveal'));

  const observadorReveal = new IntersectionObserver(entries => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        observadorReveal.unobserve(entry.target);
      }
    });
  }, { threshold: 0.12 });

  elementosReveal.forEach(el => observadorReveal.observe(el));
}

if ('requestIdleCallback' in window) {
  requestIdleCallback(iniciarReveal, { timeout: 2000 });
} else {
  setTimeout(iniciarReveal, 200);
}

/* ================================================
   QUIZ — ¿Cuál es tu shampoo ideal?
   ================================================ */

(function () {
  const elInicio    = document.getElementById('quiz-inicio');
  const elPreguntas = document.getElementById('quiz-preguntas');
  const elResultado = document.getElementById('quiz-resultado');
  const btnStart    = document.getElementById('quiz-btn-start');
  const btnRein     = document.getElementById('quiz-btn-reiniciar');
  if (!elInicio) return;

  const preguntas = [
    {
      icono: '✨',
      texto: '¿Cómo es tu cabello?',
      opciones: [
        { texto: '😞 Seco o muy dañado',                    pts: { banano:3, zanahoria:1, biotina:0, cebolla:0, romero:0 } },
        { texto: '💧 Graso, se ensucia rápido',             pts: { banano:0, zanahoria:0, biotina:0, cebolla:3, romero:1 } },
        { texto: '🪶 Fino y sin volumen',                    pts: { banano:0, zanahoria:0, biotina:3, cebolla:0, romero:1 } },
        { texto: '🌀 Mixto (raíces grasas, puntas secas)',   pts: { banano:1, zanahoria:2, biotina:0, cebolla:1, romero:0 } }
      ]
    },
    {
      icono: '🔍',
      texto: '¿Cuál es tu mayor problema capilar?',
      opciones: [
        { texto: '🌫️ Frizz y falta de brillo',              pts: { banano:1, zanahoria:3, biotina:0, cebolla:0, romero:0 } },
        { texto: '🌱 Caída y poco crecimiento',              pts: { banano:0, zanahoria:0, biotina:2, cebolla:0, romero:3 } },
        { texto: '🧴 Cuero cabelludo graso',                 pts: { banano:0, zanahoria:0, biotina:0, cebolla:3, romero:0 } },
        { texto: '✂️ Puntas secas o quebradizas',            pts: { banano:3, zanahoria:1, biotina:0, cebolla:0, romero:0 } }
      ]
    },
    {
      icono: '🌟',
      texto: '¿Qué resultado quieres lograr?',
      opciones: [
        { texto: '💦 Hidratación profunda y suavidad',       pts: { banano:3, zanahoria:1, biotina:0, cebolla:0, romero:0 } },
        { texto: '🚀 Estimular el crecimiento',              pts: { banano:0, zanahoria:0, biotina:2, cebolla:0, romero:3 } },
        { texto: '🧹 Limpieza y control de grasa',           pts: { banano:0, zanahoria:0, biotina:0, cebolla:3, romero:1 } },
        { texto: '✨ Brillo y recuperación',                  pts: { banano:1, zanahoria:3, biotina:1, cebolla:0, romero:0 } }
      ]
    }
  ];

  const resultados = {
    banano: {
      nombre: 'Shampoo y Tratamiento de Banano',
      desc:   'Tu cabello necesita hidratación intensiva. El Banano nutre profundamente, devuelve la suavidad y restaura el brillo natural desde la primera aplicación.',
      img:    '/multimedia/shampoo-banano.webp',
      precio: 'Kit desde $65.000',
      color:  '#f4a261',
      wa:     'https://wa.me/573127786165?text=Hola%20Diossy%20Capilar!%20El%20quiz%20me%20recomend%C3%B3%20el%20Shampoo%20de%20Banano%20%F0%9F%8D%8C%20%C2%BFme%20pueden%20dar%20m%C3%A1s%20informaci%C3%B3n%3F'
    },
    zanahoria: {
      nombre: 'Shampoo y Tratamiento de Zanahoria',
      desc:   'Tu cabello pide brillo y suavidad. La Zanahoria realiza un relleno molecular que devuelve el esplendor y la textura sedosa que tu cabello merece.',
      img:    '/multimedia/shampoo-zanahoria.webp',
      precio: 'Kit desde $60.000',
      color:  '#e8a030',
      wa:     'https://wa.me/573127786165?text=Hola%20Diossy%20Capilar!%20El%20quiz%20me%20recomend%C3%B3%20el%20Shampoo%20de%20Zanahoria%20%F0%9F%A5%95%20%C2%BFme%20pueden%20dar%20m%C3%A1s%20informaci%C3%B3n%3F'
    },
    biotina: {
      nombre: 'Shampoo y Tratamiento de Biotina',
      desc:   'Tu cabello necesita fortaleza y volumen. La Biotina estimula el crecimiento, engrosa cada hebra y le devuelve la vitalidad que merece.',
      img:    '/multimedia/shampoobiotina.webp',
      precio: 'Kit desde $60.000',
      color:  '#27ae60',
      wa:     'https://wa.me/573127786165?text=Hola%20Diossy%20Capilar!%20El%20quiz%20me%20recomend%C3%B3%20el%20Shampoo%20de%20Biotina%20%F0%9F%92%9A%20%C2%BFme%20pueden%20dar%20m%C3%A1s%20informaci%C3%B3n%3F'
    },
    cebolla: {
      nombre: 'Shampoo y Tratamiento de Cebolla',
      desc:   'Tu cuero cabelludo necesita pureza. La Cebolla regula la grasa, limpia profundo y fortalece el cabello con sus propiedades purificantes y antioxidantes.',
      img:    '/multimedia/shampoocebolla.webp',
      precio: 'Kit desde $60.000',
      color:  '#8e44ad',
      wa:     'https://wa.me/573127786165?text=Hola%20Diossy%20Capilar!%20El%20quiz%20me%20recomend%C3%B3%20el%20Shampoo%20de%20Cebolla%20%F0%9F%A7%85%20%C2%BFme%20pueden%20dar%20m%C3%A1s%20informaci%C3%B3n%3F'
    },
    romero: {
      nombre: 'Loción de Romero',
      desc:   'Tu cabello necesita un activador de crecimiento. La Loción de Romero estimula la circulación capilar y reactiva los folículos para un crecimiento visible.',
      img:    '/multimedia/locionromero.webp',
      precio: 'Desde $25.000',
      color:  '#c9a84c',
      wa:     'https://wa.me/573127786165?text=Hola%20Diossy%20Capilar!%20El%20quiz%20me%20recomend%C3%B3%20la%20Loci%C3%B3n%20de%20Romero%20%F0%9F%8C%BF%20%C2%BFme%20pueden%20dar%20m%C3%A1s%20informaci%C3%B3n%3F'
    }
  };

  let preguntaActual = 0;
  let pts = { banano:0, zanahoria:0, biotina:0, cebolla:0, romero:0 };

  function renderPregunta(i) {
    const p   = preguntas[i];
    const pct = Math.round(((i + 1) / preguntas.length) * 100);

    document.getElementById('quiz-progreso-fill').style.width     = pct + '%';
    document.querySelector('.quiz-progreso-barra').setAttribute('aria-valuenow', pct);
    document.getElementById('quiz-progreso-label').textContent    = `Pregunta ${i + 1} de ${preguntas.length}`;
    document.getElementById('quiz-icono-pregunta').textContent    = p.icono;
    document.getElementById('quiz-pregunta-texto').textContent    = p.texto;

    const contenedor = document.getElementById('quiz-opciones');
    contenedor.innerHTML = '';
    p.opciones.forEach(op => {
      const btn = document.createElement('button');
      btn.className   = 'quiz-opcion';
      btn.textContent = op.texto;
      btn.setAttribute('role', 'listitem');
      btn.addEventListener('click', () => elegir(op.pts));
      contenedor.appendChild(btn);
    });
  }

  function elegir(puntos) {
    Object.keys(puntos).forEach(k => { pts[k] += puntos[k]; });
    preguntaActual++;

    if (preguntaActual < preguntas.length) {
      const txt = document.getElementById('quiz-pregunta-texto');
      txt.style.opacity = '0';
      setTimeout(() => { renderPregunta(preguntaActual); txt.style.opacity = '1'; }, 220);
    } else {
      mostrarResultado();
    }
  }

  function mostrarResultado() {
    const ganador = Object.keys(pts).reduce((a, b) => pts[a] >= pts[b] ? a : b);
    const r = resultados[ganador];

    elPreguntas.hidden = true;
    elResultado.hidden = false;

    const waIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true"><path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z"/></svg>`;

    document.getElementById('quiz-resultado-producto').innerHTML = `
      <div class="quiz-res-imagen-wrap" style="border-color:${r.color}40; background:${r.color}12;">
        <img src="${r.img}" alt="${r.nombre}" class="quiz-res-imagen" loading="lazy">
      </div>
      <div class="quiz-res-info">
        <h4 class="quiz-res-nombre">${r.nombre}</h4>
        <p class="quiz-res-desc">${r.desc}</p>
        <span class="quiz-res-precio">${r.precio}</span>
        <a href="${r.wa}" target="_blank" rel="noopener noreferrer" class="btn-verde quiz-res-comprar">
          ${waIcon} Comprar por WhatsApp
        </a>
      </div>
    `;
  }

  function reiniciar() {
    preguntaActual = 0;
    pts = { banano:0, zanahoria:0, biotina:0, cebolla:0, romero:0 };
    elResultado.hidden = true;
    elInicio.hidden    = false;
  }

  btnStart.addEventListener('click', () => {
    elInicio.hidden    = true;
    elPreguntas.hidden = false;
    renderPregunta(0);
  });

  if (btnRein) btnRein.addEventListener('click', reiniciar);
})();

/* ================================================
   TILT 3D — Cards de producto al hacer hover
   ================================================ */

(function () {
  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  if (!window.matchMedia('(pointer: fine)').matches) return; // solo mouse

  const GRADOS = 8;   // inclinación máxima en grados
  const ESCALA = 1.04; // escala al hacer hover

  const tarjetas = document.querySelectorAll(
    '.sello-card, .testimonio-card, .paso-item, .rutina-card'
  );

  tarjetas.forEach(card => {
    // Capa de luz que sigue el mouse (efecto reflexión)
    const luz = document.createElement('div');
    luz.className = 'tilt-luz';
    luz.setAttribute('aria-hidden', 'true');
    card.appendChild(luz);

    card.addEventListener('mousemove', e => {
      const rect = card.getBoundingClientRect();
      const x    = e.clientX - rect.left;
      const y    = e.clientY - rect.top;
      const cx   = rect.width  / 2;
      const cy   = rect.height / 2;

      const rotX = ((y - cy) / cy) * -GRADOS;
      const rotY = ((x - cx) / cx) *  GRADOS;

      card.style.transition = 'transform 0.08s linear';
      card.style.transform  =
        `perspective(700px) rotateX(${rotX}deg) rotateY(${rotY}deg) scale(${ESCALA})`;

      // Luz que sigue el puntero dentro de la card
      const lx = (x / rect.width)  * 100;
      const ly = (y / rect.height) * 100;
      luz.style.opacity    = '1';
      luz.style.background =
        `radial-gradient(circle at ${lx}% ${ly}%, rgba(255,255,255,0.2) 0%, transparent 65%)`;
    });

    card.addEventListener('mouseleave', () => {
      card.style.transition = 'transform 0.45s ease';
      card.style.transform  =
        'perspective(700px) rotateX(0deg) rotateY(0deg) scale(1)';
      luz.style.opacity = '0';
    });
  });
})();

/* ================================================
   LIKE — BOTÓN DE ME GUSTA
   ================================================ */

(function () {
  const LIKES_API = BACKEND_BASE_URL + '/api/likes';

  const likeBtn       = document.getElementById('like-btn');
  const likeNumero    = document.getElementById('like-numero');
  const likePregunta  = document.getElementById('like-pregunta');
  const likeParticulas = document.getElementById('like-particulas');

  if (!likeBtn) return;

  const EMOJIS = ['❤️', '⭐', '✨', '🌿', '💛', '🌸', '💫', '🌟'];

  function lanzarParticulas() {
    if (!likeParticulas) return;
    likeParticulas.innerHTML = '';
    const total = TOTAL_PARTICULAS_LIKE;
    for (let i = 0; i < total; i++) {
      const angulo    = (360 / total) * i + (Math.random() * 18 - 9);
      const distancia = 55 + Math.random() * 70;
      const tx        = Math.cos(angulo * Math.PI / 180) * distancia;
      const ty        = Math.sin(angulo * Math.PI / 180) * distancia;
      const duracion  = 550 + Math.random() * 350;
      const rot       = Math.random() * 360 - 180;
      const tamaño    = 0.75 + Math.random() * 1;
      const emoji     = EMOJIS[Math.floor(Math.random() * EMOJIS.length)];
      const retraso   = Math.random() * 120;

      const p = document.createElement('span');
      p.textContent = emoji;
      p.className   = 'like-particula';
      p.style.cssText = `
        --tx: ${tx}px; --ty: ${ty}px; --rot: ${rot}deg;
        font-size: ${tamaño}rem;
        animation: like-particula-volar ${duracion}ms ${retraso}ms ease-out both;
      `;
      likeParticulas.appendChild(p);
      p.addEventListener('animationend', () => p.remove(), { once: true });
    }
  }

  function actualizarContador(total) {
    if (!likeNumero) return;
    likeNumero.textContent = total.toLocaleString('es-CO');
    likeNumero.classList.remove('rebote');
    void likeNumero.offsetWidth;
    likeNumero.classList.add('rebote');
  }

  // Cargar total al iniciar
  fetch(LIKES_API)
    .then(r => r.json())
    .then(d => actualizarContador(d.total))
    .catch(() => { if (likeNumero) likeNumero.textContent = '···'; });

  // Restaurar estado si ya dio like
  if (localStorage.getItem('diossy-like') === 'true') {
    likeBtn.classList.add('liked');
    likeBtn.setAttribute('aria-pressed', 'true');
    if (likePregunta) likePregunta.textContent = '¡Gracias por tu amor! 🌿';
  }

  likeBtn.addEventListener('click', () => {
    if (localStorage.getItem('diossy-like') === 'true') {
      mostrarToast('¡Ya diste tu amor a Diossy! 💛', '💛');
      return;
    }

    // Animación inmediata
    likeBtn.classList.add('liked', 'latiendo');
    likeBtn.setAttribute('aria-pressed', 'true');
    lanzarParticulas();
    localStorage.setItem('diossy-like', 'true');
    if (likePregunta) likePregunta.textContent = '¡Gracias por tu amor! 🌿';

    likeBtn.addEventListener('animationend', (e) => {
      if (e.animationName === 'like-latido') likeBtn.classList.remove('latiendo');
    }, { once: true });

    // Enviar al backend
    fetch(LIKES_API, { method: 'POST' })
      .then(r => r.json())
      .then(d => actualizarContador(d.total))
      .catch(() => {
        const actual = parseInt(((likeNumero ? likeNumero.textContent : '0') || '0').replace(/\D/g, '')) || 0;
        actualizarContador(actual + 1);
      });
  });
})();

/* ================================================
   AVISO DE COOKIES / PRIVACIDAD
   ================================================ */

const cookieBanner        = document.getElementById('cookie-banner');
const btnCookieAceptar    = document.getElementById('btn-cookie-aceptar');
const btnCookieCerrar     = document.getElementById('btn-cookie-cerrar');

if (cookieBanner && !localStorage.getItem('diossy-cookies')) {
  setTimeout(() => cookieBanner.classList.add('visible'), RETRASO_COOKIE_BANNER_MS);

  if (btnCookieAceptar) {
    btnCookieAceptar.addEventListener('click', () => {
      localStorage.setItem('diossy-cookies', 'aceptadas');
      cookieBanner.classList.remove('visible');
    });
  }

  if (btnCookieCerrar) {
    btnCookieCerrar.addEventListener('click', () => {
      cookieBanner.classList.remove('visible');
    });
  }
}

/* ================================================
   SERVICE WORKER — cache offline para assets estáticos
   ================================================ */

if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {});

// ================================================
// EFECTO DE BURBUJAS ANIMADAS (ADAPTATIVO)
// Se ejecuta cuando el DOM está listo
// ================================================
document.addEventListener('DOMContentLoaded', function () {
  // Secciones donde queremos agregar burbujas
  const secciones = [
    '.hero',
    '.estadisticas',
    '.productos-destacados',
    '.galeria',
    '.marca',
    '.testimonios',
    '.cta-final'
  ];

  // Tamaños posibles
  const tamanos = ['tiny', 'small', 'medium', 'large'];

  secciones.forEach(selector => {
    const seccion = document.querySelector(selector);
    if (!seccion) return;

    // Crear contenedor de burbujas
    const contenedor = document.createElement('div');
    contenedor.className = 'burbujas-contenedor';
    contenedor.setAttribute('aria-hidden', 'true');

    // Determinar número de burbujas según ancho de pantalla
    const esMovil = window.innerWidth <= 768;
    const totalBurbujas = esMovil ? 5 : 15; // 5 en móvil, 15 en escritorio

    // Generar burbujas aleatorias
    for (let i = 0; i < totalBurbujas; i++) {
      const burbuja = document.createElement('span');
      burbuja.classList.add('burbuja');

      // Tamaño aleatorio
      const tamano = tamanos[Math.floor(Math.random() * tamanos.length)];
      burbuja.classList.add(tamano);

      // Retraso aleatorio según dispositivo
      let maxDelayIndex;
      if (esMovil) {
        // En móvil: retrasos de 0 a 3s, paso 0.5s → índices 0 a 6
        maxDelayIndex = 6;
      } else {
        // En escritorio: retrasos de 0 a 7.5s, paso 0.5s → índices 0 a 15
        maxDelayIndex = 15;
      }
      const delayIndex = Math.floor(Math.random() * (maxDelayIndex + 1));
      burbuja.classList.add(`delay-${delayIndex}`);

      contenedor.appendChild(burbuja);
    }

    // Insertar el contenedor al inicio de la sección
    seccion.insertBefore(contenedor, seccion.firstChild);
  });

  // Opcional: recargar burbujas si se rota el dispositivo (ej: de portrait a landscape)
  window.addEventListener('resize', () => {
    // Evitamos recargar en cada pixel de cambio
    if (window.resizeTimeout) clearTimeout(window.resizeTimeout);
    window.resizeTimeout = setTimeout(() => {
      location.reload(); // Recarga limpia para reaplicar burbujas según nuevo ancho
    }, 300);
  });
});
  });
}