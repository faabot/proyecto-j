// =========================================================
// 1. CONFIGURACIÓN: ¡Cambia estos datos por los tuyos!
// =========================================================

// Formato de fecha: "Año-Mes-DiaTHora:Minuto:Segundo"
// Ejemplo: Si empezaron a salir el 14 de Febrero de 2023 a las 15:30.
const FECHA_INICIO = new Date("2025-08-26T19:15:00"); 

// La carta que se escribirá sola (puedes hacerla tan larga como quieras)
const CARTA = `Mi querida Julietita... 
Si pudiera elegir un lugar seguro en este inmenso universo, sin duda sería a tu lado.
Cada día que pasa me doy cuenta de lo afortunado que soy. 
No importa cuántas herramientas programe, mi mejor proyecto siempre será nuestro futuro juntos.
Te amo muchísimo. ❤️`;

// =========================================================
// 2. EL CONTADOR DE TIEMPO
// =========================================================
function actualizarContador() {
    const ahora = new Date();
    const diferencia = ahora - FECHA_INICIO;

    // Matemáticas para calcular días, horas, minutos y segundos
    const dias = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    const horas = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    const minutos = Math.floor((diferencia / 1000 / 60) % 60);
    const segundos = Math.floor((diferencia / 1000) % 60);

    // Actualizar el HTML
    document.getElementById("dias").innerText = dias;
    document.getElementById("horas").innerText = horas;
    document.getElementById("minutos").innerText = minutos;
    document.getElementById("segundos").innerText = segundos;
}

// =========================================================
// 3. EFECTO DE MÁQUINA DE ESCRIBIR
// =========================================================
let indiceLetra = 0;
const velocidadEscritura = 50; // Milisegundos entre cada letra (menor = más rápido)

function escribirCarta() {
    const contenedor = document.getElementById("carta-maquina");
    
    if (indiceLetra < CARTA.length) {
        // Mantiene los saltos de línea reemplazando el "Enter" por <br>
        let caracter = CARTA.charAt(indiceLetra);
        if (caracter === '\n') caracter = '<br>';
        
        contenedor.innerHTML = CARTA.substring(0, indiceLetra) + caracter + '<span class="cursor"></span>';
        indiceLetra++;
        setTimeout(escribirCarta, velocidadEscritura);
    } else {
        // Al terminar, dejamos el texto limpio con el cursor al final
        contenedor.innerHTML = CARTA.replace(/\n/g, '<br>') + '<span class="cursor"></span>';
    }
}

// =========================================================
// 4. GENERADOR DEL ÁRBOL DE CORAZONES (VERSIÓN CRECIMIENTO)
// =========================================================
function crearArbol() {
    const copa = document.getElementById("copa-arbol");
    const tiposCorazones = ['❤️', '💖', '💕', '💗', '💓', '🌸'];
    const cantidadHojas = 120; 

    for (let i = 0; i < cantidadHojas; i++) {
        let corazon = document.createElement("span");
        corazon.className = "corazon-hoja";
        corazon.innerText = tiposCorazones[Math.floor(Math.random() * tiposCorazones.length)];
        
        // Posición aleatoria
        let posX = Math.random() * 100;
        let posY = Math.random() * 100;
        corazon.style.left = `${posX}%`;
        corazon.style.top = `${posY}%`;
        corazon.style.fontSize = `${Math.random() * 15 + 10}px`;
        
        // LA MAGIA DE LOS TIEMPOS: 
        // El tronco y ramas tardan 2 segundos.
        // Hacemos que los corazones nazcan entre el segundo 1.8 y el 4.5 de forma aleatoria.
        let tiempoDeEspera = 2.8 + (Math.random() * 3.2);
        
        // Le aplicamos la animación CSS con ese retraso exacto
        corazon.style.animation = `floracion 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${tiempoDeEspera}s`;
        
        copa.appendChild(corazon);
    }
}

// =========================================================
// INICIALIZACIÓN: El Guion de la Película
// =========================================================
window.onload = () => {
    // ACTO 1: Arranca de inmediato (Cae la semilla y crece el árbol en el centro)
    crearArbol(); 

    // ACTO 2: A los 6.5 segundos (cuando las hojas ya florecieron)
    setTimeout(() => {
        // Le quitamos la clase, haciendo que el árbol se deslice a la derecha
        document.querySelector('.contenedor-principal').classList.remove('arbol-centrado');
    }, 6500);

    // ACTO 3: A los 8 segundos (cuando el árbol ya terminó de deslizarse)
    setTimeout(() => {
        // Aparece la carta de golpe y empieza a escribirse
        escribirCarta();
        
        // Arranca el reloj de amor en tiempo real
        actualizarContador(); 
        setInterval(actualizarContador, 1000); 
    }, 8000);
};