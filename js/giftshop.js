document.addEventListener('DOMContentLoaded', function () {
    // Logout button functionality
    document.querySelector('.btn-outline-danger').addEventListener('click', function () {
        sessionStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    // Initialize the Bootstrap modal
    const addGiftModal = new bootstrap.Modal(document.getElementById('addGiftModal'));

    // Show the modal when the "Add Gift" button is clicked
    document.getElementById('add-gift-button').addEventListener('click', function () {
        addGiftModal.show();
    });

    // Handle form submission
    document.getElementById('add-gift-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        await addGift();
    });

    // Fetch and display gifts
    fetchGifts();
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

async function renderGifts(gifts) {
    const giftCardsContainer = document.getElementById('gift-cards');
    giftCardsContainer.innerHTML = '';

    const row = document.createElement('div');
    row.className = 'row justify-content-center';

    gifts.forEach(gift => {
        const card = document.createElement('div');
        card.className = 'card col-md-3';
        card.innerHTML = `
            <i class="icon fas fa-gift"></i>
            <div class="title">${gift.name}</div>
            <div class="details">
                <div class="coins"><span>${gift.coins}</span> <i id="coinIcon" class="fas fa-coins"></i></div>
                <div class="subDetails">
                    <button class="btn btn-primary mt-2">Buy Gift</button>
                </div>
            </div>
        `;

        row.appendChild(card);
    });
    giftCardsContainer.appendChild(row);
}

async function addGift() {
    const giftName = document.getElementById('gift-name').value;
    const giftCoins = document.getElementById('gift-coins').value;

    const newGift = {
        name: giftName,
        coins: giftCoins
    };

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

        const addGiftModal = bootstrap.Modal.getInstance(document.getElementById('addGiftModal'));
        addGiftModal.hide();
        document.getElementById('add-gift-form').reset();
    } catch (error) {
        console.error('Error adding gift:', error);
    }
}
