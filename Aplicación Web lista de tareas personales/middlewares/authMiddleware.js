// middlewares/authMiddleware.js

const jwt = require('jsonwebtoken');

module.exports = (req, res, next) => {
  let token = req.headers['x-access-token'] || req.headers['authorization'];
  if (!token) return res.status(401).send('Acceso denegado. No hay token proporcionado.');

  if (token.startsWith('Bearer ')) {
    token = token.slice(7, token.length);
  }

  jwt.verify(token, 'supersecret', (err, decoded) => {
    if (err) return res.status(401).send('Token inválido.');
    req.userId = decoded.id;
    next();
  });
};

