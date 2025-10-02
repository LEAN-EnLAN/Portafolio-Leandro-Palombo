# Portafolio Profesional de Leandro Palombo

Este es el código fuente de mi portafolio personal, una carta de presentación interactiva como Desarrollador de Software de nivel medio. El proyecto está diseñado no solo para mostrar mis habilidades y proyectos, sino también para ser una demostración en sí mismo de mi enfoque hacia el desarrollo: limpio, eficiente y centrado en la experiencia de usuario.

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

### Estructura de Archivos

El código está organizado de manera lógica para facilitar su mantenimiento y escalabilidad:

```
/
├── assets/
│   └── PALOMBO, Leandro CV.pdf
├── css/
│   └── style.css
├── data/
│   └── projects.json
├── js/
│   └── main.js
├── index.html
└── README.md
```

*   **`assets/`**: Contiene todos los recursos estáticos como imágenes, PDFs, etc.
*   **`css/`**: Contiene la hoja de estilos principal.
*   **`data/`**: Contiene los datos del perfil y los proyectos en formato JSON.
*   **`js/`**: Contiene la lógica de la aplicación, incluyendo la carga de datos y la interactividad.

## ⚙️ Lógica de la Aplicación

El JavaScript del proyecto está modularizado para mantener el código limpio y enfocado en funcionalidades específicas.

### Carga de Datos Dinámica

El contenido del portafolio (perfil y proyectos) se carga dinámicamente desde el archivo `data/projects.json`. Esto se hace mediante una petición `fetch` en el archivo `js/main.js`. Esto permite una fácil actualización del contenido sin tener que modificar el código HTML.

### Interactividad

*   **Carrusel de Proyectos:** Permite navegar entre los proyectos con botones y flechas del teclado.
*   **Animaciones:** Se utilizan animaciones sutiles para mejorar la experiencia de usuario.

## 🚀 Cómo ejecutar el proyecto

Para ver el portafolio en acción, puedes clonar este repositorio y servir los archivos con un servidor HTTP simple. Una forma de hacerlo es con Python:

```bash
python3 -m http.server
```

Luego, abre tu navegador y ve a `http://localhost:8000`.

---

Gracias por explorar el código de mi portafolio. Si tienes alguna pregunta o sugerencia, no dudes en contactarme.
