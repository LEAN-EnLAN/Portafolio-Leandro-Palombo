/**
 * Archivo: habilidades.js
 * Descripción: Manejo de barras de habilidades y animaciones
 * Autor: Leandro Palombo
 * Versión: 1.0.0
 */

(function() {
    'use strict';
    
    // ========================================
    // Variables globales
    // ========================================
    let habilidadesAnimadas = false;
    let tecnologiasAnimadas = false;
    const habilidadesData = [
        { nombre: 'Reparación de Computadoras', porcentaje: 95, color: '#007AFF' },
        { nombre: 'Reparación de Celulares', porcentaje: 90, color: '#5AC8FA' },
        { nombre: 'Desarrollo Web', porcentaje: 85, color: '#30D158' },
        { nombre: 'Inteligencia Artificial', porcentaje: 82, color: '#BF5AF2' },
        { nombre: 'Arduino & IoT', porcentaje: 80, color: '#FF9F0A' },
        { nombre: 'Instalación de Sistemas', porcentaje: 88, color: '#FF453A' }
    ];
    
    // ========================================
    // Inicialización
    // ========================================
    document.addEventListener('DOMContentLoaded', function() {
        console.log('💪 Inicializando sistema de habilidades');
        inicializarHabilidades();
        inicializarTecnologias();
        inicializarGraficosCirculares();
        inicializarContadores();
        console.log('✅ Sistema de habilidades iniciado');
    });
    
    // ========================================
    // Barras de habilidades
    // ========================================
    function inicializarHabilidades() {
        const seccionHabilidades = document.getElementById('habilidades');
        if (!seccionHabilidades) return;
        
        // Observador para animar cuando sea visible
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting && !habilidadesAnimadas) {
                    animarBarrasHabilidades();
                    animarHabilidadesAleatorias();
                    habilidadesAnimadas = true;
                }
            });
        }, {
            threshold: 0.3,
            rootMargin: '0px 0px -100px 0px'
        });
        
        observador.observe(seccionHabilidades);
    }
    
    function animarBarrasHabilidades() {
        const barras = document.querySelectorAll('.habilidad-item');
        
        barras.forEach((barra, index) => {
            const porcentaje = barra.dataset.porcentaje;
            const barraProgreso = barra.querySelector('.habilidad-progreso');
            const textoPorcentaje = barra.querySelector('.habilidad-porcentaje');
            
            if (barraProgreso) {
                // Retraso escalonado para cada barra
                setTimeout(() => {
                    barraProgreso.style.width = porcentaje + '%';
                    
                    // Animar el contador de porcentaje
                    if (textoPorcentaje) {
                        animarContador(textoPorcentaje, 0, porcentaje, 1500);
                    }
                    
                    // Agregar efecto de pulso al completarse
                    barraProgreso.addEventListener('transitionend', function() {
                        barraProgreso.classList.add('animar-pulso');
                        setTimeout(() => {
                            barraProgreso.classList.remove('animar-pulso');
                        }, 600);
                    }, { once: true });
                    
                }, index * 200);
            }
        });
    }
    
    function animarHabilidadesAleatorias() {
        const intervalo = setInterval(() => {
            const barras = document.querySelectorAll('.habilidad-progreso');
            if (barras.length === 0) {
                clearInterval(intervalo);
                return;
            }
            
            const barraAleatoria = barras[Math.floor(Math.random() * barras.length)];
            barraAleatoria.style.filter = 'brightness(1.3)';
            
            setTimeout(() => {
                barraAleatoria.style.filter = 'brightness(1)';
            }, 500);
        }, 3000);
    }
    
    // ========================================
    // Tecnologías con iconos
    // ========================================
    function inicializarTecnologias() {
        const tecnologiasGrid = document.querySelector('.tecnologias-grid');
        if (!tecnologiasGrid) return;
        
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting && !tecnologiasAnimadas) {
                    animarTecnologias();
                    tecnologiasAnimadas = true;
                }
            });
        }, {
            threshold: 0.2
        });
        
        observador.observe(tecnologiasGrid);
    }
    
    function animarTecnologias() {
        const tecnologias = document.querySelectorAll('.tecnologia-item');
        
        tecnologias.forEach((tech, index) => {
            tech.style.opacity = '0';
            tech.style.transform = 'scale(0.8) rotate(-10deg)';
            
            setTimeout(() => {
                tech.style.transition = 'all 0.6s cubic-bezier(0.68, -0.55, 0.265, 1.55)';
                tech.style.opacity = '1';
                tech.style.transform = 'scale(1) rotate(0)';
                
                // Agregar efecto hover dinámico
                agregarEfectoHoverTecnologia(tech);
            }, index * 100);
        });
    }
    
    function agregarEfectoHoverTecnologia(elemento) {
        elemento.addEventListener('mouseenter', function() {
            const icono = this.querySelector('.tecnologia-icono');
            if (icono) {
                icono.style.transform = 'scale(1.2) rotate(10deg)';
            }
            
            // Crear efecto de partículas
            crearParticulasTecnologia(this);
        });
        
        elemento.addEventListener('mouseleave', function() {
            const icono = this.querySelector('.tecnologia-icono');
            if (icono) {
                icono.style.transform = 'scale(1) rotate(0)';
            }
        });
    }
    
    function crearParticulasTecnologia(elemento) {
        const numParticulas = 5;
        const rect = elemento.getBoundingClientRect();
        
        for (let i = 0; i < numParticulas; i++) {
            const particula = document.createElement('div');
            particula.style.cssText = `
                position: fixed;
                width: 4px;
                height: 4px;
                background: var(--color-primario);
                border-radius: 50%;
                pointer-events: none;
                z-index: 1000;
                left: ${rect.left + rect.width / 2}px;
                top: ${rect.top + rect.height / 2}px;
            `;
            
            document.body.appendChild(particula);
            
            // Animar partícula
            const angulo = (360 / numParticulas) * i;
            const distancia = 50 + Math.random() * 50;
            
            particula.animate([
                { 
                    transform: 'translate(0, 0) scale(1)',
                    opacity: 1
                },
                { 
                    transform: `translate(
                        ${Math.cos(angulo * Math.PI / 180) * distancia}px,
                        ${Math.sin(angulo * Math.PI / 180) * distancia}px
                    ) scale(0)`,
                    opacity: 0
                }
            ], {
                duration: 800,
                easing: 'cubic-bezier(0.4, 0, 0.2, 1)'
            });
            
            setTimeout(() => particula.remove(), 800);
        }
    }
    
    // ========================================
    // Gráficos circulares
    // ========================================
    function inicializarGraficosCirculares() {
        const contenedor = document.querySelector('.habilidades-graficos');
        if (!contenedor) return;
        
        // Crear gráficos circulares para cada habilidad
        habilidadesData.forEach((habilidad, index) => {
            const grafico = crearGraficoCircular(habilidad);
            if (grafico) {
                contenedor.appendChild(grafico);
                
                // Animar cuando sea visible
                setTimeout(() => {
                    animarGraficoCircular(grafico, habilidad.porcentaje);
                }, index * 200);
            }
        });
    }
    
    function crearGraficoCircular(habilidad) {
        const contenedor = document.createElement('div');
        contenedor.className = 'grafico-circular';
        contenedor.innerHTML = `
            <svg width="120" height="120" viewBox="0 0 120 120">
                <circle
                    class="grafico-fondo"
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="var(--color-borde)"
                    stroke-width="10"
                />
                <circle
                    class="grafico-progreso"
                    cx="60"
                    cy="60"
                    r="50"
                    fill="none"
                    stroke="${habilidad.color}"
                    stroke-width="10"
                    stroke-linecap="round"
                    stroke-dasharray="314"
                    stroke-dashoffset="314"
                    transform="rotate(-90 60 60)"
                />
            </svg>
            <div class="grafico-info">
                <span class="grafico-porcentaje">0%</span>
                <span class="grafico-nombre">${habilidad.nombre}</span>
            </div>
        `;
        
        return contenedor;
    }
    
    function animarGraficoCircular(grafico, porcentaje) {
        const circulo = grafico.querySelector('.grafico-progreso');
        const texto = grafico.querySelector('.grafico-porcentaje');
        
        if (!circulo || !texto) return;
        
        const circunferencia = 314; // 2 * PI * 50
        const offset = circunferencia - (circunferencia * porcentaje / 100);
        
        // Animar el círculo
        setTimeout(() => {
            circulo.style.transition = 'stroke-dashoffset 1.5s cubic-bezier(0.4, 0, 0.2, 1)';
            circulo.style.strokeDashoffset = offset;
        }, 100);
        
        // Animar el contador
        animarContador(texto, 0, porcentaje, 1500);
    }
    
    // ========================================
    // Contadores animados
    // ========================================
    function inicializarContadores() {
        const contadores = document.querySelectorAll('[data-contador]');
        
        if (contadores.length === 0) return;
        
        const observador = new IntersectionObserver((entradas) => {
            entradas.forEach(entrada => {
                if (entrada.isIntersecting) {
                    const elemento = entrada.target;
                    const valorFinal = parseInt(elemento.dataset.contador);
                    const duracion = parseInt(elemento.dataset.duracion) || 2000;
                    
                    animarContador(elemento, 0, valorFinal, duracion);
                    observador.unobserve(elemento);
                }
            });
        }, {
            threshold: 0.5
        });
        
        contadores.forEach(contador => observador.observe(contador));
    }
    
    function animarContador(elemento, inicio, fin, duracion) {
        const rango = fin - inicio;
        const incremento = rango / (duracion / 16); // 60 FPS
        let valorActual = inicio;
        
        const temporizador = setInterval(() => {
            valorActual += incremento;
            
            if (valorActual >= fin) {
                valorActual = fin;
                clearInterval(temporizador);
            }
            
            // Formatear el valor según el tipo
            let textoMostrar = Math.round(valorActual);
            
            if (elemento.dataset.tipo === 'porcentaje') {
                textoMostrar += '%';
            } else if (elemento.dataset.tipo === 'decimal') {
                textoMostrar = valorActual.toFixed(1);
            }
            
            elemento.textContent = textoMostrar;
            
            // Efecto de escala al llegar al final
            if (valorActual === fin) {
                elemento.style.transform = 'scale(1.2)';
                setTimeout(() => {
                    elemento.style.transform = 'scale(1)';
                }, 200);
            }
        }, 16);
    }
    
    // ========================================
    // Tooltips para habilidades
    // ========================================
    function crearTooltip(elemento, texto) {
        const tooltip = document.createElement('div');
        tooltip.className = 'habilidad-tooltip';
        tooltip.textContent = texto;
        tooltip.style.cssText = `
            position: absolute;
            background: var(--color-superficie-elevada);
            color: var(--color-texto-primario);
            padding: 0.5rem 1rem;
            border-radius: var(--radio-pequeno);
            font-size: var(--tamano-pequeno);
            white-space: nowrap;
            pointer-events: none;
            opacity: 0;
            transform: translateY(10px);
            transition: all 0.3s ease;
            z-index: 1000;
            box-shadow: var(--sombra-media);
        `;
        
        elemento.addEventListener('mouseenter', function(e) {
            document.body.appendChild(tooltip);
            
            const rect = elemento.getBoundingClientRect();
            tooltip.style.left = rect.left + (rect.width / 2) - (tooltip.offsetWidth / 2) + 'px';
            tooltip.style.top = rect.top - tooltip.offsetHeight - 10 + 'px';
            
            setTimeout(() => {
                tooltip.style.opacity = '1';
                tooltip.style.transform = 'translateY(0)';
            }, 10);
        });
        
        elemento.addEventListener('mouseleave', function() {
            tooltip.style.opacity = '0';
            tooltip.style.transform = 'translateY(10px)';
            
            setTimeout(() => {
                if (tooltip.parentNode) {
                    tooltip.parentNode.removeChild(tooltip);
                }
            }, 300);
        });
    }
    
    // ========================================
    // Filtros de habilidades
    // ========================================
    function inicializarFiltrosHabilidades() {
        const filtros = document.querySelectorAll('[data-filtro-habilidad]');
        const habilidades = document.querySelectorAll('.habilidad-item');
        
        if (filtros.length === 0 || habilidades.length === 0) return;
        
        filtros.forEach(filtro => {
            filtro.addEventListener('click', function() {
                const categoria = this.dataset.filtroHabilidad;
                
                // Actualizar estado activo del filtro
                filtros.forEach(f => f.classList.remove('activo'));
                this.classList.add('activo');
                
                // Filtrar habilidades
                habilidades.forEach(habilidad => {
                    if (categoria === 'todas' || habilidad.dataset.categoria === categoria) {
                        habilidad.style.display = 'block';
                        habilidad.style.animation = 'entradaDesvanecida 0.5s ease';
                    } else {
                        habilidad.style.display = 'none';
                    }
                });
            });
        });
    }
    
    // ========================================
    // Comparación de habilidades
    // ========================================
    function crearComparacionHabilidades() {
        const contenedor = document.querySelector('.comparacion-habilidades');
        if (!contenedor) return;
        
        const maxValor = Math.max(...habilidadesData.map(h => h.porcentaje));
        
        habilidadesData.forEach(habilidad => {
            const barra = document.createElement('div');
            barra.className = 'comparacion-barra';
            barra.style.cssText = `
                position: relative;
                height: ${(habilidad.porcentaje / maxValor) * 200}px;
                width: 60px;
                background: linear-gradient(to top, ${habilidad.color}, transparent);
                border-radius: var(--radio-pequeno) var(--radio-pequeno) 0 0;
                margin: 0 10px;
                display: inline-block;
                vertical-align: bottom;
                transition: all 0.3s ease;
                cursor: pointer;
            `;
            
            barra.innerHTML = `
                <span style="
                    position: absolute;
                    top: -30px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-weight: bold;
                    color: ${habilidad.color};
                ">${habilidad.porcentaje}%</span>
                <span style="
                    position: absolute;
                    bottom: -25px;
                    left: 50%;
                    transform: translateX(-50%);
                    font-size: 12px;
                    white-space: nowrap;
                ">${habilidad.nombre}</span>
            `;
            
            barra.addEventListener('mouseenter', function() {
                this.style.transform = 'scaleY(1.1)';
                this.style.filter = 'brightness(1.2)';
            });
            
            barra.addEventListener('mouseleave', function() {
                this.style.transform = 'scaleY(1)';
                this.style.filter = 'brightness(1)';
            });
            
            contenedor.appendChild(barra);
        });
    }
    
    // ========================================
    // Exportar funciones públicas
    // ========================================
    window.habilidadesManager = {
        animar: animarBarrasHabilidades,
        actualizarPorcentaje: function(nombre, nuevoPorcentaje) {
            const habilidad = habilidadesData.find(h => h.nombre === nombre);
            if (habilidad) {
                habilidad.porcentaje = nuevoPorcentaje;
                // Re-renderizar si es necesario
            }
        },
        agregarHabilidad: function(nuevaHabilidad) {
            habilidadesData.push(nuevaHabilidad);
            // Re-renderizar si es necesario
        }
    };
    
})();