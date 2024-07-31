document.addEventListener('DOMContentLoaded', function() {
    const task = JSON.parse(sessionStorage.getItem('selectedTask'));
    const user = JSON.parse(sessionStorage.getItem('user'));
    const kid = JSON.parse(sessionStorage.getItem('kid'));

    document.querySelector('.btn-outline-danger').addEventListener('click', function() {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('kid');
        window.location.href = 'index.html';
    });

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
            openEditModal(task);
        });

        document.getElementById('delete-task').addEventListener('click', function() {
            currentTaskId = task.publish_task_id; // Store the current task ID for deletion
            deleteTaskModal.show();
        });

        document.getElementById('confirmDelete').addEventListener('click', function() {
            deleteTask(currentTaskId);
        });

        fetchTaskHistory(task.publish_task_name); // Fetch task history

    } else {
        console.error('No task data found in sessionStorage');
    }

    editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));
    deleteTaskModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    document.getElementById('editTaskForm').addEventListener('submit', function(event) {
        event.preventDefault();
        editTask();
    });

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

    fetch(`https://taskidserver.onrender.com/api/publish-tasks/${currentTaskId}`, {
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
        updateTaskInDOM(data.data);
    })
    .catch(error => console.error('Error updating task:', error));

    editTaskModal.hide();
}

function deleteTask(taskId) {
    fetch(`https://taskidserver.onrender.com/api/publish-tasks/${taskId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            window.location.href = 'home.html'; // Navigate to home page after deletion
        } else {
            console.error('Error deleting task');
        }
    })
    .catch(error => console.error('Error deleting task:', error));
}

function updateTaskStatus(status) {
    const kid = JSON.parse(sessionStorage.getItem('kid'));

    fetch(`https://taskidserver.onrender.com/api/publish-tasks/status/${currentTaskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            publish_task_status: status,
            kidId: kid.data.kid_id,
            kidName: kid.data.kid_name
        })
    })
    .then(response => response.json())
    .then(data => {
        updateTaskInDOM(data.data);
    })
    .catch(error => console.error('Error updating task status:', error));
}

function approveTask(taskId) {
    fetch(`https://taskidserver.onrender.com/api/publish-tasks/approve/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        }
    })
    .then(response => response.json())
    .then(data => {
        updateTaskInDOM(data.data);

        // Show notification
        const notification = document.getElementById('notification');
        notification.style.display = 'block';

        // Hide notification after 3 seconds and redirect to home page
        setTimeout(() => {
            notification.style.display = 'none';
            window.location.href = 'home.html';
        }, 3000);
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

function fetchTaskHistory(taskName) {
    fetch(`https://taskidserver.onrender.com/api/history/task/${taskName}`)
        .then(response => response.json())
        .then(historyData => {
            const historyList = document.getElementById('task-history');
            historyList.innerHTML = ''; // Clear existing history items

            if (historyData.data.length > 0) {
                historyData.data.forEach(history => {
                    const listItem = document.createElement('li');
                    listItem.classList.add('list-group-item');

                    const actionClass = history.action.toLowerCase() === 'approved' ? 'text-success' : 'text-danger';

                    listItem.innerHTML = `<strong>${formatDate(new Date(history.date))}</strong> ${history.kid} - <span class="${actionClass}">${history.action}</span>`;
                    historyList.appendChild(listItem);
                });
            } else {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                listItem.innerHTML = `No history available for this task.`;
                historyList.appendChild(listItem);
            }
        })
        .catch(error => console.error('Error fetching history:', error));
}
