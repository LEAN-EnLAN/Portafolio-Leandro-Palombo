/**
 * Archivo: particulas.js
 * Descripción: Sistema de partículas y efectos visuales
 * Autor: Leandro Palombo
 * Versión: 1.0.0
 */

(function() {
    'use strict';
    
    // ========================================
    // Configuración del sistema de partículas
    // ========================================
    const CONFIGURACION = {
        numeroParticulas: 50,
        velocidadMinima: 0.1,
        velocidadMaxima: 1,
        tamanoMinimo: 2,
        tamanoMaximo: 6,
        opacidadMinima: 0.1,
        opacidadMaxima: 0.5,
        colores: ['#007AFF', '#5AC8FA', '#BF5AF2', '#FF9F0A'],
        conectarParticulas: true,
        distanciaConexion: 150,
        responderMouse: true,
        distanciaMouse: 100,
        efectoGravedad: false,
        gravedadFuerza: 0.05,
        reboteEnBordes: true,
        particulasEmisoras: false,
        tipoForma: 'circulo' // circulo, cuadrado, estrella, triangulo
    };
    
    // ========================================
    // Clase Particula
    // ========================================
    class Particula {
        constructor(canvas, opciones = {}) {
            this.canvas = canvas;
            this.ctx = canvas.getContext('2d');
            this.opciones = { ...CONFIGURACION, ...opciones };
            
            this.inicializar();
        }
        
        inicializar() {
            // Posición inicial
            this.x = Math.random() * this.canvas.width;
            this.y = Math.random() * this.canvas.height;
            
            // Velocidad
            this.vx = (Math.random() - 0.5) * (this.opciones.velocidadMaxima - this.opciones.velocidadMinima) + this.opciones.velocidadMinima;
            this.vy = (Math.random() - 0.5) * (this.opciones.velocidadMaxima - this.opciones.velocidadMinima) + this.opciones.velocidadMinima;
            
            // Propiedades visuales
            this.radio = Math.random() * (this.opciones.tamanoMaximo - this.opciones.tamanoMinimo) + this.opciones.tamanoMinimo;
            this.opacidad = Math.random() * (this.opciones.opacidadMaxima - this.opciones.opacidadMinima) + this.opciones.opacidadMinima;
            this.color = this.opciones.colores[Math.floor(Math.random() * this.opciones.colores.length)];
            
            // Propiedades adicionales
            this.vida = 1;
            this.decaimiento = 0.001;
            this.pulsacion = Math.random() * Math.PI * 2;
            this.velocidadPulsacion = 0.02;
            this.rotacion = 0;
            this.velocidadRotacion = (Math.random() - 0.5) * 0.05;
        }
        
        actualizar(deltaTime, mouse = null) {
            // Actualizar posición
            this.x += this.vx * deltaTime;
            this.y += this.vy * deltaTime;
            
            // Aplicar gravedad si está habilitada
            if (this.opciones.efectoGravedad) {
                this.vy += this.opciones.gravedadFuerza * deltaTime;
            }
            
            // Interacción con el mouse
            if (this.opciones.responderMouse && mouse) {
                const dx = mouse.x - this.x;
                const dy = mouse.y - this.y;
                const distancia = Math.sqrt(dx * dx + dy * dy);
                
                if (distancia < this.opciones.distanciaMouse) {
                    const fuerza = (1 - distancia / this.opciones.distanciaMouse) * 2;
                    this.vx -= (dx / distancia) * fuerza * 0.1;
                    this.vy -= (dy / distancia) * fuerza * 0.1;
                }
            }
            
            // Rebotar en los bordes
            if (this.opciones.reboteEnBordes) {
                if (this.x < this.radio || this.x > this.canvas.width - this.radio) {
                    this.vx *= -1;
                    this.x = Math.max(this.radio, Math.min(this.canvas.width - this.radio, this.x));
                }
                if (this.y < this.radio || this.y > this.canvas.height - this.radio) {
                    this.vy *= -1;
                    this.y = Math.max(this.radio, Math.min(this.canvas.height - this.radio, this.y));
                }
            } else {
                // Reaparecer del otro lado
                if (this.x < -this.radio) this.x = this.canvas.width + this.radio;
                if (this.x > this.canvas.width + this.radio) this.x = -this.radio;
                if (this.y < -this.radio) this.y = this.canvas.height + this.radio;
                if (this.y > this.canvas.height + this.radio) this.y = -this.radio;
            }
            
            // Actualizar pulsación
            this.pulsacion += this.velocidadPulsacion;
            
            // Actualizar rotación
            this.rotacion += this.velocidadRotacion;
            
            // Actualizar vida
            this.vida -= this.decaimiento;
            if (this.vida <= 0) {
                this.reiniciar();
            }
        }
        
        dibujar() {
            const ctx = this.ctx;
            
            ctx.save();
            ctx.globalAlpha = this.opacidad * this.vida;
            
            // Efecto de brillo
            const gradiente = ctx.createRadialGradient(this.x, this.y, 0, this.x, this.y, this.radio);
            gradiente.addColorStop(0, this.color);
            gradiente.addColorStop(1, 'transparent');
            
            // Dibujar según el tipo de forma
            ctx.fillStyle = gradiente;
            ctx.translate(this.x, this.y);
            ctx.rotate(this.rotacion);
            
            const radioPulsante = this.radio + Math.sin(this.pulsacion) * 0.5;
            
            switch(this.opciones.tipoForma) {
                case 'circulo':
                    this.dibujarCirculo(ctx, radioPulsante);
                    break;
                case 'cuadrado':
                    this.dibujarCuadrado(ctx, radioPulsante);
                    break;
                case 'estrella':
                    this.dibujarEstrella(ctx, radioPulsante);
                    break;
                case 'triangulo':
                    this.dibujarTriangulo(ctx, radioPulsante);
                    break;
                default:
                    this.dibujarCirculo(ctx, radioPulsante);
            }
            
            ctx.restore();
        }
        
        dibujarCirculo(ctx, radio) {
            ctx.beginPath();
            ctx.arc(0, 0, radio, 0, Math.PI * 2);
            ctx.fill();
        }
        
        dibujarCuadrado(ctx, radio) {
            ctx.fillRect(-radio, -radio, radio * 2, radio * 2);
        }
        
        dibujarTriangulo(ctx, radio) {
            ctx.beginPath();
            ctx.moveTo(0, -radio);
            ctx.lineTo(-radio, radio);
            ctx.lineTo(radio, radio);
            ctx.closePath();
            ctx.fill();
        }
        
        dibujarEstrella(ctx, radio) {
            const puntas = 5;
            const radioInterno = radio * 0.5;
            
            ctx.beginPath();
            for (let i = 0; i < puntas * 2; i++) {
                const angulo = (i * Math.PI) / puntas;
                const r = i % 2 === 0 ? radio : radioInterno;
                const x = Math.cos(angulo) * r;
                const y = Math.sin(angulo) * r;
                
                if (i === 0) {
                    ctx.moveTo(x, y);
                } else {
                    ctx.lineTo(x, y);
                }
            }
            ctx.closePath();
            ctx.fill();
        }
        
        reiniciar() {
            this.inicializar();
            this.vida = 1;
        }
        
        distanciaA(otraParticula) {
            const dx = this.x - otraParticula.x;
            const dy = this.y - otraParticula.y;
            return Math.sqrt(dx * dx + dy * dy);
        }
    }
    
    // ========================================
    // Sistema de partículas principal
    // ========================================
    class SistemaParticulas {
        constructor(contenedor, opciones = {}) {
            this.contenedor = contenedor;
            this.opciones = { ...CONFIGURACION, ...opciones };
            this.particulas = [];
            this.mouse = { x: 0, y: 0 };
            this.animacionId = null;
            this.ultimoTiempo = Date.now();
            
            this.inicializar();
        }
        
        inicializar() {
            // Crear canvas
            this.canvas = document.createElement('canvas');
            this.canvas.style.cssText = `
                position: absolute;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                pointer-events: none;
                z-index: 1;
            `;
            
            this.contenedor.appendChild(this.canvas);
            this.ctx = this.canvas.getContext('2d');
            
            // Ajustar tamaño del canvas
            this.ajustarTamano();
            
            // Crear partículas
            for (let i = 0; i < this.opciones.numeroParticulas; i++) {
                this.particulas.push(new Particula(this.canvas, this.opciones));
            }
            
            // Eventos
            this.configurarEventos();
            
            // Iniciar animación
            this.animar();
        }
        
        configurarEventos() {
            // Redimensionar canvas
            window.addEventListener('resize', () => this.ajustarTamano());
            
            // Seguimiento del mouse
            if (this.opciones.responderMouse) {
                document.addEventListener('mousemove', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    this.mouse.x = e.clientX - rect.left;
                    this.mouse.y = e.clientY - rect.top;
                });
                
                // Click para agregar partículas
                this.canvas.style.pointerEvents = 'auto';
                this.canvas.addEventListener('click', (e) => {
                    const rect = this.canvas.getBoundingClientRect();
                    const x = e.clientX - rect.left;
                    const y = e.clientY - rect.top;
                    
                    this.explosion(x, y, 10);
                });
            }
        }
        
        ajustarTamano() {
            const rect = this.contenedor.getBoundingClientRect();
            this.canvas.width = rect.width;
            this.canvas.height = rect.height;
        }
        
        animar() {
            const ahora = Date.now();
            const deltaTime = (ahora - this.ultimoTiempo) / 16; // Normalizar a 60 FPS
            this.ultimoTiempo = ahora;
            
            // Limpiar canvas
            this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
            
            // Actualizar y dibujar partículas
            this.particulas.forEach(particula => {
                particula.actualizar(deltaTime, this.mouse);
                particula.dibujar();
            });
            
            // Conectar partículas cercanas
            if (this.opciones.conectarParticulas) {
                this.conectarParticulas();
            }
            
            // Continuar animación
            this.animacionId = requestAnimationFrame(() => this.animar());
        }
        
        conectarParticulas() {
            const ctx = this.ctx;
            
            for (let i = 0; i < this.particulas.length; i++) {
                for (let j = i + 1; j < this.particulas.length; j++) {
                    const distancia = this.particulas[i].distanciaA(this.particulas[j]);
                    
                    if (distancia < this.opciones.distanciaConexion) {
                        const opacidad = 1 - (distancia / this.opciones.distanciaConexion);
                        
                        ctx.save();
                        ctx.globalAlpha = opacidad * 0.2;
                        ctx.strokeStyle = this.particulas[i].color;
                        ctx.lineWidth = 0.5;
                        
                        ctx.beginPath();
                        ctx.moveTo(this.particulas[i].x, this.particulas[i].y);
                        ctx.lineTo(this.particulas[j].x, this.particulas[j].y);
                        ctx.stroke();
                        
                        ctx.restore();
                    }
                }
            }
        }
        
        agregarParticula(x = null, y = null) {
            const particula = new Particula(this.canvas, this.opciones);
            
            if (x !== null && y !== null) {
                particula.x = x;
                particula.y = y;
            }
            
            this.particulas.push(particula);
        }
        
        eliminarParticula(indice) {
            if (indice >= 0 && indice < this.particulas.length) {
                this.particulas.splice(indice, 1);
            }
        }
        
        explosion(x, y, cantidad = 20) {
            for (let i = 0; i < cantidad; i++) {
                const particula = new Particula(this.canvas, {
                    ...this.opciones,
                    velocidadMaxima: 5,
                    decaimiento: 0.02
                });
                
                particula.x = x;
                particula.y = y;
                
                const angulo = (Math.PI * 2 * i) / cantidad;
                const velocidad = 2 + Math.random() * 3;
                
                particula.vx = Math.cos(angulo) * velocidad;
                particula.vy = Math.sin(angulo) * velocidad;
                
                this.particulas.push(particula);
            }
            
            // Eliminar partículas extras después de un tiempo
            setTimeout(() => {
                this.particulas.splice(-cantidad, cantidad);
            }, 2000);
        }
        
        cambiarConfiguracion(nuevaConfig) {
            this.opciones = { ...this.opciones, ...nuevaConfig };
            
            // Aplicar cambios a partículas existentes
            this.particulas.forEach(particula => {
                particula.opciones = this.opciones;
            });
        }
        
        pausar() {
            if (this.animacionId) {
                cancelAnimationFrame(this.animacionId);
                this.animacionId = null;
            }
        }
        
        reanudar() {
            if (!this.animacionId) {
                this.animar();
            }
        }
        
        destruir() {
            this.pausar();
            this.canvas.remove();
            this.particulas = [];
        }
    }
    
    // ========================================
    // Efectos especiales de partículas
    // ========================================
    class EfectosParticulas {
        static fuegosArtificiales(contenedor, x, y) {
            const colores = ['#FF0000', '#00FF00', '#0000FF', '#FFFF00', '#FF00FF', '#00FFFF'];
            const numeroExplosiones = 3;
            
            for (let i = 0; i < numeroExplosiones; i++) {
                setTimeout(() => {
                    const sistema = new SistemaParticulas(contenedor, {
                        numeroParticulas: 0,
                        colores: [colores[Math.floor(Math.random() * colores.length)]]
                    });
                    
                    sistema.explosion(
                        x + (Math.random() - 0.5) * 100,
                        y + (Math.random() - 0.5) * 100,
                        30
                    );
                    
                    setTimeout(() => sistema.destruir(), 3000);
                }, i * 200);
            }
        }
        
        static lluvia(contenedor) {
            return new SistemaParticulas(contenedor, {
                numeroParticulas: 100,
                velocidadMinima: 2,
                velocidadMaxima: 4,
                efectoGravedad: true,
                gravedadFuerza: 0.1,
                reboteEnBordes: false,
                conectarParticulas: false,
                tipoForma: 'circulo',
                tamanoMinimo: 1,
                tamanoMaximo: 3,
                colores: ['#4A90E2']
            });
        }
        
        static nieve(contenedor) {
            return new SistemaParticulas(contenedor, {
                numeroParticulas: 80,
                velocidadMinima: 0.5,
                velocidadMaxima: 1.5,
                efectoGravedad: true,
                gravedadFuerza: 0.02,
                reboteEnBordes: false,
                conectarParticulas: false,
                tipoForma: 'circulo',
                tamanoMinimo: 2,
                tamanoMaximo: 5,
                colores: ['#FFFFFF'],
                opacidadMaxima: 0.8
            });
        }
        
        static estrellas(contenedor) {
            return new SistemaParticulas(contenedor, {
                numeroParticulas: 60,
                velocidadMinima: 0.05,
                velocidadMaxima: 0.2,
                conectarParticulas: true,
                distanciaConexion: 100,
                tipoForma: 'estrella',
                tamanoMinimo: 2,
                tamanoMaximo: 4,
                colores: ['#FFD700', '#FFA500'],
                opacidadMaxima: 0.7
            });
        }
        
        static burbujas(contenedor) {
            return new SistemaParticulas(contenedor, {
                numeroParticulas: 40,
                velocidadMinima: 0.5,
                velocidadMaxima: 1,
                efectoGravedad: true,
                gravedadFuerza: -0.05, // Gravedad inversa para que floten
                reboteEnBordes: false,
                conectarParticulas: false,
                tipoForma: 'circulo',
                tamanoMinimo: 5,
                tamanoMaximo: 15,
                colores: ['#87CEEB', '#00BFFF'],
                opacidadMaxima: 0.3
            });
        }
    }
    
    // ========================================
    // Inicialización automática
    // ========================================
    document.addEventListener('DOMContentLoaded', function() {
        console.log('✨ Inicializando sistema de partículas');
        
        // Buscar contenedores con atributo data-particulas
        const contenedores = document.querySelectorAll('[data-particulas]');
        
        contenedores.forEach(contenedor => {
            const tipo = contenedor.dataset.particulas;
            const opciones = contenedor.dataset.opcionesParticulas 
                ? JSON.parse(contenedor.dataset.opcionesParticulas) 
                : {};
            
            let sistema;
            
            switch(tipo) {
                case 'default':
                    sistema = new SistemaParticulas(contenedor, opciones);
                    break;
                case 'lluvia':
                    sistema = EfectosParticulas.lluvia(contenedor);
                    break;
                case 'nieve':
                    sistema = EfectosParticulas.nieve(contenedor);
                    break;
                case 'estrellas':
                    sistema = EfectosParticulas.estrellas(contenedor);
                    break;
                case 'burbujas':
                    sistema = EfectosParticulas.burbujas(contenedor);
                    break;
                default:
                    sistema = new SistemaParticulas(contenedor, opciones);
            }
            
            // Guardar referencia al sistema
            contenedor.sistemaParticulas = sistema;
        });
        
        console.log('✅ Sistema de partículas iniciado');
    });
    
    // ========================================
    // API pública
    // ========================================
    window.particulasManager = {
        crear: (contenedor, opciones) => new SistemaParticulas(contenedor, opciones),
        efectos: EfectosParticulas,
        
        // Métodos de utilidad
        crearEnElemento: (selector, opciones) => {
            const elemento = document.querySelector(selector);
            if (elemento) {
                return new SistemaParticulas(elemento, opciones);
            }
            return null;
        },
        
        obtenerSistema: (selector) => {
            const elemento = document.querySelector(selector);
            return elemento ? elemento.sistemaParticulas : null;
        },
        
        destruirTodos: () => {
            const contenedores = document.querySelectorAll('[data-particulas]');
            contenedores.forEach(contenedor => {
                if (contenedor.sistemaParticulas) {
                    contenedor.sistemaParticulas.destruir();
                    delete contenedor.sistemaParticulas;
                }
            });
        }
    };
    
})();