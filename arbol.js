// --- CONFIGURACIÓN ---
const FECHA_INICIO = new Date("2025-08-26T19:18:00"); 
const CARTA = `Mi querida Julietita...\nSi pudiera elegir un lugar seguro en este inmenso universo, sin duda sería a tu lado.\nCada día que pasa me doy cuenta de lo afortunado que soy.\nNo importa cuántas herramientas programe, mi mejor proyecto siempre será nuestro futuro juntos.`;

// --- 1. COREOGRAFÍA Y ANIMACIONES ---
window.onload = () => {
    const semilla = document.getElementById('semilla');
    const trazosSVG = document.querySelectorAll('.trazo-verde');
    const tarjeta = document.getElementById('tarjeta-principal');

    // ACTO 1: Cae el punto rojo (segundo 0 al 1)
    semilla.style.animation = "caerPunto 1.2s ease-in forwards";

    // ACTO 2: Crece el árbol verde (segundo 1 al 2.5)
    setTimeout(() => {
        trazosSVG.forEach((trazo, index) => {
            // El tronco crece primero, las ramas un poquito después
            let retraso = index === 0 ? 0 : 0.5 + (Math.random() * 0.5);
            trazo.style.animation = `dibujarArbol 1s ease-out forwards ${retraso}s`;
        });
    }, 1000);

    // ACTO 3: Florece el corazón gigante (segundo 2.5 al 4.5)
    setTimeout(() => {
        generarCopaCorazonMatematica();
    }, 2500);

    // ACTO 4: El telón se abre, el árbol va a la derecha (segundo 5)
    setTimeout(() => {
        tarjeta.classList.remove('arbol-centrado');
    }, 5000);

    // ACTO 5: Aparece el texto y el reloj (segundo 6.5)
    setTimeout(() => {
        setInterval(actualizarContador, 1000);
        actualizarContador();
        escribirCarta();
    }, 6500);
};

// --- 2. GENERADOR DEL CORAZÓN (Ecuación Paramétrica) ---
function generarCopaCorazonMatematica() {
    const copa = document.getElementById("copa-corazon");
    const numParticulas = 180; // Bastantes para que se llene bien
    const emojis = ['❤️', '💖', '💕', '💗'];

    for (let i = 0; i < numParticulas; i++) {
        let particula = document.createElement("div");
        particula.className = "particula-corazon";
        
        // Elige si es un punto de color o un emoji
        if(Math.random() > 0.4) {
            particula.innerText = emojis[Math.floor(Math.random() * emojis.length)];
            particula.style.fontSize = `${Math.random() * 10 + 8}px`;
        } else {
            particula.innerText = "❤";
            particula.style.color = ['#ff4a6b', '#ffb3c6', '#d6336c'][Math.floor(Math.random() * 3)];
            particula.style.fontSize = `${Math.random() * 14 + 10}px`;
        }

        // MATEMÁTICA DEL CORAZÓN
        // Genera un ángulo aleatorio y una distancia desde el centro
        let t = Math.random() * Math.PI * 2;
        let r = Math.sqrt(Math.random()); // sqrt para rellenar uniformemente

        // Fórmula paramétrica del corazón
        let x = r * 16 * Math.pow(Math.sin(t), 3);
        let y = -r * (13 * Math.cos(t) - 5 * Math.cos(2*t) - 2 * Math.cos(3*t) - Math.cos(4*t));

        // Escalar y centrar para la caja de 300x250
        let escala = 7; 
        particula.style.left = `${(x * escala) + 145}px`; 
        particula.style.top = `${(y * escala) + 110}px`; 

        // Animación individual con retraso aleatorio
        let retraso = Math.random() * 2;
        particula.style.animation = `florecer 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275) forwards ${retraso}s`;

        copa.appendChild(particula);
    }
}

// --- 3. FUNCIONES DE TEXTO Y RELOJ ---
function actualizarContador() {
    const diferencia = new Date() - FECHA_INICIO;
    document.getElementById("d").innerText = Math.floor(diferencia / (1000 * 60 * 60 * 24));
    document.getElementById("h").innerText = Math.floor((diferencia / (1000 * 60 * 60)) % 24);
    document.getElementById("m").innerText = Math.floor((diferencia / 1000 / 60) % 60);
    document.getElementById("s").innerText = Math.floor((diferencia / 1000) % 60);
}

let indiceLetra = 0;
function escribirCarta() {
    const contenedor = document.getElementById("carta-maquina");
    if (indiceLetra < CARTA.length) {
        let caracter = CARTA.charAt(indiceLetra) === '\n' ? '<br>' : CARTA.charAt(indiceLetra);
        contenedor.innerHTML = CARTA.substring(0, indiceLetra).replace(/\n/g, '<br>') + caracter + '<span class="cursor"></span>';
        indiceLetra++;
        setTimeout(escribirCarta, 40); // Velocidad de escritura
    } else {
        contenedor.innerHTML = CARTA.replace(/\n/g, '<br>') + '<span class="cursor"></span>';
    }
}