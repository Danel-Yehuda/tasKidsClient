let editTaskModal;
let currentTaskId = ''; // Add this variable to store the current task ID

document.addEventListener('DOMContentLoaded', function() {
    const task = JSON.parse(sessionStorage.getItem('selectedTask'));
    if (task) {
        document.getElementById('task-title').textContent = task.publish_task_name;
        document.getElementById('task-assigned-to').textContent = task.publish_task_assigned_to;
        document.getElementById('task-deadline').textContent = formatDate(new Date(task.publish_task_deadline));
        document.getElementById('task-coins').textContent = task.publish_task_coins;

        const taskStatusElement = document.getElementById('task-status');
        if (task.publish_task_status === '1') {
            taskStatusElement.textContent = 'Not started yet';
            taskStatusElement.style.color = 'red';
        } else if (task.publish_task_status === '2') {
            taskStatusElement.textContent = 'In Progress';
            taskStatusElement.style.color = '#F4CE14';
        } else if (task.publish_task_status === '3') {
            taskStatusElement.textContent = 'Completed';
            taskStatusElement.style.color = 'green';
        }

        document.getElementById('edit-task').addEventListener('click', function() {
            console.log('Edit button clicked');
            openEditModal(task);
        });

        document.getElementById('delete-task').addEventListener('click', function() {
            console.log('Delete button clicked');
            if (confirm('Are you sure you want to delete this task?')) {
                deleteTask(task.publish_task_id);
            }
        });
    } else {
        console.error('No task data found in sessionStorage');
    }

    editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));

    document.getElementById('editTaskForm').addEventListener('submit', function(event) {
        event.preventDefault();
        editTask();
    });
});

function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

function openEditModal(task) {
    currentTaskId = task.publish_task_id;
    document.getElementById('editTaskName').value = task.publish_task_name;
    document.getElementById('editTaskAssignedTo').value = task.publish_task_assigned_to;
    document.getElementById('editTaskDeadline').value = new Date(task.publish_task_deadline).toISOString().split('T')[0];
    document.getElementById('editTaskCoins').value = task.publish_task_coins;
    document.getElementById('editTaskStatus').value = task.publish_task_status;
    editTaskModal.show();
}

function editTask() {
    const taskName = document.getElementById('editTaskName').value;
    const assignedTo = document.getElementById('editTaskAssignedTo').value;
    const deadline = document.getElementById('editTaskDeadline').value;
    const coins = document.getElementById('editTaskCoins').value;
    const status = document.getElementById('editTaskStatus').value;

    fetch(`http://localhost:8080/api/publish-tasks/${currentTaskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            publish_task_name: taskName,
            publish_task_assigned_to: assignedTo,
            publish_task_deadline: deadline,
            publish_task_coins: coins,
            publish_task_status: status
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task updated:', data);
        updateTaskInDOM(data.data);
    })
    .catch(error => console.error('Error updating task:', error));

    editTaskModal.hide();
}

function deleteTask(taskId) {
    fetch(`http://localhost:8080/api/publish-tasks/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Task deleted successfully');
            removeTaskFromDOM();
            window.location.href = 'home.html';
        } else {
            console.error('Error deleting task');
        }
    })
    .catch(error => console.error('Error deleting task:', error));
}

function removeTaskFromDOM() {
    document.getElementById('task-title').textContent = '';
    document.getElementById('task-assigned-to').textContent = '';
    document.getElementById('task-deadline').textContent = '';
    document.getElementById('task-status').textContent = '';
    document.getElementById('task-coins').textContent = '';
}

function updateTaskInDOM(task) {
    document.getElementById('task-title').textContent = task.publish_task_name;
    document.getElementById('task-assigned-to').textContent = task.publish_task_assigned_to;
    document.getElementById('task-deadline').textContent = formatDate(new Date(task.publish_task_deadline));
    document.getElementById('task-coins').textContent = task.publish_task_coins;

    const taskStatusElement = document.getElementById('task-status');
    if (task.publish_task_status === '1') {
        taskStatusElement.textContent = 'Not started yet';
        taskStatusElement.style.color = 'red';
    } else if (task.publish_task_status === '2') {
        taskStatusElement.textContent = 'In Progress';
        taskStatusElement.style.color = '#F4CE14';
    } else if (task.publish_task_status === '3') {
        taskStatusElement.textContent = 'Completed';
        taskStatusElement.style.color = 'green';
    }
}
