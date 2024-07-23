let taskModal;
let publishTaskModal;

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

    fetch("data/Kids.json")
        .then(response => response.json())
        .then(data => {
            PublishTask(data);
        });

    taskModal = new bootstrap.Modal(document.getElementById('taskModal'));
    publishTaskModal = new bootstrap.Modal(document.getElementById('publishTaskModal'));

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
        });
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
    });

    addPublishEventListeners();  // Register event listeners after tasks are created
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

function AddNewTask() {
    const taskName = document.getElementById('taskName').value;

    fetch("http://localhost:8080/api/tasks", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({ taskName: taskName })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task added:', data);
        // Optionally, refresh the task list or update the UI
        createListTasks();
    })
    .catch(error => console.error('Error adding task:', error));

    taskModal.hide();

}

function DeleteTask() {
    const trashIcons = document.getElementsByClassName("bi-trash");
    let taskToDelete = null;

    const modalHtml = `
        <div class="modal fade" id="deleteModal" tabindex="-1" aria-labelledby="deleteModalLabel" aria-hidden="true">
            <div class="modal-dialog">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="deleteModalLabel">Confirm Deletion</h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        Are you sure you want to delete this task?
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-secondary" id="cancelDelete" data-bs-dismiss="modal">No</button>
                        <button type="button" class="btn btn-danger" id="confirmDelete">Yes</button>
                    </div>
                </div>
            </div>
        </div>`;

    document.body.insertAdjacentHTML('beforeend', modalHtml);
    const deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    Array.from(trashIcons).forEach(icon => {
        icon.addEventListener('click', function () {
            taskToDelete = this.closest('li');
            deleteModal.show();
        });
    });

    document.getElementById('confirmDelete').addEventListener('click', function () {
        if (taskToDelete) {
            const taskName = taskToDelete.firstChild.textContent.trim();

            console.log(`DELETE https://taskids/api/tasks/`);
            console.log("Request body:", {
                taskToDelete: taskToDelete,
                name: `${taskName}`
            });

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
    const kidsData = data;
    const assignedToSelect = document.getElementById('assignedTo');

    kidsData.forEach(kid => {
        const option = document.createElement('option');
        option.value = kid.name;
        option.textContent = kid.name;
        assignedToSelect.appendChild(option);
    });

    document.querySelectorAll('.publish-task-btn').forEach(publishButton => {
        publishButton.addEventListener('click', function (event) {
            const taskName = this.closest('li').textContent.trim();
            openPublishModal(publishTaskModal, event, taskName);
        });
    });
}

function openPublishModal(event, taskName) {
    publishTaskModal.show();

    const form = document.getElementById('publishTaskForm');
    form.removeEventListener('submit', submitHandler); // Remove previous event listener if any
    form.addEventListener('submit', submitHandler);

    function submitHandler(event) {
        event.preventDefault();
        const assignedTo = document.getElementById('assignedTo').value;
        const deadline = document.getElementById('deadline').value.split('-').reverse().join('/');
        const coins = document.getElementById('coins').value;

        const newTask = {
            name: taskName,
            assignedTo: assignedTo,
            deadline: deadline,
            coins: coins,
            status: '1'
        };

        console.log(`POST https://taskids/api/publish-tasks/`);
        console.log("Request body:", {
            newTask: newTask
        });
        publishTaskModal.hide();
    }

    document.querySelectorAll('.btn-close').forEach(icon => {
        icon.addEventListener('click', function () {
            publishTaskModal.hide();
        });
    });
}


