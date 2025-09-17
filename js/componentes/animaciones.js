/**
 * Archivo: animaciones.js
 * Descripción: Sistema de animaciones y efectos visuales
 * Autor: Leandro Palombo
 * Versión: 1.0.0
 */

(function() {
    'use strict';
    
    // ========================================
    // Configuración de animaciones
    // ========================================
    const CONFIGURACION = {
        duracionEntrada: 800,
        duracionSalida: 600,
        retardoEntreSecciones: 200,
        umbralObservador: 0.1,
        margenObservador: '0px 0px -100px 0px',
        curvaAnimacion: 'cubic-bezier(0.4, 0, 0.2, 1)',
        curvaElastica: 'cubic-bezier(0.68, -0.55, 0.265, 1.55)'
    };
    
    // ========================================
    // Estado global
    // ========================================
    const estado = {
        elementosAnimados: new Set(),
        observadores: new Map(),
        animacionesActivas: new Map(),
        contadorAnimaciones: 0
    };
    
    // ========================================
    // Inicialización
    // ========================================
    document.addEventListener('DOMContentLoaded', function() {
        console.log('🎨 Inicializando sistema de animaciones');
        
        inicializarObservadorInterseccion();
        inicializarAnimacionesScroll();
        inicializarAnimacionesHover();
        inicializarAnimacionesCarga();
        inicializarParallax();
        inicializarAnimacionesTexto();
        inicializarAnimacionesMorfismo();
        registrarAnimacionesPersonalizadas();
        
        console.log('✅ Sistema de animaciones iniciado');
    });
    
    // ========================================
    // Observador de intersección
    // ========================================
    function inicializarObservadorInterseccion() {
        const opciones = {
            threshold: CONFIGURACION.umbralObservador,
            rootMargin: CONFIGURACION.margenObservador
        };
        
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting && !estado.elementosAnimados.has(entrada.target)) {
                    animarElemento(entrada.target);
                    estado.elementosAnimados.add(entrada.target);
                }
            });
        }, opciones);
        
        // Observar elementos con atributo data-aos
        const elementosAOS = document.querySelectorAll('[data-aos]');
        elementosAOS.forEach(elemento => {
            observador.observe(elemento);
            prepararElementoParaAnimacion(elemento);
        });
        
        // Observar elementos con clase de animación
        const elementosAnimados = document.querySelectorAll('.animar-entrada, .animar-secuencia, .animar-parallax');
        elementosAnimados.forEach(elemento => {
            observador.observe(elemento);
        });
        
        estado.observadores.set('principal', observador);
    }
    
    function prepararElementoParaAnimacion(elemento) {
        const tipoAnimacion = elemento.dataset.aos;
        
        // Establecer estado inicial según el tipo de animación
        switch(tipoAnimacion) {
            case 'fade-up':
                elemento.style.opacity = '0';
                elemento.style.transform = 'translateY(30px)';
                break;
            case 'fade-down':
                elemento.style.opacity = '0';
                elemento.style.transform = 'translateY(-30px)';
                break;
            case 'fade-left':
                elemento.style.opacity = '0';
                elemento.style.transform = 'translateX(30px)';
                break;
            case 'fade-right':
                elemento.style.opacity = '0';
                elemento.style.transform = 'translateX(-30px)';
                break;
            case 'zoom-in':
                elemento.style.opacity = '0';
                elemento.style.transform = 'scale(0.9)';
                break;
            case 'zoom-out':
                elemento.style.opacity = '0';
                elemento.style.transform = 'scale(1.1)';
                break;
            case 'flip':
                elemento.style.opacity = '0';
                elemento.style.transform = 'perspective(1000px) rotateY(90deg)';
                break;
            case 'slide':
                elemento.style.opacity = '0';
                elemento.style.transform = 'translateX(-100%)';
                break;
        }
        
        elemento.style.transition = `all ${CONFIGURACION.duracionEntrada}ms ${CONFIGURACION.curvaAnimacion}`;
    }
    
    function animarElemento(elemento) {
        const tipoAnimacion = elemento.dataset.aos || 'fade-up';
        const retardo = parseInt(elemento.dataset.aosDelay) || 0;
        const duracion = parseInt(elemento.dataset.aosDuration) || CONFIGURACION.duracionEntrada;
        const easing = elemento.dataset.aosEasing || CONFIGURACION.curvaAnimacion;
        
        setTimeout(() => {
            elemento.style.transition = `all ${duracion}ms ${easing}`;
            elemento.style.opacity = '1';
            elemento.style.transform = 'none';
            elemento.classList.add('aos-animate');
            
            // Disparar evento personalizado
            elemento.dispatchEvent(new CustomEvent('aosAnimado', {
                detail: { tipo: tipoAnimacion }
            }));
            
            // Animar elementos hijos si tienen clase stagger
            animarElementosStagger(elemento);
        }, retardo);
    }
    
    function animarElementosStagger(contenedor) {
        const elementosStagger = contenedor.querySelectorAll('.stagger-item');
        if (elementosStagger.length === 0) return;
        
        elementosStagger.forEach((elemento, index) => {
            elemento.style.opacity = '0';
            elemento.style.transform = 'translateY(20px)';
            
            setTimeout(() => {
                elemento.style.transition = `all 0.6s ${CONFIGURACION.curvaElastica}`;
                elemento.style.opacity = '1';
                elemento.style.transform = 'translateY(0)';
            }, index * 100);
        });
    }
    
    // ========================================
    // Animaciones de scroll
    // ========================================
    function inicializarAnimacionesScroll() {
        let ticking = false;
        
        function actualizarAnimacionesScroll() {
            const scrollY = window.pageYOffset;
            const windowHeight = window.innerHeight;
            
            // Parallax elementos
            const elementosParallax = document.querySelectorAll('[data-parallax]');
            elementosParallax.forEach(elemento => {
                const velocidad = parseFloat(elemento.dataset.parallax) || 0.5;
                const rect = elemento.getBoundingClientRect();
                const yPos = -(scrollY * velocidad);
                
                elemento.style.transform = `translateY(${yPos}px)`;
            });
            
            // Revelar progresivo
            const elementosReveal = document.querySelectorAll('.reveal-on-scroll');
            elementosReveal.forEach(elemento => {
                const rect = elemento.getBoundingClientRect();
                const porcentajeVisible = Math.max(0, Math.min(1, 
                    (windowHeight - rect.top) / (windowHeight + rect.height)
                ));
                
                elemento.style.opacity = porcentajeVisible;
                elemento.style.transform = `translateY(${(1 - porcentajeVisible) * 20}px)`;
            });
            
            // Rotación basada en scroll
            const elementosRotacion = document.querySelectorAll('[data-rotate-on-scroll]');
            elementosRotacion.forEach(elemento => {
                const velocidadRotacion = parseFloat(elemento.dataset.rotateOnScroll) || 1;
                const rotacion = scrollY * velocidadRotacion * 0.1;
                
                elemento.style.transform = `rotate(${rotacion}deg)`;
            });
            
            // Escala basada en scroll
            const elementosEscala = document.querySelectorAll('[data-scale-on-scroll]');
            elementosEscala.forEach(elemento => {
                const rect = elemento.getBoundingClientRect();
                const centro = rect.top + rect.height / 2;
                const distanciaCentro = Math.abs(windowHeight / 2 - centro);
                const escala = Math.max(0.8, 1 - (distanciaCentro / windowHeight) * 0.3);
                
                elemento.style.transform = `scale(${escala})`;
            });
            
            ticking = false;
        }
        
        function solicitarActualizacion() {
            if (!ticking) {
                window.requestAnimationFrame(actualizarAnimacionesScroll);
                ticking = true;
            }
        }
        
        window.addEventListener('scroll', solicitarActualizacion);
        window.addEventListener('resize', solicitarActualizacion);
        
        // Ejecutar una vez al cargar
        actualizarAnimacionesScroll();
    }
    
    // ========================================
    // Animaciones hover
    // ========================================
    function inicializarAnimacionesHover() {
        // Efecto magnético
        const elementosMagneticos = document.querySelectorAll('.efecto-magnetico');
        elementosMagneticos.forEach(elemento => {
            elemento.addEventListener('mousemove', efectoMagnetico);
            elemento.addEventListener('mouseleave', resetearEfectoMagnetico);
        });
        
        // Efecto tilt 3D
        const elementosTilt = document.querySelectorAll('.efecto-tilt');
        elementosTilt.forEach(elemento => {
            elemento.addEventListener('mousemove', efectoTilt);
            elemento.addEventListener('mouseleave', resetearEfectoTilt);
        });
        
        // Efecto resplandor
        const elementosResplandor = document.querySelectorAll('.efecto-resplandor');
        elementosResplandor.forEach(elemento => {
            elemento.addEventListener('mousemove', efectoResplandor);
            elemento.addEventListener('mouseleave', resetearEfectoResplandor);
        });
    }
    
    function efectoMagnetico(evento) {
        const elemento = evento.currentTarget;
        const rect = elemento.getBoundingClientRect();
        const x = evento.clientX - rect.left - rect.width / 2;
        const y = evento.clientY - rect.top - rect.height / 2;
        
        const fuerza = 0.3;
        
        elemento.style.transform = `translate(${x * fuerza}px, ${y * fuerza}px)`;
    }
    
    function resetearEfectoMagnetico(evento) {
        evento.currentTarget.style.transform = 'translate(0, 0)';
    }
    
    function efectoTilt(evento) {
        const elemento = evento.currentTarget;
        const rect = elemento.getBoundingClientRect();
        const x = (evento.clientX - rect.left) / rect.width;
        const y = (evento.clientY - rect.top) / rect.height;
        
        const tiltX = (y - 0.5) * 20;
        const tiltY = (x - 0.5) * -20;
        
        elemento.style.transform = `perspective(1000px) rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
    }
    
    function resetearEfectoTilt(evento) {
        evento.currentTarget.style.transform = 'perspective(1000px) rotateX(0) rotateY(0)';
    }
    
    function efectoResplandor(evento) {
        const elemento = evento.currentTarget;
        const rect = elemento.getBoundingClientRect();
        const x = ((evento.clientX - rect.left) / rect.width) * 100;
        const y = ((evento.clientY - rect.top) / rect.height) * 100;
        
        elemento.style.background = `radial-gradient(circle at ${x}% ${y}%, 
            rgba(255, 255, 255, 0.1) 0%, 
            transparent 50%)`;
    }
    
    function resetearEfectoResplandor(evento) {
        evento.currentTarget.style.background = '';
    }
    
    // ========================================
    // Animaciones de carga
    // ========================================
    function inicializarAnimacionesCarga() {
        // Animación de carga inicial
        window.addEventListener('load', () => {
            document.body.classList.add('cargado');
            
            // Animar elementos de entrada
            animarEntradaInicial();
        });
        
        // Preloader si existe
        const preloader = document.getElementById('preloader');
        if (preloader) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    preloader.style.opacity = '0';
                    setTimeout(() => {
                        preloader.style.display = 'none';
                    }, 500);
                }, 300);
            });
        }
    }
    
    function animarEntradaInicial() {
        // Hero animation
        const heroElementos = document.querySelectorAll('.hero-contenido > *');
        heroElementos.forEach((elemento, index) => {
            elemento.style.opacity = '0';
            elemento.style.transform = 'translateY(30px)';
            
            setTimeout(() => {
                elemento.style.transition = `all 0.8s ${CONFIGURACION.curvaElastica}`;
                elemento.style.opacity = '1';
                elemento.style.transform = 'translateY(0)';
            }, index * 150);
        });
    }
    
    // ========================================
    // Parallax avanzado
    // ========================================
    function inicializarParallax() {
        const capasParallax = document.querySelectorAll('.parallax-capa');
        
        if (capasParallax.length === 0) return;
        
        window.addEventListener('mousemove', (evento) => {
            const x = (evento.clientX / window.innerWidth - 0.5) * 2;
            const y = (evento.clientY / window.innerHeight - 0.5) * 2;
            
            capasParallax.forEach((capa, index) => {
                const profundidad = (index + 1) * 2;
                const movX = x * profundidad;
                const movY = y * profundidad;
                
                capa.style.transform = `translate(${movX}px, ${movY}px)`;
            });
        });
    }
    
    // ========================================
    // Animaciones de texto
    // ========================================
    function inicializarAnimacionesTexto() {
        // Efecto de escritura
        const elementosEscritura = document.querySelectorAll('.texto-escritura');
        elementosEscritura.forEach(elemento => {
            const observador = new IntersectionObserver((entradas) => {
                entradas.forEach(entrada => {
                    if (entrada.isIntersecting) {
                        animarTextoEscritura(entrada.target);
                        observador.unobserve(entrada.target);
                    }
                });
            });
            observador.observe(elemento);
        });
        
        // Efecto de división de texto
        const elementosDivision = document.querySelectorAll('.texto-division');
        elementosDivision.forEach(elemento => {
            dividirTexto(elemento);
        });
        
        // Efecto de revelado de texto
        const elementosRevelado = document.querySelectorAll('.texto-revelado');
        elementosRevelado.forEach(elemento => {
            prepararTextoRevelado(elemento);
        });
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
                elemento.classList.add('escritura-completa');
            }
        }, 50);
    }
    
    function dividirTexto(elemento) {
        const texto = elemento.textContent;
        elemento.textContent = '';
        
        texto.split('').forEach((letra, index) => {
            const span = document.createElement('span');
            span.textContent = letra === ' ' ? '\u00A0' : letra;
            span.style.display = 'inline-block';
            span.style.opacity = '0';
            span.style.transform = 'translateY(20px)';
            span.style.transition = `all 0.5s ${CONFIGURACION.curvaElastica} ${index * 30}ms`;
            
            elemento.appendChild(span);
            
            setTimeout(() => {
                span.style.opacity = '1';
                span.style.transform = 'translateY(0)';
            }, 100);
        });
    }
    
    function prepararTextoRevelado(elemento) {
        const contenedor = document.createElement('div');
        contenedor.style.position = 'relative';
        contenedor.style.overflow = 'hidden';
        
        const mascara = document.createElement('div');
        mascara.style.position = 'absolute';
        mascara.style.top = '0';
        mascara.style.left = '0';
        mascara.style.width = '100%';
        mascara.style.height = '100%';
        mascara.style.background = 'var(--color-primario)';
        mascara.style.transform = 'translateX(-100%)';
        
        elemento.parentNode.insertBefore(contenedor, elemento);
        contenedor.appendChild(elemento);
        contenedor.appendChild(mascara);
        
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    mascara.style.transition = 'transform 0.8s cubic-bezier(0.4, 0, 0.2, 1)';
                    mascara.style.transform = 'translateX(100%)';
                    
                    setTimeout(() => {
                        elemento.style.opacity = '1';
                    }, 400);
                    
                    observador.unobserve(contenedor);
                }
            });
        });
        
        observador.observe(contenedor);
    }
    
    // ========================================
    // Morfismo glassmorphism
    // ========================================
    function inicializarAnimacionesMorfismo() {
        const elementosMorfismo = document.querySelectorAll('.morfismo-dinamico');
        
        elementosMorfismo.forEach(elemento => {
            elemento.addEventListener('mousemove', (evento) => {
                const rect = elemento.getBoundingClientRect();
                const x = ((evento.clientX - rect.left) / rect.width) * 100;
                const y = ((evento.clientY - rect.top) / rect.height) * 100;
                
                elemento.style.background = `
                    radial-gradient(circle at ${x}% ${y}%, 
                    rgba(255, 255, 255, 0.15) 0%, 
                    rgba(255, 255, 255, 0.05) 40%,
                    transparent 100%)
                `;
            });
            
            elemento.addEventListener('mouseleave', () => {
                elemento.style.background = '';
            });
        });
    }
    
    // ========================================
    // Animaciones personalizadas
    // ========================================
    function registrarAnimacionesPersonalizadas() {
        // Animación de ondas
        registrarAnimacion('onda', (elemento) => {
            const duracion = 2000;
            const frames = [
                { transform: 'translateY(0) scaleY(1)' },
                { transform: 'translateY(-10px) scaleY(0.95)' },
                { transform: 'translateY(0) scaleY(1)' }
            ];
            
            return elemento.animate(frames, {
                duration: duracion,
                iterations: Infinity,
                easing: 'ease-in-out'
            });
        });
        
        // Animación de pulso luminoso
        registrarAnimacion('pulsoLuminoso', (elemento) => {
            const duracion = 1500;
            const frames = [
                { 
                    boxShadow: '0 0 0 0 rgba(0, 122, 255, 0.7)',
                    transform: 'scale(1)'
                },
                { 
                    boxShadow: '0 0 20px 10px rgba(0, 122, 255, 0)',
                    transform: 'scale(1.05)'
                }
            ];
            
            return elemento.animate(frames, {
                duration: duracion,
                iterations: Infinity,
                easing: 'ease-out'
            });
        });
        
        // Animación de vibración
        registrarAnimacion('vibracion', (elemento) => {
            const duracion = 100;
            const frames = [
                { transform: 'translateX(0)' },
                { transform: 'translateX(-2px)' },
                { transform: 'translateX(2px)' },
                { transform: 'translateX(0)' }
            ];
            
            return elemento.animate(frames, {
                duration: duracion,
                iterations: 3
            });
        });
    }
    
    function registrarAnimacion(nombre, funcionAnimacion) {
        estado.animacionesActivas.set(nombre, funcionAnimacion);
    }
    
    function ejecutarAnimacion(elemento, nombreAnimacion) {
        const animacion = estado.animacionesActivas.get(nombreAnimacion);
        if (animacion) {
            return animacion(elemento);
        }
        console.warn(`Animación '${nombreAnimacion}' no encontrada`);
        return null;
    }
    
    // ========================================
    // Utilidades
    // ========================================
    function easeInOutCubic(t) {
        return t < 0.5
            ? 4 * t * t * t
            : 1 - Math.pow(-2 * t + 2, 3) / 2;
    }
    
    function lerp(inicio, fin, factor) {
        return inicio + (fin - inicio) * factor;
    }
    
    function clamp(valor, min, max) {
        return Math.min(Math.max(valor, min), max);
    }
    
    // ========================================
    // API pública
    // ========================================
    window.animacionesManager = {
        animar: ejecutarAnimacion,
        registrar: registrarAnimacion,
        pausar: (elemento) => {
            const animacion = elemento.getAnimations()[0];
            if (animacion) animacion.pause();
        },
        reproducir: (elemento) => {
            const animacion = elemento.getAnimations()[0];
            if (animacion) animacion.play();
        },
        reiniciar: (elemento) => {
            const animaciones = elemento.getAnimations();
            animaciones.forEach(animacion => {
                animacion.cancel();
                animacion.play();
            });
        },
        utils: {
            easeInOutCubic,
            lerp,
            clamp
        }
    };
    
})();