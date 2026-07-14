// --- LÓGICA DEL CANDADO ---
// La contraseña que deberá leer del QR
const CLAVE_SECRETA = "2608"; 

function abrirModal(idModal) {
    document.getElementById(idModal).style.display = 'flex';
}

function cerrarModal(idModal) {
    document.getElementById(idModal).style.display = 'none';
    // Limpiamos los errores si se cierra
    if(idModal === 'modal-password') {
        document.getElementById('input-clave').value = '';
        document.getElementById('error-clave').style.display = 'none';
    }
}

function verificarClave() {
    const claveIngresada = document.getElementById('input-clave').value.toUpperCase().trim();

    if (claveIngresada === CLAVE_SECRETA) {
        // 1. Cambiamos el emoji del candado flotante y activamos su animación de brillo
        const btnCandado = document.getElementById('btn-candado');
        btnCandado.textContent = "🔓";
        btnCandado.classList.add('candado-abierto-anim');

        // 2. Desvanecemos el contenido del cuadro de contraseña suavemente
        const contenidoPassword = document.querySelector('#modal-password .modal-contenido');
        contenidoPassword.style.transition = "all 0.4s ease";
        contenidoPassword.style.opacity = "0";
        contenidoPassword.style.transform = "scale(0.8)";

        // 3. EL VIAJE: La llevamos a la página final de la propuesta
        setTimeout(() => {
            window.location.href = "candado.html"; 
        }, 600);

    } else {
        document.getElementById('error-clave').style.display = 'block';
    }
}

// --- LÓGICA DEL DIARIO PIXEL ART ---

let paginaActual = 1;
let temporizadorSorpresa = null; // Guardamos el temporizador aquí

function cambiarPagina(direccion) {
    paginaActual += direccion;

    // Límites de seguridad (no bajar de 1 ni pasar de 3)
    if (paginaActual < 1) paginaActual = 1;
    if (paginaActual > 3) paginaActual = 3;

    // 1. Cambiamos la imagen de la hoja actual
    document.getElementById('hoja-actual').src = `img/hoja${paginaActual}.png`;

    // 2. Mostramos u ocultamos las flechas según corresponda
    document.getElementById('btn-atras').style.display = (paginaActual === 1) ? 'none' : 'block';
    document.getElementById('btn-siguiente').style.display = (paginaActual === 3) ? 'none' : 'block';

    // 3. Lógica de la página 3 (El suspenso de 10 segundos)
    const btnAceptar = document.getElementById('btn-aceptar');

    // Siempre limpiamos el temporizador si cambia de página, para evitar errores
    if (temporizadorSorpresa) {
        clearTimeout(temporizadorSorpresa);
        temporizadorSorpresa = null;
    }

    if (paginaActual === 3) {
        // Empieza a contar 10 segundos (10000 milisegundos)
        temporizadorSorpresa = setTimeout(() => {
            btnAceptar.style.display = 'block'; // ¡Aparece el botón de Minecraft!
        }, 10000); 
    } else {
        // Si retrocede a la página 1 o 2, escondemos el botón de aceptar
        btnAceptar.style.display = 'none';
    }
}

// --- LA GRAN CELEBRACIÓN ---//
function celebrarGranMomento() {
    // 1. Cañón izquierdo
    confetti({
        particleCount: 150, // Cantidad de papelitos
        spread: 80,         // Qué tan abierto es el disparo
        origin: { x: 0.1, y: 0.6 } // Empieza desde el lado izquierdo
    });

    // 2. Cañón derecho
    confetti({
        particleCount: 150,
        spread: 80,
        origin: { x: 0.9, y: 0.6 } // Empieza desde el lado derecho
    });

    // 3. Pequeño cañón central sorpresa después de medio segundo
    setTimeout(() => {
        confetti({
            particleCount: 200,
            spread: 100,
            origin: { x: 0.5, y: 0.7 },
            colors: ['#ff0000', '#ffb3c1', '#ffffff'] // Confeti con los colores de tu app
        });
    }, 500);

    // 4. El mensaje final (esperamos 1.5 segundos para que vea el confeti)
    setTimeout(() => {
        alert('¡Dijo que SÍ! 🎉❤️ Oficialmente pololos.');
    }, 1500);
}