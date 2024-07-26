function formatDate(date) {
    const options = { year: 'numeric', month: 'long', day: 'numeric' };
    return date.toLocaleDateString(undefined, options);
}

document.addEventListener('DOMContentLoaded', function() {
    const task = JSON.parse(sessionStorage.getItem('selectedTask'));
    console.log(task);
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
            taskStatusElement.style.color = 'yellow';
        } else if (task.publish_task_status === '3') {
            taskStatusElement.textContent = 'Completed';
            taskStatusElement.style.color = 'green';
        }
    } else {
        console.error('No task data found in sessionStorage');
    }
});
