// --- 基礎變數與設定 ---
let currentUser = null;
let cart = [];

// 預設管理者帳號設定 (僅供開發測試使用)
localStorage.setItem("user_sweet@123", "123");

const products = [
    { id: 1, name: "法式盛夏芒果塔", price: 160, category: "法式塔類", img: "images (2).jpg" },
    { id: 2, name: "小山園宇治抹茶塔", price: 150, category: "法式塔類", img: "images (3).jpg" },
    { id: 3, name: "炙燒焦糖檸檬塔", price: 140, category: "法式塔類", img: "800x.jpg" },
    { id: 4, name: "經典草莓戚風蛋糕", price: 240, category: "招牌蛋糕", img: "images (4).jpg" },
    { id: 5, name: "比利時濃郁榛果黑巧蛋糕", price: 220, category: "招牌蛋糕", img: "images (5).jpg" },
    { id: 6, name: "海鹽焦糖巴斯克乳酪蛋糕", price: 180, category: "招牌蛋糕", img: "images (6).jpg" },
    { id: 7, name: "靜岡抹茶瑪德蓮 (3入)", price: 110, category: "常溫點心", img: "images (7).jpg" },
    { id: 8, name: "法式經典香草可麗露 (2入)", price: 130, category: "常溫點心", img: "images (8).jpg" }
];

// --- 系統切換與頁面控制 ---
function switchSystem(systemType) {
    const userView = document.getElementById('user-view');
    const adminView = document.getElementById('admin-view');
    const userBtn = document.getElementById('switch-user-btn');
    const adminBtn = document.getElementById('switch-admin-btn');

    if (systemType === 'admin') {
        userView.style.display = 'none';
        adminView.style.display = 'block';
        userBtn.classList.remove('active');
        adminBtn.classList.add('active');
        refreshAdminDashboard();
    } else {
        userView.style.display = 'block';
        adminView.style.display = 'none';
        userBtn.classList.add('active');
        adminBtn.classList.remove('active');
        if (currentUser) renderHistoryOrders();
    }
}

function showPage(pageId, scrollToCart = false) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');

    // 更新導覽列狀態
    ['nav-home', 'nav-order', 'nav-login'].forEach(id => document.getElementById(id).classList.remove('active'));
    const navMap = { 'home-section': 'nav-home', 'order-section': 'nav-order', 'login-section': 'nav-login' };
    if (navMap[pageId]) document.getElementById(navMap[pageId]).classList.add('active');

    if (scrollToCart && window.innerWidth <= 950) {
        setTimeout(() => {
            const cartAnchor = document.getElementById('cart-anchor');
            if (cartAnchor) window.scrollTo({ top: cartAnchor.getBoundingClientRect().top + window.pageYOffset - 90, behavior: 'smooth' });
        }, 50);
    } else {
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

// --- 資料儲存 (localStorage) ---
function getGlobalOrders() { return JSON.parse(localStorage.getItem('global_bakery_orders')) || []; }
function saveGlobalOrders(orders) { localStorage.setItem('global_bakery_orders', JSON.stringify(orders)); }

// --- 菜單與購物車功能 ---
function filterCategory(category) {
    const titleElement = document.getElementById('menu-title-text');
    const menuGridBox = document.getElementById('menu-grid-box');
    titleElement.innerText = category === '全部甜點' ? "精選甜點菜單" : `精選甜點 - ${category}`;

    const filtered = category === '全部甜點' ? products : products.filter(item => item.category === category);
    menuGridBox.innerHTML = '';
    filtered.forEach(item => {
        menuGridBox.innerHTML += `
            <div class="menu-item">
                <img src="${item.img}" alt="${item.name}">
                <div class="menu-info">
                    <span class="menu-category-tag">${item.category}</span>
                    <div class="menu-title">${item.name}</div>
                    <div class="menu-price">NT$ ${item.price}</div>
                    <button class="btn-add" onclick="addToCart('${item.name}', ${item.price})">加入購物車</button>
                </div>
            </div>`;
    });
}

function addToCart(name, price) {
    if (!currentUser) {
        alert("親愛的顧客，請先登入會員才能開始挑選美味甜點喔！");
        showPage('login-section');
        return;
    }
    const existing = cart.find(item => item.name === name);
    if (existing) existing.quantity += 1;
    else cart.push({ name: name, price: price, quantity: 1 });
    updateCartUI();
}

function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalBox = document.getElementById('cart-total-box');
    const cartCount = document.getElementById('cart-count');
    container.innerHTML = '';
    let total = 0, count = 0;

    if (cart.length === 0) {
        document.getElementById('empty-cart-msg').style.display = 'block';
        totalBox.style.display = 'none';
        cartCount.innerText = '0';
        return;
    }

    document.getElementById('empty-cart-msg').style.display = 'none';
    totalBox.style.display = 'block';
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;
        container.innerHTML += `
            <li class="cart-item">
                <div><strong>${item.name}</strong><br>(NT$ ${item.price}) x ${item.quantity}</div>
                <div>NT$ ${item.price * item.quantity} <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#c0392b; cursor:pointer; margin-left:5px;">❌</button></div>
            </li>`;
    });
    document.getElementById('total-amount').innerText = total;
    cartCount.innerText = count;
}

function removeFromCart(index) { cart.splice(index, 1); updateCartUI(); }

function checkout() {
    if (!currentUser) return;
    const totalAmt = parseInt(document.getElementById('total-amount').innerText);
    const now = new Date();
    const timeString = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;
    
    const globalOrders = getGlobalOrders();
    globalOrders.unshift({
        orderId: 'TM-' + (Date.now().toString().slice(-6)),
        user: currentUser,
        time: timeString,
        items: cart.map(item => `${item.name} x ${item.quantity}`).join(', '),
        total: totalAmt,
        status: 'pending'
    });
    saveGlobalOrders(globalOrders);
    alert(`🎉 訂單已成功送出！`);
    cart = [];
    updateCartUI();
    renderHistoryOrders();
}

// --- 會員與管理功能 ---
function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pwd = document.getElementById('login-password').value;

    if (localStorage.getItem(`user_${email}`) === pwd) {
        currentUser = email;
        document.getElementById('login-form-box').style.display = 'none';
        document.getElementById('user-status').style.display = 'block';
        document.getElementById('user-display-email').innerText = email;
        
        const isAdmin = (email === 'sweet@123');
        document.getElementById('admin-switcher-bar').style.display = isAdmin ? 'flex' : 'none';
        document.getElementById('admin-badge-notice').style.display = isAdmin ? 'block' : 'none';
        
        renderHistoryOrders();
    } else {
        alert("帳號或密碼錯誤！");
    }
}

function handleLogout() {
    currentUser = null; cart = []; updateCartUI();
    document.getElementById('login-form-box').style.display = 'block';
    document.getElementById('user-status').style.display = 'none';
    document.getElementById('admin-switcher-bar').style.display = 'none';
    switchSystem('user');
}

function renderHistoryOrders() {
    const container = document.getElementById('history-list-content');
    container.innerHTML = '';
    const myOrders = getGlobalOrders().filter(o => o.user === currentUser);
    if (myOrders.length === 0) { container.innerHTML = '<div class="no-history-msg">目前尚無任何消費紀錄。</div>'; return; }

    myOrders.forEach(order => {
        const statusMap = { 'pending': '⏳ 店家確認中', 'cooking': '👩‍🍳 甜點主廚製作中', 'completed': '✅ 已完成/可取餐' };
        container.innerHTML += `
            <div class="order-card">
                <div class="order-card-header"><span>單號：#${order.orderId}</span><span style="font-weight:bold; color:#d35400;">${statusMap[order.status]}</span></div>
                <div class="order-card-body"><strong>時間：</strong>${order.time}<br><strong>品項：</strong>${order.items}</div>
                <div class="order-card-total">實付總額：NT$ ${order.total}</div>
            </div>`;
    });
}

function refreshAdminDashboard() {
    const orders = getGlobalOrders();
    document.getElementById('stat-new-orders').innerText = `${orders.filter(o => o.status === 'pending').length} 筆`;
    document.getElementById('stat-cooking-orders').innerText = `${orders.filter(o => o.status === 'cooking').length} 筆`;
    document.getElementById('stat-total-revenue').innerText = orders.filter(o => o.status === 'completed').reduce((s, o) => s + o.total, 0);

    const listContainer = document.getElementById('admin-orders-list-box');
    listContainer.innerHTML = '';
    orders.forEach(order => {
        let actionButtons = order.status === 'pending' ? `<button class="admin-btn" onclick="updateOrderStatus('${order.orderId}', 'cooking')">接受訂單</button>` : 
                            order.status === 'cooking' ? `<button class="admin-btn" onclick="updateOrderStatus('${order.orderId}', 'completed')">製作完成</button>` : '💵 款項已入帳';
        listContainer.innerHTML += `
            <div class="order-card">
                <div class="order-card-header">單號：#${order.orderId} - ${order.user}</div>
                <div class="order-card-body">${order.items} | NT$ ${order.total}</div>
                <div style="text-align:right;">${actionButtons}</div>
            </div>`;
    });
}

function updateOrderStatus(orderId, newStatus) {
    let orders = getGlobalOrders();
    const idx = orders.findIndex(o => o.orderId === orderId);
    if (idx !== -1) { orders[idx].status = newStatus; saveGlobalOrders(orders); refreshAdminDashboard(); }
}

window.onload = () => filterCategory('全部甜點');
