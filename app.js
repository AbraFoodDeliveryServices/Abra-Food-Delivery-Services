const menu = [
  {
    id: "classic-burger",
    name: "Classic Burger",
    category: "Bestseller",
    description: "Beef patty, cheddar, pickles, lettuce, and burger sauce.",
    price: 12.5,
  },
  {
    id: "chicken-wrap",
    name: "Chicken Wrap",
    category: "Healthy",
    description: "Crispy chicken, lettuce, tomato, and garlic sauce in a soft wrap.",
    price: 10.75,
  },
  {
    id: "margherita-pizza",
    name: "Margherita Pizza",
    category: "Popular",
    description: "Fresh mozzarella, basil, and tomato sauce on a thin crust.",
    price: 15.9,
  },
  {
    id: "pasta-deluxe",
    name: "Pasta Deluxe",
    category: "Chef pick",
    description: "Creamy garlic pasta with parmesan and herbs.",
    price: 14.2,
  },
  {
    id: "fries",
    name: "Loaded Fries",
    category: "Sides",
    description: "Crispy fries topped with cheese and chili flakes.",
    price: 7.95,
  },
  {
    id: "lemonade",
    name: "Fresh Lemonade",
    category: "Drinks",
    description: "House-made lemonade with a citrus twist.",
    price: 4.5,
  },
];

const storageKeys = {
  cart: "abra-food-cart",
  orders: "abra-food-orders",
};

let cart = JSON.parse(localStorage.getItem(storageKeys.cart) || "[]");
let orders = JSON.parse(localStorage.getItem(storageKeys.orders) || "[]");

const menuList = document.getElementById("menu-list");
const cartItems = document.getElementById("cart-items");
const cartCount = document.getElementById("cart-count");
const subtotalEl = document.getElementById("subtotal");
const deliveryEl = document.getElementById("delivery");
const totalEl = document.getElementById("total");
const ordersList = document.getElementById("orders-list");
const checkoutForm = document.getElementById("checkout-form");
const toast = document.getElementById("toast");

function saveCart() {
  localStorage.setItem(storageKeys.cart, JSON.stringify(cart));
}

function saveOrders() {
  localStorage.setItem(storageKeys.orders, JSON.stringify(orders));
}

function getMenuItem(itemId) {
  return menu.find((item) => item.id === itemId);
}

function getCartCount() {
  return cart.reduce((sum, item) => sum + item.quantity, 0);
}

function getCartSubtotal() {
  return cart.reduce((sum, item) => {
    const menuItem = getMenuItem(item.id);
    return sum + menuItem.price * item.quantity;
  }, 0);
}

function getDeliveryFee() {
  return cart.length ? 4 : 0;
}

function getCartTotal() {
  return getCartSubtotal() + getDeliveryFee();
}

function showToast(message) {
  toast.textContent = message;
  toast.classList.add("show");
  setTimeout(() => {
    toast.classList.remove("show");
  }, 1800);
}

function addToCart(itemId) {
  const existing = cart.find((item) => item.id === itemId);

  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({ id: itemId, quantity: 1 });
  }

  saveCart();
  renderCart();
  showToast("Added to cart");
}

function updateCartQuantity(itemId, delta) {
  const item = cart.find((product) => product.id === itemId);

  if (!item) return;

  item.quantity += delta;

  if (item.quantity <= 0) {
    cart = cart.filter((product) => product.id !== itemId);
  }

  saveCart();
  renderCart();
}

function renderMenu() {
  menuList.innerHTML = menu
    .map(
      (item) => `
        <article class="menu-item">
          <div class="menu-item-top">
            <span class="item-badge">${item.category}</span>
            <span class="item-price">$${item.price.toFixed(2)}</span>
          </div>
          <div>
            <h3 class="item-name">${item.name}</h3>
            <p class="item-desc">${item.description}</p>
          </div>
          <div class="item-footer">
            <span class="chip neutral">Fresh</span>
            <button class="primary-btn" data-add-item="${item.id}">Add</button>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("[data-add-item]").forEach((button) => {
    button.addEventListener("click", () => addToCart(button.dataset.addItem));
  });
}

function renderCart() {
  if (!cart.length) {
    cartItems.innerHTML = '<div class="empty-state">Your cart is empty.<br />Add a few dishes to get started.</div>';
  } else {
    cartItems.innerHTML = cart
      .map((entry) => {
        const item = getMenuItem(entry.id);
        return `
          <div class="cart-item">
            <div class="cart-meta">
              <h4>${item.name}</h4>
              <p>$${item.price.toFixed(2)} each</p>
            </div>
            <div class="cart-actions">
              <strong>$${(item.price * entry.quantity).toFixed(2)}</strong>
              <div class="qty-controls">
                <button class="qty-btn" data-update-qty="${item.id}" data-delta="-1">-</button>
                <span>${entry.quantity}</span>
                <button class="qty-btn" data-update-qty="${item.id}" data-delta="1">+</button>
              </div>
            </div>
          </div>
        `;
      })
      .join("");

    document.querySelectorAll("[data-update-qty]").forEach((button) => {
      button.addEventListener("click", () => {
        updateCartQuantity(button.dataset.updateQty, Number(button.dataset.delta));
      });
    });
  }

  cartCount.textContent = `${getCartCount()} item${getCartCount() !== 1 ? "s" : ""}`;
  subtotalEl.textContent = `$${getCartSubtotal().toFixed(2)}`;
  deliveryEl.textContent = `$${getDeliveryFee().toFixed(2)}`;
  totalEl.textContent = `$${getCartTotal().toFixed(2)}`;
}

function advanceOrderStatus(orderId) {
  const orderIndex = orders.findIndex((order) => order.id === orderId);
  if (orderIndex === -1) return;

  const statuses = ["Pending", "Preparing", "On the way", "Delivered"];
  const current = orders[orderIndex].status;
  const currentIndex = statuses.indexOf(current);
  const nextStatus = statuses[Math.min(currentIndex + 1, statuses.length - 1)];

  orders[orderIndex].status = nextStatus;
  saveOrders();
  renderOrders();
  showToast(`Order ${orderId} updated to ${nextStatus}`);
}

function renderOrders() {
  if (!orders.length) {
    ordersList.innerHTML = '<div class="empty-state">No orders yet. Your latest order will appear here.</div>';
    return;
  }

  ordersList.innerHTML = orders
    .map(
      (order) => `
        <article class="order-card">
          <div class="order-top">
            <span class="order-id">${order.id}</span>
            <span class="order-status">${order.status}</span>
          </div>
          <ul class="order-items">
            ${order.items
              .map(
                (item) =>
                  `<li>${item.name} x${item.quantity} — $${(item.price * item.quantity).toFixed(2)}</li>`
              )
              .join("")}
          </ul>
          <div class="order-footer">
            <strong>Total: $${order.total.toFixed(2)}</strong>
            <button class="status-btn" data-advance-order="${order.id}">Update status</button>
          </div>
        </article>
      `
    )
    .join("");

  document.querySelectorAll("[data-advance-order]").forEach((button) => {
    button.addEventListener("click", () => advanceOrderStatus(button.dataset.advanceOrder));
  });
}

checkoutForm.addEventListener("submit", (event) => {
  event.preventDefault();

  if (!cart.length) {
    showToast("Your cart is empty");
    return;
  }

  const formData = new FormData(checkoutForm);
  const customerName = formData.get("name").toString().trim();
  const customerPhone = formData.get("phone").toString().trim();
  const customerAddress = formData.get("address").toString().trim();
  const notes = formData.get("notes").toString().trim();

  const orderItems = cart.map((entry) => {
    const item = getMenuItem(entry.id);
    return {
      name: item.name,
      quantity: entry.quantity,
      price: item.price,
    };
  });

  const order = {
    id: `ORD-${Date.now().toString().slice(-6)}`,
    customerName,
    customerPhone,
    customerAddress,
    notes,
    status: "Pending",
    items: orderItems,
    total: getCartTotal(),
    createdAt: new Date().toISOString(),
  };

  orders.unshift(order);
  saveOrders();

  cart = [];
  saveCart();
  renderCart();
  renderOrders();
  checkoutForm.reset();
  showToast("Order placed successfully!");
});

const seedOrders = [
  {
    id: "ORD-1001",
    customerName: "Alicia",
    customerPhone: "555-0175",
    customerAddress: "46 Orchard Ave",
    notes: "Extra napkins",
    status: "Preparing",
    items: [
      { name: "Classic Burger", quantity: 2, price: 12.5 },
      { name: "Fresh Lemonade", quantity: 1, price: 4.5 },
    ],
    total: 29.5,
    createdAt: "2026-11-11T12:00:00Z",
  },
  {
    id: "ORD-1002",
    customerName: "Mason",
    customerPhone: "555-0199",
    customerAddress: "78 Sunset Road",
    notes: "No onions",
    status: "On the way",
    items: [
      { name: "Margherita Pizza", quantity: 1, price: 15.9 },
      { name: "Loaded Fries", quantity: 1, price: 7.95 },
    ],
    total: 27.85,
    createdAt: "2026-11-11T12:15:00Z",
  },
];

if (!orders.length) {
  orders = seedOrders;
  saveOrders();
}

renderMenu();
renderCart();
renderOrders();
