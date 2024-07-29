// let deleteModal;
// let giftToDelete;
// let editGiftModal;
// let giftToEdit;

// document.addEventListener('DOMContentLoaded', function () {
//     const addGiftModal = new bootstrap.Modal(document.getElementById('addGiftModal'));
//     deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
//     editGiftModal = new bootstrap.Modal(document.getElementById('editGiftModal'));
//     document.getElementById('add-gift-button').addEventListener('click', function () {
//         addGiftModal.show();
//     });

//     const addGiftForm = document.getElementById('add-gift-form');
//     addGiftForm.addEventListener('submit', function (event) {
//         event.preventDefault();
//         const user = JSON.parse(sessionStorage.getItem('user'));
//         const userId = user ? user.data.user_id : null;
//         addGift(addGiftModal, userId);
//     });

//     fetchGifts();

//     document.getElementById('confirmDelete').addEventListener('click', function () {
//         if (giftToDelete) {
//             const giftId = giftToDelete.dataset.giftId;
//             deleteGift(giftId);
//         }
//     });

//     document.getElementById('cancelDelete').addEventListener('click', function () {
//         deleteModal.hide();
//     });

//     const editGiftForm = document.getElementById('edit-gift-form');
//     editGiftForm.addEventListener('submit', function (event) {
//         event.preventDefault();
//         const giftId = giftToEdit.dataset.giftId;
//         console.log('Editing gift with payload:', updatedGift);
//         editGift(giftId);
//     });

//     document.querySelectorAll('.btn-close').forEach(function (element) {
//         element.addEventListener('click', function () {
//             addGiftModal.hide();
//             deleteModal.hide();
//         });
//     });
// });

// async function fetchGifts() {
//     try {
//         const response = await fetch('http://localhost:8080/api/gift-shop');
//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         const result = await response.json();
//         console.log('Gifts result:', result);

//         if (Array.isArray(result.data)) {
//             renderGifts(result.data);
//         } else {
//             console.error('Data is not an array:', result.data);
//         }
//     } catch (error) {
//         console.error('Error fetching gifts:', error);
//     }
// }

// function renderGifts(gifts) {
//     const giftCardsContainer = document.getElementById('gift-cards');
//     giftCardsContainer.innerHTML = '';

//     const row = document.createElement('div');
//     row.className = 'row justify-content-center';

//     gifts.forEach(gift => {
//         const card = document.createElement('div');
//         card.className = 'card col-md-3';
//         card.dataset.giftId = gift.gift_id;
//         card.innerHTML = `
//             <i class="icon fas fa-gift"></i>
//             <div class="title">${gift.gift_name}</div>
//             <div class="details">
//                 <div class="coins"><span>${gift.coin_cost}</span> <i id="coinIcon" class="fas fa-coins"></i></div>
//                 <div class="subDetails">
//                     <div class="icon-container">
//                         <i class="bi bi-pencil icon-large" data-id="${gift.gift_id}"></i>
//                         <i class="bi bi-trash icon-large" data-id="${gift.gift_id}"></i>
//                     </div>
//                 </div>
//             </div>
//         `;
//         row.appendChild(card);
//     });

//     giftCardsContainer.appendChild(row);

//     document.querySelectorAll('.bi-trash').forEach(icon => {
//         icon.addEventListener('click', function () {
//             giftToDelete = this.closest('.card');
//             deleteModal.show();
//         });
//     });

//     document.querySelectorAll('.bi-pencil').forEach(icon => {
//         icon.addEventListener('click', function () {
//             giftToEdit = this.closest('.card');
//             editGiftModal.show();
//         });
//     });
// }

// async function addGift(addGiftModal, userId) {
//     const giftName = document.getElementById('gift-name').value;
//     const giftCoins = document.getElementById('gift-coins').value;

//     if (!userId) {
//         console.error('User is not logged in or user_id is missing');
//         return;
//     }
//     if (!giftName || !giftCoins) {
//         console.error('Gift name or coins are missing');
//         return;
//     }

//     const newGift = {
//         gift_name: giftName,
//         coin_cost: parseInt(giftCoins, 10),
//         user_id: userId
//     };
//     addGiftModal.hide();

//     console.log('Adding new gift with payload:', newGift);

//     try {
//         const response = await fetch('http://localhost:8080/api/gift-shop', {
//             method: 'POST',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(newGift)
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const result = await response.json();
//         console.log('Gift added:', result);

//         await fetchGifts();

//         document.getElementById('add-gift-form').reset();
//     } catch (error) {
//         console.error('Error adding gift:', error);
//     }
// }

// async function deleteGift(giftId) {
//     try {
//         const response = await fetch(`http://localhost:8080/api/gift-shop/${giftId}`, {
//             method: 'DELETE',
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }
//         deleteModal.hide();

//         console.log('Gift deleted successfully');
//         await fetchGifts();
//     } catch (error) {
//         console.error('Error deleting gift:', error);
//     }
// }

// async function editGift(giftId) {
//     const giftName = document.getElementById('edit-gift-name').value;
//     const giftCoins = document.getElementById('edit-gift-coins').value;

//     const updatedGift = {
//         gift_name: giftName,
//         coin_cost: parseInt(giftCoins, 10)
//     };
//     editModal.hide();

//     console.log('Editing gift with payload:', updatedGift);

//     try {
//         const response = await fetch(`http://localhost:8080/api/gift-shop/${giftId}`, {
//             method: 'PUT',
//             headers: {
//                 'Content-Type': 'application/json'
//             },
//             body: JSON.stringify(updatedGift)
//         });

//         if (!response.ok) {
//             throw new Error('Network response was not ok');
//         }

//         const result = await response.json();
//         console.log('Gift edited:', result);

//         await fetchGifts();
//     } catch (error) {
//         console.error('Error editing gift:', error);
//     }
// }
let deleteModal;
let giftToDelete;
let editGiftModal;
let giftToEdit;

document.addEventListener('DOMContentLoaded', function () {
    const addGiftModal = new bootstrap.Modal(document.getElementById('addGiftModal'));
    deleteModal = new bootstrap.Modal(document.getElementById('deleteModal'));
    editGiftModal = new bootstrap.Modal(document.getElementById('editGiftModal'));

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

    const editGiftForm = document.getElementById('edit-gift-form');
    editGiftForm.addEventListener('submit', function (event) {
        event.preventDefault();
        const giftId = giftToEdit.dataset.giftId;
        editGift(giftId);
    });

    fetchGifts();
    document.getElementById('confirmDelete').addEventListener('click', function () {
        if (giftToDelete) {
            const giftId = giftToDelete.dataset.giftId;
            deleteGift(giftId);
        }
    });

    document.getElementById('cancelDelete').addEventListener('click', function () {
        deleteModal.hide();
    });

    document.querySelectorAll('.btn-close').forEach(function (element) {
        element.addEventListener('click', function () {
            addGiftModal.hide();
            deleteModal.hide();
            editGiftModal.hide();
        });
    });
});

async function fetchGifts() {
    try {
        const response = await fetch('http://localhost:8080/api/gift-shop');
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
                        <i class="bi bi-pencil icon-large" data-id="${gift.gift_id}"></i>
                        <i class="bi bi-trash icon-large" data-id="${gift.gift_id}"></i>
                    </div>
                </div>
            </div>
        `;
        row.appendChild(card);
    });

    giftCardsContainer.appendChild(row);

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
        const response = await fetch('http://localhost:8080/api/gift-shop', {
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
        const response = await fetch(`http://localhost:8080/api/gift-shop/${giftId}`, {
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
        const response = await fetch(`http://localhost:8080/api/gift-shop/${giftId}`, {  // Corrected line
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
