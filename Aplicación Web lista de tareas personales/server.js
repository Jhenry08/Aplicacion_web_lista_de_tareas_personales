// server.js

const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');

const authRoutes = require('./routes/auth');
const tasksRoutes = require('./routes/tasks');

const app = express();

app.use(cors());
app.use(bodyParser.json());

// Rutas
app.use('/auth', authRoutes);
app.use('/tasks', tasksRoutes);

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`Servidor corriendo en el puerto ${PORT}`);
});

app.use(express.static('public'));

// Manejar rutas desconocidas
app.use((req, res) => {
  res.status(404).send('Página no encontrada');
});
