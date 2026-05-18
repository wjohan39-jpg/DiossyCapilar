/* ================================================
   DIOSSY CAPILAR — diossy.js
   Correcciones aplicadas:
   1. Tres carruseles idénticos refactorizados en una función reutilizable.
   2. setInterval del carrusel de precios guardado y limpiable.
   3. Todos los elementos verifican existencia antes de usarse.
   4. FAQ actualizado con aria-expanded y atributo hidden correcto.
   5. Formulario valida manualmente (consistente con type="button").
   6. Constante nombrada para la velocidad del contador.
   ================================================ */

/* ================================================
   LOADER
   ================================================ */

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  if (loader) setTimeout(() => loader.classList.add('oculto'), 1500);
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
  setTimeout(() => toast.classList.remove('visible'), 3000);
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
   CONTADOR DE ESTADÍSTICAS
   CORRECCIÓN: La constante de velocidad ahora tiene
   nombre descriptivo en vez de un número mágico.
   ================================================ */

const DURACION_CONTADOR_MS  = 2000; // duración total de la animación en ms
const FRAMES_POR_SEGUNDO    = 60;
const INTERVALO_FRAME_MS    = DURACION_CONTADOR_MS / FRAMES_POR_SEGUNDO;

const numeros = document.querySelectorAll('.estadistica-numero');

function animarContador(elemento) {
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
   FORMULARIO — ENVÍO POR WHATSAPP
   CORRECCIÓN: Validación manual (sin HTML5 required)
   para ser consistente con type="button".
   ================================================ */

const btnWaForm = document.getElementById('btn-whatsapp-form');

if (btnWaForm) {
  btnWaForm.addEventListener('click', () => {
    const campoNombre  = document.getElementById('nombre');
    const campoEmail   = document.getElementById('email');
    const campoProducto = document.getElementById('producto');
    const campoMensaje = document.getElementById('mensaje');

    if (!campoNombre || !campoEmail || !campoMensaje) return;

    const nombre  = campoNombre.value.trim();
    const email   = campoEmail.value.trim();
    const mensaje = campoMensaje.value.trim();

    // Validación manual
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

    const productoTexto = campoProducto && campoProducto.value
      ? `Producto de interés: ${campoProducto.selectedOptions[0].text}\n`
      : '';

    const texto = `Hola Diossy Capilar! 🌿\n\nNombre: ${nombre}\nCorreo: ${email}\n${productoTexto}Mensaje: ${mensaje}`;
    const url   = `https://wa.me/573127786165?text=${encodeURIComponent(texto)}`;

    // Abrir WhatsApp de inmediato (gesto directo del usuario) para evitar bloqueo de popup en móviles
    window.open(url, '_blank');
    mostrarToast('¡Mensaje listo en WhatsApp! 🌿');

    // Limpiar formulario
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
      });
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
  chatAbrir.addEventListener('click', () => {
    const estaVisible = chatBurbuja.classList.toggle('visible');
    chatAbrir.setAttribute('aria-expanded', estaVisible ? 'true' : 'false');
    if (chatNotif) chatNotif.style.display = 'none';
  });

  chatCerrar.addEventListener('click', () => {
    chatBurbuja.classList.remove('visible');
    chatAbrir.setAttribute('aria-expanded', 'false');
  });

  // Abrir automáticamente después de 5s, cerrar a los 15s
  const timerAbrir = setTimeout(() => {
    chatBurbuja.classList.add('visible');
    chatAbrir.setAttribute('aria-expanded', 'true');
  }, 5000);

  const timerCerrar = setTimeout(() => {
    chatBurbuja.classList.remove('visible');
    chatAbrir.setAttribute('aria-expanded', 'false');
  }, 15000);

  // Si el usuario cierra manualmente, cancelar los timers automáticos
  chatCerrar.addEventListener('click', () => {
    clearTimeout(timerAbrir);
    clearTimeout(timerCerrar);
  }, { once: true });
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
   ================================================ */

const navLinks   = document.querySelectorAll('#nav-principal a[href^="#"]');
const secciones  = document.querySelectorAll('section[id], footer[id]');

if (navLinks.length && secciones.length) {
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

/* ================================================
   ANIMACIONES DE ENTRADA AL HACER SCROLL
   ================================================ */

const selectoresReveal = [
  '.estadisticas-grid',
  '.carrusel',
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

if (elementosReveal.length) {
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

/* ================================================
   AVISO DE COOKIES / PRIVACIDAD
   ================================================ */

const cookieBanner        = document.getElementById('cookie-banner');
const btnCookieAceptar    = document.getElementById('btn-cookie-aceptar');
const btnCookieCerrar     = document.getElementById('btn-cookie-cerrar');

if (cookieBanner && !localStorage.getItem('diossy-cookies')) {
  setTimeout(() => cookieBanner.classList.add('visible'), 2500);

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