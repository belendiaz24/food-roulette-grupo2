// ============================================
// ruleta.js
// Lógica de la página de búsqueda de recetas.
// Este archivo maneja:
// 1. Cargar las recetas desde el JSON
// 2. Mostrar los chips de ingredientes
// 3. Filtrar recetas según los 3 criterios
// 4. Renderizar las cards de resultados
// 5. Guardar/quitar favoritos en localStorage
// ============================================


// ============================================
// ESTADO DE LA APLICACIÓN
// Guardamos el estado actual de los filtros
// en variables para consultarlas en cualquier
// momento sin tener que leer el DOM.
// ============================================
let todasLasRecetas = [];           // Array con todas las recetas cargadas
let ingredientesSeleccionados = []; // Array de ingredientes elegidos por el usuario
let tiempoSeleccionado = 999;       // Tiempo máximo en minutos (999 = sin límite)
let dificultadSeleccionada = 'todas'; // Dificultad elegida


// ============================================
// FUNCIONALIDAD 1: CARGAR RECETAS DESDE JSON
// Leemos el archivo recetas.json con fetch()
// ============================================

/**
 * fetch() hace una petición HTTP para obtener un archivo.
 * Devuelve una Promesa: una operación que tarda un tiempo
 * y puede ser exitosa o fallar.
 * 
 * .then() se ejecuta cuando la promesa se resuelve (éxito).
 * .catch() se ejecuta si hay un error.
 */
fetch('../assets/data/recetas.json')
  .then(respuesta => {
    // respuesta.json() convierte el texto JSON en un objeto JavaScript
    return respuesta.json();
  })
  .then(datos => {
    // "datos" ya es un array de objetos JavaScript
    todasLasRecetas = datos;

    // Una vez cargadas las recetas, inicializamos la UI
    inicializarChips();
    renderizarRecetas(todasLasRecetas);
    actualizarContador(todasLasRecetas.length);
  })
  .catch(error => {
    // Si algo sale mal, mostramos un error en consola y en pantalla
    console.error('Error al cargar las recetas:', error);
    mostrarMensajeVacio('😵 Error al cargar las recetas. Recargá la página.');
  });


// ============================================
// CHIPS DE INGREDIENTES
// Extraemos todos los ingredientes únicos de
// todas las recetas y creamos un chip por cada uno
// ============================================

function inicializarChips() {
  const contenedor = document.getElementById('chipsIngredientes');

  // Paso 1: Recolectar todos los ingredientes de todas las recetas
  // flatMap() es como map() pero aplana arrays anidados.
  // Cada receta tiene un array de ingredientes, entonces
  // tenemos un array de arrays. flatMap lo vuelve un array plano.
  const todosLosIngredientes = todasLasRecetas.flatMap(receta => receta.ingredientes);

  // Paso 2: Eliminar duplicados con Set.
  // Set es una estructura que solo guarda valores únicos.
  // Luego lo convertimos de vuelta a array con Array.from().
  const ingredientesUnicos = Array.from(new Set(todosLosIngredientes));

  // Paso 3: Ordenar alfabéticamente
  ingredientesUnicos.sort();

  // Paso 4: Crear un botón (chip) por cada ingrediente
  ingredientesUnicos.forEach(ingrediente => {
    const chip = document.createElement('button'); // Creamos un elemento <button>
    chip.classList.add('chip');                     // Le agregamos la clase CSS
    chip.textContent = ingrediente;                 // El texto visible del botón
    chip.setAttribute('data-ingrediente', ingrediente); // Guardamos el valor en data-

    // Cuando el usuario hace click en el chip, lo selecciona o deselecciona
    chip.addEventListener('click', () => toggleIngrediente(chip, ingrediente));

    // Insertamos el chip en el contenedor del HTML
    contenedor.appendChild(chip);
  });
}

/**
 * Activa o desactiva un chip de ingrediente
 * @param {HTMLElement} chip - El botón del ingrediente
 * @param {string} ingrediente - El nombre del ingrediente
 */
function toggleIngrediente(chip, ingrediente) {
  chip.classList.toggle('seleccionado');

  // indexOf() devuelve la posición del elemento en el array,
  // o -1 si no está. Lo usamos para saber si ya está seleccionado.
  const indice = ingredientesSeleccionados.indexOf(ingrediente);

  if (indice === -1) {
    // No estaba en el array: lo agregamos
    ingredientesSeleccionados.push(ingrediente);
  } else {
    // Ya estaba: lo quitamos con splice()
    // splice(indice, 1) elimina 1 elemento a partir del índice dado
    ingredientesSeleccionados.splice(indice, 1);
  }

  // Cada vez que cambia la selección, volvemos a filtrar
  filtrarYMostrar();
}


// ============================================
// SELECTOR DE TIEMPO
// ============================================

const botonestiempo = document.querySelectorAll('#selectorTiempo .selector-opcion');
// querySelectorAll() devuelve TODOS los elementos que
// coinciden con el selector CSS, como un array.

botonestiempo.forEach(boton => {
  boton.addEventListener('click', () => {
    // Quitamos "seleccionado" de TODOS los botones de tiempo
    botonestiempo.forEach(b => b.classList.remove('seleccionado'));

    // Agregamos "seleccionado" solo al que se clickeó
    boton.classList.add('seleccionado');

    // Leemos el valor del atributo data-valor y lo convertimos a número
    // parseInt() convierte un string a número entero
    tiempoSeleccionado = parseInt(boton.dataset.valor);

    filtrarYMostrar();
  });
});


// ============================================
// SELECTOR DE DIFICULTAD
// ============================================

const botonesDificultad = document.querySelectorAll('#selectorDificultad .selector-opcion');

botonesDificultad.forEach(boton => {
  boton.addEventListener('click', () => {
    botonesDificultad.forEach(b => b.classList.remove('seleccionado'));
    boton.classList.add('seleccionado');
    dificultadSeleccionada = boton.dataset.valor;
    filtrarYMostrar();
  });
});


// ============================================
// FUNCIONALIDAD 2: FILTRADO DE RECETAS
// Esta es la función central del desafío obligatorio:
// filtrar con AL MENOS 3 criterios.
// ============================================

/**
 * Filtra las recetas según los 3 criterios seleccionados
 * y actualiza la pantalla con los resultados.
 */
function filtrarYMostrar() {
  // filter() recorre el array y devuelve un nuevo array
  // solo con los elementos para los que la función devuelve "true"
  const recetasFiltradas = todasLasRecetas.filter(receta => {

    // CRITERIO 1: Ingredientes
    // Si no hay ingredientes seleccionados, pasa cualquier receta.
    // Si hay ingredientes seleccionados, la receta debe tener AL MENOS
    // uno de ellos (podés cambiar esto a "todos" si querés más estricto).
    const pasaIngredientes = ingredientesSeleccionados.length === 0 ||
      ingredientesSeleccionados.some(ing => receta.ingredientes.includes(ing));
    // .some() devuelve true si AL MENOS UN elemento del array cumple la condición
    // .includes() devuelve true si el array incluye ese valor

    // CRITERIO 2: Tiempo
    // La receta debe tardar MENOS O IGUAL que el tiempo seleccionado
    const pasaTiempo = receta.tiempo <= tiempoSeleccionado;

    // CRITERIO 3: Dificultad
    // Si eligió "todas", pasa cualquier dificultad.
    // Si no, la dificultad de la receta debe coincidir.
    const pasaDificultad = dificultadSeleccionada === 'todas' ||
      receta.dificultad === dificultadSeleccionada;

    // La receta pasa el filtro SOLO si cumple los 3 criterios
    // && significa "Y" (AND): todos deben ser true
    return pasaIngredientes && pasaTiempo && pasaDificultad;
  });

  // Actualizamos la pantalla con los resultados
  renderizarRecetas(recetasFiltradas);
  actualizarContador(recetasFiltradas.length);
}


// ============================================
// FUNCIONALIDAD 3: RENDERIZADO DINÁMICO DE CARDS
// Creamos HTML dinámicamente con JavaScript
// y lo insertamos en el DOM.
// ============================================

/**
 * Renderiza las cards de recetas en la grilla
 * @param {Array} recetas - Array de recetas a mostrar
 */
function renderizarRecetas(recetas) {
  const grilla = document.getElementById('grillaRecetas');

  // Si no hay recetas, mostramos un mensaje
  if (recetas.length === 0) {
    mostrarMensajeVacio('🤷 No encontramos recetas con esos filtros. ¡Probá cambiando algo!');
    return; // Salimos de la función
  }

  // innerHTML permite escribir HTML directamente en un elemento.
  // Usamos .map() para transformar cada receta en HTML,
  // y .join('') para unir todo en un string.
  grilla.innerHTML = recetas.map(receta => crearCardHTML(receta)).join('');

  // Después de crear el HTML, asignamos los eventos a los botones
  asignarEventosCards();
}

/**
 * Crea el HTML de una card de receta
 * @param {Object} receta - Objeto con datos de la receta
 * @returns {string} - String con el HTML de la card
 */
function crearCardHTML(receta) {
  // Verificamos si esta receta ya está en favoritos
  const favoritos = obtenerFavoritos();
  const esFavorito = favoritos.some(fav => fav.id === receta.id);

  // Template literal: backticks `` permiten strings multilínea
  // y la interpolación de variables con ${}
  return `
    <article class="card" data-id="${receta.id}">
      <div class="card-emoji">${receta.imagen}</div>
      <div class="card-body">
        <h3 class="card-titulo">${receta.nombre}</h3>
        <p class="card-descripcion">${receta.descripcion}</p>
        <div class="card-meta">
          <span class="badge">⏱️ ${receta.tiempo} min</span>
          <span class="badge">${receta.dificultad}</span>
          <span class="badge badge-verde">${receta.categoria}</span>
        </div>
        <div class="card-acciones">
          <button 
            class="btn btn-primario btn-ver" 
            data-id="${receta.id}"
          >
            📖 Ver receta
          </button>
          <button 
            class="btn-favorito ${esFavorito ? 'guardado' : ''}" 
            data-id="${receta.id}"
            aria-label="${esFavorito ? 'Quitar de favoritos' : 'Guardar en favoritos'}"
          >
            ${esFavorito ? '❤️ Guardada' : '🤍 Guardar'}
          </button>
        </div>
      </div>
    </article>
  `;
}

/**
 * Asigna eventos de click a los botones de las cards.
 * Se llama DESPUÉS de renderizar porque los botones
 * se crean dinámicamente y no existen antes.
 */
function asignarEventosCards() {
  // Botones "Ver receta" -> abren el modal
  document.querySelectorAll('.btn-ver').forEach(boton => {
    boton.addEventListener('click', () => {
      const id = parseInt(boton.dataset.id);
      // Buscamos la receta por su id en el array
      const receta = todasLasRecetas.find(r => r.id === id);
      // .find() devuelve el primer elemento que cumple la condición
      if (receta) abrirModal(receta); // abrirModal() está en main.js
    });
  });

  // Botones de favorito -> guardan o quitan del localStorage
  document.querySelectorAll('.btn-favorito').forEach(boton => {
    boton.addEventListener('click', () => {
      const id = parseInt(boton.dataset.id);
      const receta = todasLasRecetas.find(r => r.id === id);
      if (receta) toggleFavorito(receta, boton);
    });
  });
}


// ============================================
// FUNCIONALIDAD DE PERSISTENCIA: LOCALSTORAGE
// localStorage guarda datos en el navegador del usuario.
// Los datos persisten aunque se cierre el navegador.
// Es como un diccionario clave:valor donde todo se
// guarda como texto (string).
// ============================================

/**
 * Obtiene el array de favoritos del localStorage.
 * @returns {Array} - Array de recetas favoritas
 */
function obtenerFavoritos() {
  // localStorage.getItem('clave') devuelve el valor guardado,
  // o null si no existe esa clave.
  const guardados = localStorage.getItem('foodroulette_favoritos');

  if (guardados) {
    // JSON.parse() convierte el string JSON de vuelta a un objeto/array JavaScript.
    // localStorage solo guarda strings, por eso necesitamos convertir.
    return JSON.parse(guardados);
  }

  // Si no hay nada guardado, devolvemos un array vacío
  return [];
}

/**
 * Guarda el array de favoritos en localStorage.
 * @param {Array} favoritos - Array de recetas a guardar
 */
function guardarFavoritos(favoritos) {
  // JSON.stringify() convierte el objeto/array a string JSON.
  // localStorage.setItem('clave', 'valor') guarda el dato.
  localStorage.setItem('foodroulette_favoritos', JSON.stringify(favoritos));
}

/**
 * Agrega o quita una receta de los favoritos
 * y actualiza el botón visualmente.
 * @param {Object} receta - La receta a guardar/quitar
 * @param {HTMLElement} boton - El botón que se clickeó
 */
function toggleFavorito(receta, boton) {
  let favoritos = obtenerFavoritos();
  const indice = favoritos.findIndex(fav => fav.id === receta.id);
  // findIndex() devuelve el índice del primer elemento que cumple
  // la condición, o -1 si no existe.

  if (indice === -1) {
    // No estaba: la agregamos
    favoritos.push(receta);
    boton.classList.add('guardado');
    boton.textContent = '❤️ Guardada';
    boton.setAttribute('aria-label', 'Quitar de favoritos');
  } else {
    // Ya estaba: la quitamos
    favoritos.splice(indice, 1);
    boton.classList.remove('guardado');
    boton.textContent = '🤍 Guardar';
    boton.setAttribute('aria-label', 'Guardar en favoritos');
  }

  // Guardamos el array actualizado
  guardarFavoritos(favoritos);
}


// ============================================
// FUNCIONES AUXILIARES
// ============================================

/**
 * Actualiza el contador de resultados
 * @param {number} cantidad - Cantidad de recetas encontradas
 */
function actualizarContador(cantidad) {
  const contador = document.getElementById('cantidadResultados');
  if (cantidad === 0) {
    contador.textContent = 'Sin resultados';
  } else if (cantidad === 1) {
    contador.textContent = '1 receta encontrada';
  } else {
    contador.textContent = `${cantidad} recetas encontradas`;
  }
}

/**
 * Muestra un mensaje cuando no hay recetas para mostrar
 * @param {string} mensaje - El texto del mensaje
 */
function mostrarMensajeVacio(mensaje) {
  const grilla = document.getElementById('grillaRecetas');
  grilla.innerHTML = `
    <div class="mensaje-vacio" style="grid-column: 1 / -1">
      <p>🍽️</p>
      <p>${mensaje}</p>
      <a href="ruleta.html" class="btn btn-secundario" style="margin-top: 1rem; display: inline-flex">
        🔄 Limpiar filtros
      </a>
    </div>
  `;
}
