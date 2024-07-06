const express = require('express');
const mysql = require('mysql2');
const bodyParser = require('body-parser');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(bodyParser.json());

// Conectar a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'root',
    password: 'yourpassword',
    database: 'login_register_app'
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a la base de datos: ' + err.stack);
        return;
    }
    console.log('Conectado a la base de datos MySQL');
});

// Crear la tabla de usuarios si no existe
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

// Ruta para registrar usuario
app.post('/register', async (req, res) => {
    const { fullName, email, username, password } = req.body;
    const hashedPassword = await bcrypt.hash(password, 10);

    const query = 'INSERT INTO users (fullName, email, username, password) VALUES (?, ?, ?, ?)';
    db.query(query, [fullName, email, username, hashedPassword], (err, result) => {
        if (err) {
            res.status(400).send('Error al registrar usuario');
        } else {
            res.status(201).send('Usuario registrado');
        }
    });
});

// Ruta para iniciar sesión
app.post('/login', (req, res) => {
    const { email, password } = req.body;

    const query = 'SELECT * FROM users WHERE email = ?';
    db.query(query, [email], async (err, results) => {
        if (err) {
            res.status(500).send('Error del servidor');
        } else if (results.length === 0) {
            res.status(400).send('Usuario no encontrado');
        } else {
            const user = results[0];
            const isMatch = await bcrypt.compare(password, user.password);
            if (!isMatch) {
                res.status(400).send('Contraseña incorrecta');
            } else {
                const token = jwt.sign({ id: user.id }, 'secretkey', { expiresIn: '1h' });
                res.json({ token });
            }
        }
    });
});

// Ruta para obtener datos del usuario
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

// Middleware para verificar el token
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
