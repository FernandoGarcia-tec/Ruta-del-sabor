document.addEventListener("DOMContentLoaded", function () {
    let productosComida = [];
    let negocios = [];

    // Llamar a la API para obtener productos y negocios
    fetch('/api/products')
        .then(response => {
            if (!response.ok) {
                throw new Error('Error al cargar productos');
            }
            return response.json();
        })
        .then(data => {
            // Filtrar solo los productos de la categoría 'Comida' y 'Negocios'
            productosComida = data.filter(product => product.categoria === 'Comida');
            negocios = data.filter(product => product.categoria === 'Negocios');

            // Mostrar lista de comida por defecto
            mostrarLista('listaNegocios', productosComida, true);
        })
        .catch(error => console.error('Error al cargar productos:', error));

    // Función para mostrar lista de productos o negocios
    function mostrarLista(listaId, datos, esProducto) {
        const listaNegocios = document.getElementById(listaId);
        listaNegocios.innerHTML = ''; // Limpiar contenido previo

        datos.forEach(item => {
            const listItem = document.createElement('li');
            listItem.textContent = item.nombre;
            listItem.addEventListener('click', () => mostrarDetalle(item, esProducto));
            listaNegocios.appendChild(listItem);
        });
    }

    // Función para mostrar detalle del negocio o producto
    function mostrarDetalle(item, esProducto) {
        document.getElementById('negocioCategoria').textContent = esProducto ? 'Comida' : 'Negocios';
        document.getElementById('negocioNombre').textContent = item.nombre;
        document.getElementById('negocioImagen').src = item.imagen || 'placeholder.png'; // Usa una imagen por defecto si no hay
        document.getElementById('negocioDescripcion').textContent = item.descripcion;
        document.getElementById('negocioUbicacion').textContent = item.ubicacion || 'N/A';
        document.getElementById('negocioStock').textContent = esProducto ? item.stock : 'N/A';
    }

    // Eventos para controlar las pestañas
    document.getElementById('tabComida').addEventListener('click', function () {
        cambiarTab('tabComida', 'Comida');
        mostrarLista('listaNegocios', productosComida, true); // Mostrar productos de comida
    });

    document.getElementById('tabNegocios').addEventListener('click', function () {
        cambiarTab('tabNegocios', 'Negocios');
        mostrarLista('listaNegocios', negocios, false); // Mostrar negocios
    });

    // Función para cambiar de pestaña
    function cambiarTab(tabId, categoria) {
        const tabs = document.querySelectorAll('.tab-item');
        tabs.forEach(tab => tab.classList.remove('active'));

        document.getElementById(tabId).classList.add('active');
        document.getElementById('negocioCategoria').textContent = categoria;
    }
});
