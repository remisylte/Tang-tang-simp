const lightbox = document.getElementById('lightbox');
const imgEnGrande = document.getElementById('img-en-grande');
const videoEnGrande = document.getElementById('video-en-grande');
const cerrarBtn = document.querySelector('.cerrar');

let estaAbierto = false;

function abrir(src, esVideo) {
    lightbox.style.display = "flex";
    document.body.style.overflow = "hidden";
    lightbox.scrollTop = 0;
    estaAbierto = true;

    if (esVideo) {
        // MODO VIDEO
        imgEnGrande.style.display = "none";
        imgEnGrande.removeAttribute('src'); // Quitamos el atributo por completo
        
        videoEnGrande.style.display = "block";
        videoEnGrande.src = src;
        videoEnGrande.load();
        videoEnGrande.play();
    } else {
        // MODO IMAGEN
        // Detenemos y reseteamos el video totalmente
        videoEnGrande.pause();
        videoEnGrande.removeAttribute('src'); // Eliminamos la fuente
        videoEnGrande.load(); 
        videoEnGrande.style.display = "none";

        // Activamos la imagen
        imgEnGrande.style.display = "block";
        imgEnGrande.src = src;
    }
}

function cerrarTodo() {
    lightbox.style.display = "none";
    // Esto es vital: devuelve el poder de hacer scroll a la página
    document.body.style.overflow = "auto"; 
    
    // Limpieza de recursos
    videoEnGrande.pause();
    videoEnGrande.src = "";
    imgEnGrande.src = "";
    estaAbierto = false;
}

// 3. ASIGNACIÓN DE CLICS (Imágenes y Videos)
document.querySelectorAll('[class^="galeria-"]').forEach(contenedor => {
    const img = contenedor.querySelector('img');
    const vid = contenedor.querySelector('video');

    // Si el contenedor tiene una imagen
    if (img) {
        img.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            abrir(img.getAttribute('src'), false);
        };
    }

    // Si el contenedor tiene un video (ESTA ES LA PARTE QUE FALTABA)
    if (vid) {
        vid.onclick = (e) => {
            e.preventDefault();
            e.stopPropagation();
            // Usamos currentSrc o getAttribute para sacar la ruta del video
            const fuenteVideo = vid.querySelector('source') ? vid.querySelector('source').src : vid.src;
            abrir(fuenteVideo, true);
        };
    }
});

lightbox.onclick = (e) => {
    // Si la imagen tiene pointer-events: none, el e.target siempre será el lightbox.
    // Para que no se cierre SIEMPRE al tocar la imagen, vamos a cerrar solo
    // si el clic es lejos del centro.
    
    const rect = imgEnGrande.getBoundingClientRect();
    const clicEnImagen = (
        e.clientX >= rect.left &&
        e.clientX <= rect.right &&
        e.clientY >= rect.top &&
        e.clientY <= rect.bottom
    );

    if (!clicEnImagen || e.target === cerrarBtn) {
        cerrarTodo();
    }
};