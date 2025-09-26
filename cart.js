// Функции для работы с корзиной
function getCart() {
    return JSON.parse(localStorage.getItem('cart')) || [];
}

function saveCart(cart) {
    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount();
    loadCartItems();
}

function updateCartCount() {
    const cart = getCart();
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElement = document.getElementById('cart-count');
    if (cartCountElement) {
        cartCountElement.textContent = totalItems;
    }
}

function calculateTotal() {
    const cart = getCart();
    let total = 0;
    
    cart.forEach(item => {
        const price = parseInt(item.price);
        if (!isNaN(price)) {
            total += price * item.quantity;
        }
    });
    
    return total;
}

function loadCartItems() {
    const cart = getCart();
    const cartItemsContainer = document.getElementById('cart-items-container');
    const totalAmountElement = document.getElementById('total-amount');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<div class="empty-cart">Корзина пуста</div>';
        totalAmountElement.textContent = '0';
        return;
    }
    
    cartItemsContainer.innerHTML = '';
    
    cart.forEach((item, index) => {
        const cartItem = document.createElement('div');
        cartItem.className = 'cart-item';
        cartItem.innerHTML = `
            <div class="cart-item-img">
                <img src="${item.image}" alt="${item.title}" onerror="this.style.display='none'">
            </div>
            <div class="cart-item-info">
                <div class="cart-item-title">${item.title}</div>
                <div class="cart-item-price">${item.price}</div>
                <div class="cart-item-quantity">
                    <button class="quantity-btn minus" data-index="${index}">-</button>
                    <span class="quantity-num">${item.quantity}</span>
                    <button class="quantity-btn plus" data-index="${index}">+</button>
                </div>
                <button class="delete-btn" data-index="${index}">Удалить</button>
            </div>
        `;
        cartItemsContainer.appendChild(cartItem);
    });
    
    totalAmountElement.textContent = calculateTotal();
    
    // Добавляем обработчики событий
    attachEventListeners();
}

function attachEventListeners() {
    // Кнопки увеличения количества
    document.querySelectorAll('.quantity-btn.plus').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            const cart = getCart();
            
            if (cart[index].quantity < 10) {
                cart[index].quantity += 1;
                saveCart(cart);
            }
        });
    });
    
    // Кнопки уменьшения количества
    document.querySelectorAll('.quantity-btn.minus').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            const cart = getCart();
            
            if (cart[index].quantity > 1) {
                cart[index].quantity -= 1;
                saveCart(cart);
            }
        });
    });
    
    // Кнопки удаления
    document.querySelectorAll('.delete-btn').forEach(btn => {
        btn.addEventListener('click', function() {
            const index = parseInt(this.dataset.index);
            const cart = getCart();
            
            cart.splice(index, 1);
            saveCart(cart);
        });
    });
}

// Инициализация при загрузке страницы
document.addEventListener('DOMContentLoaded', function() {
    updateCartCount();
    loadCartItems();
    
    // Кнопка оформления заказа
    document.getElementById('checkout-btn').addEventListener('click', function() {
        const cart = getCart();
        if (cart.length === 0) {
            alert('Корзина пуста!');
            return;
        }
        
        alert('Заказ оформлен! Спасибо за покупку!');
        localStorage.removeItem('cart');
        updateCartCount();
        loadCartItems();
    });
    
    // Кнопка очистки корзины
    document.getElementById('clear-cart-btn').addEventListener('click', function() {
        if (confirm('Вы уверены, что хотите очистить корзину?')) {
            localStorage.removeItem('cart');
            updateCartCount();
            loadCartItems();
        }
    });
});