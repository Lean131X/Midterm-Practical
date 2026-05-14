const galeria = document.getElementById("galeria");
const navCategorias = document.getElementById("navCategorias");

let categoriaActual = "";


async function cargarCategorias() {
    const cats = await getCategorias();

    for (let i = 0; i < cats.length; i++) {
        const cat = cats[i];
        const btn = document.createElement("button");
        btn.type = "button";
        btn.className = "btn-categoria";
        btn.textContent = cat;
        btn.addEventListener("click", function () {
            seleccionarCategoria(cat, btn);
        });
        navCategorias.appendChild(btn);
    }

    const btnTodas = document.getElementById("btnTodas");
    btnTodas.addEventListener("click", function () {
        seleccionarCategoria("", btnTodas);
    });
}


function seleccionarCategoria(cat, btn) {
    categoriaActual = cat;
    const todos = document.querySelectorAll(".btn-categoria");
    for (let i = 0; i < todos.length; i++) {
        todos[i].classList.remove("activo");
    }
    btn.classList.add("activo");
    cargarVideos();
}


async function cargarVideos() {
    while (galeria.firstChild) {
        galeria.removeChild(galeria.firstChild);
    }

    const videos = await getVideos(categoriaActual);

    if (videos.length === 0) {
        const vacio = document.createElement("p");
        vacio.className = "cargando";
        vacio.textContent = "No hay videos en esta categoría.";
        galeria.appendChild(vacio);
        return;
    }

    for (let i = 0; i < videos.length; i++) {
        const tarjeta = crearTarjeta(videos[i]);
        galeria.appendChild(tarjeta);
    }
}


function crearTarjeta(video) {
    const tarjeta = document.createElement("article");
    tarjeta.className = "tarjeta";

    const wrap = document.createElement("div");
    wrap.className = "tarjeta-video-wrap";

    const vid = document.createElement("video");
    vid.className = "tarjeta-video";
    vid.src = video.miniatura;
    vid.preload = "metadata";
    vid.muted = true;

    const play = document.createElement("div");
    play.className = "play-icon";
    play.textContent = "▶";

    wrap.appendChild(vid);
    wrap.appendChild(play);

    const info = document.createElement("div");
    info.className = "tarjeta-info";

    const titulo = document.createElement("h4");
    titulo.className = "tarjeta-titulo";
    titulo.textContent = video.titulo;

    const badge = document.createElement("span");
    badge.className = "badge-categoria";
    badge.textContent = video.categoria;

    info.appendChild(titulo);
    info.appendChild(badge);

    tarjeta.appendChild(wrap);
    tarjeta.appendChild(info);

    tarjeta.addEventListener("click", function () {
        window.location.href = "reproductor.html?id=" + video.id;
    });

    return tarjeta;
}


cargarCategorias();
cargarVideos();