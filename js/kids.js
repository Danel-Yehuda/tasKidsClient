let addKidModal;
let editKidModal;
let deleteKidModal;
let currentKidId = '';

document.addEventListener('DOMContentLoaded', function() {

    document.querySelector('.btn-outline-danger').addEventListener('click', function() {
        sessionStorage.removeItem('user');
        sessionStorage.removeItem('kid');
        window.location.href = 'index.html';
    });

    addKidModal = new bootstrap.Modal(document.getElementById('addKidModal'));
    editKidModal = new bootstrap.Modal(document.getElementById('editKidModal'));
    deleteKidModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    document.getElementById('addKidBtn').addEventListener('click', function() {
        addKidModal.show();
    });

    document.getElementById('addKidForm').addEventListener('submit', function(event) {
        event.preventDefault();
        addKid();
    });

    document.getElementById('editKidForm').addEventListener('submit', function(event) {
        event.preventDefault();
        editKid();
    });

    document.getElementById('confirmDelete').addEventListener('click', function() {
        deleteKid(currentKidId);
    });

    loadKids();
});

function loadKids() {
    fetch("https://taskidserver.onrender.com/api/kids")
        .then(response => response.json())
        .then(data => {
            console.log(data);
            data.data.forEach(kid => {
                addKidCard(kid);
            });
        })
        .catch(error => console.error('Error loading kids:', error));
}

function addKid() {
    const kidName = document.getElementById('kidName').value;
    const kidPassword = document.getElementById('kidPassword').value;

    const user = JSON.parse(sessionStorage.getItem('user'));
    const parentId = user ? user.data.user_id : null;
    const parentEmail = user ? user.data.user_email : null;

    if (!parentId || !parentEmail) {
        console.error('User is not logged in or user data is missing');
        return;
    }

    const kidData = {
        kid_name: kidName,
        kid_password: kidPassword,
        parent_email: parentEmail,
        parent_id: parentId,
        kid_coins: 5,
        kid_tasks_done: 0
    };

    fetch("https://taskidserver.onrender.com/api/kids", {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(kidData)
    })
    .then(response => response.json())
    .then(data => {
        console.log('Kid added:', data);
        addKidCard(data.data);
    })
    .catch(error => console.error('Error adding kid:', error));

    addKidModal.hide();
}

function addKidCard(kid) {
    const kidsList = document.getElementById('kidsList');
    const col = document.createElement('div');
    col.className = 'col-md-4';
    col.dataset.kidId = kid.kid_id;

    col.innerHTML = `
        <div class="card mb-4">
            <div class="card-body">
                <h5 class="card-title">${kid.kid_name}</h5>
                <p class="card-text">Coins: ${kid.kid_coins}</p>
                <p class="card-text">Tasks Done: ${kid.kid_tasks_done}</p>
                <div class="d-flex justify-content-between">
                    <button class="btn btn-primary edit-kid">Edit</button>
                    <button class="btn btn-danger delete-kid">Delete</button>
                </div>
            </div>
        </div>
    `;

    col.querySelector('.edit-kid').addEventListener('click', function() {
        openEditModal(kid);
    });

    col.querySelector('.delete-kid').addEventListener('click', function() {
        currentKidId = kid.kid_id;
        deleteKidModal.show();
    });

    kidsList.appendChild(col);
}

function openEditModal(kid) {
    currentKidId = kid.kid_id;
    document.getElementById('editKidName').value = kid.kid_name;
    document.getElementById('editKidCoins').value = kid.kid_coins;
    document.getElementById('editKidTasksDone').value = kid.kid_tasks_done;
    editKidModal.show();
}

function editKid() {
    const kidName = document.getElementById('editKidName').value;
    const kidCoins = document.getElementById('editKidCoins').value;
    const kidTasksDone = document.getElementById('editKidTasksDone').value;

    fetch(`https://taskidserver.onrender.com/api/kids/${currentKidId}`, {
        method: "PUT",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify({
            kid_name: kidName,
            kid_coins: kidCoins,
            kid_tasks_done: kidTasksDone,
        })
    })
    .then(response => response.json())
    .then(data => {
        console.log('Kid updated:', data);
        updateKidCard(data.data);
    })
    .catch(error => console.error('Error updating kid:', error));

    editKidModal.hide();
}

function updateKidCard(kid) {
    const kidCard = document.querySelector(`div[data-kid-id='${kid.kid_id}']`);
    if (kidCard) {
        kidCard.querySelector('.card-title').textContent = kid.kid_name;
        kidCard.querySelector('.card-text:nth-child(2)').textContent = `Coins: ${kid.kid_coins}`;
        kidCard.querySelector('.card-text:nth-child(3)').textContent = `Tasks Done: ${kid.kid_tasks_done}`;
    }
}

function deleteKid(kidId) {
    fetch(`https://taskidserver.onrender.com/api/kids/${kidId}`, {
        method: 'DELETE'
    })
    .then(response => {
        if (response.ok) {
            console.log('Kid deleted successfully');
            const kidCard = document.querySelector(`div[data-kid-id='${kidId}']`);
            if (kidCard) {
                kidCard.remove();
            }
            deleteKidModal.hide();
        } else {
            console.error('Error deleting kid');
        }
    })
    .catch(error => console.error('Error deleting kid:', error));
}
