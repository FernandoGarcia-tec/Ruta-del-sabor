const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const mysql = require('mysql');

const app = express();
const PORT = 3000;

// Crear conexión a la base de datos MySQL
const connection = mysql.createConnection({
    host: 'localhost', // Cambia esto si tu base de datos está en otro lugar
    user: 'root', // Cambia esto a tu usuario de MySQL
    password: '', // Cambia esto a tu contraseña de MySQL
    database: 'ruta_sabor' // Cambia esto al nombre de tu base de datos
});

// Conectar a la base de datos
connection.connect((err) => {
    if (err) {
        console.error('Error conectando a la base de datos:', err);
        return;
    }
    console.log('Conectado a la base de datos MySQL como ID ' + connection.threadId);
});

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json()); // Agregar para manejar JSON
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Ruta para servir archivos estáticos
app.use(express.static(path.join(__dirname)));

// Rutas

// Home
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/home.html'));
});

// Página de Login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/login.html'));
});
// Procesar Login
app.post('/login', async (req, res) => {
    const { username, password } = req.body;

    const query = 'SELECT * FROM users WHERE username = ?';
    connection.query(query, [username], (err, results) => {
        if (err) {
            console.error('Error al procesar el login:', err);
            return res.status(500).json({ error: 'Error al procesar el login' });
        }

        if (results.length === 0) {
            return res.status(401).json({ error: 'Usuario no encontrado' });
        }

        const user = results[0];
        if (user.password !== password) {
            return res.status(401).json({ error: 'Contraseña incorrecta' });
        }

        // Si todo es correcto, establece la sesión
        req.session.loggedIn = true;
        req.session.username = username;
        res.json({ success: true }); // Respuesta exitosa
    });
});
// Nueva ruta para verificar si el usuario está autenticado
app.get('/is-authenticated', (req, res) => {
    if (req.session.loggedIn) {
        res.json({ authenticated: true, username: req.session.username });
    } else {
        res.json({ authenticated: false });
    }
});


// Página de Registro
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/register.html'));
});
// Página de sales menu
app.get('/salesMenu', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/salesMenu.html'));
});
// Página de sales menu
app.get('/sales', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/sales.html'));
});

// Página de sales vendedor
app.get('/salesV', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/salesVendedor.html'));
});
// Procesar Registro
app.post('/register', (req, res) => {
    const { username, password, email } = req.body;

    // Verificar si el usuario ya existe
    const checkQuery = 'SELECT * FROM users WHERE username = ?';
    connection.query(checkQuery, [username], (err, results) => {
        if (err) {
            console.error('Error al verificar el usuario:', err);
            return res.status(500).send('Error al verificar el usuario');
        }

        console.log('Resultados de la verificación:', results); // Ver resultados de la verificación

        if (results.length > 0) {
            // Si el usuario ya existe, enviar un mensaje de error
            
            console.log('usuario ya existe');
            return res.send('El nombre de usuario ya existe. <a href="/register">Intenta de nuevo</a>');
        }

        // Si el usuario no existe, proceder a registrarlo
        const query = 'INSERT INTO users (username, password, email) VALUES (?, ?, ?)';
        connection.query(query, [username, password, email], (err, results) => {
            if (err) {
                console.error('Error al registrar el usuario:', err);
                return res.status(500).send('Error al registrar el usuario');
            }
            res.send('Registro exitoso! <a href="/login">Iniciar sesión</a>');
        });
    });
});

// Cerrar sesión
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Servidor escuchando en http://localhost:${PORT}`);
});
