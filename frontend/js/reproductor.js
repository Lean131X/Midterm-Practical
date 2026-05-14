const params = new URLSearchParams(window.location.search);
const videoId = params.get("id");

const player = document.getElementById("player");
const tituloVideo = document.getElementById("tituloVideo");
const descripcionVideo = document.getElementById("descripcionVideo");
const categoriaVideo = document.getElementById("categoriaVideo");
const listaComentarios = document.getElementById("listaComentarios");
const listaRecomendaciones = document.getElementById("listaRecomendaciones");
const btnComentar = document.getElementById("btnComentar");
const inputAutor = document.getElementById("inputAutor");
const inputContenido = document.getElementById("inputContenido");


async function cargarVideo() {
    if (!videoId) {
        tituloVideo.textContent = "Video no especificado";
        return;
    }

    const video = await getVideoById(videoId);
    if (!video) {
        tituloVideo.textContent = "Video no encontrado";
        return;
    }

    player.src = video.source;
    tituloVideo.textContent = video.titulo;
    descripcionVideo.textContent = video.descripcion;
    categoriaVideo.textContent = video.categoria;
}


async function cargarRecomendaciones() {
    const recs = await getRecomendaciones(videoId);

    while (listaRecomendaciones.firstChild) {
        listaRecomendaciones.removeChild(listaRecomendaciones.firstChild);
    }

    for (let i = 0; i < recs.length; i++) {
        const item = crearItemRecomendacion(recs[i]);
        listaRecomendaciones.appendChild(item);
    }
}


function crearItemRecomendacion(rec) {
    const li = document.createElement("li");
    li.className = "rec-item";

    const thumb = document.createElement("video");
    thumb.className = "rec-thumb";
    thumb.src = rec.miniatura;
    thumb.preload = "none";
    thumb.muted = true;

    const info = document.createElement("div");
    info.className = "rec-info";

    const titulo = document.createElement("p");
    titulo.className = "rec-titulo";
    titulo.textContent = rec.titulo;

    const cat = document.createElement("span");
    cat.className = "rec-categoria";
    cat.textContent = rec.categoria;

    info.appendChild(titulo);
    info.appendChild(cat);

    li.appendChild(thumb);
    li.appendChild(info);

    li.addEventListener("mouseenter", function () {
        if (thumb.preload === "none") {
            thumb.preload = "metadata";
            thumb.load();
        }
    });

    li.addEventListener("click", function () {
        window.location.href = "reproductor.html?id=" + rec.id;
    });

    return li;
}


async function cargarComentarios() {
    const comentarios = await getComments(videoId);

    while (listaComentarios.firstChild) {
        listaComentarios.removeChild(listaComentarios.firstChild);
    }

    if (comentarios.length === 0) {
        const vacio = document.createElement("li");
        vacio.className = "cargando";
        vacio.textContent = "No hay comentarios todavía.";
        listaComentarios.appendChild(vacio);
        return;
    }

    comentarios.reverse();
    for (let i = 0; i < comentarios.length; i++) {
        const item = crearItemComentario(comentarios[i]);
        listaComentarios.appendChild(item);
    }
}


function crearItemComentario(c) {
    const li = document.createElement("li");
    li.className = "comentario";

    const header = document.createElement("div");
    header.className = "comentario-header";

    const autor = document.createElement("span");
    autor.className = "comentario-autor";
    autor.textContent = c.autor;

    const fecha = document.createElement("span");
    fecha.className = "comentario-fecha";
    fecha.textContent = formatearFecha(c.fecha);

    header.appendChild(autor);
    header.appendChild(fecha);

    const contenido = document.createElement("p");
    contenido.className = "comentario-contenido";
    contenido.textContent = c.contenido;

    li.appendChild(header);
    li.appendChild(contenido);

    return li;
}


function formatearFecha(fechaStr) {
    const d = new Date(fechaStr);
    const dia = d.getDate();
    const mes = d.getMonth() + 1;
    const hora = d.getHours();
    let min = d.getMinutes();
    if (min < 10) {
        min = "0" + min;
    }
    return dia + "/" + mes + " " + hora + ":" + min;
}


btnComentar.addEventListener("click", async function () {
    const autor = inputAutor.value.trim();
    const contenido = inputContenido.value.trim();

    if (!autor || !contenido) {
        alert("Completa todos los campos");
        return;
    }

    await postComment(videoId, autor, contenido);
    inputContenido.value = "";
    cargarComentarios();
});


cargarVideo();
cargarRecomendaciones();
cargarComentarios();