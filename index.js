// Функции для работы с корзиной
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    document.getElementById('cart-count').textContent = totalItems;
}

function addToCart(gameTitle, gamePrice, gameImage) {
    const cart = getCart();
    const existingItemIndex = cart.findIndex(item => item.title === gameTitle);
    
    if (existingItemIndex > -1) {
        cart[existingItemIndex].quantity += 1;
    } else {
        cart.push({
            title: gameTitle,
            price: gamePrice,
            image: gameImage,
            quantity: 1
        });
    }
    
    saveCart(cart);
    
    // Анимация добавления
    showAddToCartAnimation(gameTitle);
}

function showAddToCartAnimation(gameTitle) {
    const notification = document.createElement('div');
    notification.style.cssText = `
        position: fixed;
        top: 20px;
        right: 20px;
        background: #66c0f4;
        color: #23272e;
        padding: 15px 20px;
        border-radius: 5px;
        z-index: 1000;
        font-weight: bold;
        box-shadow: 0 4px 12px rgba(0,0,0,0.3);
    `;
    notification.textContent = `"${gameTitle}" добавлен в корзину!`;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.remove();
    }, 2000);
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    
    const games = document.querySelectorAll('.steam-game-card');
    
    games.forEach(game => {
        game.addEventListener('click', () => {
            game.classList.toggle('game-active');
        });
    });

    const buyBtns = document.querySelectorAll('.buy-btn');
    
    buyBtns.forEach(btn => {
        btn.addEventListener('click', (event) => {
            event.stopPropagation();
            
            const gameCard = btn.closest('.steam-game-card');
            const gameTitle = gameCard.dataset.title;
            const gamePrice = gameCard.dataset.price + ' руб.';
            const gameImage = gameCard.dataset.image;
            
            addToCart(gameTitle, gamePrice, gameImage);
        });
    });
});