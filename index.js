const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');
const admin = require('firebase-admin'); // Importa Firebase Admin

const app = express();
const PORT = 3000;

// Inicializa Firebase Admin
admin.initializeApp({
    credential: admin.credential.applicationDefault(), // Asegúrate de tener configuradas las credenciales
    databaseURL: 'https://rutasabor-25dd3.firebaseio.com' // Cambia esto por tu URL de base de datos
});

const db = admin.firestore(); // Inicializa Firestore

// Middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(session({
    secret: 'your_secret_key',
    resave: false,
    saveUninitialized: true
}));

// Ruta para servir archivos estáticos como HTML
app.use(express.static(path.join(__dirname)));

// Dummy user data
const users = {
    user1: 'password1',
    user2: 'password2'
};

// Rutas

// Home
app.get('/', (req, res) => {
    if (req.session.loggedIn) {
        res.send(`Welcome ${req.session.username}! <a href="/logout">Logout</a>`);
    } else {
        res.sendFile(path.join(__dirname, 'templates/home.html'));
    }
});

// Login
app.get('/login', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/login.html'));
});

app.post('/login', (req, res) => {
    const { username, password } = req.body;
    if (users[username] && users[username] === password) {
        req.session.loggedIn = true;
        req.session.username = username;
        res.redirect('/');
    } else {
        res.send('Invalid username or password. <a href="/login">Try again</a>');
    }
});

// Register
app.get('/register', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/register.html'));
});

app.post('/register', (req, res) => {
    const { username, password } = req.body;
    if (users[username]) {
        res.send('Username already exists. <a href="/register">Try again</a>');
    } else {
        users[username] = password;
        res.send('Registration successful! <a href="/login">Login now</a>');
    }
});

// Sales
app.get('/sales', (req, res) => {
    res.sendFile(path.join(__dirname, 'templates/sales.html'));
});

// Agregar un producto
app.post('/add-product', async (req, res) => {
    const { name, price } = req.body; // Asegúrate de tener estos campos en tu formulario
    const productRef = db.collection('products').doc(); // Crea una referencia a un nuevo documento
    await productRef.set({
        name: name,
        price: price,
        createdAt: admin.firestore.FieldValue.serverTimestamp() // Añade una marca de tiempo
    });
    res.send('Product added successfully! <a href="/sales">Go back to sales</a>');
});

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
