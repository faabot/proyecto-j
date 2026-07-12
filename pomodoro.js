// --- 2. LÓGICA DEL POMODORO PRO ---
let tiempoRestante = 25 * 60;
let idIntervalo = null;
let cicloActual = 0; // Cuenta cuántos pomodoros se han completado
let faseActual = 'ESTUDIO'; // ESTUDIO, CORTO, LARGO

// Sonido oficial de alarma
const sonidoAlarma = new Audio('https://actions.google.com/sounds/v1/alarms/beep_short.ogg');

const minPantalla = document.getElementById("minutos");
const segPantalla = document.getElementById("segundos");

function actualizarPantalla() {
    let min = Math.floor(tiempoRestante / 60);
    let seg = tiempoRestante % 60;
    minPantalla.textContent = min < 10 ? "0" + min : min;
    segPantalla.textContent = seg < 10 ? "0" + seg : seg;
}

function aplicarConfigPomo() {
    pausarCronometro();
    faseActual = 'ESTUDIO';
    cicloActual = 0;
    actualizarTextosUI();
    let minEstudio = parseInt(document.getElementById("pomo-estudio").value) || 25;
    tiempoRestante = minEstudio * 60;
    actualizarPantalla();
}

function actualizarTextosUI() {
    const titulo = document.getElementById("titulo-pomodoro");
    const subtitulo = document.getElementById("subtitulo-pomodoro");
    const reloj = document.getElementById("reloj-pantalla");

    if (faseActual === 'ESTUDIO') {
        titulo.textContent = "Tiempo de Estudio ❤️";
        subtitulo.textContent = "Concentración al máximo.";
        reloj.style.color = "#222";
    } else if (faseActual === 'CORTO') {
        titulo.textContent = "Descanso Corto ☕";
        subtitulo.textContent = "¡Bien hecho! Estira las piernas unos minutos.";
        reloj.style.color = "#4caf50"; // Verde
    } else {
        titulo.textContent = "Descanso Largo 🛋️";
        subtitulo.textContent = "¡Sección completada! Te mereces un buen relajo.";
        reloj.style.color = "#2196f3"; // Azul
    }
}

function procesarFinDeFase() {
    sonidoAlarma.play().catch(e => console.log("Sonido bloqueado por el navegador"));

    let autoDescanso = document.getElementById('auto-descanso').checked;
    let autoPomo = document.getElementById('auto-pomo').checked;
    let intervaloMax = parseInt(document.getElementById('pomo-intervalo').value) || 4;

    if (faseActual === 'ESTUDIO') {
        cicloActual++;
        if (cicloActual >= intervaloMax) {
            faseActual = 'LARGO';
            tiempoRestante = (parseInt(document.getElementById("pomo-largo").value) || 15) * 60;
            cicloActual = 0;
        } else {
            faseActual = 'CORTO';
            tiempoRestante = (parseInt(document.getElementById("pomo-corto").value) || 5) * 60;
        }
        actualizarTextosUI();
        actualizarPantalla();
        if (autoDescanso) iniciarCronometro();
        
    } else {
        faseActual = 'ESTUDIO';
        tiempoRestante = (parseInt(document.getElementById("pomo-estudio").value) || 25) * 60;
        actualizarTextosUI();
        actualizarPantalla();
        if (autoPomo) iniciarCronometro();
    }
}

// --- ESTAS ERAN LAS FUNCIONES QUE TE FALTABAN ---

function iniciarCronometro() {
    // Si ya hay un intervalo corriendo, no hace nada para que no se acelere el reloj
    if (idIntervalo !== null) return; 
    
    idIntervalo = setInterval(() => {
        if (tiempoRestante > 0) {
            tiempoRestante--;
            actualizarPantalla();
        } else {
            pausarCronometro();
            procesarFinDeFase();
        }
    }, 1000);
}

function pausarCronometro() {
    clearInterval(idIntervalo);
    idIntervalo = null;
}

function reiniciarCronometro() {
    pausarCronometro();
    if (faseActual === 'ESTUDIO') {
        tiempoRestante = (parseInt(document.getElementById("pomo-estudio").value) || 25) * 60;
    } else if (faseActual === 'CORTO') {
        tiempoRestante = (parseInt(document.getElementById("pomo-corto").value) || 5) * 60;
    } else {
        tiempoRestante = (parseInt(document.getElementById("pomo-largo").value) || 15) * 60;
    }
    actualizarPantalla();
}

// Inicia la pantalla con los valores correctos apenas carga la página
actualizarTextosUI();
actualizarPantalla();