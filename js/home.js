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
    }
    if (kid) {
        profilePicElement.src = "images/kid1.jpg";
        document.getElementById('kidsNav').style.display = 'none';
        document.getElementById('tasksNav').style.display = 'none';
        kidSavingsElement.style.display = 'block';
        savingsAmountElement.textContent = kid.data.kid_coins;
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
            renderPublishTasks(result.data);
        } else {
            console.error('Data is not an array:', result.data);
        }
    } catch (error) {
        console.error('Error fetching publish tasks:', error);
    }
}

function renderPublishTasks(tasks) {
    const taskCardsContainer = document.querySelector('#task-cards .row');
    taskCardsContainer.innerHTML = ''; // Clear existing tasks if any

    tasks.forEach((task, index) => {
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
                    <div class="assigned-to">Assigned to: ${task.publish_task_assigned_to}</div>
                    <div class="deadline">Deadline: ${formattedDate}</div>
                </div>
            </div>
        `;

        card.addEventListener('click', function() {
            sessionStorage.setItem('selectedTask', JSON.stringify(task));
            window.location.href = 'taskPage.html';
        });

        taskCardsContainer.appendChild(card);
    });
}
