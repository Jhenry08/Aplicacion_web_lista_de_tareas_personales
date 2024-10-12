// controllers/tasksController.js

const pool = require('../config/db');

exports.getTasks = (req, res) => {
  const userId = req.userId;
  const query = 'SELECT * FROM tareas WHERE usuario_id = ?';
  pool.query(query, [userId], (err, results) => {
    if (err) return res.status(500).send('Error al obtener las tareas');
    res.status(200).send(results);
  });
};

exports.createTask = (req, res) => {
  const userId = req.userId;
  const { titulo, descripcion, fecha_limite, prioridad } = req.body;

  if (!titulo) return res.status(400).send('El título es obligatorio');

  const query = 'INSERT INTO tareas (titulo, descripcion, fecha_limite, prioridad, usuario_id) VALUES (?, ?, ?, ?, ?)';
  pool.query(query, [titulo, descripcion, fecha_limite, prioridad, userId], (err, results) => {
    if (err) return res.status(500).send('Error al crear la tarea');
    res.status(200).send({ message: 'Tarea creada exitosamente' });
  });
};

exports.updateTask = (req, res) => {
  const userId = req.userId;
  const taskId = req.params.id;
  const { titulo, descripcion, fecha_limite, prioridad, estado } = req.body;

  
  const checkTaskQuery = 'SELECT * FROM tareas WHERE id = ? AND usuario_id = ?';
  pool.query(checkTaskQuery, [taskId, userId], (err, results) => {
    if (err) return res.status(500).send('Error en el servidor');
    if (results.length === 0) return res.status(404).send('Tarea no encontrada');

    const updateQuery = 'UPDATE tareas SET titulo = ?, descripcion = ?, fecha_limite = ?, prioridad = ?, estado = ? WHERE id = ?';
    pool.query(updateQuery, [titulo, descripcion, fecha_limite, prioridad, estado, taskId], (err, results) => {
      if (err) return res.status(500).send('Error al actualizar la tarea');
      res.status(200).send({ message: 'Tarea actualizada exitosamente' });
    });
  });
};

exports.deleteTask = (req, res) => {
  const userId = req.userId;
  const taskId = req.params.id;

  
  const checkTaskQuery = 'SELECT * FROM tareas WHERE id = ? AND usuario_id = ?';
  pool.query(checkTaskQuery, [taskId, userId], (err, results) => {
    if (err) return res.status(500).send('Error en el servidor');
    if (results.length === 0) return res.status(404).send('Tarea no encontrada');

    const deleteQuery = 'DELETE FROM tareas WHERE id = ?';
    pool.query(deleteQuery, [taskId], (err, results) => {
      if (err) return res.status(500).send('Error al eliminar la tarea');
      res.status(200).send({ message: 'Tarea eliminada exitosamente' });
    });
  });
};
