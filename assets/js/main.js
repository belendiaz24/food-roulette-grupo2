// ============================================
// main.js
// Este archivo se carga en TODAS las páginas.
// Contiene funciones que se reutilizan en
// múltiples lugares del sitio.
// ============================================

// ============================================
// MENÚ HAMBURGUESA (responsive mobile)
// ============================================

// document.getElementById() busca un elemento HTML
// por su atributo id="". Lo guardamos en una variable
// para usarlo después.
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

// addEventListener() le "escucha" un evento a un elemento.
// Cuando el usuario hace 'click' en navToggle,
// ejecutamos la función que está adentro.
navToggle.addEventListener('click', () => {
  // classList.toggle() agrega la clase si no la tiene,
  // o la quita si ya la tiene. Muy útil para mostrar/ocultar.
  navLinks.classList.toggle('abierto');

  // También cambiamos el aria-label para accesibilidad
  const estaAbierto = navLinks.classList.contains('abierto');
  navToggle.setAttribute('aria-label', estaAbierto ? 'Cerrar menú' : 'Abrir menú');
});

// Si el usuario hace click FUERA del menú, lo cerramos
document.addEventListener('click', (evento) => {
  // evento.target es el elemento en el que hizo click el usuario
  // closest() busca el ancestro más cercano que coincida con el selector
  // Si el click no fue dentro del <nav>, cerramos el menú
  if (!evento.target.closest('nav')) {
    navLinks.classList.remove('abierto');
  }
});


// ============================================
// MODAL (ventana flotante de detalle)
// Estas funciones las usan tanto ruleta.js
// como guardadas.js
// ============================================

const modalOverlay = document.getElementById('modalOverlay');
const modalBody = document.getElementById('modalBody');
const btnCerrarModal = document.getElementById('btnCerrarModal');

/**
 * Abre el modal y llena su contenido con los datos de la receta.
 * @param {Object} receta - El objeto con los datos de la receta
 */
function abrirModal(receta) {
  // Construimos el HTML interno del modal con template literals.
  // Los template literals usan backticks (`) y permiten escribir
  // HTML en varias líneas e insertar variables con ${variable}
  modalBody.innerHTML = `
    <div class="modal-emoji">${receta.imagen}</div>
    <h2 class="modal-titulo">${receta.nombre}</h2>
    <p class="modal-descripcion">${receta.descripcion}</p>

    <div class="card-meta">
      <span class="badge">⏱️ ${receta.tiempo} min</span>
      <span class="badge">${receta.dificultad}</span>
      <span class="badge badge-verde">${receta.categoria}</span>
    </div>

    <div class="modal-pasos">
      <h3>📋 Preparación paso a paso</h3>
      <ol>
        ${receta.pasos.map(paso => `<li>${paso}</li>`).join('')}
      </ol>
    </div>
  `;
  // .map() recorre el array receta.pasos y transforma
  // cada paso en un elemento <li>.
  // .join('') une todos los <li> en un solo string.

  // Agregamos la clase "visible" que hace aparecer el modal
  // (ver en el CSS: .modal-overlay.visible)
  modalOverlay.classList.add('visible');

  // Bloqueamos el scroll del body para que no se pueda
  // hacer scroll mientras el modal está abierto
  document.body.style.overflow = 'hidden';
}

/**
 * Cierra el modal
 */
function cerrarModal() {
  modalOverlay.classList.remove('visible');
  document.body.style.overflow = ''; // Restauramos el scroll
}

// Cerrar al hacer click en el botón X
btnCerrarModal.addEventListener('click', cerrarModal);

// Cerrar al hacer click en el fondo oscuro (overlay)
// pero NO si el click fue dentro del modal en sí
modalOverlay.addEventListener('click', (evento) => {
  // evento.target es el elemento clickeado
  // Si el elemento clickeado ES el overlay (fondo), cerramos
  if (evento.target === modalOverlay) {
    cerrarModal();
  }
});

// Cerrar con la tecla Escape (accesibilidad)
document.addEventListener('keydown', (evento) => {
  if (evento.key === 'Escape') {
    cerrarModal();
  }
});
