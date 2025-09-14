/* 
Archivo: main.js
Descripción: Script principal para el portfolio de Leandro Palombo.
Autor: Leandro Palombo
*/

/* ========== Navegación suave al hacer click en los enlaces internos ========= */
document.querySelectorAll('a[href^="#"]').forEach(function(enlace) {
    enlace.addEventListener('click', function(evento) {
        // Evitar el salto instantáneo
        const destino = document.querySelector(this.getAttribute('href'));
        if (destino) {
            evento.preventDefault();
            destino.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

/* ========== Cambiar sombra del header al hacer scroll ========= */
window.addEventListener('scroll', function() {
    const header = document.querySelector('.navbar');
    if (!header) return;
    if (window.pageYOffset > 60) {
        header.classList.add('sombra-header-activa');
    } else {
        header.classList.remove('sombra-header-activa');
    }
});

/* ========== Efecto de animación de tarjetas al aparecer ========= */
function animarTarjetas() {
    const tarjetas = document.querySelectorAll('.card-exp, .card-hab, .card-proy, .card-contacto');
    const alturaVentana = window.innerHeight;
    tarjetas.forEach(function(tarjeta) {
        const posicionTarjeta = tarjeta.getBoundingClientRect().top;
        if (posicionTarjeta < alturaVentana - 80) {
            tarjeta.classList.add('animada');
        }
    });
}
window.addEventListener('scroll', animarTarjetas);
window.addEventListener('load', animarTarjetas);

/* ========== Barra de habilidades animada ========= */
function animarBarrasHabilidad() {
    const seccionHabilidades = document.getElementById('habilidades');
    if (!seccionHabilidades) return;
    const barras = seccionHabilidades.querySelectorAll('.porcentaje');
    barras.forEach(function(barra) {
        // Si necesitas animar barras de progreso, puedes agregar lógica aquí
        // Por ahora solo cambio de opacidad y transición en CSS
        barra.classList.add('animada');
    });
}
window.addEventListener('scroll', animarBarrasHabilidad);
window.addEventListener('load', animarBarrasHabilidad);

/* ========== Botón "Descargar CV" ========= */
const botonCV = document.querySelector('a.btn-outline-primary, button.btn-outline-primary');
if (botonCV) {
    botonCV.addEventListener('click', function(evento) {
        evento.preventDefault();
        // Cambiar por la ruta real de tu CV
        window.open('assets/Leandro_Palombo_CV.pdf', '_blank');
    });
}

/* ========== Efecto hover en iconos del footer ========= */
const iconosFooter = document.querySelectorAll('.icono-footer');
iconosFooter.forEach(function(icono) {
    icono.addEventListener('mouseenter', function() {
        this.classList.add('icono-footer-activo');
    });
    icono.addEventListener('mouseleave', function() {
        this.classList.remove('icono-footer-activo');
    });
});

/* ========== Utilidad: cerrar menú móvil al seleccionar un enlace ========= */
const menuPrincipal = document.getElementById('menuPrincipal');
if (menuPrincipal) {
    const enlacesMenu = menuPrincipal.querySelectorAll('a.nav-link');
    enlacesMenu.forEach(function(enlace) {
        enlace.addEventListener('click', function() {
            if (window.innerWidth < 992) {
                // Cerrar el menú Bootstrap si está abierto
                const navbarCollapse = document.querySelector('.navbar-collapse');
                if (navbarCollapse && navbarCollapse.classList.contains('show')) {
                    const bsCollapse = new bootstrap.Collapse(navbarCollapse, {toggle: true});
                    bsCollapse.hide();
                }
            }
        });
    });
}

/* ========== Utilidad: animaciones de entrada para sección principal ========= */
window.addEventListener('load', function() {
    const hero = document.querySelector('.hero-section');
    if (hero) {
        hero.classList.add('animar-entrada');
    }
});