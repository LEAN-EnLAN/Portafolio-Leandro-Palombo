/**
 * 
 * Propósito: Animaciones por intersección, barras de habilidad dinámicas y micro-animaciones.
 * Autor: Leandro Palombo
 *
 * Notas:
 * - Este archivo se centra en animaciones que se disparan cuando los elementos entran en la pantalla,
 *   animación de "barras de habilidad" a partir de spans con clase .porcentaje, y pequeñas animaciones
 *   flotantes para iconos.
 */

(function () {
  'use strict';

  /* =========================
     Utilidades
     ========================= */
  // Debounce simple para optimizar handlers
  function debounce(funcion, espera) {
    let temporizador;
    return function () {
      const contexto = this;
      const argumentos = arguments;
      clearTimeout(temporizador);
      temporizador = setTimeout(() => funcion.apply(contexto, argumentos), espera);
    };
  }

  // Convierte "95%" a 95 (número)
  function extraerNumeroPorcentaje(textoPorcentaje) {
    if (!textoPorcentaje) return 0;
    const coincidencia = textoPorcentaje.toString().match(/(\d{1,3})/);
    return coincidencia ? parseInt(coincidencia[1], 10) : 0;
  }

  /* =========================
     Intersección: revelado/estagger
     ========================= */
  function inicializarObserverRevelado() {
    const opcionesObserver = {
      root: null,
      rootMargin: '0px 0px -8% 0px',
      threshold: 0.12
    };

    const observer = new IntersectionObserver((entradas) => {
      entradas.forEach((entrada) => {
        const elemento = entrada.target;
        if (entrada.isIntersecting) {
          // Aplicar clase que activa la animación (definida en CSS: .animada)
          elemento.classList.add('animada');

          // Si el elemento tiene hijos con .stagger-animation se los animará con retardo
          const elementosStagger = elemento.querySelectorAll('.stagger-animation');
          if (elementosStagger.length) {
            elementosStagger.forEach((hijo, indice) => {
              hijo.style.transitionDelay = (indice * 140) + 'ms';
              hijo.classList.add('animada');
            });
          }

          // Si no queremos observar más el elemento una vez animado:
          observer.unobserve(elemento);
        }
      });
    }, opcionesObserver);

    // Seleccionar elementos que queremos revelar con observer
    const selectoresRevelar = [
      '.card-exp',
      '.card-hab',
      '.card-proy',
      '.card-contacto',
      '.fondo-card',
      '.seccion-padd .container > .row',
      '.hero-section'
    ].join(',');

    document.querySelectorAll(selectoresRevelar).forEach((el) => {
      // Ocultar por defecto si no está ya visible
      // (La clase .animada en CSS controla opacidad y transform)
      if (!el.classList.contains('animada')) {
        el.style.willChange = 'opacity, transform';
        observer.observe(el);
      }
    });
  }

  /* =========================
     Barras de habilidad dinámicas
     ========================= */
  function inicializarBarrasHabilidad() {
    // Buscamos spans con clase .porcentaje dentro de listas de habilidades
    const elementosPorcentaje = document.querySelectorAll('.porcentaje');

    elementosPorcentaje.forEach((spanPorcentaje) => {
      // Evitamos duplicar barras si ya fueron procesadas
      if (spanPorcentaje.dataset.procesado === 'true') return;

      // Extraer valor numérico del porcentaje
      const valor = extraerNumeroPorcentaje(spanPorcentaje.textContent);

      // Crear contenedor de barra y barra rellena
      const contenedorBarra = document.createElement('div');
      const barraRelleno = document.createElement('div');

      contenedorBarra.className = 'barra-habilidad';
      barraRelleno.className = 'barra-habilidad-llenado';

      // Estilos base mínimos para la barra (puedes mejorar CSS en main.css si quieres)
      contenedorBarra.style.width = '140px';
      contenedorBarra.style.height = '8px';
      contenedorBarra.style.background = 'rgba(255,255,255,0.06)';
      contenedorBarra.style.borderRadius = '999px';
      contenedorBarra.style.overflow = 'hidden';
      contenedorBarra.style.display = 'inline-block';
      contenedorBarra.style.verticalAlign = 'middle';
      contenedorBarra.style.marginLeft = '10px';
      contenedorBarra.style.boxShadow = 'inset 0 1px 2px rgba(0,0,0,0.25)';

      barraRelleno.style.width = '0%';
      barraRelleno.style.height = '100%';
      barraRelleno.style.background = 'linear-gradient(90deg, var(--color-primario), #5ac8fa)';
      barraRelleno.style.borderRadius = '999px';
      barraRelleno.style.transition = 'width 1.2s cubic-bezier(.2,.9,.2,1)';

      // Insertar barra después del spanPorcentaje
      contenedorBarra.appendChild(barraRelleno);
      spanPorcentaje.parentNode.insertBefore(contenedorBarra, spanPorcentaje.nextSibling);

      // Marcar como procesado
      spanPorcentaje.dataset.procesado = 'true';

      // Observador para animar la barra cuando el elemento aparezca
      const observerBarra = new IntersectionObserver((entradas) => {
        entradas.forEach((entrada) => {
          if (entrada.isIntersecting) {
            // Animar al valor
            barraRelleno.style.width = Math.max(0, Math.min(100, valor)) + '%';
            observerBarra.unobserve(entrada.target);
          }
        });
      }, { threshold: 0.3 });

      // Observamos el contenedor que incluye el span (li probablemente)
      const padreObservado = spanPorcentaje.closest('li') || spanPorcentaje.parentElement;
      if (padreObservado) observerBarra.observe(padreObservado);
    });
  }

  /* =========================
     Micro-parallax y flotación para iconos
     ========================= */
  function inicializarFlotacionIconos() {
    const iconosFlotantes = document.querySelectorAll('.icono-tec, .icono-exp, .icono-proy, .icono-contacto, .icono-proy .icono-svg');

    if (!iconosFlotantes.length) return;

    let ultimoScrollY = window.scrollY;
    let rafActivo = false;

    function actualizarTransformaciones() {
      iconosFlotantes.forEach((icono, indice) => {
        // Efecto sutil: cada icono se mueve distinto según su indice para dar vida
        const offset = (Math.sin((Date.now() / 1000) + indice) * 4);
        // Y añadir un leve seguimiento del scroll (parallax)
        const diferenciaScroll = (window.scrollY - ultimoScrollY) * 0.05;
        icono.style.transform = `translate3d(0, ${offset + diferenciaScroll}px, 0)`;
      });
      rafActivo = false;
    }

    window.addEventListener('scroll', () => {
      ultimoScrollY = window.scrollY;
      if (!rafActivo) {
        rafActivo = true;
        window.requestAnimationFrame(actualizarTransformaciones);
      }
    });

    // Animación continua leve (floating) con requestAnimationFrame para suavidad
    let ultimoTiempo = Date.now();
    function bucleFlotante() {
      const ahora = Date.now();
      const delta = (ahora - ultimoTiempo) / 1000;
      ultimoTiempo = ahora;

      iconosFlotantes.forEach((icono, indice) => {
        // Oscilación con distinta fase por índice
        const y = Math.sin((ahora / 1000) + indice * 0.7) * 3; // px
        icono.style.transform = `translate3d(0, ${y}px, 0)`;
      });

      requestAnimationFrame(bucleFlotante);
    }
    requestAnimationFrame(bucleFlotante);
  }

  /* =========================
     Inicialización general
     ========================= */
  function inicializarAnimaciones() {
    // Dejar un pequeño retardo para que el DOM y CSS estén totalmente listos
    document.documentElement.classList.add('animaciones-cargadas');

    inicializarObserverRevelado();
    inicializarBarrasHabilidad();
    inicializarFlotacionIconos();
  }

  // Ejecutar al cargar DOM
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarAnimaciones);
  } else {
    inicializarAnimaciones();
  }

  // Recalcular barras al redimensionar (debounced)
  window.addEventListener('resize', debounce(() => {
    // Si en alguno de los badges las barras no llegaron a completarse
    // re-ejecutamos la inicialización ligera de barras (no recrea duplicadas)
    inicializarBarrasHabilidad();
  }, 200));

})();