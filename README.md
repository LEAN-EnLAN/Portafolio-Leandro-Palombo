# Portafolio Profesional de Leandro Palombo

Este es el código fuente de mi portafolio personal, una carta de presentación interactiva como Técnico en Informática y Desarrollador Web. El proyecto está diseñado no solo para mostrar mis habilidades y proyectos, sino también para ser una demostración en sí mismo de mi enfoque hacia el desarrollo: limpio, eficiente y centrado en la experiencia de usuario.

## ✨ Filosofía del Proyecto

El objetivo principal era crear una experiencia de usuario fluida y atractiva. Cada decisión de diseño y de código se tomó con estos principios en mente:

*   **Claridad y Minimalismo:** La interfaz es limpia y se centra en el contenido, evitando distracciones.
*   **Interactividad Sutil:** Las animaciones y efectos están diseñados para guiar al usuario y añadir un toque de personalidad sin ser abrumadores.
*   **Rendimiento:** El sitio está optimizado para cargar rápidamente y funcionar de manera fluida en una amplia gama de dispositivos.

## 🛠️ Estructura y Tecnologías

El proyecto está construido con tecnologías web estándar, siguiendo una estructura modular y fácil de mantener.

### Tecnologías Principales

*   **HTML5:** Para la estructura semántica del contenido.
*   **CSS3:** Para el diseño y los estilos, con un enfoque moderno y componentizado.
*   **JavaScript (ES6+):** Para la interactividad y la manipulación dinámica del DOM.
*   **Bootstrap 5:** Utilizado como base para el sistema de rejilla (grid) y para asegurar la compatibilidad entre navegadores, aunque muchos componentes tienen estilos personalizados para un diseño único.

### Estructura de Archivos

El código está organizado de manera lógica para facilitar su mantenimiento y escalabilidad:

```
/
├── assets/
│   └── ... (imágenes, CV, etc.)
├── css/
│   ├── componentes/
│   │   ├── animaciones.css
│   │   ├── botones.css
│   │   ├── sobre-mi.css
│   │   └── tarjetas.css
│   ├── temas/
│   │   └── oscuro.css
│   └── main.css
├── js/
│   ├── componentes/
│   │   ├── animaciones.js
│   │   ├── habilidades.js
│   │   └── navegacion.js
│   ├── utilidades/
│   │   ├── particulas.js
│   │   └── scroll.js
│   └── main.js
├── index.html
└── README.md
```

*   **`assets/`**: Contiene todos los recursos estáticos como imágenes, PDFs, etc.
*   **`css/`**: Organizado en subcarpetas para separar los estilos globales (`main.css`), los estilos de componentes específicos (`componentes/`) y los temas (`temas/`).
*   **`js/`**: Similar a CSS, se divide en lógica de componentes (`componentes/`) y funciones de utilidad reutilizables (`utilidades/`). El archivo `main.js` actúa como el punto de entrada que orquesta todo.

## 🎨 Arquitectura CSS

El CSS está escrito siguiendo una metodología similar a BEM (Bloque, Elemento, Modificador) y está componentizado para ser reutilizable y mantenible.

### Variables CSS

El archivo `main.css` define una paleta de colores, tipografías y tamaños en la pseudoclase `:root`. Esto permite cambiar el aspecto de todo el sitio modificando solo unas pocas líneas de código, y es la base para el sistema de temas (claro/oscuro).

### Componentes

Cada pieza de la interfaz (botones, tarjetas, etc.) tiene su propia hoja de estilos en la carpeta `css/componentes/`. Esto mantiene el código CSS organizado y evita conflictos entre estilos.

### Glassmorphism y Sombras

El efecto de "cristal esmerilado" (glassmorphism) se utiliza en las tarjetas para crear una sensación de profundidad y modernidad. Este efecto se logra con la propiedad `backdrop-filter: blur()`. Las sombras se han diseñado para ser sutiles y realistas, añadiendo profundidad sin sobrecargar la interfaz.

## ⚙️ Lógica de JavaScript

El JavaScript del proyecto está modularizado para mantener el código limpio y enfocado en funcionalidades específicas.

### `main.js`

Este archivo es el "director de orquesta". Se encarga de inicializar todos los demás módulos y componentes, como la navegación, el cursor personalizado y las animaciones.

### Interactividad

*   **Cursor Personalizado:** Para añadir un toque único a la experiencia de escritorio, se ha creado un cursor personalizado que reacciona a los elementos interactivos.
*   **Animaciones de Scroll:** Se utilizan animaciones sutiles para revelar el contenido a medida que el usuario se desplaza por la página. Esto se logra con un observador de intersección (`IntersectionObserver`), una técnica moderna y eficiente que no sobrecarga el navegador.
*   **Efecto Parallax:** El parallax en la sección de inicio crea una sensación de profundidad y dinamismo. Está implementado de forma que no afecte negativamente al rendimiento.

### Optimización

Se utilizan técnicas como el "debounce" en los eventos de `scroll` y `resize` para evitar que el navegador se sobrecargue con demasiadas llamadas a funciones, asegurando una experiencia fluida.

## 🚀 Mejoras y Futuro

Este proyecto está en constante evolución. Algunas de las áreas en las que planeo trabajar son:

*   **Optimización de imágenes:** Comprimir y servir imágenes en formatos modernos como WebP.
*   **Pruebas de rendimiento:** Realizar pruebas más exhaustivas para asegurar la mejor experiencia en todos los dispositivos.
*   **Accesibilidad (A11y):** Continuar mejorando la accesibilidad para que el sitio sea usable por el mayor número de personas posible.

---

Gracias por explorar el código de mi portafolio. Si tienes alguna pregunta o sugerencia, no dudes en contactarme.