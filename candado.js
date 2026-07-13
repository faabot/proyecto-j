// --- LÓGICA DEL CANDADO ---
// La contraseña que deberá leer del QR
const CLAVE_SECRETA = "AMOR"; 

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

// --- LÓGICA DE LA PROPUESTA (El botón escurridizo) ---

// Variable global para recordar el tamaño del botón "Sí"
let escalaSi = 1;

function escaparBoton() {
    const btnNo = document.getElementById('btn-no');
    const btnSi = document.getElementById('btn-si');
    
    // 1. El salto del botón "No" (se mantiene igual)
    const movimientoX = (Math.random() * 400) - 200;
    const movimientoY = (Math.random() * 400) - 200;

    btnNo.style.transition = "none";
    btnNo.style.transform = `translate(${movimientoX}px, ${movimientoY}px)`;
    
    const frases = ["¡Nop! 🤪", "¡Casi! 🏃‍♂️", "¿Segura? 👀", "Intenta de nuevo 😂"];
    btnNo.textContent = frases[Math.floor(Math.random() * frases.length)];

    // 2. HACER CRECER EL BOTÓN "SÍ"
    escalaSi += 0.3; // Crece un 30% adicional cada vez que intenta atrapar el "No"
    
    // Le aplicamos la escala al botón verde con una transición suave
    btnSi.style.transform = `scale(${escalaSi})`;
    btnSi.style.transition = "transform 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)";
}