const express = require('express');
const bodyParser = require('body-parser');
const session = require('express-session');
const path = require('path');

const app = express();
const PORT = 3000;

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

// Logout
app.get('/logout', (req, res) => {
    req.session.destroy();
    res.redirect('/');
});

// Iniciar servidor
app.listen(PORT, () => {
    console.log(`Server is running on http://localhost:${PORT}`);
});
