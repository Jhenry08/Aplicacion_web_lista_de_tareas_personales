// controllers/authController.js

const pool = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

exports.register = (req, res) => {
  const { nombre, email, contrasena } = req.body;

  
  const checkEmailQuery = 'SELECT email FROM usuarios WHERE email = ?';
  pool.query(checkEmailQuery, [email], (err, results) => {
    if (err) return res.status(500).send('Error en el servidor');
    if (results.length > 0) {
      return res.status(400).send('El correo electrónico ya está registrado');
    }

    
    const hashedPassword = bcrypt.hashSync(contrasena, 8);
    const query = 'INSERT INTO usuarios (nombre, email, contrasena) VALUES (?, ?, ?)';
    pool.query(query, [nombre, email, hashedPassword], (err, results) => {
      if (err) return res.status(500).send('Error al registrar el usuario');
      res.status(200).send({ message: 'Usuario registrado exitosamente' });
    });
  });
};

exports.login = (req, res) => {
  const { email, contrasena } = req.body;

  const query = 'SELECT * FROM usuarios WHERE email = ?';
  pool.query(query, [email], (err, results) => {
    if (err) return res.status(500).send('Error en el servidor');
    if (results.length === 0) return res.status(404).send('Usuario no encontrado');

    const user = results[0];
    const passwordIsValid = bcrypt.compareSync(contrasena, user.contrasena);

    if (!passwordIsValid) return res.status(401).send('Contraseña incorrecta');

    const token = jwt.sign({ id: user.id }, 'supersecret', { expiresIn: 86400 }); // Expira en 24 horas

    res.status(200).send({ auth: true, token: token });
  });
};

