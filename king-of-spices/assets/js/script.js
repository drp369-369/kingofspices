/* ==========================================================
   King of Spices — Core Script
   Handles: Nav toggle, Authentication & Roles (Customer / Restaurant Staff),
   Cart Drawer, Mandatory Delivery address validation, Inventory tracking,
   Membership discounts, and Order History using localStorage.
   ========================================================== */

/* ---------------- Constants & Defaults ---------------- */
const DELIVERY_FEES = { standard: 40, express: 80 };
const TAX_RATE = 0.05; // 5% GST
const FREE_DELIVERY_THRESHOLD = 499;
const MEMBER_DISCOUNT_RATE = 0.10;
const COUPONS = {
  WELCOME10: { type: 'percent', value: 10, label: '10% off' },
  KING50:    { type: 'flat',    value: 50, label: '₹50 off' }
};

const DEFAULT_INVENTORY = {
  'chicken-lolipop': { name: 'Chicken Lolipop (6 pcs)', price: 299, stock: 15, available: true, category: 'Non-Veg', img: 'https://alkaison.github.io/King-of-Spices/assets/images/food-menu-3.png' },
  'happy-meal-combo': { name: 'Happy Meal Combo', price: 149, stock: 20, available: true, category: 'Combo', img: 'https://alkaison.github.io/King-of-Spices/assets/images/about-banner.png' },
  'veg-thali': { name: 'Veg Thali (36 Items)', price: 399, stock: 10, available: true, category: 'Veg', img: 'https://alkaison.github.io/King-of-Spices/assets/images/R.png' },
  'nonveg-thali': { name: 'Non-Veg Thali', price: 499, stock: 8, available: true, category: 'Non-Veg', img: 'https://alkaison.github.io/King-of-Spices/assets/images/chickenthali.png' },
  'veg-pizza': { name: 'Veg Pizza', price: 199, stock: 25, available: true, category: 'Veg', img: 'https://alkaison.github.io/King-of-Spices/assets/images/Veg_pizza.png' },
  'roasted-chicken-pizza': { name: 'Roasted Chicken Pizza', price: 249, stock: 12, available: true, category: 'Non-Veg', img: 'https://alkaison.github.io/King-of-Spices/assets/images/chicken_pizza.png' },
  'pav-bhaji': { name: 'Pav Bhaji', price: 199, stock: 18, available: true, category: 'Veg', img: 'https://alkaison.github.io/King-of-Spices/assets/images/Pav-Bhaji500.png' },
  'chinese-noodles': { name: 'Chinese Noodles', price: 249, stock: 22, available: true, category: 'Veg', img: 'https://alkaison.github.io/King-of-Spices/assets/images/chinese_noodles.png' },
  'king-size-maggie': { name: 'King Size Maggie', price: 299, stock: 14, available: true, category: 'Snacks', img: 'https://alkaison.github.io/King-of-Spices/assets/images/king_size_maggie.png' },
  'dabeli': { name: '3x Dabeli', price: 199, stock: 16, available: true, category: 'Snacks', img: 'https://alkaison.github.io/King-of-Spices/assets/images/dabeli.png' },
  'vada-pav': { name: '4x Vada Pav', price: 199, stock: 30, available: true, category: 'Snacks', img: 'https://alkaison.github.io/King-of-Spices/assets/images/Vada_Pav%20_PNG_PSD.png' },
  'paper-dosa': { name: 'Paper Dosa', price: 199, stock: 15, available: true, category: 'South Indian', img: 'https://alkaison.github.io/King-of-Spices/assets/images/dosa-delhi-500x500.png' }
};

/* ---------------- Storage Helpers ---------------- */
const store = {
  get(key, fallback) {
    try { const v = JSON.parse(localStorage.getItem(key)); return v === null ? fallback : v; }
    catch (e) { return fallback; }
  },
  set(key, val) { localStorage.setItem(key, JSON.stringify(val)); }
};

/* ---------------- Authentication & Roles ---------------- */
function getAuth() {
  return store.get('kos_auth', {
    loggedIn: false,
    role: 'customer', // 'customer' or 'restaurant'
    name: '',
    email: '',
    phone: '',
    address: ''
  });
}

function saveAuth(authData) {
  store.set('kos_auth', authData);
  if (authData.address) store.set('kos_user_address', authData.address);
  if (authData.phone) store.set('kos_user_phone', authData.phone);
  renderAuthNav();
  window.dispatchEvent(new Event('kos_auth_changed'));
}

function logout() {
  store.set('kos_auth', { loggedIn: false, role: 'customer', name: '', email: '', phone: '', address: '' });
  toast('Logged out successfully.');
  renderAuthNav();
  window.dispatchEvent(new Event('kos_auth_changed'));
  setTimeout(() => location.reload(), 400);
}

function getCart() { return store.get('kos_cart', []); }
function saveCart(cart) { store.set('kos_cart', cart); renderCartCount(); }

function getMembership() { return store.get('kos_membership', { active: false, plan: 'Free', joinDate: null }); }
function isMember() { return !!getMembership().active; }

function getInventory() {
  let inv = store.get('kos_inventory', null);
  if (!inv) {
    inv = DEFAULT_INVENTORY;
    store.set('kos_inventory', inv);
  }
  return inv;
}

function saveInventory(inv) {
  store.set('kos_inventory', inv);
  window.dispatchEvent(new Event('kos_inventory_updated'));
}

let appliedCoupon = store.get('kos_coupon', null);
let deliveryMethod = store.get('kos_delivery', 'standard');

/* ---------------- Toast Notification ---------------- */
function toast(msg) {
  let t = document.querySelector('.toast');
  if (!t) {
    t = document.createElement('div');
    t.className = 'toast';
    document.body.appendChild(t);
  }
  t.textContent = msg;
  t.classList.add('show');
  clearTimeout(t._timer);
  t._timer = setTimeout(() => t.classList.remove('show'), 2800);
}

/* ---------------- Nav & Auth Initialization ---------------- */
function initNav() {
  const openBtn = document.querySelector('.openMenu');
  const closeBtn = document.querySelector('.closeMenu');
  const navUl = document.querySelector('.nav-ul');
  if (openBtn && navUl) openBtn.addEventListener('click', () => navUl.classList.add('open'));
  if (closeBtn && navUl) closeBtn.addEventListener('click', () => navUl.classList.remove('open'));

  // Mark active page link
  const path = location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-ul a[href]').forEach(a => {
    const href = a.getAttribute('href').split('#')[0];
    if (href && href === path) a.classList.add('active');
  });

  renderMemberPill();
  renderCartCount();
  renderAuthNav();
}

function renderMemberPill() {
  document.querySelectorAll('.member-pill').forEach(p => {
    p.classList.toggle('show', isMember());
  });
}

function renderCartCount() {
  const count = getCart().reduce((s, i) => s + i.qty, 0);
  document.querySelectorAll('.cart-count').forEach(el => el.textContent = count);
}

function renderAuthNav() {
  const auth = getAuth();
  const navUl = document.querySelector('.nav-ul');
  if (!navUl) return;

  let authItem = navUl.querySelector('.nav-auth-item');
  if (!authItem) {
    authItem = document.createElement('li');
    authItem.className = 'nav-auth-item';
    const closeBtn = navUl.querySelector('.closeMenu')?.parentNode;
    if (closeBtn) navUl.insertBefore(authItem, closeBtn);
    else navUl.appendChild(authItem);
  }

  if (auth.loggedIn) {
    const isRest = auth.role === 'restaurant';
    authItem.innerHTML = `
      <div class="user-auth-pill ${isRest ? 'rest' : 'cust'}">
        <i class="fa-solid ${isRest ? 'fa-user-ninja' : 'fa-circle-user'}"></i>
        <span class="uname">${auth.name || 'Logged In'}</span>
        <span class="role-badge ${isRest ? 'rest' : 'cust'}">${isRest ? 'Kitchen Staff' : 'Customer'}</span>
        <button type="button" class="btn-auth-logout" onclick="logout()" title="Logout"><i class="fa-solid fa-power-off"></i></button>
      </div>`;
  } else {
    authItem.innerHTML = `
      <button type="button" class="btn-auth-login js-open-auth"><i class="fa-solid fa-right-to-bracket"></i> Login / Register</button>`;
    authItem.querySelector('.js-open-auth').addEventListener('click', showAuthModal);
  }

  document.querySelectorAll('.js-open-auth').forEach(btn => {
    btn.removeEventListener('click', showAuthModal);
    btn.addEventListener('click', showAuthModal);
  });
}

/* ---------------- Auth Modal (Login / Register) ---------------- */
function showAuthModal() {
  let modal = document.querySelector('.auth-modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal auth-modal';
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });
  }

  const auth = getAuth();

  modal.innerHTML = `
    <div class="modal-card auth-modal-card">
      <button class="modal-close-x" onclick="document.querySelector('.auth-modal').classList.remove('show')">&times;</button>
      <div class="auth-tabs">
        <button class="auth-tab-btn active" data-authtab="customer"><i class="fa-solid fa-user"></i> Customer Login / Signup</button>
        <button class="auth-tab-btn" data-authtab="restaurant"><i class="fa-solid fa-store"></i> Restaurant Staff Portal</button>
      </div>

      <!-- Customer Form -->
      <form id="auth-form-customer" class="auth-form-content active">
        <h3><i class="fa-solid fa-utensils" style="color:var(--brand-dark);"></i> Customer Login</h3>
        <p class="auth-subtitle">Log in to save delivery addresses and track active food orders.</p>
        <div class="form-group">
          <label>Full Name *</label>
          <input type="text" id="ac-name" placeholder="e.g. Rahul Sharma" value="${auth.name || ''}" required>
        </div>
        <div class="form-group">
          <label>Email Address</label>
          <input type="email" id="ac-email" placeholder="e.g. rahul@example.com" value="${auth.email || ''}">
        </div>
        <div class="form-group">
          <label>Phone Number (Mandatory for orders) *</label>
          <input type="tel" id="ac-phone" placeholder="10-digit mobile number" value="${auth.phone || store.get('kos_user_phone','')}" required>
        </div>
        <div class="form-group">
          <label>Default Delivery Address *</label>
          <textarea id="ac-address" rows="2" placeholder="Complete street address, door/flat no." required>${auth.address || store.get('kos_user_address','')}</textarea>
        </div>
        <button type="submit" class="btn-primary btn-block" style="margin-top:12px;">Login as Customer</button>
      </form>

      <!-- Restaurant Staff Form -->
      <form id="auth-form-restaurant" class="auth-form-content" style="display:none;">
        <div class="staff-alert-banner">
          <i class="fa-solid fa-shield-halved"></i> Restricted Merchant & Kitchen Access
        </div>
        <h3><i class="fa-solid fa-store" style="color:var(--brand-dark);"></i> Restaurant Staff Login</h3>
        <p class="auth-subtitle">Access the live kitchen order queue, update dispatch status, and manage dish inventory.</p>
        <div class="form-group">
          <label>Staff / Kitchen ID *</label>
          <input type="text" id="ar-staffid" placeholder="e.g. CHEF-01 or ADMIN" value="KITCHEN-ADMIN" required>
        </div>
        <div class="form-group">
          <label>Staff Passcode / PIN *</label>
          <input type="password" id="ar-pin" placeholder="Enter staff PIN (Demo: 1234)" value="1234" required>
        </div>
        <button type="submit" class="btn-primary btn-block" style="margin-top:12px;">Login as Kitchen Staff</button>
        <p style="font-size:0.78rem;color:var(--muted);margin-top:10px;text-align:center;">Demo Passcode: <strong>1234</strong> or click button above.</p>
      </form>
    </div>
  `;

  // Tab switcher
  const tabs = modal.querySelectorAll('.auth-tab-btn');
  tabs.forEach(t => {
    t.addEventListener('click', () => {
      tabs.forEach(x => x.classList.remove('active'));
      t.classList.add('active');
      const target = t.dataset.authtab;
      modal.querySelectorAll('.auth-form-content').forEach(f => {
        if (f.id === 'auth-form-' + target) {
          f.style.display = 'block';
          f.classList.add('active');
        } else {
          f.style.display = 'none';
          f.classList.remove('active');
        }
      });
    });
  });

  // Customer submit
  modal.querySelector('#auth-form-customer').addEventListener('submit', e => {
    e.preventDefault();
    const name = modal.querySelector('#ac-name').value.trim();
    const email = modal.querySelector('#ac-email').value.trim();
    const phone = modal.querySelector('#ac-phone').value.trim();
    const address = modal.querySelector('#ac-address').value.trim();

    saveAuth({ loggedIn: true, role: 'customer', name, email, phone, address });
    toast(`Welcome back, ${name}! Logged in as Customer.`);
    modal.classList.remove('show');
    if (window.renderCart) renderCart();
  });

  // Restaurant submit
  modal.querySelector('#auth-form-restaurant').addEventListener('submit', e => {
    e.preventDefault();
    const staffid = modal.querySelector('#ar-staffid').value.trim();
    saveAuth({ loggedIn: true, role: 'restaurant', name: `Kitchen Admin (${staffid})`, email: '', phone: '', address: '' });
    toast(`Logged in to Partner Kitchen Portal!`);
    modal.classList.remove('show');
    if (location.pathname.includes('partner-portal.html')) {
      location.reload();
    } else {
      location.href = 'partner-portal.html';
    }
  });

  modal.classList.add('show');
}

/* ---------------- Menu Item Actions & Stock Badges ---------------- */
function initMenuButtons() {
  const inv = getInventory();

  document.querySelectorAll('.Items[data-id]').forEach(card => {
    const id = card.dataset.id;
    const name = card.dataset.name;
    const price = parseFloat(card.dataset.price);
    const btn = card.querySelector('.btn-add');
    const stepper = card.querySelector('.qty-stepper');
    const qtyLabel = stepper ? stepper.querySelector('.qty-val') : null;

    if (!inv[id]) {
      inv[id] = { name, price, stock: 15, available: true, category: 'General', img: card.querySelector('.dishpic')?.src || '' };
      saveInventory(inv);
    }

    const itemData = inv[id];

    let badge = card.querySelector('.stock-badge');
    if (!badge) {
      badge = document.createElement('div');
      badge.className = 'stock-badge';
      card.insertBefore(badge, card.querySelector('.Dish'));
    }

    if (!itemData.available || itemData.stock <= 0) {
      badge.className = 'stock-badge out';
      badge.innerHTML = '<i class="fa-solid fa-ban"></i> Out of Stock';
      if (btn) { btn.disabled = true; btn.textContent = 'Out of Stock'; btn.style.display = ''; }
      if (stepper) stepper.classList.remove('show');
      return;
    } else if (itemData.stock <= 5) {
      badge.className = 'stock-badge low';
      badge.innerHTML = `<i class="fa-solid fa-fire"></i> Only ${itemData.stock} left!`;
      if (btn) { btn.disabled = false; btn.textContent = 'Add to Cart'; }
    } else {
      badge.className = 'stock-badge in';
      badge.innerHTML = `<i class="fa-solid fa-box-archive"></i> ${itemData.stock} in stock`;
      if (btn) { btn.disabled = false; btn.textContent = 'Add to Cart'; }
    }

    function refresh() {
      const currentInv = getInventory()[id] || itemData;
      const cart = getCart();
      const line = cart.find(i => i.id === id);

      if (line && line.qty > 0) {
        if (btn) btn.style.display = 'none';
        if (stepper) {
          stepper.classList.add('show');
          if (qtyLabel) qtyLabel.textContent = line.qty;
        }
      } else {
        if (btn && currentInv.stock > 0 && currentInv.available) btn.style.display = '';
        if (stepper) stepper.classList.remove('show');
      }
    }

    if (btn && (!btn._hasListener)) {
      btn._hasListener = true;
      btn.addEventListener('click', () => {
        const currentInv = getInventory()[id];
        if (!currentInv || !currentInv.available || currentInv.stock <= 0) {
          toast('Sorry, ' + name + ' is currently out of stock!');
          return;
        }

        const cart = getCart();
        const line = cart.find(i => i.id === id);
        const currentQty = line ? line.qty : 0;

        if (currentQty + 1 > currentInv.stock) {
          toast(`Stock limit reached! Only ${currentInv.stock} available.`);
          return;
        }

        if (line) line.qty += 1;
        else cart.push({ id, name, price, qty: 1 });

        saveCart(cart);
        toast(name + ' added to cart');
        refresh();
      });
    }

    if (stepper && (!stepper._hasListener)) {
      stepper._hasListener = true;
      stepper.querySelector('.qty-plus').addEventListener('click', () => {
        const currentInv = getInventory()[id];
        const cart = getCart();
        const line = cart.find(i => i.id === id);
        if (line) {
          if (line.qty + 1 > currentInv.stock) {
            toast(`Only ${currentInv.stock} items remaining in stock!`);
            return;
          }
          line.qty += 1;
          saveCart(cart);
          refresh();
        }
      });
      stepper.querySelector('.qty-minus').addEventListener('click', () => {
        let cart = getCart();
        const line = cart.find(i => i.id === id);
        if (line) {
          line.qty -= 1;
          if (line.qty <= 0) cart = cart.filter(i => i.id !== id);
          saveCart(cart);
          refresh();
        }
      });
    }
    refresh();
  });
}

/* ---------------- Cart Drawer Management ---------------- */
function initCartDrawer() {
  const drawer = document.querySelector('.cart-drawer');
  const overlay = document.querySelector('.overlay');
  if (!drawer) return;

  function open() { drawer.classList.add('show'); overlay.classList.add('show'); renderCart(); }
  function close() { drawer.classList.remove('show'); overlay.classList.remove('show'); }

  document.querySelectorAll('.js-open-cart').forEach(b => b.addEventListener('click', open));
  const closeBtn = drawer.querySelector('.cart-close');
  if (closeBtn) closeBtn.addEventListener('click', close);
  if (overlay) overlay.addEventListener('click', close);

  drawer.querySelectorAll('input[name="delivery"]').forEach(r => {
    r.checked = r.value === deliveryMethod;
    r.addEventListener('change', () => {
      deliveryMethod = r.value;
      store.set('kos_delivery', deliveryMethod);
      renderCart();
    });
  });

  const couponInput = drawer.querySelector('.coupon-input');
  const couponBtn = drawer.querySelector('.coupon-apply');
  if (couponBtn && couponInput) {
    couponBtn.addEventListener('click', () => {
      const code = couponInput.value.trim().toUpperCase();
      const msg = drawer.querySelector('.coupon-msg');
      if (!code) { msg.textContent = 'Enter a coupon code.'; msg.className = 'coupon-msg err'; return; }
      if (COUPONS[code]) {
        appliedCoupon = code;
        store.set('kos_coupon', appliedCoupon);
        msg.textContent = 'Applied ' + code + ' — ' + COUPONS[code].label + '!';
        msg.className = 'coupon-msg ok';
      } else {
        appliedCoupon = null;
        store.set('kos_coupon', null);
        msg.textContent = 'Invalid coupon code.';
        msg.className = 'coupon-msg err';
      }
      renderCart();
    });
  }

  const placeOrderBtn = drawer.querySelector('.place-order');
  if (placeOrderBtn) placeOrderBtn.addEventListener('click', placeOrder);

  window.openCartDrawer = open;
}

function computeTotals() {
  const cart = getCart();
  const subtotal = cart.reduce((s, i) => s + i.price * i.qty, 0);
  const member = isMember();

  let memberDiscount = 0;
  if (member && subtotal > 0) memberDiscount = subtotal * MEMBER_DISCOUNT_RATE;

  let couponDiscount = 0;
  if (appliedCoupon && COUPONS[appliedCoupon] && subtotal > 0) {
    const c = COUPONS[appliedCoupon];
    couponDiscount = c.type === 'percent' ? subtotal * (c.value / 100) : c.value;
  }

  const totalDiscount = Math.min(memberDiscount + couponDiscount, subtotal);
  const taxable = Math.max(subtotal - totalDiscount, 0);
  const tax = taxable * TAX_RATE;

  let delivery = DELIVERY_FEES[deliveryMethod] ?? DELIVERY_FEES.standard;
  let freeDelivery = member && subtotal >= FREE_DELIVERY_THRESHOLD;
  if (freeDelivery) delivery = 0;

  const total = taxable + tax + delivery;

  return { cart, subtotal, memberDiscount, couponDiscount, totalDiscount, tax, delivery, total, freeDelivery, member };
}

function renderCart() {
  const drawer = document.querySelector('.cart-drawer');
  if (!drawer) return;
  const body = drawer.querySelector('.cart-body');
  const t = computeTotals();
  const auth = getAuth();

  // Populate saved or logged-in address values
  const addressVal = auth.address || store.get('kos_user_address', '');
  const phoneVal = auth.phone || store.get('kos_user_phone', '');

  let addressFormHtml = `
    <div class="cart-address-section">
      <div class="cart-address-header">
        <h4 class="cart-section-title"><i class="fa-solid fa-location-dot" style="color:var(--brand-dark);"></i> Delivery Details <span class="req-star">*</span></h4>
        ${auth.loggedIn ? `<span class="cart-user-badge"><i class="fa-solid fa-user-check"></i> ${auth.name}</span>` : `<button type="button" class="btn-link-sm js-open-auth">Log in to pre-fill</button>`}
      </div>
      <div class="address-fields">
        <div class="field-group">
          <label for="cart-address">Street Address / Door No. <span class="req-star">*</span></label>
          <textarea id="cart-address" placeholder="Enter complete delivery street address, building/flat no." rows="2" required>${addressVal}</textarea>
          <div id="address-err" class="field-error">Delivery address is mandatory.</div>
        </div>
        <div class="field-row">
          <div class="field-group">
            <label for="cart-phone">Phone Number <span class="req-star">*</span></label>
            <input type="tel" id="cart-phone" placeholder="10-digit mobile no." value="${phoneVal}" required>
            <div id="phone-err" class="field-error">Valid phone number is mandatory.</div>
          </div>
          <div class="field-group">
            <label for="cart-landmark">Landmark (Optional)</label>
            <input type="text" id="cart-landmark" placeholder="e.g. Near City Park">
          </div>
        </div>
      </div>
    </div>
  `;

  if (t.cart.length === 0) {
    body.innerHTML = '<p class="cart-empty"><i class="fa-solid fa-basket-shopping" style="font-size:2.2rem;color:var(--brand);"></i><br><br>Your cart is empty.<br>Add items from the menu!</p>';
  } else {
    body.innerHTML = t.cart.map(i => `
      <div class="cart-line" data-id="${i.id}">
        <div class="cart-line-info">
          <h4>${i.name}</h4>
          <div class="cline-price">₹${i.price} × ${i.qty} = ₹${i.price * i.qty}</div>
        </div>
        <div class="qty-stepper show">
          <button class="qty-minus" aria-label="Decrease quantity">−</button>
          <span class="qty-val">${i.qty}</span>
          <button class="qty-plus" aria-label="Increase quantity">+</button>
        </div>
        <button class="cart-remove" aria-label="Remove item"><i class="fa-solid fa-trash"></i></button>
      </div>`).join('') + addressFormHtml;

    body.querySelectorAll('.cart-line').forEach(line => {
      const id = line.dataset.id;
      line.querySelector('.qty-plus').addEventListener('click', () => {
        const inv = getInventory()[id];
        const cart = getCart();
        const it = cart.find(x => x.id === id);
        if (it && inv) {
          if (it.qty + 1 > inv.stock) {
            toast(`Only ${inv.stock} remaining in stock!`);
            return;
          }
          it.qty += 1;
          saveCart(cart); renderCart(); initMenuButtons();
        }
      });
      line.querySelector('.qty-minus').addEventListener('click', () => {
        let cart = getCart();
        const it = cart.find(x => x.id === id);
        if (it) {
          it.qty -= 1;
          if (it.qty <= 0) cart = cart.filter(x => x.id !== id);
          saveCart(cart); renderCart(); initMenuButtons();
        }
      });
      line.querySelector('.cart-remove').addEventListener('click', () => {
        const cart = getCart().filter(x => x.id !== id);
        saveCart(cart); renderCart(); initMenuButtons();
      });
    });

    const loginLink = body.querySelector('.js-open-auth');
    if (loginLink) loginLink.addEventListener('click', showAuthModal);
  }

  if (t.member && t.cart.length > 0) {
    body.insertAdjacentHTML('afterbegin',
      '<div class="member-banner-mini"><i class="fa-solid fa-crown"></i> King\'s Club Active — 10% discount applied' +
      (t.subtotal >= FREE_DELIVERY_THRESHOLD ? ' + Free Delivery' : '') + '.</div>');
  }

  const foot = drawer.querySelector('.cart-foot');
  foot.querySelector('.row-subtotal').textContent = '₹' + t.subtotal.toFixed(0);
  const discRow = foot.querySelector('.row-discount') || foot.querySelector('.discount');
  if (discRow) {
    if (t.totalDiscount > 0) {
      discRow.style.display = 'flex';
      discRow.querySelector('span:last-child').textContent = '−₹' + t.totalDiscount.toFixed(0);
    } else { discRow.style.display = 'none'; }
  }
  foot.querySelector('.row-tax').textContent = '₹' + t.tax.toFixed(0);
  foot.querySelector('.row-delivery').textContent = t.freeDelivery ? 'FREE' : '₹' + t.delivery.toFixed(0);
  foot.querySelector('.row-total').textContent = '₹' + t.total.toFixed(0);
  foot.querySelector('.place-order').disabled = t.cart.length === 0;
}

/* ---------------- Mandatory Order Placement & Stock Deduction ---------------- */
function placeOrder() {
  const t = computeTotals();
  if (t.cart.length === 0) return;

  const addressEl = document.querySelector('#cart-address');
  const phoneEl = document.querySelector('#cart-phone');
  const landmarkEl = document.querySelector('#cart-landmark');
  const errAddress = document.querySelector('#address-err');
  const errPhone = document.querySelector('#phone-err');

  const auth = getAuth();
  const address = addressEl ? addressEl.value.trim() : (auth.address || store.get('kos_user_address', ''));
  const phone = phoneEl ? phoneEl.value.trim() : (auth.phone || store.get('kos_user_phone', ''));
  const landmark = landmarkEl ? landmarkEl.value.trim() : '';

  let isValid = true;

  if (!address) {
    if (addressEl) addressEl.classList.add('input-error');
    if (errAddress) errAddress.classList.add('show');
    isValid = false;
  } else {
    if (addressEl) addressEl.classList.remove('input-error');
    if (errAddress) errAddress.classList.remove('show');
  }

  if (!phone || phone.length < 7) {
    if (phoneEl) phoneEl.classList.add('input-error');
    if (errPhone) errPhone.classList.add('show');
    isValid = false;
  } else {
    if (phoneEl) phoneEl.classList.remove('input-error');
    if (errPhone) errPhone.classList.remove('show');
  }

  if (!isValid) {
    toast('Please fill out the required delivery address and phone number.');
    if (addressEl && !address) addressEl.focus();
    else if (phoneEl && !phone) phoneEl.focus();
    return;
  }

  store.set('kos_user_address', address);
  store.set('kos_user_phone', phone);

  // Validate stock
  const inv = getInventory();
  for (let item of t.cart) {
    const stockItem = inv[item.id];
    if (!stockItem || !stockItem.available || stockItem.stock < item.qty) {
      toast(`Cannot place order: Insufficient stock for ${item.name}! (${stockItem ? stockItem.stock : 0} remaining)`);
      return;
    }
  }

  // Deduct stock
  t.cart.forEach(item => {
    if (inv[item.id]) {
      inv[item.id].stock = Math.max(0, inv[item.id].stock - item.qty);
      if (inv[item.id].stock === 0) inv[item.id].available = false;
    }
  });
  saveInventory(inv);

  const orderId = 'KOS' + Date.now().toString().slice(-8);
  const eta = deliveryMethod === 'express' ? '15–20 minutes' : '35–45 minutes';
  
  const order = {
    id: orderId,
    customerName: auth.loggedIn ? auth.name : 'Guest Customer',
    items: t.cart,
    subtotal: t.subtotal,
    discount: t.totalDiscount,
    tax: t.tax,
    delivery: t.delivery,
    deliveryMethod,
    total: t.total,
    status: 'Pending',
    address,
    phone,
    landmark,
    placedAt: new Date().toISOString()
  };

  const history = store.get('kos_orders', []);
  history.unshift(order);
  store.set('kos_orders', history);

  saveCart([]);
  appliedCoupon = null;
  store.set('kos_coupon', null);

  const drawer = document.querySelector('.cart-drawer');
  if (drawer) drawer.classList.remove('show');
  const overlay = document.querySelector('.overlay');
  if (overlay) overlay.classList.remove('show');

  showModal({
    icon: 'fa-circle-check',
    title: 'Order Placed Successfully!',
    detail: [
      ['Order ID', orderId],
      ['Customer', order.customerName],
      ['Delivery Address', address + (landmark ? ` (${landmark})` : '')],
      ['Contact Phone', phone],
      ['Order Total', '₹' + t.total.toFixed(0)],
      ['Est. Arrival', eta]
    ],
    note: 'Track your order live under "My Orders" or view updates sent to the Kitchen Portal.'
  });

  renderCart();
  initMenuButtons();
}

/* ---------------- Generic Modal ---------------- */
function showModal({ icon, title, detail, note }) {
  let modal = document.querySelector('.modal');
  if (!modal) {
    modal = document.createElement('div');
    modal.className = 'modal';
    modal.innerHTML = '<div class="modal-card"></div>';
    document.body.appendChild(modal);
    modal.addEventListener('click', e => { if (e.target === modal) modal.classList.remove('show'); });
  }
  modal.querySelector('.modal-card').innerHTML = `
    <div class="modal-icon"><i class="fa-solid ${icon}"></i></div>
    <h3>${title}</h3>
    <div class="modal-detail">
      ${detail.map(([k, v]) => `<div class="row-line"><span>${k}</span><span><strong>${v}</strong></span></div>`).join('')}
    </div>
    ${note ? `<p style="color:var(--muted);font-size:.84rem;margin-top:10px;">${note}</p>` : ''}
    <button class="btn-primary btn-block modal-close" style="margin-top:12px;">Done</button>
  `;
  modal.querySelector('.modal-close').addEventListener('click', () => modal.classList.remove('show'));
  modal.classList.add('show');
}

/* Export Globals */
window.getAuth = getAuth;
window.saveAuth = saveAuth;
window.logout = logout;
window.showAuthModal = showAuthModal;
window.showModal = showModal;
window.computeTotals = computeTotals;
window.getMembership = getMembership;
window.isMember = isMember;
window.getInventory = getInventory;
window.saveInventory = saveInventory;
window.store = store;
window.toast = toast;
window.initMenuButtons = initMenuButtons;

/* ---------------- Boot ---------------- */
document.addEventListener('DOMContentLoaded', () => {
  initNav();
  initMenuButtons();
  initCartDrawer();
  renderCart();

  window.addEventListener('kos_inventory_updated', () => {
    initMenuButtons();
  });
});
