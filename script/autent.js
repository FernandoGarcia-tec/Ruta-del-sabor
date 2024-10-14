document.addEventListener("DOMContentLoaded", function() {
    // Verificar si el usuario está autenticado
    fetch('/is-authenticated')
        .then(response => response.json())
        .then(data => {
            if (data.authenticated) {
                // Ocultar el botón de login si el usuario está autenticado
                const loginLink = document.getElementById("login-link");
                if (loginLink) {
                    loginLink.style.display = "none";
                }

                // Mostrar mensaje de bienvenida con el nombre del usuario
                const welcomeMessage = document.getElementById("welcome-message");
                const showmen = document.getElementById("showmen");
                if (welcomeMessage) {
                    welcomeMessage.style.display = "block";
                    showmen.style.display = "block";
                    document.getElementById("username").textContent = data.username;
                    document.getElementById("usernam").textContent = data.username;

                }
            }
        })
        .catch(error => console.error('Error al verificar autenticación:', error));
});
