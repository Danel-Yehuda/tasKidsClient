document.addEventListener('DOMContentLoaded', function () {
    const addGiftModal = new bootstrap.Modal(document.getElementById('addGiftModal'));
    document.getElementById('add-gift-button').addEventListener('click', function () {
        addGiftModal.show();
    });

    const addGiftForm = document.getElementById('add-gift-form');
    addGiftForm.addEventListener('submit', function(event) {
        event.preventDefault();
        addGift(addGiftModal);
    });

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

function renderGifts(gifts) {
    const giftCardsContainer = document.getElementById('gift-cards');
    giftCardsContainer.innerHTML = '';

    const row = document.createElement('div');
    row.className = 'row justify-content-center';

    gifts.forEach(gift => {
        const card = document.createElement('div');
        card.className = 'card col-md-3';
        card.innerHTML = `
            <i class="icon fas fa-gift"></i>
            <div class="title">${gift.gift_name}</div>
            <div class="details">
                <div class="coins"><span>${gift.coin_cost}</span> <i id="coinIcon" class="fas fa-coins"></i></div>
                <div class="subDetails">
                    <button class="btn btn-primary mt-2">Buy Gift</button>
                </div>
            </div>
        `;
        row.appendChild(card);
    });
    giftCardsContainer.appendChild(row);
}

async function addGift(addGiftModal) {
    const giftName = document.getElementById('gift-name').value;
    const giftCoins = document.getElementById('gift-coins').value;

    if (!giftName || !giftCoins) {
        console.error('Gift name or coins are missing');
        return;
    }

    const newGift = {
        gift_name: giftName,
        coin_cost: parseInt(giftCoins, 10)
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

        addGiftModal.hide();
        document.getElementById('add-gift-form').reset();
    } catch (error) {
        console.error('Error adding gift:', error);
    }
}
