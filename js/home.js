document.addEventListener('DOMContentLoaded', function() {
    // Log out button functionality
    document.querySelector('.btn-outline-danger').addEventListener('click', function() {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('kid');
        window.location.href = 'index.html';
    });

    const user = JSON.parse(sessionStorage.getItem('user'));
    const kid = JSON.parse(sessionStorage.getItem('kid'));
    console.log('User:', user);
    console.log('Kid:', kid);
    const profilePicElement = document.getElementById('profilePic');
    const kidSavingsElement = document.getElementById('kid-savings');
    const savingsAmountElement = document.getElementById('savings-amount');

    if (user) {
        profilePicElement.src = "images/Picture1.png";
        fetchMessages(user.data.user_id, 'user'); // Fetch messages for parent
    }
    if (kid) {
        profilePicElement.src = "images/kid1.jpg";
        document.getElementById('kidsNav').style.display = 'none';
        document.getElementById('tasksNav').style.display = 'none';
        kidSavingsElement.style.display = 'block';
        savingsAmountElement.textContent = kid.data.kid_coins;
        fetchMessages(kid.data.kid_id, 'kid'); // Fetch messages for kid
    }

    // Fetch and display publish tasks
    fetchPublishTasks(user, kid);
});

function formatDate(date) {
    const day = String(date.getDate()).padStart(2, '0');
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const year = date.getFullYear();
    return `${day}/${month}/${year}`;
}

async function fetchPublishTasks(user, kid) {
    let url = 'http://localhost:8080/api/publish-tasks';
    if (user) {
        url += `?userId=${user.data.user_id}`;
    } else if (kid) {
        url += `?kidId=${kid.data.kid_id}`;
    }

    try {
        const response = await fetch(url);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Publish tasks result:', result);

        if (Array.isArray(result.data)) {
            renderPublishTasks(result.data, kid, user);
        } else {
            console.error('Data is not an array:', result.data);
        }
    } catch (error) {
        console.error('Error fetching publish tasks:', error);
    }
}

function renderPublishTasks(tasks,kid,user) {
    const taskCardsContainer = document.querySelector('#task-cards .row');
    taskCardsContainer.innerHTML = ''; // Clear existing tasks if any

    tasks.forEach((task, index) => {
        if (task.approve !== 1) { // Filter out approved tasks
            const formattedDate = formatDate(new Date(task.publish_task_deadline));
            const card = document.createElement('div');
            card.classList.add('card', 'col-md-3');

            card.classList.add(task.publish_task_status == '3' ? 'green' : task.publish_task_status == '2' ? 'yellow' : 'red');
            card.setAttribute('data-index', index);

            card.innerHTML = `
                <i class="icon fas fa-lightbulb"></i>
                <div class="title">${task.publish_task_name}</div>
                <div class="details">
                    <div class="coins"><span>${task.publish_task_coins}</span> <i id="coinIcon" class="fas fa-coins"></i></div>
                    <div class="subDetails">
                        ${user ? `<div class="assigned-to">Assigned to: ${task.publish_task_assigned_to}</div>` : ''}
                        <div class="deadline">Deadline: ${formattedDate}</div>
                    </div>
                </div>
                ${kid ? '<div class="color-picker">' + document.getElementById('gradient-icon').outerHTML + '</div>' : ''}
            `;

            card.addEventListener('click', function() {
                sessionStorage.setItem('selectedTask', JSON.stringify(task));
                window.location.href = 'taskPage.html';
            });

            if (kid) {
                const colorPicker = card.querySelector('.color-picker');
                colorPicker.addEventListener('click', function(e) {
                    e.stopPropagation();
                    showColorOptions(card, task.publish_task_id);
                });
            }

            taskCardsContainer.appendChild(card);
        }
    });
}

function showColorOptions(card, taskId) {
    const colors = ['#FA7070', '#C6EBC5', '#7EA1FF', '#FFD1E3', '#D8B4F8']; // Example colors
    const colorOptions = document.createElement('div');
    colorOptions.classList.add('color-options');

    colors.forEach(color => {
        const colorOption = document.createElement('div');
        colorOption.classList.add('color-option');
        colorOption.style.backgroundColor = color;
        colorOption.addEventListener('click', function(e) {
            changeCardColor(card, color, taskId);
            e.stopPropagation();
            colorOptions.remove();
        });
        colorOptions.appendChild(colorOption);
    });

    card.appendChild(colorOptions);

    // Remove the color options when clicking outside the card
    document.addEventListener('click', function(e) {
        if (!card.contains(e.target)) {
            colorOptions.remove();
        }
    }, { once: true });
}

function changeCardColor(card, color, taskId) {
    card.style.backgroundColor = color;

    fetch(`http://localhost:8080/api/publish-tasks/color/${taskId}`, {
        method: 'PUT',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ color: color })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Task color updated:', data);
    })
    .catch(error => console.error('Error updating task color:', error));
}


async function fetchMessages(id, userType) {
    console.log('Fetching messages for', userType, 'with ID:', id);
    try {
        const response = await fetch(`http://localhost:8080/api/messages/${userType}/${id}`);
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const messages = await response.json();
        console.log('Messages:', messages);

        const messageList = document.getElementById('message-list');
        messageList.innerHTML = ''; // Clear existing messages

        if (messages.data.length > 0) {
            messages.data.forEach(message => {
                const listItem = document.createElement('li');
                listItem.classList.add('list-group-item');
                listItem.textContent = `${formatDate(new Date(message.timestamp))} - ${message.message}`;
                messageList.appendChild(listItem);
            });
        } else {
            const listItem = document.createElement('li');
            listItem.classList.add('list-group-item');
            listItem.textContent = 'No messages available.';
            messageList.appendChild(listItem);
        }
    } catch (error) {
        console.error('Error fetching messages:', error);
    }
}
