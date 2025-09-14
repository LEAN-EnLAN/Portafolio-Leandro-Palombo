/**
 * Archivo: scroll.js
 * Propósito: Control y utilidades relacionadas con el scroll:
 *  - Resaltar link activo en navegación según sección visible.
 *  - Comportamiento de header al hacer scroll (shrink / sombra).
 *  - Scroll suave con ajuste de offset por header fijo (complementa main.js).
 *
 * Autor: Leandro Palombo
 *
 * Observaciones:
 * - Este módulo está pensado para ser robusto ante cambios de estructura de secciones.
 */

(function () {
  'use strict';

  /* =========================
     Configuración
     ========================= */
  const SELECTOR_NAV_LINKS = '.navbar .nav-link';
  const SELECTOR_SECCIONES = 'section[id]';
  const CLASE_ACTIVO = 'activo-scroll'; // clase para nav item activo
  const CLASE_HEADER_SCROLLED = 'sombra-header-activa'; // clase que main.js utiliza
  const OFFSET_HEADER = 76; // alto estimado del header fijo (px). Ajustar si cambias tamaño

  /* =========================
     Util: Debounce
     ========================= */
  function debounce(funcion, espera) {
    let temporizador;
    return function () {
      const contexto = this;
      const args = arguments;
      clearTimeout(temporizador);
      temporizador = setTimeout(() => funcion.apply(contexto, args), espera);
    };
  }

  /* =========================
     Resaltar nav link activo
     ========================= */
  function actualizarNavActivo() {
    const enlaces = Array.from(document.querySelectorAll(SELECTOR_NAV_LINKS));
    const secciones = Array.from(document.querySelectorAll(SELECTOR_SECCIONES));

    if (!secciones.length || !enlaces.length) return;

    // Calcular centro del viewport para detectar sección "principal"
    const puntoReferencia = window.scrollY + (window.innerHeight / 2);

    let seccionActiva = secciones[0];

    for (let i = 0; i < secciones.length; i++) {
      const rect = secciones[i].getBoundingClientRect();
      const topAbs = window.scrollY + rect.top;
      const bottomAbs = topAbs + rect.height;

      // Si el punto de referencia está dentro de la sección actual
      if (puntoReferencia >= topAbs && puntoReferencia < bottomAbs) {
        seccionActiva = secciones[i];
        break;
      }
    }

    const idSeccionActiva = seccionActiva.getAttribute('id');

    enlaces.forEach((enlace) => {
      const href = enlace.getAttribute('href');
      if (!href) return;
      // Comparar con formato "#id"
      if (href === ('#' + idSeccionActiva)) {
        enlace.classList.add(CLASE_ACTIVO);
      } else {
        enlace.classList.remove(CLASE_ACTIVO);
      }
    });
  }

  /* =========================
     Ajuste del header al hacer scroll
     ========================= */
  function aplicarEfectoHeader() {
    const header = document.querySelector('.navbar');
    if (!header) return;

    if (window.scrollY > 80) {
      header.classList.add(CLASE_HEADER_SCROLLED);
      // Podemos reducir padding para efecto "shrink"
      header.style.transition = 'padding .18s ease, box-shadow .18s ease';
      header.style.paddingTop = '6px';
      header.style.paddingBottom = '6px';
    } else {
      header.classList.remove(CLASE_HEADER_SCROLLED);
      header.style.paddingTop = '';
      header.style.paddingBottom = '';
    }
  }

  /* =========================
     Scroll suave con compensación por header fijo
     ========================= */
  function inicializarScrollConOffset() {
    // Añadimos manejador solo para enlaces internos que no sean externos
    document.querySelectorAll('a[href^="#"]').forEach((enlace) => {
      enlace.addEventListener('click', function (evento) {
        const destinoSelector = this.getAttribute('href');
        if (!destinoSelector || destinoSelector === '#') return;
        const destino = document.querySelector(destinoSelector);
        if (!destino) return;
        evento.preventDefault();

        const rect = destino.getBoundingClientRect();
        const topAbsoluto = window.scrollY + rect.top;

        // Ajuste por header fijo
        const destinoFinal = Math.max(0, topAbsoluto - OFFSET_HEADER + 6);

        window.scrollTo({
          top: destinoFinal,
          behavior: 'smooth'
        });

        // Si el menú móvil está abierto, intentamos cerrarlo (Bootstrap)
        const navbarCollapse = document.querySelector('.navbar-collapse');
        if (navbarCollapse && navbarCollapse.classList.contains('show')) {
          try {
            const instancia = bootstrap.Collapse.getInstance(navbarCollapse) || new bootstrap.Collapse(navbarCollapse, {toggle: false});
            instancia.hide();
          } catch (e) {
            // si bootstrap no está presente, ignorar sin romper
          }
        }
      });
    });
  }

  /* =========================
     Inicialización y eventos
     ========================= */
  function inicializarScrollUtils() {
    // Ejecutar al cargar para marcar nav y header
    actualizarNavActivo();
    aplicarEfectoHeader();
    inicializarScrollConOffset();

    // Scroll listener optimizado
    window.addEventListener('scroll', debounce(() => {
      aplicarEfectoHeader();
      actualizarNavActivo();
    }, 60));

    // Recalcular en resize (debounced)
    window.addEventListener('resize', debounce(() => {
      actualizarNavActivo();
    }, 120));
  }

  // Ejecutar cuando el DOM esté listo
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', inicializarScrollUtils);
  } else {
    inicializarScrollUtils();
  }

})();