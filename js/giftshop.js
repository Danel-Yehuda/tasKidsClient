let giftToDelete;
let deleteModal
let editGiftModal;
let giftToEdit;
let buyGiftModal;
let giftToBuy;
let successModal;

document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.btn-outline-danger').addEventListener('click', function () {
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
    const addGiftButton = document.getElementById('add-gift-button');

    if (user) {
        profilePicElement.src = "images/Picture1.png";
    }

   if (kid) {
    profilePicElement.src = "images/kid1.jpg";
    document.getElementById('kidsNav').style.display = 'none';
    document.getElementById('tasksNav').style.display = 'none';
    addGiftButton.style.display = 'none';
    kidSavingsElement.style.display = 'block';
    fetch(`https://taskidserver.onrender.com/api/kids/${kid.data.kid_id}`)
        .then(response => response.json())
        .then(updatedKid => {
            console.log('Updated kid data:', updatedKid);
            sessionStorage.setItem('kid', JSON.stringify(updatedKid));
            savingsAmountElement.textContent = updatedKid.data.kid_coins;
            fetchMessages(updatedKid.data.kid_id, 'kid');
        })
        .catch(error => console.error('Error fetching updated kid data:', error));
    }
    const addGiftModal = new bootstrap.Modal(document.getElementById('addGiftModal'));
    document.getElementById('add-gift-button').addEventListener('click', function () {
        addGiftModal.show();
    });

    const addGiftForm = document.getElementById('add-gift-form');
    addGiftForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const user = JSON.parse(sessionStorage.getItem('user'));
        const userId = user ? user.data.user_id : null;
        addGift(addGiftModal, userId);
    });

    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));

    editGiftModal = new bootstrap.Modal(document.getElementById('editGiftModal'));
    const editGiftForm = document.getElementById('edit-gift-form');
    editGiftForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const giftId = giftToEdit.dataset.giftId;
        editGift(giftId);
    });

    buyGiftModal = new bootstrap.Modal(document.getElementById('buyGiftModal'));
    document.querySelectorAll('.buy-gift-button').forEach(button => {
        button.addEventListener('click', function () {
            giftToBuy = this.closest('.card');
            buyGiftModal.show();
        });
    });

    const buyGiftForm = document.getElementById('buy-gift-form');
    buyGiftForm.addEventListener('submit', function (event) {
        event.preventDefault();
        if (giftToBuy) {
            const giftId = giftToBuy.dataset.giftId;
            const user = JSON.parse(sessionStorage.getItem('user'));
            const userId = user ? user.data.user_id : null;
            buyGift(giftId);
        }
    });

    fetchGifts();

    document.getElementById('confirmDelete').addEventListener('click', function () {
        if (giftToDelete) {
            const giftId = giftToDelete.dataset.giftId;
            deleteGift(giftId);
        }
    });

    successModal = new bootstrap.Modal(document.getElementById('successModal'));

    document.querySelectorAll('.btn-close, .btn-secondary, .btn-primary').forEach(function (element) {
        element.addEventListener('click', function () {
            addGiftModal.hide();
            deleteModal.hide();
            editGiftModal.hide();
            buyGiftModal.hide();
            successModal.hide();
        });
    });
});

async function fetchGifts() {
    try {
        const response = await fetch('https://taskidserver.onrender.com/api/gift-shop');
        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        const result = await response.json();
        console.log('Gifts result:', result);

        if (Array.isArray(result.data)) {
            renderGifts(result.data);
        } else {
            console.error('Data is not an array:', result.data);
        }
    } catch (error) {
        console.error('Error fetching gifts:', error);
    }
}

function renderGifts(gifts) {
    const giftCardsContainer = document.getElementById('gift-cards');
    giftCardsContainer.innerHTML = '';

    const row = document.createElement('div');
    row.className = 'row justify-content-center';

    gifts.forEach(gift => {
        const card = document.createElement('div');
        card.className = 'card col-md-3';
        card.dataset.giftId = gift.gift_id;
        card.innerHTML = `
            <i class="icon fas fa-gift"></i>
            <div class="title">${gift.gift_name}</div>
            <div class="details">
                <div class="coins"><span>${gift.coin_cost}</span> <i id="coinIcon" class="fas fa-coins"></i></div>
                <div class="subDetails">
                    <div class="icon-container">
                        <button class="btn btn-primary mt-2 buy-gift-button">Buy Gift</button>
                        <i class="bi bi-pencil icon-large" data-id="${gift.gift_id}"></i>
                        <i class="bi bi-trash icon-large" data-id="${gift.gift_id}"></i>
                    </div>
                </div>
            </div>
        `;

        row.appendChild(card);
    });

    giftCardsContainer.appendChild(row);

    const kid = JSON.parse(sessionStorage.getItem('kid'));
    if (!kid) {
        document.querySelectorAll('.buy-gift-button').forEach(button => {
            button.style.display = 'none';
        });
    }

    if (kid) {
        document.querySelectorAll('.bi-pencil').forEach(icon => {
            icon.style.display = 'none';
        });
        document.querySelectorAll('.bi-trash').forEach(icon => {
            icon.style.display = 'none';
        });
    }

    document.querySelectorAll('.bi-trash').forEach(icon => {
        icon.addEventListener('click', function () {
            giftToDelete = this.closest('.card');
            deleteModal.show();
        });
    });

    document.querySelectorAll('.bi-pencil').forEach(icon => {
        icon.addEventListener('click', function () {
            giftToEdit = this.closest('.card');
            openEditModal(giftToEdit);
        });
    });

    document.querySelectorAll('.buy-gift-button').forEach(button => {
        button.addEventListener('click', function () {
            giftToBuy = this.closest('.card');
            buyGiftModal.show();
        });
    });
}


function openEditModal(gift) {
    const giftId = gift.dataset.giftId;
    const giftName = gift.querySelector('.title').textContent;
    const giftCoins = gift.querySelector('.coins span').textContent;

    document.getElementById('edit-gift-name').value = giftName;
    document.getElementById('edit-gift-coins').value = giftCoins;
    giftToEdit = gift;
    editGiftModal.show();
}

async function addGift(addGiftModal, userId) {
    const giftName = document.getElementById('gift-name').value;
    const giftCoins = document.getElementById('gift-coins').value;

    if (!userId) {
        console.error('User is not logged in or user_id is missing');
        return;
    }
    if (!giftName || !giftCoins) {
        console.error('Gift name or coins are missing');
        return;
    }

    const newGift = {
        gift_name: giftName,
        coin_cost: parseInt(giftCoins, 10),
        user_id: userId
    };
    addGiftModal.hide();

    console.log('Adding new gift with payload:', newGift);

    try {
        const response = await fetch('https://taskidserver.onrender.com/api/gift-shop', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(newGift)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Gift added:', result);

        await fetchGifts();

        document.getElementById('add-gift-form').reset();
    } catch (error) {
        console.error('Error adding gift:', error);
    }
}

async function deleteGift(giftId) {
    try {
        const response = await fetch(`https://taskidserver.onrender.com/api/gift-shop/${giftId}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }
        deleteModal.hide();

        console.log('Gift deleted successfully');
        await fetchGifts();
    } catch (error) {
        console.error('Error deleting gift:', error);
    }
}

async function editGift(giftId) {
    const giftName = document.getElementById('edit-gift-name').value;
    const giftCoins = document.getElementById('edit-gift-coins').value;

    const updatedGift = {
        gift_name: giftName,
        coin_cost: parseInt(giftCoins, 10)
    };

    console.log('Editing gift with payload:', updatedGift);

    try {
        const response = await fetch(`https://taskidserver.onrender.com/api/gift-shop/${giftId}`, {  // Corrected line
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(updatedGift)
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Gift edited:', result);

        updateGiftInDOM(giftId, giftName, giftCoins);

        editGiftModal.hide();
    } catch (error) {
        console.error('Error editing gift:', error);
    }
}
function updateGiftInDOM(giftId, giftName, giftCoins) {
    const giftElement = document.querySelector(`div[data-gift-id='${giftId}']`);  // Corrected line
    if (giftElement) {
        giftElement.querySelector('.title').textContent = giftName;
        giftElement.querySelector('.coins span').textContent = giftCoins;
    }
}
async function buyGift(giftId) {
    buyGiftModal.hide();

    const kid = JSON.parse(sessionStorage.getItem('kid'));
    if (!kid) {
        alert('You must be logged in to buy a gift.');
        return;
    }

    const kidId = kid.data.kid_id;
    try {
        const response = await fetch(`https://taskidserver.onrender.com/api/gift-shop/buy/${giftId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ kidId })
        });

        if (!response.ok) {
            throw new Error('Network response was not ok');
        }

        const result = await response.json();
        console.log('Gift purchased:', result);

        await fetchGifts();

        buyGiftModal.hide();
        successModal.show();
    } catch (error) {
        console.error('Error purchasing gift:', error);
        alert('There was an error purchasing the gift. Please try again.');
    }
}
