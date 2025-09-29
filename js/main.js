// ==================== SISTEMA DE CARRUSEL DE PROYECTOS ====================
let indiceActual = 0;
let proyectos = [];
const totalProyectos = () => proyectos.length;
const btnAnterior = document.getElementById('btnAnterior');
const btnSiguiente = document.getElementById('btnSiguiente');
const indicador = document.getElementById('indicador');
const contenedorProyectos = document.getElementById('contenedor-proyectos');
const perfilInfo = document.getElementById('perfil-info');

async function loadProjectData() {
    try {
        const response = await fetch('data/projects.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        const data = await response.json();
        proyectos = data.projects;
        renderProfile(data.profile);
        renderProjects();
        mostrarProyecto(0);
    } catch (error) {
        console.error("Error loading project data:", error);
        // Optionally display an error message to the user
        contenedorProyectos.innerHTML = '<p style="color: var(--acento-rosa);">Error al cargar los proyectos. Inténtalo de nuevo más tarde.</p>';
    }
}

function renderProfile(profile) {
    const profileHTML = `
        <div class="cabecera-json">// profile.json</div>
        <div class="linea-json">
          <span class="clave-json">"nombre"</span>: <span class="valor-json">"${profile.nombre}"</span>,
        </div>
        <div class="linea-json">
          <span class="clave-json">"titulo"</span>: <span class="valor-json rosa">"${profile.titulo}"</span>,
        </div>
        <div class="linea-json">
          <span class="clave-json">"ubicacion"</span>: <span class="valor-json">"${profile.ubicacion}"</span>,
        </div>
        <div class="linea-json">
          <span class="clave-json">"bio"</span>: <span class="valor-json">${JSON.stringify(profile.bio)}</span>,
        </div>
    `;
    perfilInfo.innerHTML = profileHTML;
}

function renderProjects() {
    contenedorProyectos.innerHTML = '';
    proyectos.forEach((project, index) => {
        const projectElement = renderProjectItem(project, index);
        contenedorProyectos.appendChild(projectElement);
    });
}

function renderProjectItem(project, index) {
    const projectDiv = document.createElement('div');
    projectDiv.classList.add('marco-ascii', 'proyecto-item');
    if (index !== 0) {
        projectDiv.classList.add('oculto');
    }

    // Generar HTML para las etiquetas
    const tagsHTML = project.tags.map(tag => `<span class="etiqueta"># ${tag}</span>`).join('');

    // Generar HTML para los enlaces
    let linksHTML = '';
    if (project.github_url) {
        linksHTML += `<a href="${project.github_url}" target="_blank" rel="noopener noreferrer" class="project-link">Ver Código</a>`;
    }
    if (project.live_demo_url) {
        linksHTML += `<a href="${project.live_demo_url}" target="_blank" rel="noopener noreferrer" class="project-link">Demo en Vivo</a>`;
    }

    // Generar HTML para la imagen si existe
    let imageHTML = '';
    if (project.imagen_url) {
        imageHTML = `<img src="${project.imagen_url}" alt="${project.nombre}" class="project-image">`;
    }

    projectDiv.innerHTML = `
        <div class="contenido-proyecto">
            <div class="cabecera-proyecto">
                <div class="nombre-proyecto">PROYECTO: ${project.nombre}</div>
                <div class="estado-proyecto" style="background-color: ${project.status_color};">${project.status}</div>
            </div>
            ${imageHTML}
            <div class="descripcion-proyecto">
                ${project.descripcion}
            </div>
            <div class="etiquetas-proyecto">
                ${tagsHTML}
            </div>
            <div class="project-links-container">
                ${linksHTML}
            </div>
        </div>
    `;
    return projectDiv;
}

function mostrarProyecto(indice) {
    const proyectosElements = document.querySelectorAll('.proyecto-item');
    proyectosElements.forEach((proyecto, index) => {
        if (index === indice) {
            proyecto.classList.remove('oculto');
        } else {
            proyecto.classList.add('oculto');
        }
    });

    indicador.textContent = `${indice + 1} / ${totalProyectos()}`;
    btnAnterior.disabled = (indice === 0);
    btnSiguiente.disabled = (indice === totalProyectos() - 1);
}

btnAnterior.addEventListener('click', () => {
    if (indiceActual > 0) {
        indiceActual--;
        mostrarProyecto(indiceActual);
    }
});

btnSiguiente.addEventListener('click', () => {
    if (indiceActual < totalProyectos() - 1) {
        indiceActual++;
        mostrarProyecto(indiceActual);
    }
});

document.addEventListener('keydown', (e) => {
    if (e.key === 'ArrowLeft' && indiceActual > 0) {
        indiceActual--;
        mostrarProyecto(indiceActual);
    } else if (e.key === 'ArrowRight' && indiceActual < totalProyectos() - 1) {
        indiceActual++;
        mostrarProyecto(indiceActual);
    }
});

document.addEventListener('DOMContentLoaded', () => {
    loadProjectData();
});



// ==================== EFECTOS INTERACTIVOS ====================

// Efecto hover en controles de tráfico
const controles = document.querySelectorAll('.boton-control');
controles.forEach(control => {
  control.addEventListener('click', () => {
    control.style.transform = 'scale(0.9)';
    setTimeout(() => {
      control.style.transform = 'scale(1)';
    }, 150);
  });
});

// Animación de aparición suave al cargar
window.addEventListener('load', () => {
  const contenedor = document.querySelector('.contenedor-terminal');
  contenedor.style.animation = 'aparecerContenedor 0.6s cubic-bezier(0.4, 0, 0.2, 1) forwards';
});

// Agregar estilo de animación de aparición
const styleSheet = document.createElement('style');
styleSheet.textContent = `
  @keyframes aparecerContenedor {
    from {
      opacity: 0;
      transform: scale(0.95) translateY(20px);
    }
    to {
      opacity: 1;
      transform: scale(1) translateY(0);
    }
  }
`;
document.head.appendChild(styleSheet);

// ==================== CONSOLA INTERACTIVA (Easter Egg) ====================
console.log('%c⚡ dev@portfolio-server: ~$ ', 'color: #a6e3a1; font-family: monospace; font-size: 14px; font-weight: bold;');
console.log('%cBienvenido al portfolio de Leandro Palombo', 'color: #89dceb; font-family: monospace; font-size: 12px;');
console.log('%cComandos disponibles:', 'color: #f5c2e7; font-family: monospace; font-size: 12px;');
console.log('%c  → cat profile.json', 'color: #cdd6f4; font-family: monospace; font-size: 11px;');
console.log('%c  → cat projects.json', 'color: #cdd6f4; font-family: monospace; font-size: 11px;');
console.log('%c  → ls -la /dev/skills', 'color: #cdd6f4; font-family: monospace; font-size: 11px;');
console.log('%c  → echo $CONTACT_INFO', 'color: #cdd6f4; font-family: monospace; font-size: 11px;');
