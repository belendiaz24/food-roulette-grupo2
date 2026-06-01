# 🎰 Food Roulette

## Descripción
Food Roulette es un recomendador de recetas que te ayuda a decidir qué cocinar según los ingredientes que tenés disponibles, el tiempo que tenés y el nivel de dificultad que preferís. Guardá tus recetas favoritas y volvé a encontrarlas cuando quieras.

## Integrantes
- Nombre Apellido
- Nombre Apellido
- Nombre Apellido

## Idea elegida
Idea 8: Food Roulette — recomendador de recetas basado en ingredientes disponibles, tiempo y dificultad.

## Tecnologías utilizadas
- HTML5 (semántico)
- CSS3 (Flexbox, Grid, Media Queries, Animaciones)
- JavaScript Vanilla (ES6+)
- localStorage para persistencia
- Google Fonts (Playfair Display + DM Sans)

## Funcionalidades principales
- 🎯 **Filtro por ingredientes**: seleccioná los ingredientes disponibles con chips interactivos
- ⏱️ **Filtro por tiempo**: elegí cuánto tiempo tenés para cocinar
- 🎯 **Filtro por dificultad**: fácil, media o difícil
- 📖 **Modal de detalle**: visualizá los pasos de preparación de cada receta
- ❤️ **Sistema de favoritos**: guardá recetas con localStorage (persisten al recargar)
- 📱 **Responsive**: adaptado para mobile y desktop

## Links
- Repositorio: [URL del repositorio]
- Deploy: [URL del deploy]

## Instrucciones de uso
1. Abrí el sitio desde el link del deploy
2. Hacé click en "Buscar receta"
3. Seleccioná los ingredientes que tenés disponibles
4. Elegí cuánto tiempo tenés
5. Filtrá por dificultad si querés
6. Hacé click en "Ver receta" para ver los pasos
7. Guardá las que te gustan con el botón ❤️
8. Visitá "Mis favoritas" para verlas todas juntas

## Estructura del proyecto
```
/food-roulette
├── index.html              → Página de inicio
├── README.md
├── pages/
│   ├── ruleta.html         → Buscador de recetas con filtros
│   └── guardadas.html      → Recetas guardadas en favoritos
└── assets/
    ├── css/
    │   └── styles.css      → Estilos globales + responsive
    ├── js/
    │   ├── main.js         → Menú hamburguesa + modal (compartido)
    │   ├── ruleta.js       → Filtros, cards y localStorage
    │   └── guardadas.js    → Renderizado de favoritos
    ├── img/                → Imágenes (si aplica)
    └── data/
        └── recetas.json    → Base de datos de recetas
```

## Uso de IA
Se utilizaron herramientas de inteligencia artificial como asistentes de código durante el desarrollo.  
El detalle completo está documentado en el siguiente informe:

[📄 Informe de uso de Inteligencia Artificial grupo 2](https://github.com/belendiaz24/food-roulette-grupo2/blob/patch-2/Informe-IA-grupo2)
