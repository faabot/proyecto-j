// Mejora de voltear: mantiene z-index original por página y añade soporte táctil/teclado
let _topZ = 1000; // contador para traer páginas al frente temporalmente

function voltear(numeroPapel) {
    const papel = document.getElementById('p' + numeroPapel);
    if (!papel) return;

    // asegurar origZ
    if (!('origZ' in papel.dataset)) {
        const z = getComputedStyle(papel).zIndex;
        papel.dataset.origZ = (z && z !== 'auto') ? z : 0;
        papel.style.zIndex = papel.dataset.origZ;
    }

    if (!papel.classList.contains('volteado')) {
        papel.classList.add('volteado');
        // Traer la hoja al frente TEMPORALMENTE para que el giro esté encima
        _topZ += 1;
        papel.style.zIndex = _topZ;
    } else {
        papel.classList.remove('volteado');
        // Restaurar z-index al original tras la animación
        setTimeout(() => { papel.style.zIndex = papel.dataset.origZ || ''; }, 800);
    }

    // NUEVO: Llamamos a la función que centra el libro cada vez que se toca una hoja
    centrarLibro();
}

// --- NUEVA FUNCION: Calcula la posición del libro ---
function centrarLibro() {
    const libro = document.querySelector('.libro');
    const totalHojas = document.querySelectorAll('.papel').length;
    const hojasVolteadas = document.querySelectorAll('.papel.volteado').length;
    
    if (hojasVolteadas === 0) {
        // Libro cerrado (Inicio): Se queda en su lugar
        libro.style.setProperty('--desplazamiento', '0px');
    } else if (hojasVolteadas === totalHojas) {
        // Libro cerrado (Final): Como pasaste todas las hojas, el libro se mueve a la derecha
        libro.style.setProperty('--desplazamiento', '300px');
    } else {
        // Libro abierto: Se centra perfectamente en la pantalla (150px es la mitad de 300px)
        libro.style.setProperty('--desplazamiento', '150px');
    }
}


// Soporte táctil y accesibilidad: asignar tabindex y listeners
document.addEventListener('DOMContentLoaded', () => {
    const pages = Array.from(document.querySelectorAll('.papel'));
    const total = pages.length;

    pages.forEach((p, idx) => {
        p.setAttribute('tabindex', '0');

        // Determinar z-index estable basado en el orden DOM (primer elemento arriba)
        const zIndex = total - idx;
        p.dataset.origZ = zIndex;
        p.style.zIndex = zIndex;

        // FRONT: si el usuario ya puso una imagen, mantenla. Si no, asignar una aleatoria reproducible
        const frenteImg = p.querySelector('.frente img');
        if (frenteImg && (!frenteImg.src || frenteImg.src.trim() === '')) {
            frenteImg.src = `https://picsum.photos/seed/front-${idx}/400/500`;
        }

        // BACK: preferir src que ponga el usuario; si no hay, asignar picsum con seed por índice
        const dorsoImg = p.querySelector('.dorso img');
        const backSrc = dorsoImg && dorsoImg.getAttribute('src') && dorsoImg.src.indexOf('data:') !== 0
            ? dorsoImg.src
            : `https://picsum.photos/seed/back-${idx}/400/500`;
        p.dataset.backSrc = backSrc;
        if (dorsoImg) dorsoImg.src = backSrc;

        // Listeners
        p.addEventListener('touchstart', function (e) {
            e.preventDefault();
            voltear(this.id.replace('p',''));
        }, { passive: false });

        p.addEventListener('click', function (e) {
            // prevenir que clicks en imágenes aniden otros eventos
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

// También exponemos la función por si el HTML la llama directamente
window.voltear = voltear;
