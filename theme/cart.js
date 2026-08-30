// Shopping Cart Management
class ShoppingCart {
  constructor() {
    this.items = JSON.parse(localStorage.getItem('cart')) || [];
    this.updateCartUI();
  }

  addItem(product, quantity = 1, color = null) {
    const item = {
      id: product.id,
      title: product.title,
      price: product.price,
      quantity: quantity,
      color: color,
      image: product.image || 'default.jpg',
      timestamp: new Date().getTime()
    };

    const existingItem = this.items.find(
      i => i.id === item.id && i.color === item.color
    );

    if (existingItem) {
      existingItem.quantity += quantity;
    } else {
      this.items.push(item);
    }

    this.save();
    this.updateCartUI();
    this.showNotification(`Added to cart: ${product.title}`);
  }

  removeItem(itemId) {
    this.items = this.items.filter(item => item.id !== itemId);
    this.save();
    this.updateCartUI();
  }

  updateQuantity(itemId, quantity) {
    const item = this.items.find(i => i.id === itemId);
    if (item) {
      item.quantity = Math.max(1, quantity);
      this.save();
      this.updateCartUI();
    }
  }

  getTotal() {
    return this.items.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  }

  getItemCount() {
    return this.items.reduce((count, item) => count + item.quantity, 0);
  }

  save() {
    localStorage.setItem('cart', JSON.stringify(this.items));
  }

  clear() {
    this.items = [];
    this.save();
    this.updateCartUI();
  }

  updateCartUI() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
      cartCount.textContent = this.getItemCount();
    }

    const cartTotal = document.getElementById('cart-total');
    if (cartTotal) {
      cartTotal.textContent = `€${this.getTotal().toFixed(2)}`;
    }
  }

  showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'cart-notification';
    notification.textContent = message;
    document.body.appendChild(notification);

    setTimeout(() => {
      notification.classList.add('show');
    }, 100);

    setTimeout(() => {
      notification.classList.remove('show');
      setTimeout(() => notification.remove(), 300);
    }, 3000);
  }

  renderCart() {
    const cartContainer = document.getElementById('cart-items');
    if (!cartContainer) return;

    if (this.items.length === 0) {
      cartContainer.innerHTML = '<p>Your cart is empty</p>';
      return;
    }

    cartContainer.innerHTML = this.items.map(item => `
      <div class="cart-item" data-id="${item.id}">
        <img src="${item.image}" alt="${item.title}" class="cart-item-image">
        <div class="cart-item-details">
          <h4>${item.title}</h4>
          <p class="cart-item-color">Color: ${item.color}</p>
          <p class="cart-item-price">€${item.price}</p>
        </div>
        <div class="cart-item-quantity">
          <button class="qty-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity - 1})">-</button>
          <input type="number" value="${item.quantity}" min="1" 
            onchange="cart.updateQuantity('${item.id}', this.value)">
          <button class="qty-btn" onclick="cart.updateQuantity('${item.id}', ${item.quantity + 1})">+</button>
        </div>
        <div class="cart-item-total">
          €${(item.price * item.quantity).toFixed(2)}
        </div>
        <button class="remove-btn" onclick="cart.removeItem('${item.id}')">Remove</button>
      </div>
    `).join('');
  }
}

// Initialize cart
let cart = new ShoppingCart();

// Add to cart function
function addToCart() {
  const selectedColor = document.querySelector('.color-btn.selected')?.dataset.color || 'Pink';
  const quantity = parseInt(document.getElementById('quantity')?.value) || 1;

  // Get product data from page
  const product = {
    id: 'pet-water-bottle-001',
    title: 'Botella de Agua Portátil para Perros y Gatos',
    price: 8.79,
    image: '/images/pet-water-bottle.jpg'
  };

  cart.addItem(product, quantity, selectedColor);
}

// Color selection
document.addEventListener('DOMContentLoaded', () => {
  const colorButtons = document.querySelectorAll('.color-btn');
  colorButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      colorButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
    });
  });
});

// Styles for cart notification
const style = document.createElement('style');
style.textContent = `
  .cart-notification {
    position: fixed;
    bottom: 20px;
    right: 20px;
    background: #28a745;
    color: white;
    padding: 1rem 1.5rem;
    border-radius: 4px;
    box-shadow: 0 2px 8px rgba(0, 0, 0, 0.2);
    opacity: 0;
    transform: translateY(20px);
    transition: all 0.3s ease;
    z-index: 1000;
  }

  .cart-notification.show {
    opacity: 1;
    transform: translateY(0);
  }

  .cart-item {
    display: grid;
    grid-template-columns: 80px 1fr 1fr 1fr 80px;
    gap: 1rem;
    padding: 1rem;
    border-bottom: 1px solid #eee;
    align-items: center;
  }

  .cart-item-image {
    width: 80px;
    height: 80px;
    object-fit: cover;
    border-radius: 4px;
  }

  .cart-item-quantity {
    display: flex;
    gap: 0.5rem;
    align-items: center;
  }

  .qty-btn {
    width: 30px;
    height: 30px;
    border: 1px solid #ddd;
    background: white;
    cursor: pointer;
    border-radius: 4px;
  }

  .cart-item-quantity input {
    width: 50px;
    text-align: center;
    border: 1px solid #ddd;
    border-radius: 4px;
    padding: 0.25rem;
  }

  .remove-btn {
    padding: 0.5rem 1rem;
    background: #dc3545;
    color: white;
    border: none;
    border-radius: 4px;
    cursor: pointer;
    font-size: 0.9rem;
  }

  .remove-btn:hover {
    background: #c82333;
  }

  .color-btn.selected {
    background: #007bff;
    color: white;
    border-color: #007bff;
  }
`;
document.head.appendChild(style);
