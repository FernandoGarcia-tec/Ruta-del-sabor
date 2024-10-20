document.addEventListener("DOMContentLoaded", function() {
    // Llamar a la API para obtener productos
    fetch('/api/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }
            return response.json();
        })
        .then(data => {
            // Organizar los productos por categoría
            const productsByCategory = {
                'Comida': [],
                'Turismo': [],
                'DIVERSION': [],
                'HOTELES': [],
                'TRANSPORTE': []
            };

            data.forEach(product => {
                if (productsByCategory[product.categoria]) {
                    productsByCategory[product.categoria].push(product);
                }
            });

            // Cargar productos en sus respectivos carruseles
            loadProductsInCarousel('productCarousel', productsByCategory['Comida']);
            loadProductsInCarousel('turismoCarousel', productsByCategory['Turismo']);
            loadProductsInCarousel('diversionCarousel', productsByCategory['DIVERSION']);
            loadProductsInCarousel('hotelesCarousel', productsByCategory['HOTELES']);
            loadProductsInCarousel('transporteCarousel', productsByCategory['TRANSPORTE']);
        })
        .catch(error => console.error('Error al cargar productos:', error));
});

// Función para cargar productos en un carrusel específico
function loadProductsInCarousel(carouselId, products) {
    const productCarousel = document.getElementById(carouselId);
    productCarousel.innerHTML = ''; // Limpiar contenido previo

    products.forEach((product, index) => {
        const activeClass = index === 0 ? 'active' : ''; // Hacer el primer elemento activo
        const carouselItem = `
            <div class="carousel-item ${activeClass}">
                <img src="${product.imagen}" class="d-block w-10" alt="${product.nombre}">
                <div class="carousel-caption d-none d-md-block">
                    <h5>${product.nombre}</h5>
                    <p>Stock: ${product.stock}</p>
                    <p>${product.descripcion}</p>
                </div>
            </div>
        `;
        productCarousel.innerHTML += carouselItem; // Añadir el nuevo elemento
    });
}
