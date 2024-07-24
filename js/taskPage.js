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
});





