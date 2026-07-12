// --- 5. LÓGICA DE LA CALCULADORA DE NOTAS PRO ---
let registroNotas = { certamenes: [], trabajos: [], laboratorios: [], presentaciones: [] };

function alternarCategoria(categoria) {
    const isChecked = document.getElementById(`check-${categoria}`).checked;
    const grupo = document.getElementById(`grupo-${categoria}`);
    const pesoInput = document.getElementById(`peso-${categoria}`);
    const internoCheck = document.getElementById(`interno-${categoria}`);

    if (isChecked) {
        grupo.style.opacity = "1";
        grupo.style.pointerEvents = "auto";
        pesoInput.disabled = false;
        internoCheck.disabled = false;
    } else {
        grupo.style.opacity = "0.5";
        grupo.style.pointerEvents = "none";
        pesoInput.disabled = true;
        internoCheck.disabled = true;
    }
}

function alternarModoInterno(categoria) {
    const esPonderadoInterno = document.getElementById(`interno-${categoria}`).checked;
    const inputPesoInterno = document.getElementById(`peso-int-${categoria}`);
    
    inputPesoInterno.style.display = esPonderadoInterno ? 'block' : 'none';
    
    // Si cambia las reglas del juego, borramos las notas de esa categoría para no romper el cálculo
    registroNotas[categoria] = [];
    actualizarVisualNotas(categoria);
}

function agregarNota(categoria) {
    const esPonderadoInterno = document.getElementById(`interno-${categoria}`).checked;
    const inputNota = document.getElementById(`nota-${categoria}`);
    const inputPesoInterno = document.getElementById(`peso-int-${categoria}`);
    
    let notaVal = parseFloat(inputNota.value);
    let pesoVal = esPonderadoInterno ? parseFloat(inputPesoInterno.value) : null;

    if (isNaN(notaVal) || notaVal < 1.0 || notaVal > 7.0) {
        return alert("Mi amor, ingresa una nota válida entre 1.0 y 7.0 🥺");
    }

    if (esPonderadoInterno && (isNaN(pesoVal) || pesoVal <= 0)) {
        return alert("Por favor, ingresa el porcentaje que vale esta nota.");
    }

    registroNotas[categoria].push({ nota: notaVal, peso: pesoVal });
    
    inputNota.value = ""; 
    if (esPonderadoInterno) inputPesoInterno.value = "";
    
    actualizarVisualNotas(categoria);
}

function actualizarVisualNotas(categoria) {
    const contenedor = document.getElementById(`lista-${categoria}`);
    contenedor.innerHTML = ""; 
    registroNotas[categoria].forEach(item => {
        // Si tiene peso, lo muestra al lado en pequeñito
        let textoExtra = item.peso !== null ? ` <small style="font-size:11px; opacity:0.8;">(${item.peso}%)</small>` : "";
        contenedor.innerHTML += `<span class="etiqueta-nota">${item.nota.toFixed(1)}${textoExtra}</span>`;
    });
}

function calcularPromedioFinal() {
    const categorias = ['certamenes', 'trabajos', 'laboratorios', 'presentaciones'];
    let promedioFinal = 0;
    let sumaPorcentajesGlobales = 0;
    let errorEncontrado = false;

    for (let cat of categorias) {
        const estaActiva = document.getElementById(`check-${cat}`).checked;
        
        if (estaActiva) {
            let pesoGlobal = parseFloat(document.getElementById(`peso-${cat}`).value);
            let esPonderadoInterno = document.getElementById(`interno-${cat}`).checked;
            let notas = registroNotas[cat];

            if (isNaN(pesoGlobal)) {
                alert(`Falta el porcentaje Total de la categoría ${cat}.`);
                return;
            }
            sumaPorcentajesGlobales += pesoGlobal;

            if (notas.length > 0) {
                if (esPonderadoInterno) {
                    // SUMA 100% INTERNA
                    let sumaPesosInternos = notas.reduce((acc, curr) => acc + curr.peso, 0);
                    if (sumaPesosInternos !== 100) {
                        alert(`¡Ojo! Las notas en ${cat} suman ${sumaPesosInternos}%. Deben sumar exactamente 100%.`);
                        dispararAlertaVisual(cat);
                        errorEncontrado = true;
                        break; // Detiene el cálculo
                    }
                    // Promedio interno ponderado
                    let promedioCat = notas.reduce((acc, curr) => acc + (curr.nota * (curr.peso / 100)), 0);
                    promedioFinal += promedioCat * (pesoGlobal / 100);
                } else {
                    // Promedio interno simple
                    let promedioCat = notas.reduce((acc, curr) => acc + curr.nota, 0) / notas.length;
                    promedioFinal += promedioCat * (pesoGlobal / 100);
                }
            } else {
                alert(`Activaste ${cat} pero no le pusiste notas. Apágala si no la necesitas.`);
                return;
            }
        }
    }

    if (errorEncontrado) return; // Si hubo error en los porcentajes internos, no avanza

    if (sumaPorcentajesGlobales !== 100) {
        alert(`Los porcentajes Globales suman ${sumaPorcentajesGlobales}%. Deben sumar exactamente 100% para calcular la asignatura.`);
        return;
    }

    mostrarVeredicto(promedioFinal);
}

// --- FUNCIONES EXTRA DE INTERFAZ ---

// Hace que la caja de la categoría parpadee en rojo si los porcentajes están mal
function dispararAlertaVisual(categoria) {
    const seccion = document.getElementById(`seccion-${categoria}`);
    seccion.style.border = "2px solid #e74c3c";
    seccion.style.backgroundColor = "#fadbd8";
    
    // Lo regresa a la normalidad después de 2 segundos
    setTimeout(() => {
        seccion.style.border = "1px solid #e9ecef";
        seccion.style.backgroundColor = "#f8f9fa";
    }, 2000);
}

// Muestra la nota final en la pantalla
function mostrarVeredicto(promedio) {
    const cajaResultado = document.getElementById("resultado-notas");
    cajaResultado.style.display = "block"; // Lo hace visible
    
    // Redondear a un decimal
    let notaFinal = promedio.toFixed(1);

    if (notaFinal >= 4.0) {
        cajaResultado.style.backgroundColor = "#d4edda";
        cajaResultado.style.color = "#155724";
        cajaResultado.style.border = "1px solid #c3e6cb";
        cajaResultado.innerHTML = `¡Felicidades! 🎉<br>Tu promedio final es: <span style="font-size: 1.5rem;">${notaFinal}</span><br><small>Aprobaste la asignatura.</small>`;
    } else {
        cajaResultado.style.backgroundColor = "#f8d7da";
        cajaResultado.style.color = "#721c24";
        cajaResultado.style.border = "1px solid #f5c6cb";
        cajaResultado.innerHTML = `Peligro 🚨<br>Tu promedio final es: <span style="font-size: 1.5rem;">${notaFinal}</span><br><small>Requieres mejorar para aprobar.</small>`;
    }
}