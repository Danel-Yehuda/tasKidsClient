document.addEventListener('DOMContentLoaded', function () {
    document.querySelector('.btn-outline-danger').addEventListener('click', function () {
        sessionStorage.removeItem('user');
        window.location.href = 'index.html';
    });

    fetchGifts();
});

window.onload = () => {
    const addGiftModal = new bootstrap.Modal(document.getElementById('addGiftModal'));
    document.getElementById('add-gift-button').addEventListener('click', function () {
        addGiftModal.show();
    });

    document.getElementById('add-gift-form').addEventListener('submit', async function (event) {
        event.preventDefault();
        await addGift();
    });
};

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

