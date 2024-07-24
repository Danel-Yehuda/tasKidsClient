document.addEventListener('DOMContentLoaded', function() {
    const task = JSON.parse(localStorage.getItem('selectedTask'));
    if (task) {
        document.getElementById('task-title').textContent = task.publish_task_name;
        document.getElementById('task-assigned-to').textContent = task.publish_task_assigned_to;
        document.getElementById('task-deadline').textContent = formatDate(new Date(task.publish_task_deadline));
        document.getElementById('task-status').textContent = task.publish_task_status;
        document.getElementById('task-coins').textContent = task.publish_task_coins;
    } else {
        console.error('No task data found in localStorage');
    }

    // Edit Task Functionality
    const editIcon = document.getElementById('edit-icon');
    editIcon.addEventListener('click', function() {
        const editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
        document.getElementById('edit-task-name').value = task.publish_task_name;
        document.getElementById('edit-task-assigned-to').value = task.publish_task_assigned_to;
        document.getElementById('edit-task-deadline').value = new Date(task.publish_task_deadline).toISOString().split('T')[0];
        document.getElementById('edit-task-status').value = task.publish_task_status;
        document.getElementById('edit-task-coins').value = task.publish_task_coins;

        editTaskModal.show();

        document.getElementById('editTaskForm').addEventListener('submit', function(event) {
            event.preventDefault();
            const updatedTask = {
                publish_task_name: document.getElementById('edit-task-name').value,
                publish_task_assigned_to: document.getElementById('edit-task-assigned-to').value,
                publish_task_deadline: document.getElementById('edit-task-deadline').value,
                publish_task_status: document.getElementById('edit-task-status').value,
                publish_task_coins: document.getElementById('edit-task-coins').value,
            };

            fetch(`http://localhost:8080/api/publish-tasks/${task.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(updatedTask),
            })
            .then(response => response.json())
            .then(data => {
                console.log('Task updated:', data);
                localStorage.setItem('selectedTask', JSON.stringify(updatedTask));
                // Optionally, update the UI with the new task data
                location.reload(); // Reload the page to see the updated task details
            })
            .catch(error => {
                console.error('Error updating task:', error);
            });
        });
    });

    function formatDate(date) {
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }
});
