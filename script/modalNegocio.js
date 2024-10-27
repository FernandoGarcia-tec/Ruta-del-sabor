document.addEventListener("DOMContentLoaded", function() {
    const productEmail = document.getElementById('productEmail').value;

    fetch(`/api/negocios?categoria=${productEmail}`)
        .then(response => response.json())
        .then(data => {
            console.log('API response data:', data); // Log the entire data object

            if (data.length === 0) {
                console.error('No se encontraron negocios');
                return;
            }
            
            const nombre = data[0].nombre;
            data.forEach((negocio, index) => {
                console.log(`Negocio ${index + 1}:`, negocio);
            });
            const negocioId2 = data.find(negocio => negocio.id === 2);
            if (negocioId2) {
                console.log('Nombre del negocio con id 2:', negocioId2.nombre);
            } else {
                console.error('No se encontró un negocio con id 2');
            }
            const nombre2 = data[1].nombre2;
            document.getElementById("titulo").textContent = nombre;
            
            document.getElementById("titulo2").textContent = negocioId2.nombre;
            
            console.log('Nombre del negocio:', nombre);
            console.log('Nombre del negocio:', nombre2);
            const welcomeMessage = document.getElementById("welcome-message");
            const showmen = document.getElementById("showmen");
            const modalAñadir = document.getElementById("openModalBtn");
            if (data.length > 1) {
               
                showmen.style.display = "block";
                modalAñadir.style.display = "none";


            }
            

        })
        .catch(error => console.error('Error:', error));
});
