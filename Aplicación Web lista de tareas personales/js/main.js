// public/js/main.js

$(document).ready(function() {
    const token = localStorage.getItem('token');
    if (!token) {
      window.location.href = 'login.html';
    }
  
    // Función para cargar las tareas
    function loadTasks() {
      $.ajax({
        url: '/tasks',
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token },
        success: function(tasks) {
          $('#tasksContainer').empty();
          tasks.forEach(task => {
            const taskCard = `
              <div class="col-md-4">
                <div class="card mb-4 ${task.estado === 'completada' ? 'bg-light' : ''}">
                  <div class="card-body">
                    <h5 class="card-title">${task.titulo}</h5>
                    <p class="card-text">${task.descripcion}</p>
                    <p><strong>Prioridad:</strong> ${task.prioridad}</p>
                    <p><strong>Estado:</strong> ${task.estado}</p>
                    ${task.estado === 'pendiente' ? `<button class="btn btn-success btn-complete" data-id="${task.id}">Completar</button>` : ''}
                    <button class="btn btn-primary btn-edit" data-id="${task.id}">Editar</button>
                    <button class="btn btn-danger btn-delete" data-id="${task.id}">Eliminar</button>
                  </div>
                </div>
              </div>
            `;
            $('#tasksContainer').append(taskCard);
          });
        },
        error: function() {
          alert('Error al cargar las tareas');
        }
      });
    }
  
    loadTasks();
  
    // Cerrar sesión
    $('#logout').click(function() {
      localStorage.removeItem('token');
      window.location.href = 'login.html';
    });
  
    // Mostrar modal para agregar tarea
    $('#addTaskBtn').click(function() {
      $('#taskModalLabel').text('Agregar Nueva Tarea');
      $('#taskForm')[0].reset();
      $('#taskId').val('');
      $('#taskModal').modal('show');
    });
  
    // Guardar tarea (agregar o editar)
    $('#taskForm').submit(function(e) {
      e.preventDefault();
      const taskId = $('#taskId').val();
      const method = taskId ? 'PUT' : 'POST';
      const url = taskId ? `/tasks/${taskId}` : '/tasks';
  
      const taskData = {
        titulo: $('#titulo').val(),
        descripcion: $('#descripcion').val(),
        fecha_limite: $('#fecha_limite').val(),
        prioridad: $('#prioridad').val(),
        estado: $('#estado').val()
      };
  
      $.ajax({
        url: url,
        method: method,
        headers: { 'Authorization': 'Bearer ' + token },
        contentType: 'application/json',
        data: JSON.stringify(taskData),
        success: function() {
          $('#taskModal').modal('hide');
          loadTasks();
        },
        error: function() {
          alert('Error al guardar la tarea');
        }
      });
    });
  
    // Editar tarea
    $('#tasksContainer').on('click', '.btn-edit', function() {
      const taskId = $(this).data('id');
  
      $.ajax({
        url: `/tasks`,
        method: 'GET',
        headers: { 'Authorization': 'Bearer ' + token },
        success: function(tasks) {
          const task = tasks.find(t => t.id === taskId);
          if (task) {
            $('#taskModalLabel').text('Editar Tarea');
            $('#titulo').val(task.titulo);
            $('#descripcion').val(task.descripcion);
            $('#fecha_limite').val(task.fecha_limite ? task.fecha_limite.substring(0, 10) : '');
            $('#prioridad').val(task.prioridad);
            $('#estado').val(task.estado);
            $('#taskId').val(task.id);
            $('#taskModal').modal('show');
          }
        },
        error: function() {
          alert('Error al obtener la tarea');
        }
      });
    });
  
    // Eliminar tarea
    $('#tasksContainer').on('click', '.btn-delete', function() {
      const taskId = $(this).data('id');
      if (confirm('¿Estás seguro de eliminar esta tarea?')) {
        $.ajax({
          url: `/tasks/${taskId}`,
          method: 'DELETE',
          headers: { 'Authorization': 'Bearer ' + token },
          success: function() {
            loadTasks();
          },
          error: function() {
            alert('Error al eliminar la tarea');
          }
        });
      }
    });
  
    // Completar tarea
    $('#tasksContainer').on('click', '.btn-complete', function() {
      const taskId = $(this).data('id');
      $.ajax({
        url: `/tasks/${taskId}`,
        method: 'PUT',
        headers: { 'Authorization': 'Bearer ' + token },
        contentType: 'application/json',
        data: JSON.stringify({ estado: 'completada' }),
        success: function() {
          loadTasks();
        },
        error: function() {
          alert('Error al completar la tarea');
        }
      });
    });
  
  });
  