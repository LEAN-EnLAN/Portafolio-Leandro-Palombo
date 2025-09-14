/**
 * Archivo: navegacion.js
 * Descripción: Sistema de navegación y menú del portfolio
 * Autor: Leandro Palombo
 * Versión: 1.0.0
 */

(function() {
    'use strict';
    
    // ========================================
    // Configuración
    // ========================================
    const CONFIGURACION = {
        alturaHeader: 70,
        offsetScroll: 100,
        duracionTransicion: 300,
        breakpointMovil: 768,
        claseActiva: 'activo',
        claseScrolled: 'scrolled',
        claseMenuAbierto: 'menu-abierto'
    };
    
    // ========================================
    // Estado de la aplicación
    // ========================================
    const estado = {
        menuAbierto: false,
        scrollAnterior: 0,
        seccionActual: 'inicio',
        navegando: false,
        touchStartY: 0,
        touchEndY: 0
    };
    
    // ========================================
    // Elementos del DOM
    // ========================================
    let elementos = {};
    
    // ========================================
    // Inicialización
    // ========================================
    document.addEventListener('DOMContentLoaded', inicializar);
    
    function inicializar() {
        console.log('🧭 Inicializando sistema de navegación');
        
        obtenerElementos();
        configurarEventos();
        inicializarNavegacionScroll();
        inicializarMenuMovil();
        inicializarNavegacionTeclado();
        actualizarNavegacionActiva();
        inicializarIndicadorProgreso();
        
        console.log('✅ Sistema de navegación iniciado');
    }
    
    // ========================================
    // Obtener elementos del DOM
    // ========================================
    function obtenerElementos() {
        elementos = {
            navegacion: document.getElementById('navegacionPrincipal'),
            menuHamburguesa: document.getElementById('menuHamburguesa'),
            menuNavegacion: document.getElementById('navegacionMenu'),
            enlaces: document.querySelectorAll('.navegacion-enlace'),
            secciones: document.querySelectorAll('section[id]'),
            logo: document.querySelector('.navegacion-logo'),
            body: document.body
        };
    }
    
    // ========================================
    // Configurar eventos
    // ========================================
    function configurarEventos() {
        // Eventos de scroll
        window.addEventListener('scroll', manejarScroll);
        window.addEventListener('resize', manejarResize);
        
        // Eventos del menú
        if (elementos.menuHamburguesa) {
            elementos.menuHamburguesa.addEventListener('click', alternarMenu);
        }
        
        // Eventos de navegación
        elementos.enlaces.forEach(enlace => {
            enlace.addEventListener('click', manejarClickEnlace);
        });
        
        // Click en el logo
        if (elementos.logo) {
            elementos.logo.addEventListener('click', scrollArriba);
        }
        
        // Eventos táctiles
        configurarEventosTactiles();
    }
    
    // ========================================
    // Manejo del scroll
    // ========================================
    function manejarScroll() {
        const scrollActual = window.pageYOffset;
        
        // Agregar/quitar clase scrolled
        if (scrollActual > 50) {
            elementos.navegacion.classList.add(CONFIGURACION.claseScrolled);
        } else {
            elementos.navegacion.classList.remove(CONFIGURACION.claseScrolled);
        }
        
        // Ocultar/mostrar navegación según dirección
        if (!estado.menuAbierto) {
            if (scrollActual > estado.scrollAnterior && scrollActual > CONFIGURACION.offsetScroll) {
                ocultarNavegacion();
            } else {
                mostrarNavegacion();
            }
        }
        
        estado.scrollAnterior = scrollActual;
        
        // Actualizar navegación activa
        actualizarNavegacionActiva();
        
        // Actualizar indicador de progreso
        actualizarIndicadorProgreso();
    }
    
    function ocultarNavegacion() {
        elementos.navegacion.style.transform = 'translateY(-100%)';
        elementos.navegacion.style.boxShadow = 'none';
    }
    
    function mostrarNavegacion() {
        elementos.navegacion.style.transform = 'translateY(0)';
        if (window.pageYOffset > 50) {
            elementos.navegacion.style.boxShadow = 'var(--sombra-media)';
        }
    }
    
    // ========================================
    // Actualizar navegación activa
    // ========================================
    function actualizarNavegacionActiva() {
        const scrollY = window.pageYOffset;
        const alturaVentana = window.innerHeight;
        let seccionActual = '';
        
        elementos.secciones.forEach(seccion => {
            const offsetTop = seccion.offsetTop - CONFIGURACION.alturaHeader - 100;
            const altura = seccion.offsetHeight;
            
            if (scrollY >= offsetTop && scrollY < offsetTop + altura) {
                seccionActual = seccion.getAttribute('id');
            }
        });
        
        // Si estamos cerca del final, activar la última sección
        if (window.innerHeight + scrollY >= document.body.offsetHeight - 100) {
            const ultimaSeccion = elementos.secciones[elementos.secciones.length - 1];
            if (ultimaSeccion) {
                seccionActual = ultimaSeccion.getAttribute('id');
            }
        }
        
        // Actualizar clases activas
        if (seccionActual && seccionActual !== estado.seccionActual) {
            elementos.enlaces.forEach(enlace => {
                enlace.classList.remove(CONFIGURACION.claseActiva);
                
                if (enlace.getAttribute('data-seccion') === seccionActual ||
                    enlace.getAttribute('href') === '#' + seccionActual) {
                    enlace.classList.add(CONFIGURACION.claseActiva);
                    
                    // Efecto visual al cambiar de sección
                    agregarEfectoTransicion(enlace);
                }
            });
            
            estado.seccionActual = seccionActual;
            
            // Disparar evento personalizado
            window.dispatchEvent(new CustomEvent('seccionCambiada', {
                detail: { seccion: seccionActual }
            }));
        }
    }
    
    // ========================================
    // Navegación suave
    // ========================================
    function manejarClickEnlace(evento) {
        evento.preventDefault();
        
        const href = this.getAttribute('href');
        if (!href || href === '#') return;
        
        const destino = document.querySelector(href);
        if (!destino) return;
        
        // Cerrar menú móvil si está abierto
        if (estado.menuAbierto) {
            cerrarMenu();
        }
        
        // Navegar a la sección
        navegarASeccion(destino);
        
        // Actualizar URL sin recargar
        history.pushState(null, null, href);
    }
    
    function navegarASeccion(elemento) {
        if (estado.navegando) return;
        
        estado.navegando = true;
        
        const offsetTop = elemento.offsetTop - CONFIGURACION.alturaHeader;
        const duracion = calcularDuracionScroll(offsetTop);
        
        // Animación de scroll suave personalizada
        animarScroll(window.pageYOffset, offsetTop, duracion, () => {
            estado.navegando = false;
        });
    }
    
    function animarScroll(inicio, destino, duracion, callback) {
        const tiempoInicio = performance.now();
        const distancia = destino - inicio;
        
        function animacion(tiempoActual) {
            const tiempoTranscurrido = tiempoActual - tiempoInicio;
            const progreso = Math.min(tiempoTranscurrido / duracion, 1);
            
            // Función de easing
            const easeInOutCubic = progreso < 0.5
                ? 4 * progreso * progreso * progreso
                : 1 - Math.pow(-2 * progreso + 2, 3) / 2;
            
            window.scrollTo(0, inicio + distancia * easeInOutCubic);
            
            if (progreso < 1) {
                requestAnimationFrame(animacion);
            } else {
                if (callback) callback();
            }
        }
        
        requestAnimationFrame(animacion);
    }
    
    function calcularDuracionScroll(destino) {
        const distancia = Math.abs(window.pageYOffset - destino);
        const velocidad = 2; // píxeles por milisegundo
        const duracionMin = 300;
        const duracionMax = 1500;
        
        let duracion = distancia / velocidad;
        duracion = Math.max(duracionMin, Math.min(duracion, duracionMax));
        
        return duracion;
    }
    
    // ========================================
    // Menú móvil
    // ========================================
    function inicializarMenuMovil() {
        if (!elementos.menuHamburguesa) return;
        
        // Detectar clicks fuera del menú
        document.addEventListener('click', function(evento) {
            if (estado.menuAbierto &&
                !elementos.menuNavegacion.contains(evento.target) &&
                !elementos.menuHamburguesa.contains(evento.target)) {
                cerrarMenu();
            }
        });
        
        // Cerrar con tecla Escape
        document.addEventListener('keydown', function(evento) {
            if (evento.key === 'Escape' && estado.menuAbierto) {
                cerrarMenu();
            }
        });
    }
    
    function alternarMenu() {
        if (estado.menuAbierto) {
            cerrarMenu();
        } else {
            abrirMenu();
        }
    }
    
    function abrirMenu() {
        estado.menuAbierto = true;
        elementos.menuHamburguesa.classList.add(CONFIGURACION.claseActiva);
        elementos.menuNavegacion.classList.add(CONFIGURACION.claseActiva);
        elementos.body.classList.add(CONFIGURACION.claseMenuAbierto);
        
        // Animar entrada del menú
        animarEntradaMenu();
        
        // Prevenir scroll del body
        elementos.body.style.overflow = 'hidden';
    }
    
    function cerrarMenu() {
        estado.menuAbierto = false;
        elementos.menuHamburguesa.classList.remove(CONFIGURACION.claseActiva);
        elementos.menuNavegacion.classList.remove(CONFIGURACION.claseActiva);
        elementos.body.classList.remove(CONFIGURACION.claseMenuAbierto);
        
        // Animar salida del menú
        animarSalidaMenu();
        
        // Restaurar scroll del body
        elementos.body.style.overflow = '';
    }
    
    function animarEntradaMenu() {
        const enlaces = elementos.menuNavegacion.querySelectorAll('.navegacion-enlace');
        
        enlaces.forEach((enlace, index) => {
            enlace.style.opacity = '0';
            enlace.style.transform = 'translateX(-20px)';
            
            setTimeout(() => {
                enlace.style.transition = 'all 0.3s ease';
                enlace.style.opacity = '1';
                enlace.style.transform = 'translateX(0)';
            }, index * 50);
        });
    }
    
    function animarSalidaMenu() {
        const enlaces = elementos.menuNavegacion.querySelectorAll('.navegacion-enlace');
        
        enlaces.forEach((enlace, index) => {
            setTimeout(() => {
                enlace.style.opacity = '0';
                enlace.style.transform = 'translateX(-20px)';
            }, index * 30);
        });
    }
    
    // ========================================
    // Navegación por teclado
    // ========================================
    function inicializarNavegacionTeclado() {
        document.addEventListener('keydown', function(evento) {
            // Navegación con teclas de flecha
            if (evento.key === 'ArrowDown' || evento.key === 'ArrowUp') {
                evento.preventDefault();
                navegarConTeclado(evento.key === 'ArrowDown' ? 1 : -1);
            }
            
            // Navegación con números (1-9 para las primeras 9 secciones)
            if (evento.key >= '1' && evento.key <= '9') {
                const indice = parseInt(evento.key) - 1;
                if (elementos.secciones[indice]) {
                    navegarASeccion(elementos.secciones[indice]);
                }
            }
            
            // Home y End
            if (evento.key === 'Home') {
                evento.preventDefault();
                scrollArriba();
            }
            
            if (evento.key === 'End') {
                evento.preventDefault();
                scrollAbajo();
            }
        });
    }
    
    function navegarConTeclado(direccion) {
        const indiceActual = Array.from(elementos.secciones).findIndex(
            seccion => seccion.id === estado.seccionActual
        );
        
        const nuevoIndice = indiceActual + direccion;
        
        if (nuevoIndice >= 0 && nuevoIndice < elementos.secciones.length) {
            navegarASeccion(elementos.secciones[nuevoIndice]);
        }
    }
    
    // ========================================
    // Eventos táctiles
    // ========================================
    function configurarEventosTactiles() {
        // Swipe para cerrar menú
        elementos.menuNavegacion?.addEventListener('touchstart', manejarTouchStart);
        elementos.menuNavegacion?.addEventListener('touchend', manejarTouchEnd);
    }
    
    function manejarTouchStart(evento) {
        estado.touchStartY = evento.touches[0].clientY;
    }
    
    function manejarTouchEnd(evento) {
        estado.touchEndY = evento.changedTouches[0].clientY;
        manejarSwipe();
    }
    
    function manejarSwipe() {
        const diferencia = estado.touchStartY - estado.touchEndY;
        const umbralSwipe = 50;
        
        if (Math.abs(diferencia) > umbralSwipe) {
            if (diferencia > 0 && estado.menuAbierto) {
                // Swipe hacia arriba - cerrar menú
                cerrarMenu();
            }
        }
    }
    
    // ========================================
    // Indicador de progreso
    // ========================================
    function inicializarIndicadorProgreso() {
        const indicador = document.createElement('div');
        indicador.className = 'indicador-progreso-scroll';
        indicador.style.cssText = `
            position: fixed;
            top: 0;
            left: 0;
            height: 3px;
            background: linear-gradient(90deg, var(--color-primario), var(--color-secundario));
            z-index: 10000;
            transition: width 0.1s ease;
            width: 0;
        `;
        
        document.body.appendChild(indicador);
        elementos.indicadorProgreso = indicador;
    }
    
    function actualizarIndicadorProgreso() {
        const alturaDocumento = document.documentElement.scrollHeight - window.innerHeight;
        const progreso = (window.pageYOffset / alturaDocumento) * 100;
        
        if (elementos.indicadorProgreso) {
            elementos.indicadorProgreso.style.width = progreso + '%';
        }
    }
    
    // ========================================
    // Utilidades
    // ========================================
    function scrollArriba(evento) {
        if (evento) evento.preventDefault();
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    }
    
    function scrollAbajo() {
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
    }
    
    function manejarResize() {
        // Cerrar menú móvil si cambiamos a desktop
        if (window.innerWidth > CONFIGURACION.breakpointMovil && estado.menuAbierto) {
            cerrarMenu();
        }
    }
    
    function agregarEfectoTransicion(elemento) {
        elemento.style.position = 'relative';
        
        const efecto = document.createElement('span');
        efecto.style.cssText = `
            position: absolute;
            bottom: 0;
            left: 0;
            width: 100%;
            height: 2px;
            background: var(--color-primario);
            transform: scaleX(0);
            transform-origin: left;
            transition: transform 0.3s ease;
        `;
        
        elemento.appendChild(efecto);
        
        setTimeout(() => {
            efecto.style.transform = 'scaleX(1)';
        }, 10);
        
        setTimeout(() => {
            efecto.remove();
        }, 500);
    }
    
    // ========================================
    // API pública
    // ========================================
    window.navegacionManager = {
        navegarA: navegarASeccion,
        cerrarMenu: cerrarMenu,
        abrirMenu: abrirMenu,
        obtenerSeccionActual: () => estado.seccionActual,
        estaMenuAbierto: () => estado.menuAbierto
    };
    
})();