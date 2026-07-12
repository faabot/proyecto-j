// --- LÓGICA DEL LECTOR QR ---

function iniciarQR() {
    const html5QrCode = new Html5Qrcode("lector_qr");
    document.getElementById("btn-camara").style.display = "none"; 
    
    html5QrCode.start(
        { facingMode: "environment" }, // Usa la cámara trasera del celular si está disponible
        { fps: 10, qrbox: { width: 250, height: 250 } },
        (textoDecodificado) => {
            // ¡Lectura exitosa!
            document.getElementById("resultado-qr").innerHTML = `💌 ¡Mensaje secreto: ${textoDecodificado}!`;
            
            // Apaga la cámara y vuelve a mostrar el botón
            html5QrCode.stop().then(() => {
                const btn = document.getElementById("btn-camara");
                btn.style.display = "block";
                btn.textContent = "Escanear otro código";
            }); 
        },
        (error) => { 
            // Silenciar errores constantes de lectura (es normal cuando busca códigos) 
        }
    ).catch(err => {
        // En caso de que el usuario no dé permisos de cámara
        alert("Compañero, no se pudo acceder a la cámara. Asegúrate de dar los permisos en el navegador.");
        document.getElementById("btn-camara").style.display = "block";
    });
}