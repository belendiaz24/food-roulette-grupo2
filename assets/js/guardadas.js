// ============================================
// guardadas.js
// Lógica de la página "Mis favoritas".
// Lee las recetas guardadas en localStorage
// y las muestra en pantalla.
// ============================================

/**
 * Obtiene los favoritos del localStorage.
 * (misma función que en ruleta.js, necesaria acá
 * porque los archivos JS no se comparten automáticamente)
 */
function obtenerFavoritos() {
  const guardados = localStorage.getItem('foodroulette_favoritos');
  return guardados ? JSON.parse(guardados) : [];
}

function guardarFavoritos(favoritos) {
  localStorage.setItem('foodroulette_favoritos', JSON.stringify(favoritos));
}


/**
 * Función principal: renderiza las recetas favoritas.
 * Se llama cuando carga la página.
 */
function renderizarFavoritas() {
  const grilla = document.getElementById('grillaFavoritas');
  const favoritos = obtenerFavoritos();

  // Si no hay favoritos, mostramos un mensaje especial
  if (favoritos.length === 0) {
    grilla.innerHTML = `
      <div class="mensaje-vacio" style="grid-column: 1 / -1; margin-top: 3rem">
        <p>😢</p>
        <p>Todavía no guardaste ninguna receta favorita.</p>
        <a href="ruleta.html" class="btn btn-primario" style="margin-top: 1rem; display: inline-flex">
          🎯 Buscar recetas
        </a>
      </div>
    `;
    return;
  }

  // Si hay favoritos, creamos las cards
  grilla.innerHTML = favoritos.map(receta => `
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
          <button class="btn btn-primario btn-ver" data-id="${receta.id}">
            📖 Ver receta
          </button>
          <button class="btn-favorito guardado" data-id="${receta.id}" aria-label="Quitar de favoritos">
            ❤️ Quitar
          </button>
        </div>
      </div>
    </article>
  `).join('');

  // Asignamos eventos a los botones recién creados
  asignarEventos(favoritos);
}

/**
 * Asigna eventos a los botones de las cards
 * @param {Array} favoritos - Array de recetas favoritas
 */
function asignarEventos(favoritos) {
  // Botones "Ver receta"
  document.querySelectorAll('.btn-ver').forEach(boton => {
    boton.addEventListener('click', () => {
      const id = parseInt(boton.dataset.id);
      const receta = favoritos.find(r => r.id === id);
      if (receta) abrirModal(receta); // abrirModal() viene de main.js
    });
  });

  // Botones "Quitar" -> eliminan de favoritos y re-renderizan
  document.querySelectorAll('.btn-favorito').forEach(boton => {
    boton.addEventListener('click', () => {
      const id = parseInt(boton.dataset.id);
      let favoritosActuales = obtenerFavoritos();

      // Filtramos fuera la receta con ese id
      // filter() devuelve un nuevo array sin los elementos
      // que devuelvan false. Acá excluimos el id clickeado.
      favoritosActuales = favoritosActuales.filter(r => r.id !== id);
      guardarFavoritos(favoritosActuales);

      // Volvemos a renderizar la página con la lista actualizada
      renderizarFavoritas();
    });
  });
}

// Ejecutamos la función al cargar la página
// Esto es equivalente a decir "cuando la página esté lista, hacé esto"
renderizarFavoritas();
