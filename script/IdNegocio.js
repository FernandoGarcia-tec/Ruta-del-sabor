function redirectToProducts(tituloId) {
    const negocioNombre = document.getElementById(tituloId).textContent;
    console.log(negocioNombre);
    window.location.href = `/salesV?nombreNegocio=${encodeURIComponent(negocioNombre)}`;
}