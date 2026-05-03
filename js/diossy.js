/* ================================================
   LOADER
   ================================================ */

window.addEventListener('load', () => {
  const loader = document.getElementById('loader');
  setTimeout(() => loader.classList.add('oculto'), 1500);
});

/* ================================================
   TOAST — NOTIFICACIÓN
   ================================================ */

function mostrarToast(mensaje, icono = '✅') {
  const toast       = document.getElementById('toast');
  const toastMensaje = document.getElementById('toast-mensaje');
  const toastIcono  = toast.querySelector('.toast-icono');

  toastMensaje.textContent = mensaje;
  toastIcono.textContent   = icono;
  toast.classList.add('visible');

  setTimeout(() => toast.classList.remove('visible'), 3000);
}

/* ================================================
   BOTÓN VOLVER ARRIBA
   ================================================ */

const btnTop = document.getElementById('btn-top');

window.addEventListener('scroll', () => {
  btnTop.classList.toggle('visible', window.scrollY > 400);
});

btnTop.addEventListener('click', () => {
  window.scrollTo({ top: 0, behavior: 'smooth' });
});

/* ================================================
   CARRUSEL DE PRODUCTOS
   ================================================ */

const pista   = document.querySelector('.carrusel-pista');
const slides  = document.querySelectorAll('.carrusel-slide');
const puntos  = document.querySelectorAll('.punto');
const btnPrev = document.querySelector('.carrusel-prev');
const btnNext = document.querySelector('.carrusel-next');

let indiceActual = 0;

function irASlide(indice) {
  indiceActual = indice;
  pista.style.transform = `translateX(-${indiceActual * 100}%)`;

  puntos.forEach(p => p.classList.remove('activo'));
  puntos[indiceActual].classList.add('activo');

  /* Reiniciar y animar barras del slide activo */
  const barrasSlide = slides[indiceActual].querySelectorAll('.barra-relleno');
  barrasSlide.forEach(b => {
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

btnNext.addEventListener('click', () => irASlide((indiceActual + 1) % slides.length));
btnPrev.addEventListener('click', () => irASlide((indiceActual - 1 + slides.length) % slides.length));
puntos.forEach(p => p.addEventListener('click', () => irASlide(Number(p.dataset.indice))));

irASlide(0);

/* ================================================
   CARRUSEL DE PRECIOS
   ================================================ */

const pistaPrecio   = document.querySelector('.precios-pista');
const slidesPrecios = document.querySelectorAll('.precio-slide');
const puntosPrecio  = document.querySelectorAll('.punto-precio');
const btnPrevPrecio = document.querySelector('.prev-precio');
const btnNextPrecio = document.querySelector('.next-precio');

let indicePrecio = 0;

function irAPrecio(indice) {
  indicePrecio = indice;
  pistaPrecio.style.transform = `translateX(-${indicePrecio * 100}%)`;
  puntosPrecio.forEach(p => p.classList.remove('activo'));
  puntosPrecio[indicePrecio].classList.add('activo');
}

btnNextPrecio.addEventListener('click', () => irAPrecio((indicePrecio + 1) % slidesPrecios.length));
btnPrevPrecio.addEventListener('click', () => irAPrecio((indicePrecio - 1 + slidesPrecios.length) % slidesPrecios.length));
puntosPrecio.forEach(p => p.addEventListener('click', () => irAPrecio(Number(p.dataset.indice))));

setInterval(() => irAPrecio((indicePrecio + 1) % slidesPrecios.length), 6000);
irAPrecio(0);

/* ================================================
   CARRUSEL GALERÍA
   ================================================ */

const pistaGaleria   = document.querySelector('.galeria-pista');
const slidesGaleria  = document.querySelectorAll('.galeria-slide');
const puntosGaleria  = document.querySelectorAll('.punto-galeria');
const btnPrevGaleria = document.querySelector('.prev-galeria');
const btnNextGaleria = document.querySelector('.next-galeria');
const galeriaActual  = document.getElementById('galeria-actual');

let indiceGaleria = 0;

function irAGaleria(indice) {
  const videoAnterior = slidesGaleria[indiceGaleria].querySelector('video');
  if (videoAnterior) videoAnterior.pause();

  indiceGaleria = indice;
  pistaGaleria.style.transform = `translateX(-${indiceGaleria * 100}%)`;

  puntosGaleria.forEach(p => p.classList.remove('activo'));
  puntosGaleria[indiceGaleria].classList.add('activo');

  if (galeriaActual) galeriaActual.textContent = indiceGaleria + 1;
}

btnNextGaleria.addEventListener('click', () => irAGaleria((indiceGaleria + 1) % slidesGaleria.length));
btnPrevGaleria.addEventListener('click', () => irAGaleria((indiceGaleria - 1 + slidesGaleria.length) % slidesGaleria.length));
puntosGaleria.forEach(p => p.addEventListener('click', () => irAGaleria(Number(p.dataset.indice))));

irAGaleria(0);

/* ================================================
   CONTADOR DE ESTADÍSTICAS
   ================================================ */

const numeros = document.querySelectorAll('.estadistica-numero');

function animarContador(elemento) {
  const objetivo   = parseInt(elemento.dataset.objetivo);
  const incremento = objetivo / 60;
  let actual = 0;

  const timer = setInterval(() => {
    actual += incremento;
    if (actual >= objetivo) {
      actual = objetivo;
      clearInterval(timer);
    }
    elemento.textContent = Math.floor(actual);
  }, 2000 / 60);
}

const observadorEstadisticas = new IntersectionObserver((entradas) => {
  entradas.forEach(entrada => {
    if (entrada.isIntersecting) {
      numeros.forEach(n => animarContador(n));
      observadorEstadisticas.disconnect();
    }
  });
}, { threshold: 0.5 });

const seccionEstadisticas = document.querySelector('.estadisticas');
if (seccionEstadisticas) observadorEstadisticas.observe(seccionEstadisticas);

/* ================================================
   FORMULARIO — ENVÍO POR WHATSAPP
   ================================================ */

document.getElementById('btn-whatsapp-form').addEventListener('click', () => {
  const nombre   = document.getElementById('nombre').value.trim();
  const email    = document.getElementById('email').value.trim();
  const producto = document.getElementById('producto').value;
  const mensaje  = document.getElementById('mensaje').value.trim();

  if (!nombre || !email || !mensaje) {
    mostrarToast('Por favor completa todos los campos', '⚠️');
    return;
  }

  const productoTexto = producto
    ? `Producto de interés: ${document.getElementById('producto').selectedOptions[0].text}\n`
    : '';

  const texto = `Hola Diossy Capilar! 🌿\n\nNombre: ${nombre}\nCorreo: ${email}\n${productoTexto}Mensaje: ${mensaje}`;
  const url   = `https://wa.me/573127786165?text=${encodeURIComponent(texto)}`;

  mostrarToast('¡Redirigiendo a WhatsApp! 🌿');
  setTimeout(() => window.open(url, '_blank'), 1000);
});

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
          btn.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" width="16" height="16" fill="currentColor"><path d="M18 16.08c-.76 0-1.44.3-1.96.77L8.91 12.7c.05-.23.09-.46.09-.7s-.04-.47-.09-.7l7.05-4.11c.54.5 1.25.81 2.04.81 1.66 0 3-1.34 3-3s-1.34-3-3-3-3 1.34-3 3c0 .24.04.47.09.7L8.04 9.81C7.5 9.31 6.79 9 6 9c-1.66 0-3 1.34-3 3s1.34 3 3 3c.79 0 1.5-.31 2.04-.81l7.12 4.16c-.05.21-.08.43-.08.65 0 1.61 1.31 2.92 2.92 2.92s2.92-1.31 2.92-2.92-1.31-2.92-2.92-2.92z"/></svg> Compartir`;
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

if (localStorage.getItem('dark') === 'true') {
  document.documentElement.classList.add('dark');
  iconoDark.innerHTML = sol;
}

btnDark.addEventListener('click', () => {
  const esDark = document.documentElement.classList.toggle('dark');
  iconoDark.innerHTML = esDark ? sol : luna;
  localStorage.setItem('dark', esDark);
});

/* ================================================
   FAQ — ACORDEÓN
   ================================================ */

document.querySelectorAll('.faq-pregunta').forEach(pregunta => {
  pregunta.addEventListener('click', () => {
    const item       = pregunta.parentElement;
    const estaAbierto = item.classList.contains('abierto');

    document.querySelectorAll('.faq-item').forEach(i => i.classList.remove('abierto'));

    if (!estaAbierto) item.classList.add('abierto');
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
    chatBurbuja.classList.toggle('visible');
    if (chatNotif) chatNotif.style.display = 'none';
  });

  chatCerrar.addEventListener('click', () => chatBurbuja.classList.remove('visible'));

  setTimeout(() => chatBurbuja.classList.add('visible'), 5000);
  setTimeout(() => chatBurbuja.classList.remove('visible'), 15000);
}