/**
 * Archivo: main.js
 * Descripción: Script principal para el portfolio de Leandro Palombo
 * Autor: Leandro Palombo
 * Versión: 1.0.0
 */

// ========================================
// Variables globales
// ========================================
let scrollPosicionAnterior = 0;
let navegacionPrincipal = null;
let menuHamburguesa = null;
let navegacionMenu = null;
let botonTema = null;
let botonArriba = null;
let cursorPunto = null;
let cursorAnillo = null;

// ========================================
// Inicialización principal
// ========================================
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 Portfolio de Leandro Palombo iniciado');
    
    // Obtener elementos del DOM
    obtenerElementosDOM();
    
    // Inicializar componentes
    inicializarNavegacion();
    inicializarCursorPersonalizado();
    inicializarBotonArriba();
    inicializarTema();
    inicializarAnimacionesScroll();
    inicializarEnlacesSuaves();
    inicializarAnimacionesHero();
    inicializarIndicadorScroll();
    
    // Efectos visuales
    crearParticulasFondo();
    inicializarCanvasHero();
    
    // Observadores
    inicializarObservadorInterseccion();
    
    console.log('✅ Todos los componentes iniciados correctamente');
});

// ========================================
// Inicializar indicador de scroll
// ========================================
function inicializarIndicadorScroll() {
    const heroScroll = document.getElementById('heroScroll');
    if (!heroScroll) return;
    
    // Ocultar en dispositivos móviles muy pequeños
    if (window.innerHeight < 600) {
        heroScroll.style.display = 'none';
        return;
    }
    
    // Click para hacer scroll
    heroScroll.addEventListener('click', function() {
        const sobreMi = document.getElementById('sobre-mi');
        if (sobreMi) {
            sobreMi.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Hacer clickeable
    heroScroll.style.cursor = 'pointer';
    heroScroll.style.pointerEvents = 'auto';
}

// ========================================
// Obtener elementos del DOM
// ========================================
function obtenerElementosDOM() {
    navegacionPrincipal = document.getElementById('navegacionPrincipal');
    menuHamburguesa = document.getElementById('menuHamburguesa');
    navegacionMenu = document.getElementById('navegacionMenu');
    botonTema = document.getElementById('botonTema');
    botonArriba = document.getElementById('botonArriba');
    cursorPunto = document.querySelector('.cursor-punto');
    cursorAnillo = document.querySelector('.cursor-anillo');
}

// ========================================
// Navegación principal
// ========================================
function inicializarNavegacion() {
    if (!navegacionPrincipal) return;
    
    // Efecto de scroll en navegación
    window.addEventListener('scroll', manejarScrollNavegacion);
    
    // Menú móvil
    if (menuHamburguesa && navegacionMenu) {
        menuHamburguesa.addEventListener('click', alternarMenuMovil);
        
        // Cerrar menú al hacer click en enlaces
        const enlaces = navegacionMenu.querySelectorAll('.navegacion-enlace');
        enlaces.forEach(enlace => {
            enlace.addEventListener('click', () => {
                cerrarMenuMovil();
                actualizarEnlaceActivo(enlace);
            });
        });
    }
}

// ========================================
// Manejo del scroll
// ========================================
function manejarScrollNavegacion() {
    const scrollActual = window.pageYOffset;
    
    // Agregar clase cuando se hace scroll
    if (scrollActual > 50) {
        navegacionPrincipal.classList.add('scrolled');
    } else {
        navegacionPrincipal.classList.remove('scrolled');
    }
    
    // Ocultar/mostrar navegación según dirección del scroll
    if (scrollActual > scrollPosicionAnterior && scrollActual > 100) {
        navegacionPrincipal.style.transform = 'translateY(-100%)';
    } else {
        navegacionPrincipal.style.transform = 'translateY(0)';
    }
    
    // Ocultar indicador de scroll del hero de manera confiable
    const heroScroll = document.getElementById('heroScroll');
    if (heroScroll) {
        // Usar requestAnimationFrame para asegurar que el cambio se aplique
        requestAnimationFrame(() => {
            if (scrollActual > 100) {
                heroScroll.classList.add('oculto');
                heroScroll.style.pointerEvents = 'none';
            } else {
                heroScroll.classList.remove('oculto');
                heroScroll.style.pointerEvents = 'auto';
            }
        });
    }
    
    scrollPosicionAnterior = scrollActual;
}

function alternarMenuMovil() {
    menuHamburguesa.classList.toggle('activo');
    navegacionMenu.classList.toggle('activo');
    document.body.classList.toggle('menu-abierto');
}

function cerrarMenuMovil() {
    menuHamburguesa.classList.remove('activo');
    navegacionMenu.classList.remove('activo');
    document.body.classList.remove('menu-abierto');
}

function actualizarEnlaceActivo(enlaceActivo) {
    const enlaces = document.querySelectorAll('.navegacion-enlace');
    enlaces.forEach(enlace => enlace.classList.remove('activo'));
    enlaceActivo.classList.add('activo');
}

// ========================================
// Cursor personalizado
// ========================================
function inicializarCursorPersonalizado() {
    if (!cursorPunto || !cursorAnillo) return;
    
    // Solo en dispositivos con cursor
    if (window.matchMedia("(pointer: coarse)").matches) {
        cursorPunto.style.display = 'none';
        cursorAnillo.style.display = 'none';
        return;
    }
    
    document.addEventListener('mousemove', moverCursor);
    document.addEventListener('mousedown', presionarCursor);
    document.addEventListener('mouseup', soltarCursor);
    
    // Efectos hover en elementos interactivos
    const elementosInteractivos = document.querySelectorAll('a, button, .tarjeta-cristal');
    elementosInteractivos.forEach(elemento => {
        elemento.addEventListener('mouseenter', () => expandirCursor());
        elemento.addEventListener('mouseleave', () => contraerCursor());
    });
}

function moverCursor(e) {
    const x = e.clientX;
    const y = e.clientY;
    
    cursorPunto.style.transform = `translate(${x - 4}px, ${y - 4}px)`;
    cursorAnillo.style.transform = `translate(${x - 15}px, ${y - 15}px)`;
}

function presionarCursor() {
    cursorAnillo.style.transform += ' scale(0.8)';
}

function soltarCursor() {
    cursorAnillo.style.transform = cursorAnillo.style.transform.replace(' scale(0.8)', '');
}

function expandirCursor() {
    cursorAnillo.style.transform += ' scale(1.5)';
    cursorAnillo.style.borderColor = 'var(--color-secundario)';
}

function contraerCursor() {
    cursorAnillo.style.transform = cursorAnillo.style.transform.replace(' scale(1.5)', '');
    cursorAnillo.style.borderColor = 'var(--color-primario)';
}

// ========================================
// Botón volver arriba
// ========================================
function inicializarBotonArriba() {
    if (!botonArriba) return;
    
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            botonArriba.classList.add('visible');
        } else {
            botonArriba.classList.remove('visible');
        }
    });
    
    botonArriba.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });
}

// ========================================
// Sistema de temas
// ========================================
function inicializarTema() {
    if (!botonTema) return;
    
    // Cargar tema guardado
    const temaGuardado = localStorage.getItem('tema') || 'oscuro';
    if (temaGuardado === 'claro') {
        document.body.classList.add('tema-claro');
    }
    
    botonTema.addEventListener('click', () => {
        document.body.classList.toggle('tema-claro');
        const temaActual = document.body.classList.contains('tema-claro') ? 'claro' : 'oscuro';
        localStorage.setItem('tema', temaActual);
        
        // Animación de transición
        document.body.style.transition = 'background 0.3s ease';
    });
}

// ========================================
// Enlaces suaves
// ========================================
function inicializarEnlacesSuaves() {
    const enlaces = document.querySelectorAll('a[href^="#"]');
    
    enlaces.forEach(enlace => {
        enlace.addEventListener('click', function(e) {
            e.preventDefault();
            
            const destino = document.querySelector(this.getAttribute('href'));
            if (!destino) return;
            
            const offsetTop = destino.offsetTop - 80; // Compensar altura del header
            
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        });
    });
}

// ========================================
// Animaciones del Hero
// ========================================
function inicializarAnimacionesHero() {
    // Animar etiquetas con delay
    const etiquetas = document.querySelectorAll('.etiqueta-hero');
    etiquetas.forEach((etiqueta, index) => {
        etiqueta.style.animationDelay = `${index * 0.1}s`;
        
        if (etiqueta.dataset.animacion === 'flotar') {
            etiqueta.style.animation = `entradaHero 0.8s ${index * 0.1}s cubic-bezier(0.68, -0.55, 0.265, 1.55) both, flotarSuave 3s ${index * 0.1}s ease-in-out infinite`;
        } else if (etiqueta.dataset.animacion === 'pulso') {
            etiqueta.style.animation = `entradaHero 0.8s ${index * 0.1}s cubic-bezier(0.68, -0.55, 0.265, 1.55) both`;
        }
    });
    
    // Animar texto del hero con efecto de escritura
    const tituloNombre = document.querySelector('.hero-titulo-nombre');
    if (tituloNombre) {
        animarTextoEscritura(tituloNombre);
    }
}

function animarTextoEscritura(elemento) {
    const texto = elemento.textContent;
    elemento.textContent = '';
    elemento.style.opacity = '1';
    
    let index = 0;
    const intervalo = setInterval(() => {
        if (index < texto.length) {
            elemento.textContent += texto[index];
            index++;
        } else {
            clearInterval(intervalo);
        }
    }, 100);
}

// ========================================
// Partículas de fondo
// ========================================
function crearParticulasFondo() {
    const contenedorParticulas = document.getElementById('particulasFondo');
    if (!contenedorParticulas) return;
    
    const numeroParticulas = 30;
    
    for (let i = 0; i < numeroParticulas; i++) {
        const particula = document.createElement('div');
        particula.className = 'particula';
        
        // Posición aleatoria
        particula.style.left = Math.random() * 100 + '%';
        particula.style.animationDelay = Math.random() * 20 + 's';
        particula.style.animationDuration = (15 + Math.random() * 10) + 's';
        
        // Tamaño aleatorio
        const tamano = Math.random() * 4 + 2;
        particula.style.width = tamano + 'px';
        particula.style.height = tamano + 'px';
        
        // Color aleatorio entre los colores del tema
        const colores = ['var(--color-primario)', 'var(--color-secundario)', 'var(--color-purpura)'];
        particula.style.background = colores[Math.floor(Math.random() * colores.length)];
        
        contenedorParticulas.appendChild(particula);
    }
}

// ========================================
// Canvas del Hero
// ========================================
function inicializarCanvasHero() {
    const canvas = document.getElementById('canvasHero');
    if (!canvas) return;
    
    const ctx = canvas.getContext('2d');
    
    // Ajustar tamaño del canvas
    function ajustarCanvas() {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    }
    
    ajustarCanvas();
    window.addEventListener('resize', ajustarCanvas);
    
    // Crear puntos conectados
    const puntos = [];
    const numeroPuntos = 50;
    
    for (let i = 0; i < numeroPuntos; i++) {
        puntos.push({
            x: Math.random() * canvas.width,
            y: Math.random() * canvas.height,
            vx: (Math.random() - 0.5) * 0.5,
            vy: (Math.random() - 0.5) * 0.5,
            radio: Math.random() * 2 + 1
        });
    }
    
    function animar() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        // Actualizar y dibujar puntos
        puntos.forEach(punto => {
            punto.x += punto.vx;
            punto.y += punto.vy;
            
            // Rebotar en los bordes
            if (punto.x < 0 || punto.x > canvas.width) punto.vx *= -1;
            if (punto.y < 0 || punto.y > canvas.height) punto.vy *= -1;
            
            ctx.beginPath();
            ctx.arc(punto.x, punto.y, punto.radio, 0, Math.PI * 2);
            ctx.fillStyle = 'rgba(0, 122, 255, 0.3)';
            ctx.fill();
        });
        
        // Conectar puntos cercanos
        for (let i = 0; i < puntos.length; i++) {
            for (let j = i + 1; j < puntos.length; j++) {
                const dx = puntos[i].x - puntos[j].x;
                const dy = puntos[i].y - puntos[j].y;
                const distancia = Math.sqrt(dx * dx + dy * dy);
                
                if (distancia < 150) {
                    ctx.beginPath();
                    ctx.moveTo(puntos[i].x, puntos[i].y);
                    ctx.lineTo(puntos[j].x, puntos[j].y);
                    ctx.strokeStyle = `rgba(0, 122, 255, ${0.2 * (1 - distancia / 150)})`;
                    ctx.stroke();
                }
            }
        }
        
        requestAnimationFrame(animar);
    }
    
    animar();
}

// ========================================
// Observador de intersección
// ========================================
function inicializarObservadorInterseccion() {
    const opciones = {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    };
    
    const observador = new IntersectionObserver((entradas) => {
        entradas.forEach(entrada => {
            if (entrada.isIntersecting) {
                entrada.target.classList.add('aos-animate');
                
                // Actualizar navegación activa
                actualizarNavegacionActiva(entrada.target);
            }
        });
    }, opciones);
    
    // Observar elementos con data-aos
    const elementosAnimados = document.querySelectorAll('[data-aos]');
    elementosAnimados.forEach(elemento => {
        observador.observe(elemento);
    });
    
    // Observar secciones para navegación
    const secciones = document.querySelectorAll('section[id]');
    secciones.forEach(seccion => {
        observador.observe(seccion);
    });
}

function actualizarNavegacionActiva(seccion) {
    if (!seccion.id) return;
    
    const enlaceActivo = document.querySelector(`.navegacion-enlace[href="#${seccion.id}"]`);
    if (enlaceActivo) {
        const enlaces = document.querySelectorAll('.navegacion-enlace');
        enlaces.forEach(enlace => enlace.classList.remove('activo'));
        enlaceActivo.classList.add('activo');
    }
}

// ========================================
// Animaciones de scroll
// ========================================
function inicializarAnimacionesScroll() {
    let ticking = false;
    
    function actualizarAnimaciones() {
        const scrollY = window.pageYOffset;
        
        // Parallax en el hero (reducido para evitar que se solape)
        const hero = document.querySelector('.hero-contenido');
        if (hero && scrollY < 800) {
            hero.style.transform = `translateY(${scrollY * 0.3}px)`;
            hero.style.opacity = Math.max(0.3, 1 - (scrollY / 1000));
        }
        
        // Parallax en el fondo
        const heroFondo = document.querySelector('.hero-gradiente');
        if (heroFondo) {
            heroFondo.style.transform = `translateY(${scrollY * 0.2}px) rotate(${scrollY * 0.01}deg)`;
        }
        
        ticking = false;
    }
    
    function solicitarTick() {
        if (!ticking) {
            window.requestAnimationFrame(actualizarAnimaciones);
            ticking = true;
        }
    }
    
    window.addEventListener('scroll', solicitarTick);
}

// ========================================
// Utilidades
// ========================================
function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

function throttle(func, limit) {
    let inThrottle;
    return function(...args) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

// ========================================
// Manejo de errores
// ========================================
window.addEventListener('error', function(e) {
    console.error('Error capturado:', e.error);
});

// ========================================
// Performance monitoring
// ========================================
if ('performance' in window) {
    window.addEventListener('load', function() {
        const perfData = window.performance.timing;
        const pageLoadTime = perfData.loadEventEnd - perfData.navigationStart;
        console.log(`⚡ Página cargada en ${pageLoadTime}ms`);
    });
}

// ========================================
// Service Worker (opcional para PWA)
// ========================================
if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
        navigator.serviceWorker.register('/sw.js').then(
            registration => console.log('Service Worker registrado:', registration),
            err => console.log('Service Worker falló:', err)
        );
    });
}

// Exportar funciones para uso en otros módulos
window.portfolioUtils = {
    debounce,
    throttle,
    actualizarEnlaceActivo,
    cerrarMenuMovil
};