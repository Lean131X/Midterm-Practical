const API_URL = "http://127.0.0.1:8000";

async function getVideos(categoria) {
    let url = API_URL + "/videos/";
    if (categoria) {
        url = url + "?categoria=" + encodeURIComponent(categoria);
    }
    const res = await fetch(url);
    return await res.json();
}

async function getCategorias() {
    const res = await fetch(API_URL + "/videos/categorias");
    return await res.json();
}

async function getVideoById(id) {
    const res = await fetch(API_URL + "/videos/" + id);
    if (!res.ok) {
        return null;
    }
    return await res.json();
}

async function getRecomendaciones(id) {
    const res = await fetch(API_URL + "/videos/" + id + "/recomendaciones");
    return await res.json();
}

async function getComments(videoId) {
    const res = await fetch(API_URL + "/videos/" + videoId + "/comments/");
    return await res.json();
}

async function postComment(videoId, autor, contenido) {
    const res = await fetch(API_URL + "/videos/" + videoId + "/comments/", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ autor: autor, contenido: contenido })
    });
    return await res.json();
}