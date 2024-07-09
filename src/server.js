const express = require('express');
const path = require('path');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const cors = require('cors')

const app = express();
const PORT = process.env.PORT || 3000;

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(express.static('components'));
app.use(express.static(__dirname));

const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: '',
    database: 'Prueba'
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

db.query(`
    CREATE TABLE IF NOT EXISTS users (
        id INT AUTO_INCREMENT PRIMARY KEY,
        fullName VARCHAR(255),
        email VARCHAR(255) UNIQUE,
        username VARCHAR(255) UNIQUE,
        password VARCHAR(255)
    )
`, (err, result) => {
    if (err) throw err;
    console.log('Tabla de usuarios lista');
});

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/components/public/index.html')
})

app.get('/form', (req, res) => {
    res.sendFile(__dirname + '/components/public/login.html')
})

app.get('../static/styles.css', (req, res) => {
    res.sendFile(__dirname + '/components/static/styles.css');
});
app.post('/register', async (req, res) => {
    const { fullName, email, username, password } = req.body;
    if (!fullName || !email || !username || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const query = 'INSERT INTO users (fullName, email, username, password) VALUES (?, ?, ?, ?)';
    db.query(query, [fullName, email, username, hashedPassword], (err, result) => {
        if (err) {
            console.error('Error al registrar usuario:', err);
            return res.status(400).json({ message: 'Error al registrar usuario' });
        }
        res.status(201).json({ message: 'Usuario registrado' });
    });
});

app.post('/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
        return res.status(400).json({ message: 'Todos los campos son obligatorios' });
    }
    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            console.error('Error del servidor:', err);
            return res.status(500).json({ message: 'Error del servidor' });
        }
        if (results.length === 0) {
            return res.status(400).json({ message: 'Usuario no encontrado' });
        }
        const user = results[0];
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: 'Contraseña incorrecta' });
        }
        const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });
        res.json({ token });
    });
});


app.get('/user', verifyToken, (req, res) => {
    const query = 'SELECT fullName, email, username FROM users WHERE id = ?';
    db.query(query, [req.userId], (err, results) => {
        if (err) {
            res.status(500).send('Error del servidor');
        } else {
            res.json(results[0]);
        }
    });
});

// token
function verifyToken(req, res, next) {
    const token = req.headers['authorization'];
    if (!token) return res.status(401).send('Acceso denegado');

    try {
        const decoded = jwt.verify(token, 'secretkey');
        req.userId = decoded.id;
        next();
    } catch (err) {
        res.status(400).send('Token inválido');
    }
}

app.listen(PORT, () => {
    console.log(`Servidor corriendo en el puerto ${PORT}`);
});
