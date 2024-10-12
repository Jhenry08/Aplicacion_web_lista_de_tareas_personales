

const mysql = require('mysql');

const pool = mysql.createPool({
  connectionLimit: 10,        
  host: 'localhost',
  user: 'tu_usuario',         
  password: 'tu_contrasena', 
  database: 'lista_tareas'
});

module.exports = pool;

