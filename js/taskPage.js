let editTaskModal;
let deleteTaskModal;
let currentTaskId = ''; // Add this variable to store the current task ID

document.addEventListener('DOMContentLoaded', function() {
    const task = JSON.parse(sessionStorage.getItem('selectedTask'));
    if (task) {
        currentTaskId = task.publish_task_id;
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
            currentTaskId = task.publish_task_id; // Store the current task ID for deletion
            deleteTaskModal.show();
        });

        document.getElementById('confirmDelete').addEventListener('click', function() {
            deleteTask(currentTaskId);
        });
    } else {
        console.error('No task data found in sessionStorage');
    }

    editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
    deleteTaskModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    document.getElementById('editTaskForm').addEventListener('submit', function(event) {
        event.preventDefault();
        editTask();
    });

    const user = JSON.parse(sessionStorage.getItem('user'));
    const kid = JSON.parse(sessionStorage.getItem('kid'));
    console.log('User:', user);
    console.log('Kid:', kid);
    const profilePicElement = document.getElementById('profilePic');

    if (user) {
        profilePicElement.src = "images/Picture1.png";
        document.getElementById('parent-actions').style.display = 'block';
        document.getElementById('kid-actions').style.display = 'none';
    }
    if (kid) {
        profilePicElement.src = "images/kid1.jpg";
        document.getElementById('kidsNav').style.display = 'none';
        document.getElementById('tasksNav').style.display = 'none';
        document.getElementById('edit-task').style.display = 'none';
        document.getElementById('delete-task').style.display = 'none';
        document.getElementById('parent-actions').style.display = 'none';
        document.getElementById('kid-actions').style.display = 'block';

        const startTaskButton = document.getElementById('start-task-btn');
        
        if(task.publish_task_status === '2'){
            console.log('Task in progress');
            startTaskButton.textContent = 'I\'m Done!'
        }
        if(task.publish_task_status === '3'){
            startTaskButton.style.display = 'none';
            const kidAction = document.getElementById('kid-actions');
            kidAction.appendChild(document.createElement('p')).textContent = 'Good Job! Waiting for parent to approve';
        }
        startTaskButton.addEventListener('click', function() {
            if (startTaskButton.textContent === 'Start') {
                updateTaskStatus(2);
                startTaskButton.textContent = 'I\'m Done!';
            } else if (startTaskButton.textContent === 'I\'m Done!') {
                updateTaskStatus(3);
            }
        });
    }

    document.getElementById('approve-btn').addEventListener('click', function() {
        if (task.publish_task_status !== "3") {
            alert('Task must be completed before it can be approved.');
        } else {
            approveTask(currentTaskId);
        }
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
            window.location.href = 'home.html'; // Navigate to home page after deletion
        } else {
            console.error('Error deleting task');
        }
    })
    .catch(error => console.error('Error deleting task:', error));
}

function updateTaskStatus(status) {
    console.log(currentTaskId, status);
    fetch(`http://localhost:8080/api/publish-tasks/status/${currentTaskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            publish_task_status: status
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task status updated:', data);
        updateTaskInDOM(data.data);
    })
    .catch(error => console.error('Error updating task status:', error));
}

function approveTask(taskId) {
    fetch(`http://localhost:8080/api/publish-tasks/approve/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task approved:', data);
        updateTaskInDOM(data.data);
    })
    .catch(error => console.error('Error approving task:', error));
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
