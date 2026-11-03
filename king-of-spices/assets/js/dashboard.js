/* ==========================================================
   King of Spices — Dashboards & Partner Hub Script
   ========================================================== */

document.addEventListener('DOMContentLoaded', () => {
  const pageType = document.body.dataset.page;
  if (pageType === 'dashboard-user' || pageType === 'my-orders') initUserDashboard();
  else if (pageType === 'dashboard-restaurant') initRestaurantDashboard();
  else if (pageType === 'dashboard-inventory') initInventoryDashboard();
  else if (pageType === 'partner-portal') initPartnerPortal();
});

function initPartnerPortal() {
  initRestaurantDashboard();
  initInventoryDashboard();

  const tabBtns = document.querySelectorAll('.portal-tab-btn');
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      tabBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const targetTab = btn.dataset.portalTab;
      document.querySelectorAll('.portal-tab-content').forEach(content => {
        if (content.id === 'portal-tab-' + targetTab) {
          content.style.display = 'block';
          content.classList.add('active');
        } else {
          content.style.display = 'none';
          content.classList.remove('active');
        }
      });
    });
  });
}

/* ---------------- Helper Utilities ---------------- */
function formatDate(isoStr) {
  if (!isoStr) return 'N/A';
  const d = new Date(isoStr);
  return d.toLocaleDateString('en-IN', {
    day: 'numeric', month: 'short', year: 'numeric',
    hour: '2-digit', minute: '2-digit'
  });
}

function getStatusBadgeClass(status) {
  switch ((status || '').toLowerCase()) {
    case 'pending': return 'badge-pending';
    case 'preparing': return 'badge-preparing';
    case 'out for delivery': return 'badge-delivery';
    case 'delivered': return 'badge-delivered';
    case 'cancelled': return 'badge-cancelled';
    default: return 'badge-pending';
  }
}

/* ==========================================================
   1. USER ORDER TRACKING & HISTORY
   ========================================================== */
function initUserDashboard() {
  renderUserProfile();
  renderUserOrders();

  const filterBtns = document.querySelectorAll('.order-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderUserOrders(btn.dataset.filter);
    });
  });

  window.addEventListener('storage', () => {
    renderUserProfile();
    renderUserOrders();
  });
}

function renderUserProfile() {
  const profileContainer = document.querySelector('#user-profile-widget');
  if (!profileContainer) return;

  const membership = window.getMembership ? window.getMembership() : { active: false };
  const orders = window.store.get('kos_orders', []);
  const totalSpent = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);

  profileContainer.innerHTML = `
    <div class="user-card-head">
      <div class="user-avatar"><i class="fa-solid fa-user-gear"></i></div>
      <div>
        <h3>Guest Customer</h3>
        <p><i class="fa-solid fa-phone"></i> ${window.store.get('kos_user_phone', 'Not provided')}</p>
        <p><i class="fa-solid fa-location-dot"></i> ${window.store.get('kos_user_address', 'No default address saved')}</p>
      </div>
    </div>
    <div class="user-stats-grid">
      <div class="ustat-item">
        <span class="lbl">Total Orders</span>
        <span class="val">${orders.length}</span>
      </div>
      <div class="ustat-item">
        <span class="lbl">Total Spent</span>
        <span class="val">₹${totalSpent.toFixed(0)}</span>
      </div>
      <div class="ustat-item">
        <span class="lbl">King's Club</span>
        <span class="val">${membership.active ? '<span style="color:var(--brand-dark);"><i class="fa-solid fa-crown"></i> Active Member</span>' : 'Standard Member'}</span>
      </div>
    </div>
  `;
}

function renderUserOrders(filter = 'all') {
  const container = document.querySelector('#user-orders-container');
  if (!container) return;

  let orders = window.store.get('kos_orders', []);

  if (filter === 'active') {
    orders = orders.filter(o => ['Pending', 'Preparing', 'Out for Delivery'].includes(o.status));
  } else if (filter === 'completed') {
    orders = orders.filter(o => o.status === 'Delivered');
  } else if (filter === 'cancelled') {
    orders = orders.filter(o => o.status === 'Cancelled');
  }

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="empty-dashboard-box">
        <i class="fa-solid fa-receipt" style="font-size:2.8rem;color:var(--brand);"></i>
        <h3>No orders found in this category</h3>
        <p>Hungry? Explore our delicious menu and place your order!</p>
        <a href="index.html#menu" class="btn-primary" style="display:inline-block;margin-top:14px;">Browse Menu</a>
      </div>`;
    return;
  }

  container.innerHTML = orders.map(o => {
    const isCompleted = o.status === 'Delivered';
    const isCancelled = o.status === 'Cancelled';
    const statusSteps = ['Pending', 'Preparing', 'Out for Delivery', 'Delivered'];
    const currentStepIdx = statusSteps.indexOf(o.status);

    return `
      <div class="order-history-card">
        <div class="order-card-header">
          <div>
            <span class="order-id">#${o.id}</span>
            <span class="order-time"><i class="fa-regular fa-clock"></i> ${formatDate(o.placedAt)}</span>
          </div>
          <span class="status-badge ${getStatusBadgeClass(o.status)}">${o.status || 'Pending'}</span>
        </div>

        ${!isCancelled ? `
          <div class="order-tracker-timeline">
            ${statusSteps.map((step, idx) => {
              const active = idx <= currentStepIdx;
              return `
                <div class="step-item ${active ? 'active' : ''}">
                  <div class="step-dot"><i class="fa-solid ${active ? 'fa-check' : 'fa-circle'}"></i></div>
                  <div class="step-name">${step}</div>
                </div>`;
            }).join('')}
          </div>` : ''}

        <div class="order-delivery-box">
          <div class="del-row">
            <span class="lbl"><i class="fa-solid fa-location-dot"></i> Mandatory Address:</span>
            <span class="val">${o.address || 'Address not recorded'} ${o.landmark ? `(Landmark: ${o.landmark})` : ''}</span>
          </div>
          <div class="del-row">
            <span class="lbl"><i class="fa-solid fa-phone"></i> Contact Phone:</span>
            <span class="val">${o.phone || 'N/A'}</span>
          </div>
          <div class="del-row">
            <span class="lbl"><i class="fa-solid fa-truck-fast"></i> Mode & ETA:</span>
            <span class="val">${o.deliveryMethod === 'express' ? 'Express Delivery (15-20 mins)' : 'Standard Delivery (35-45 mins)'}</span>
          </div>
        </div>

        <div class="order-items-table">
          <h4><i class="fa-solid fa-utensils"></i> Ordered Items (${o.items ? o.items.length : 0})</h4>
          <div class="item-lines">
            ${(o.items || []).map(item => `
              <div class="item-line">
                <span class="iname">${item.name}</span>
                <span class="iqty">× ${item.qty}</span>
                <span class="iprice">₹${(item.price * item.qty).toFixed(0)}</span>
              </div>`).join('')}
          </div>
        </div>

        <div class="order-summary-breakdown">
          <div class="srow"><span>Subtotal:</span><span>₹${(o.subtotal || 0).toFixed(0)}</span></div>
          ${(o.discount || 0) > 0 ? `<div class="srow disc"><span>Discount:</span><span>−₹${o.discount.toFixed(0)}</span></div>` : ''}
          <div class="srow"><span>GST Tax (5%):</span><span>₹${(o.tax || 0).toFixed(0)}</span></div>
          <div class="srow"><span>Delivery Fee:</span><span>${o.delivery === 0 ? 'FREE' : '₹' + (o.delivery || 0).toFixed(0)}</span></div>
          <div class="srow grand-total"><span>Total Paid:</span><span>₹${(o.total || 0).toFixed(0)}</span></div>
        </div>

        <div class="order-card-actions">
          <button class="btn-ghost btn-sm btn-reorder" onclick="reorderItems('${o.id}')"><i class="fa-solid fa-rotate-right"></i> Reorder Items</button>
        </div>
      </div>`;
  }).join('');
}

window.reorderItems = function(orderId) {
  const orders = window.store.get('kos_orders', []);
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  const inv = window.getInventory();
  const cart = window.store.get('kos_cart', []);

  order.items.forEach(item => {
    const stockItem = inv[item.id];
    if (stockItem && stockItem.available && stockItem.stock > 0) {
      const existing = cart.find(c => c.id === item.id);
      if (existing) {
        existing.qty = Math.min(stockItem.stock, existing.qty + item.qty);
      } else {
        cart.push({ id: item.id, name: item.name, price: item.price, qty: Math.min(stockItem.stock, item.qty) });
      }
    }
  });

  window.store.set('kos_cart', cart);
  if (window.toast) window.toast('Items added to cart!');
  if (window.openCartDrawer) window.openCartDrawer();
};

/* ==========================================================
   2. RESTAURANT KITCHEN DISPATCH QUEUE
   ========================================================== */
function initRestaurantDashboard() {
  renderRestaurantStats();
  renderRestaurantQueue();

  const filterBtns = document.querySelectorAll('.rest-filter-btn');
  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderRestaurantQueue(btn.dataset.filter);
    });
  });

  window.addEventListener('storage', () => {
    renderRestaurantStats();
    renderRestaurantQueue();
  });
  window.addEventListener('kos_inventory_updated', renderRestaurantStats);
}

function renderRestaurantStats() {
  const container = document.querySelector('#restaurant-stats-grid');
  if (!container) return;

  const orders = window.store.get('kos_orders', []);
  const totalRevenue = orders.reduce((sum, o) => sum + (o.status !== 'Cancelled' ? o.total : 0), 0);
  const pendingOrders = orders.filter(o => o.status === 'Pending').length;
  const activeOrders = orders.filter(o => ['Pending', 'Preparing', 'Out for Delivery'].includes(o.status)).length;
  const completedOrders = orders.filter(o => o.status === 'Delivered').length;

  container.innerHTML = `
    <div class="rstat-card">
      <div class="rstat-icon rev"><i class="fa-solid fa-indian-rupee-sign"></i></div>
      <div class="rstat-info">
        <span class="lbl">Total Revenue</span>
        <span class="val">₹${totalRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}</span>
      </div>
    </div>
    <div class="rstat-card">
      <div class="rstat-icon active"><i class="fa-solid fa-fire-burner"></i></div>
      <div class="rstat-info">
        <span class="lbl">Active Kitchen Queue</span>
        <span class="val">${activeOrders}</span>
      </div>
    </div>
    <div class="rstat-card">
      <div class="rstat-icon pending"><i class="fa-solid fa-bell"></i></div>
      <div class="rstat-info">
        <span class="lbl">New Pending Orders</span>
        <span class="val">${pendingOrders}</span>
      </div>
    </div>
    <div class="rstat-card">
      <div class="rstat-icon comp"><i class="fa-solid fa-circle-check"></i></div>
      <div class="rstat-info">
        <span class="lbl">Delivered Orders</span>
        <span class="val">${completedOrders}</span>
      </div>
    </div>
  `;
}

function renderRestaurantQueue(filter = 'active') {
  const container = document.querySelector('#restaurant-queue-container');
  if (!container) return;

  let orders = window.store.get('kos_orders', []);

  if (filter === 'active') {
    orders = orders.filter(o => ['Pending', 'Preparing', 'Out for Delivery'].includes(o.status));
  } else if (filter === 'pending') {
    orders = orders.filter(o => o.status === 'Pending');
  } else if (filter === 'delivered') {
    orders = orders.filter(o => o.status === 'Delivered');
  } else if (filter === 'cancelled') {
    orders = orders.filter(o => o.status === 'Cancelled');
  }

  if (orders.length === 0) {
    container.innerHTML = `
      <div class="empty-dashboard-box">
        <i class="fa-solid fa-utensils" style="font-size:2.8rem;color:var(--brand);"></i>
        <h3>No orders found in queue (${filter})</h3>
        <p>New incoming customer orders will appear here automatically.</p>
      </div>`;
    return;
  }

  container.innerHTML = orders.map(o => `
    <div class="rest-order-card">
      <div class="rest-order-head">
        <div>
          <span class="order-id">Order #${o.id}</span>
          <span class="order-time"><i class="fa-regular fa-clock"></i> Placed: ${formatDate(o.placedAt)}</span>
        </div>
        <div class="rest-status-control">
          <span class="lbl-status">Current Status:</span>
          <select class="status-select" onchange="updateOrderStatus('${o.id}', this.value)">
            <option value="Pending" ${o.status === 'Pending' ? 'selected' : ''}>⏳ Pending</option>
            <option value="Preparing" ${o.status === 'Preparing' ? 'selected' : ''}>👨‍🍳 Preparing</option>
            <option value="Out for Delivery" ${o.status === 'Out for Delivery' ? 'selected' : ''}>🛵 Out for Delivery</option>
            <option value="Delivered" ${o.status === 'Delivered' ? 'selected' : ''}>✅ Delivered</option>
            <option value="Cancelled" ${o.status === 'Cancelled' ? 'selected' : ''}>❌ Cancelled</option>
          </select>
        </div>
      </div>

      <div class="rest-customer-details">
        <div class="cust-info-box">
          <div class="del-row">
            <span class="lbl"><i class="fa-solid fa-location-dot" style="color:var(--nonveg);"></i> Mandatory Address:</span>
            <span class="val highlight">${o.address || 'Address missing'} ${o.landmark ? `(Landmark: ${o.landmark})` : ''}</span>
          </div>
          <div class="del-row">
            <span class="lbl"><i class="fa-solid fa-phone"></i> Customer Contact:</span>
            <span class="val">${o.phone || 'N/A'}</span>
          </div>
          <div class="del-row">
            <span class="lbl"><i class="fa-solid fa-truck"></i> Delivery Speed:</span>
            <span class="val">${o.deliveryMethod === 'express' ? '⚡ Express (15-20 min)' : '🚚 Standard (35-45 min)'}</span>
          </div>
        </div>
      </div>

      <div class="rest-items-summary">
        <h4><i class="fa-solid fa-list-check"></i> Kitchen Item Dispatch List</h4>
        <ul class="rest-item-list">
          ${(o.items || []).map(item => `
            <li>
              <span class="qty-pill">${item.qty}x</span>
              <span class="name">${item.name}</span>
              <span class="price">₹${(item.price * item.qty).toFixed(0)}</span>
            </li>`).join('')}
        </ul>
      </div>

      <div class="rest-card-foot">
        <span class="total-tag">Total Bill: <strong>₹${(o.total || 0).toFixed(0)}</strong> (${(o.items || []).reduce((s,i)=>s+i.qty,0)} items)</span>
        <div class="quick-status-btns">
          ${o.status === 'Pending' ? `<button class="btn-sm btn-prep" onclick="updateOrderStatus('${o.id}', 'Preparing')">Start Cooking</button>` : ''}
          ${o.status === 'Preparing' ? `<button class="btn-sm btn-out" onclick="updateOrderStatus('${o.id}', 'Out for Delivery')">Send for Delivery</button>` : ''}
          ${o.status === 'Out for Delivery' ? `<button class="btn-sm btn-done" onclick="updateOrderStatus('${o.id}', 'Delivered')">Mark Delivered</button>` : ''}
        </div>
      </div>
    </div>
  `).join('');
}

window.updateOrderStatus = function(orderId, newStatus) {
  const orders = window.store.get('kos_orders', []);
  const order = orders.find(o => o.id === orderId);
  if (!order) return;

  order.status = newStatus;
  window.store.set('kos_orders', orders);

  if (window.toast) window.toast(`Order #${orderId} status updated to: ${newStatus}`);
  renderRestaurantStats();
  const activeFilter = document.querySelector('.rest-filter-btn.active')?.dataset.filter || 'active';
  renderRestaurantQueue(activeFilter);
};

/* ==========================================================
   3. STOCK & INVENTORY MANAGER
   ========================================================== */
function initInventoryDashboard() {
  renderInventoryStats();
  renderInventoryTable();

  const searchInput = document.querySelector('#inv-search');
  if (searchInput) {
    searchInput.addEventListener('input', () => {
      renderInventoryTable(searchInput.value.trim().toLowerCase());
    });
  }

  const addDishForm = document.querySelector('#add-dish-form');
  if (addDishForm) {
    addDishForm.addEventListener('submit', e => {
      e.preventDefault();
      addNewDishFromForm(addDishForm);
    });
  }

  window.addEventListener('storage', () => {
    renderInventoryStats();
    renderInventoryTable();
  });
  window.addEventListener('kos_inventory_updated', () => {
    renderInventoryStats();
    renderInventoryTable();
  });
}

function renderInventoryStats() {
  const container = document.querySelector('#inventory-stats-grid');
  if (!container) return;

  const inv = window.getInventory();
  const items = Object.values(inv);
  const totalCount = items.length;
  const inStock = items.filter(i => i.available && i.stock > 5).length;
  const lowStock = items.filter(i => i.available && i.stock > 0 && i.stock <= 5).length;
  const outOfStock = items.filter(i => !i.available || i.stock <= 0).length;

  container.innerHTML = `
    <div class="istat-card">
      <div class="istat-icon total"><i class="fa-solid fa-boxes-stacked"></i></div>
      <div class="istat-info">
        <span class="lbl">Total Dishes</span>
        <span class="val">${totalCount}</span>
      </div>
    </div>
    <div class="istat-card">
      <div class="istat-icon instock"><i class="fa-solid fa-circle-check"></i></div>
      <div class="istat-info">
        <span class="lbl">In Stock (>5)</span>
        <span class="val">${inStock}</span>
      </div>
    </div>
    <div class="istat-card">
      <div class="istat-icon lowstock"><i class="fa-solid fa-triangle-exclamation"></i></div>
      <div class="istat-info">
        <span class="lbl">Low Stock (1-5)</span>
        <span class="val">${lowStock}</span>
      </div>
    </div>
    <div class="istat-card">
      <div class="istat-icon outstock"><i class="fa-solid fa-circle-xmark"></i></div>
      <div class="istat-info">
        <span class="lbl">Out of Stock</span>
        <span class="val">${outOfStock}</span>
      </div>
    </div>
  `;
}

function renderInventoryTable(searchQuery = '') {
  const container = document.querySelector('#inventory-items-container');
  if (!container) return;

  const inv = window.getInventory();
  let entries = Object.entries(inv);

  if (searchQuery) {
    entries = entries.filter(([id, item]) => 
      item.name.toLowerCase().includes(searchQuery) ||
      (item.category || '').toLowerCase().includes(searchQuery) ||
      id.includes(searchQuery)
    );
  }

  if (entries.length === 0) {
    container.innerHTML = `
      <div class="empty-dashboard-box">
        <i class="fa-solid fa-box-open" style="font-size:2.8rem;color:var(--brand);"></i>
        <h3>No matching items found</h3>
        <p>Try adjusting your search query or add a new menu dish.</p>
      </div>`;
    return;
  }

  container.innerHTML = `
    <table class="inventory-table">
      <thead>
        <tr>
          <th>Dish</th>
          <th>Category</th>
          <th>Price</th>
          <th>Remaining Items</th>
          <th>Stock Status</th>
          <th>Quick Adjust</th>
          <th>Availability</th>
        </tr>
      </thead>
      <tbody>
        ${entries.map(([id, item]) => {
          let statusTag = '';
          if (!item.available || item.stock <= 0) {
            statusTag = '<span class="istatus-pill out">Out of Stock</span>';
          } else if (item.stock <= 5) {
            statusTag = '<span class="istatus-pill low">Low Stock (' + item.stock + ')</span>';
          } else {
            statusTag = '<span class="istatus-pill in">In Stock</span>';
          }

          return `
            <tr>
              <td>
                <div class="inv-dish-cell">
                  <img src="${item.img || 'https://alkaison.github.io/King-of-Spices/assets/images/about-banner.png'}" alt="${item.name}">
                  <div>
                    <strong>${item.name}</strong>
                    <div class="dish-id">ID: ${id}</div>
                  </div>
                </div>
              </td>
              <td><span class="cat-pill">${item.category || 'General'}</span></td>
              <td><strong>₹${item.price}</strong></td>
              <td>
                <div class="stock-count-cell">
                  <span class="count-num">${item.stock}</span> units
                </div>
              </td>
              <td>${statusTag}</td>
              <td>
                <div class="stock-adjust-btns">
                  <button class="btn-qty-adj" onclick="adjustItemStock('${id}', -5)">-5</button>
                  <button class="btn-qty-adj" onclick="adjustItemStock('${id}', -1)">-1</button>
                  <button class="btn-qty-adj" onclick="adjustItemStock('${id}', 1)">+1</button>
                  <button class="btn-qty-adj" onclick="adjustItemStock('${id}', 5)">+5</button>
                  <button class="btn-qty-set" onclick="promptSetStock('${id}')">Set</button>
                </div>
              </td>
              <td>
                <label class="toggle-switch">
                  <input type="checkbox" ${item.available && item.stock > 0 ? 'checked' : ''} onchange="toggleItemAvailability('${id}', this.checked)">
                  <span class="toggle-slider"></span>
                </label>
              </td>
            </tr>`;
        }).join('')}
      </tbody>
    </table>
  `;
}

window.adjustItemStock = function(id, delta) {
  const inv = window.getInventory();
  if (!inv[id]) return;

  inv[id].stock = Math.max(0, inv[id].stock + delta);
  if (inv[id].stock > 0) inv[id].available = true;
  else inv[id].available = false;

  window.saveInventory(inv);
  if (window.toast) window.toast(`Updated ${inv[id].name} stock to ${inv[id].stock}`);
};

window.promptSetStock = function(id) {
  const inv = window.getInventory();
  if (!inv[id]) return;

  const input = prompt(`Enter exact stock count for ${inv[id].name}:`, inv[id].stock);
  if (input !== null) {
    const val = parseInt(input, 10);
    if (!isNaN(val) && val >= 0) {
      inv[id].stock = val;
      inv[id].available = val > 0;
      window.saveInventory(inv);
      if (window.toast) window.toast(`Set ${inv[id].name} stock to ${val}`);
    } else {
      alert('Please enter a valid non-negative number.');
    }
  }
};

window.toggleItemAvailability = function(id, isChecked) {
  const inv = window.getInventory();
  if (!inv[id]) return;

  inv[id].available = isChecked;
  if (isChecked && inv[id].stock === 0) inv[id].stock = 10;
  window.saveInventory(inv);
  if (window.toast) window.toast(`${inv[id].name} is now ${isChecked ? 'AVAILABLE' : 'OUT OF STOCK'}`);
};

function addNewDishFromForm(form) {
  const name = form.querySelector('#dish-name').value.trim();
  const category = form.querySelector('#dish-category').value.trim();
  const price = parseFloat(form.querySelector('#dish-price').value);
  const stock = parseInt(form.querySelector('#dish-stock').value, 10);
  const img = form.querySelector('#dish-img').value.trim() || 'https://alkaison.github.io/King-of-Spices/assets/images/about-banner.png';

  if (!name || isNaN(price) || isNaN(stock)) {
    alert('Please enter valid dish details!');
    return;
  }

  const id = name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const inv = window.getInventory();

  if (inv[id]) {
    alert('A dish with this name already exists. Choose a different name to avoid replacing existing inventory.');
    return;
  }

  inv[id] = {
    name,
    category: category || 'General',
    price,
    stock,
    available: stock > 0,
    img
  };

  window.saveInventory(inv);
  if (window.toast) window.toast(`Added new dish: ${name}`);
  form.reset();
  renderInventoryStats();
  renderInventoryTable();
}
