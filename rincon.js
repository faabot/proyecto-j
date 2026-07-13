// --- LÓGICA DEL LIBRO 3D ---
let _topZ = 1000; 

function voltear(numeroPapel) {
    const papel = document.getElementById('p' + numeroPapel);
    if (!papel) return;

    // Asegurar el z-index original de la hoja
    if (!('origZ' in papel.dataset)) {
        const z = getComputedStyle(papel).zIndex;
        papel.dataset.origZ = (z && z !== 'auto') ? z : 0;
        papel.style.zIndex = papel.dataset.origZ;
    }

    if (!papel.classList.contains('volteado')) {
        papel.classList.add('volteado');
        // Traer la hoja al frente para que gire por encima de las demás
        _topZ += 1;
        papel.style.zIndex = _topZ;
    } else {
        papel.classList.remove('volteado');
        // Esperamos a que termine la animación para devolverle su orden original
        setTimeout(() => { papel.style.zIndex = papel.dataset.origZ || ''; }, 800);
    }

    // Calculamos si el libro debe moverse
    centrarLibro();
}

function centrarLibro() {
    const libro = document.querySelector('.libro');
    const totalHojas = document.querySelectorAll('.papel').length;
    const hojasVolteadas = document.querySelectorAll('.papel.volteado').length;
    
    if (hojasVolteadas === 0) {
        // Inicio: 0% de desplazamiento
        libro.style.setProperty('--desplazamiento', '0%');
    } else if (hojasVolteadas === totalHojas) {
        // Final: 100% de desplazamiento (se mueve exactamente el ancho del libro)
        libro.style.setProperty('--desplazamiento', '100%');
    } else {
        // Abierto: 50% de desplazamiento (se centra perfecto)
        libro.style.setProperty('--desplazamiento', '50%');
    }
}

document.addEventListener('DOMContentLoaded', () => {
    const pages = Array.from(document.querySelectorAll('.papel'));
    const total = pages.length;

    pages.forEach((p, idx) => {
        p.setAttribute('tabindex', '0');

        // Determinar el orden de las páginas (la primera arriba, la última abajo)
        const zIndex = total - idx;
        p.dataset.origZ = zIndex;
        p.style.zIndex = zIndex;

        // Listeners para tocar, hacer clic o usar teclado
        p.addEventListener('touchstart', function (e) {
            e.preventDefault();
            voltear(this.id.replace('p',''));
        }, { passive: false });

        p.addEventListener('click', function (e) {
            voltear(this.id.replace('p',''));
        });

        p.addEventListener('keydown', function (e) {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                voltear(this.id.replace('p',''));
            }
        });
    });
});

window.voltear = voltear;