let taskModal;
let publishTaskModal;
let deleteModal;
let currentTaskName = ''; // Add this variable to store the current task name
let editTaskModal;
let taskId = '';

window.onload = () => {
    fetch("http://localhost:8080/api/tasks")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            createListTasks(data.data);
            DeleteTask();
            addPublishEventListeners();  // Register event listeners after tasks are created
        });

    fetch("data/RecommendPublish.json")
        .then(response => response.json())
        .then(data => {
            createPublish(data);
        });

    fetch("data/RecommendAddTasks.json")
        .then(response => response.json())
        .then(data => {
            AddTRecommenedTasks(data);
        });

    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user ? user.data.user_id : null;

    fetch(`http://localhost:8080/api/kids/byParent/${userId}`)
        .then(response => response.json())
        .then(data => {
            PublishTask(data);
        });

    taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
    publishTaskModal = new bootstrap.Modal(document.getElementById('publishTaskModal'));
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    document.getElementById('AddTask').addEventListener('click', function () {
        taskModal.show();
    });

    document.getElementById('taskForm').addEventListener('submit', function(event) {
        event.preventDefault();
        AddNewTask();
    });

    document.querySelectorAll('.btn-close').forEach(function (element) {
        element.addEventListener('click', function () {
            taskModal.hide();
            publishTaskModal.hide();
            deleteModal.hide();
        });
    });

    document.getElementById('publishTaskForm').addEventListener('submit', function(event) {
        submitHandler(event, currentTaskName);
    });

    editTaskModal = new bootstrap.Modal(document.getElementById('editTaskModal'));

    document.getElementById('editTaskForm').addEventListener('submit', function(event) {
        event.preventDefault();
        EditTask();
    });
};

function addPublishEventListeners() {
    document.querySelectorAll('.publish-task-btn').forEach(publishButton => {
        publishButton.addEventListener('click', function (event) {
            const taskName = this.closest('li').textContent.trim();
            openPublishModal(event, taskName);
        });
    });
}

function createListTasks(data) {
    const main = document.querySelector("main");

    const ul = document.createElement("ul");
    ul.className = "list-group mt-3";
    main.appendChild(ul);

    data.forEach(task => {
        const li = document.createElement("li");
        li.className = "list-group-item d-flex justify-content-between align-items-center";
        li.textContent = task.task_name;
        li.dataset.taskId = task.task_id;

        const div = document.createElement("div");

        const editIcon = document.createElement("i");
        editIcon.className = "bi bi-pencil";
        editIcon.addEventListener('click', function () {
            openEditModal(task);
        });
        div.appendChild(editIcon);

        const deleteIcon = document.createElement("i");
        deleteIcon.className = "bi bi-trash";
        div.appendChild(deleteIcon);

        const publishButton = document.createElement("input");
        publishButton.type = "button";
        publishButton.value = "Publish";
        publishButton.className = "publish-task-btn";
        div.appendChild(publishButton);

        li.appendChild(div);
        ul.appendChild(li);
    });

    addPublishEventListeners();
}

function openEditModal(task) {
    taskId = task.task_id;
    console.log('Task ID:', taskId);
    document.getElementById('editTaskName').value = task.task_name;
    editTaskModal.show();
}

function updateTaskInDOM(taskId, taskName) {
    const taskElement = document.querySelector(`li[data-task-id='${taskId}']`);
    if (taskElement) {
        taskElement.textContent = taskName;
        const div = document.createElement("div");

        const editIcon = document.createElement("i");
        editIcon.className = "bi bi-pencil";
        editIcon.addEventListener('click', function () {
            openEditModal({ task_id: taskId, task_name: taskName });
        });
        div.appendChild(editIcon);

        const deleteIcon = document.createElement("i");
        deleteIcon.className = "bi bi-trash";
        div.appendChild(deleteIcon);

        const publishButton = document.createElement("input");
        publishButton.type = "button";
        publishButton.value = "Publish";
        publishButton.className = "publish-task-btn";
        div.appendChild(publishButton);

        taskElement.appendChild(div);
    }
}

function EditTask() {
    const taskName = document.getElementById('editTaskName').value;

    if (!taskId || !taskName) {
        console.error('Task ID or Task Name is missing');
        return;
    }

    fetch(`http://localhost:8080/api/tasks/${taskId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            taskName: taskName
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task updated:', data);
        updateTaskInDOM(taskId, taskName);
    })
    .catch(error => console.error('Error updating task:', error));

    editTaskModal.hide();
}

function createPublish(data) {
    const main = document.querySelector("main");
    const h2 = document.createElement("h2");
    h2.textContent = data.category;
    main.appendChild(h2);

    const rectangleOfPublish = document.createElement("div");
    rectangleOfPublish.classList.add("GrayRectangle");
    main.appendChild(rectangleOfPublish);

    data.publishTasks.forEach(task => {
        const card = document.createElement('div');
        card.classList.add('card');
        card.classList.add(task.status === '3' ? 'green' : task.status === '2' ? 'yellow' : 'red');

        card.innerHTML = `
            <i class="icon fas fa-lightbulb"></i>
            <div class="title">${task.name}</div>
            <div class="details">
                <div class="coins"><span>${task.coins}</span> <i id="coinIcon" class="fas fa-coins"></i></div>
                <div class="assigned-to">Assigned to: ${task.assignedTo}</div>
                <div class="deadline">Deadline: ${task.deadline}</div>
            </div>
            <input type="button" value="Publish" class="publish-task-button">
        `;

        card.addEventListener('click', function () {
            localStorage.setItem('taskData', JSON.stringify(task));
            window.location.href = 'taskPage.html';
        });

        const addButton = card.querySelector('.publish-task-button');
        addButton.addEventListener('click', function (event) {
            event.stopPropagation();
        });

        rectangleOfPublish.appendChild(card);
    });

    const div = document.createElement("div");
    const slideRight = document.createElement("i");
    slideRight.className = "bi bi-arrow-right";
    div.appendChild(slideRight);
    rectangleOfPublish.appendChild(div);
}

function AddTRecommenedTasks(data) {
    const main = document.querySelector("main");
    const rectangleOfRecoomened = document.createElement("div");
    rectangleOfRecoomened.classList.add("GrayRectangle", "rectangle-add-tasks");
    main.appendChild(rectangleOfRecoomened);

    data.AddTasks.forEach(task => {
        const AddTask = document.createElement('div');
        AddTask.classList.add('card');
        AddTask.innerHTML = `
            <div class="title">${task.name}</div>
            <input type="button" value="Add Task" class="add-task-button">
        `;

        rectangleOfRecoomened.appendChild(AddTask);
    });

    const div = document.createElement("div");
    const slideRight = document.createElement("i");
    slideRight.className = "bi bi-arrow-right";
    div.appendChild(slideRight);
    rectangleOfRecoomened.appendChild(div);
}

function appendNewTask(task) {
    const ul = document.querySelector("main ul.list-group");

    const li = document.createElement("li");
    li.className = "list-group-item d-flex justify-content-between align-items-center";
    li.textContent = task.task_name;
    li.dataset.taskId = task.task_id;

    const div = document.createElement("div");

    const editIcon = document.createElement("i");
    editIcon.className = "bi bi-pencil";
    div.appendChild(editIcon);

    const deleteIcon = document.createElement("i");
    deleteIcon.className = "bi bi-trash";
    div.appendChild(deleteIcon);

    const publishButton = document.createElement("input");
    publishButton.type = "button";
    publishButton.value = "Publish";
    publishButton.className = "publish-task-btn";
    div.appendChild(publishButton);

    li.appendChild(div);
    ul.appendChild(li);

    deleteIcon.addEventListener('click', function () {
        const taskToDelete = this.closest('li');
        deleteTask(taskToDelete);
    });

    publishButton.addEventListener('click', function (event) {
        const taskName = this.closest('li').textContent.trim();
        openPublishModal(event, taskName);
    });
}

function AddNewTask() {
    const taskName = document.getElementById('taskName').value;

    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user ? user.data.user_id : null; // Adjust the key according to your user object structure

    if (!userId) {
        console.error('User is not logged in or user_id is missing');
        return;
    }

    fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ taskName: taskName, userId: userId })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task added:', data);
        appendNewTask(data.data);
    })
    .catch(error => console.error('Error adding task:', error));

    taskModal.hide();
}

function DeleteTask() {
    const trashIcons = document.getElementsByClassName("bi-trash");
    let taskToDelete = null;

    Array.from(trashIcons).forEach(icon => {
        icon.addEventListener('click', function () {
            taskToDelete = this.closest('li');
            deleteModal.show();
        });
    });

    document.getElementById('confirmDelete').addEventListener('click', function () {
        if (taskToDelete) {
            const taskId = taskToDelete.dataset.taskId;

            fetch(`http://localhost:8080/api/tasks/${taskId}`, {
                method: 'DELETE',
            })
            .then(response => {
                if (response.ok) {
                    console.log('Task deleted successfully');
                    taskToDelete.remove();
                } else {
                    console.error('Error deleting task');
                }
            })
            .catch(error => console.error('Error deleting task:', error));

            deleteModal.hide();
        }
    });

    document.getElementById('cancelDelete').addEventListener('click', function () {
        deleteModal.hide();
    });

    Array.from(document.getElementsByClassName('btn-close')).forEach(function (element) {
        element.addEventListener('click', function () {
            deleteModal.hide();
        });
    });
}

function PublishTask(data) {
    const kidsData = data.data;
    const assignedToSelect = document.getElementById('assignedTo');

    kidsData.forEach(kid => {
        const option = document.createElement('option');
        option.value = kid.kid_id;
        option.textContent = kid.kid_name;
        assignedToSelect.appendChild(option);
    });

    document.querySelectorAll('.publish-task-btn').forEach(publishButton => {
        publishButton.addEventListener('click', function (event) {
            const taskName = this.closest('li').textContent.trim();
            openPublishModal(event, taskName);
        });
    });
}

function submitHandler(event, taskName) {
    event.preventDefault();
    const assignedToSelect = document.getElementById('assignedTo');
    const assignedTo = assignedToSelect.options[assignedToSelect.selectedIndex];
    const kidId = assignedTo.value;
    const kidName = assignedTo.textContent;
    const deadline = document.getElementById('deadline').value;
    const coins = document.getElementById('coins').value;
    const user = JSON.parse(sessionStorage.getItem('user'));
    const userId = user ? user.data.user_id : null; // Adjust the key according to your user object structure

    if (!userId) {
        console.error('User is not logged in or user_id is missing');
        return;
    }

    const newTask = {
        publish_task_name: taskName,
        publish_task_status: '1',
        publish_task_coins: coins,
        publish_task_deadline: deadline,
        publish_task_assigned_to: kidName,
        kidId: kidId,
        userId: userId
    };

    // Perform the POST request to create a publish task
    fetch('http://localhost:8080/api/publish-tasks/', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(newTask)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Publish task created:', data);
        const successAlert = document.getElementById('success-alert');
        successAlert.style.display = 'block';
        setTimeout(() => {
            successAlert.style.display = 'none';
        }, 3000);
    })
    .catch(error => {
        console.error('Error creating publish task:', error);
    });

    publishTaskModal.hide();
}

function openPublishModal(event, taskName) {
    currentTaskName = taskName; // Update the current task name
    publishTaskModal.show();
}
