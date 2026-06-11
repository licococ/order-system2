let currentUser = null;
let cart = [];

// 🧠 核心設置：預設全新的管理者通行證
localStorage.setItem("user_sweet@123", "123");

const products = [
    { id: 1, name: "法式盛夏芒果塔", price: 160, category: "法式塔類", img: "images/mango.jpg" },
    { id: 2, name: "小山園宇治抹茶塔", price: 150, category: "法式塔類", img: "images/matcha.jpg" },
    { id: 3, name: "炙燒焦糖檸檬塔", price: 140, category: "法式塔類", img: "images/lemon_tart.jpg" },
    { id: 4, name: "經典草莓戚風蛋糕", price: 240, category: "招牌蛋糕", img: "images/cake_berry.jpg" },
    { id: 5, name: "比利時濃郁榛果黑巧蛋糕", price: 220, category: "招牌蛋糕", img: "images/cake_cocoa.jpg" },
    { id: 6, name: "海鹽焦糖巴斯克乳酪蛋糕", price: 180, category: "招牌蛋糕", img: "images/cake_cheese.jpg" },
    { id: 7, name: "靜岡抹茶瑪德蓮 (3入)", price: 110, category: "常溫點心", img: "images/madeleine.jpg" },
    { id: 8, name: "法式經典香草可麗露 (2入)", price: 130, category: "常溫點心", img: "images/canelet.jpg" }
];

// 🚀 網頁加載安全初始化
window.onload = function() {
    // 1. 精準對齊 HTML 中 media query 的 767px 斷點
    if (window.innerWidth <= 767) {
        document.body.classList.remove('is-pc');
        document.body.classList.add('is-mobile');
    } else {
        document.body.classList.remove('is-mobile');
        document.body.classList.add('is-pc');
    }
    // 2. 載入產品菜單
    filterCategory('全部甜點');
};

function showPage(pageId, scrollToCart = false) {
    // 隱藏所有分頁區塊
    const sections = document.querySelectorAll('.page-section');
    sections.forEach(sec => sec.classList.remove('active'));
    
    // 顯示指定的目標分頁
    const targetPage = document.getElementById(pageId);
    if (targetPage) targetPage.classList.add('active');

    // 清除導覽列所有按鈕的點亮狀態
    const navIds = ['nav-home', 'nav-order', 'nav-login', 'nav-cart'];
    navIds.forEach(id => {
        const navEl = document.getElementById(id);
        if (navEl) navEl.classList.remove('active');
    });

    // 依據目前分頁，點亮對應按鈕（加入高度安全防護，找不到元件不報錯）
    try {
        if (pageId === 'home-section') {
            const el = document.getElementById('nav-home');
            if (el) el.classList.add('active');
        }
        if (pageId === 'order-section' && !scrollToCart) {
            const el = document.getElementById('nav-order');
            if (el) el.classList.add('active');
        }
        if (pageId === 'order-section' && scrollToCart) {
            const el = document.getElementById('nav-cart');
            if (el) el.classList.add('active');
        }
        if (pageId === 'login-section') {
            const el = document.getElementById('nav-login');
            if (el) el.classList.add('active');
        }
    } catch(err) {
        console.log("導覽列切換提示：部分按鈕目前不可見。");
    }

    // 手機端點擊購物車自動平滑滾動
    if (scrollToCart && window.innerWidth <= 767) {
        setTimeout(() => {
            const cartAnchor = document.getElementById('cart-anchor');
            if (cartAnchor) {
                const topOffset = cartAnchor.getBoundingClientRect().top + window.pageYOffset - 90;
                window.scrollTo({top: topOffset, behavior: 'smooth'});
            }
        }, 80);
    } else {
        window.scrollTo({top: 0, behavior: 'smooth'});
    }
}

function filterCategory(category) {
    const titleElement = document.getElementById('menu-title-text');
    const menuGridBox = document.getElementById('menu-grid-box');
    
    if (titleElement) {
        titleElement.innerText = category === '全部甜點' ? "精選甜點菜單" : `精選甜點 - ${category}`;
    }

    const filtered = category === '全部甜點' ? products : products.filter(item => item.category === category);
    
    if (menuGridBox) {
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
                </div>
            `;
        });
    }
}

function switchSystem(systemType) {
    const userView = document.getElementById('user-view');
    const adminView = document.getElementById('admin-view');
    const userBtn = document.getElementById('switch-user-btn');
    const adminBtn = document.getElementById('switch-admin-btn');

    if (systemType === 'admin') {
        if(userView) userView.style.display = 'none';
        if(adminView) adminView.style.display = 'block';
        if(userBtn) userBtn.classList.remove('active');
        if(adminBtn) adminBtn.classList.add('active');
        refreshAdminDashboard();
    } else {
        if(userView) userView.style.display = 'block';
        if(adminView) adminView.style.display = 'none';
        if(userBtn) userBtn.classList.add('active');
        if(adminBtn) adminBtn.classList.remove('active');
        if(currentUser) renderHistoryOrders();
    }
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
    const emptyMsg = document.getElementById('empty-cart-msg');
    const totalBox = document.getElementById('cart-total-box');
    const cartCount = document.getElementById('cart-count');
    const totalSpan = document.getElementById('total-amount');

    if (!container) return;
    container.innerHTML = '';
    let total = 0, count = 0;

    if (cart.length === 0) {
        if (emptyMsg) emptyMsg.style.display = 'block';
        if (totalBox) totalBox.style.display = 'none';
        if (cartCount) cartCount.innerText = '0';
        return;
    }

    if (emptyMsg) emptyMsg.style.display = 'none';
    if (totalBox) totalBox.style.display = 'block';

    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        count += item.quantity;
        container.innerHTML += `
            <li class="cart-item">
                <div><strong>${item.name}</strong><br>(NT$ ${item.price}) x ${item.quantity}</div>
                <div>NT$ ${item.price * item.quantity} <button onclick="removeFromCart(${index})" style="background:none; border:none; color:#c0392b; cursor:pointer; margin-left:5px;">❌</button></div>
            </li>
        `;
    });
    if (totalSpan) totalSpan.innerText = total;
    if (cartCount) cartCount.innerText = count;
}

function removeFromCart(index) {
    cart.splice(index, 1);
    updateCartUI();
}

function getGlobalOrders() {
    return JSON.parse(localStorage.getItem('global_bakery_orders')) || [];
}

function saveGlobalOrders(orders) {
    localStorage.setItem('global_bakery_orders', JSON.stringify(orders));
}

function checkout() {
    if (!currentUser) return;
    const totalAmt = parseInt(document.getElementById('total-amount').innerText);
    const orderDetails = cart.map(item => `${item.name} x ${item.quantity}`).join(', ');
    const now = new Date();
    const timeString = `${now.getFullYear()}/${now.getMonth()+1}/${now.getDate()} ${now.getHours().toString().padStart(2,'0')}:${now.getMinutes().toString().padStart(2,'0')}`;

    const globalOrders = getGlobalOrders();
    const newOrder = {
        orderId: 'TM-' + (Date.now().toString().slice(-6)),
        user: currentUser,
        time: timeString,
        items: orderDetails,
        total: totalAmt,
        status: 'pending'
    };

    globalOrders.unshift(newOrder);
    saveGlobalOrders(globalOrders);

    alert(`🎉 訂單已成功送出！\n總金額為：NT$ ${totalAmt}\n店家會立刻開始為您排單製作！`);
    cart = [];
    updateCartUI();
    renderHistoryOrders();
}

function toggleForm(type) {
    const loginBox = document.getElementById('login-form-box');
    const regBox = document.getElementById('register-form-box');
    if(loginBox) loginBox.style.display = type === 'register' ? 'none' : 'block';
    if(regBox) regBox.style.display = type === 'register' ? 'block' : 'none';
}

function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('reg-email').value;
    const pwd = document.getElementById('reg-password').value;
    if (pwd !== document.getElementById('reg-confirm').value) { alert("密碼不一致！"); return; }
    if (localStorage.getItem(`user_${email}`)) { alert("信箱已註冊過！"); return; }
    
    localStorage.setItem(`user_${email}`, pwd);
    alert("註冊成功！已跳轉登入。");
    toggleForm('login');
    document.getElementById('login-email').value = email;
}

function handleLogin(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const enteredPassword = document.getElementById('login-password').value;

    if (localStorage.getItem(`user_${email}`) === enteredPassword) {
        currentUser = email;
        if(document.getElementById('login-form-box')) document.getElementById('login-form-box').style.display = 'none';
        if(document.getElementById('user-status')) document.getElementById('user-status').style.display = 'block';
        if(document.getElementById('user-display-email')) document.getElementById('user-display-email').innerText = email;
        if(document.getElementById('history-box')) document.getElementById('history-box').style.display = 'block';
        
        const switcher = document.getElementById('admin-switcher-bar');
        const badge = document.getElementById('admin-badge-notice');
        if (email === 'sweet@123') {
            if(switcher) switcher.style.display = 'flex';
            if(badge) badge.style.display = 'block';
        } else {
            if(switcher) switcher.style.display = 'none';
            if(badge) badge.style.display = 'none';
        }

        renderHistoryOrders();
    } else {
        alert("帳號或密碼錯誤！");
    }
}

function handleLogout() {
    currentUser = null; cart = []; updateCartUI();
    if(document.getElementById('login-form-box')) document.getElementById('login-form-box').style.display = 'block';
    if(document.getElementById('user-status')) document.getElementById('user-status').style.display = 'none';
    if(document.getElementById('history-box')) document.getElementById('history-box').style.display = 'none';
    if(document.getElementById('admin-switcher-bar')) document.getElementById('admin-switcher-bar').style.display = 'none';
    switchSystem('user'); 
}

function renderHistoryOrders() {
    const container = document.getElementById('history-list-content');
    if (!container) return;
    container.innerHTML = '';
    if (!currentUser) return;

    const myOrders = getGlobalOrders().filter(o => o.user === currentUser);
    if (myOrders.length === 0) {
        container.innerHTML = '<div class="no-history-msg">目前尚無任何消費紀錄。</div>';
        return;
    }

    myOrders.forEach(order => {
        let statusText = '⏳ 店家確認中';
        if(order.status === 'cooking') statusText = '👩‍🍳 甜點主廚製作中';
        if(order.status === 'completed') statusText = '✅ 已完成/可取餐';

        container.innerHTML += `
            <div class="order-card">
                <div class="order-card-header">
                    <span>單號：#${order.orderId}</span>
                    <span style="font-weight:bold; color:#d35400;">${statusText}</span>
                </div>
                <div class="order-card-body">
                    <strong>時間：</strong>${order.time}<br>
                    <strong>品項：</strong>${order.items}
                </div>
                <div class="order-card-total">實付總額：NT$ ${order.total}</div>
            </div>
        `;
    });
}

function refreshAdminDashboard() {
    const orders = getGlobalOrders();
    const newCount = orders.filter(o => o.status === 'pending').length;
    const cookingCount = orders.filter(o => o.status === 'cooking').length;
    const revenue = orders.filter(o => o.status === 'completed').reduce((sum, o) => sum + o.total, 0);

    const statNew = document.getElementById('stat-new-orders');
    const statCook = document.getElementById('stat-cooking-orders');
    const statRev = document.getElementById('stat-total-revenue');

    if (statNew) statNew.innerText = `${newCount} 筆`;
    if (statCook) statCook.innerText = `${cookingCount} 筆`;
    if (statRev) statRev.innerText = revenue;

    const listContainer = document.getElementById('admin-orders-list-box');
    if (!listContainer) return;
    listContainer.innerHTML = '';

    if (orders.length === 0) {
        listContainer.innerHTML = '<div class="no-history-msg" style="text-align:center;">🏭 目前全台灣沒有任何顧客下單喔。</div>';
        return;
    }

    orders.forEach(order => {
        let badgeHTML = '';
        let actionButtons = '';

        if (order.status === 'pending') {
            badgeHTML = `<span class="status-badge status-pending">新訂單 (未接)</span>`;
            actionButtons = `<button class="admin-btn btn-accept" onclick="updateOrderStatus('${order.orderId}', 'cooking')">接受訂單並開始製作</button>`;
        } else if (order.status === 'cooking') {
            badgeHTML = `<span class="status-badge status-cooking">製作中</span>`;
            actionButtons = `<button class="admin-btn btn-finish" onclick="updateOrderStatus('${order.orderId}', 'completed')">製作完成通知取餐</button>`;
        } else if (order.status === 'completed') {
            badgeHTML = `<span class="status-badge status-completed">已出餐完成</span>`;
            actionButtons = `<span style="color:#27ae60; font-size:13px; margin-left:10px;">💵 款項已入帳</span>`;
        }

        listContainer.innerHTML += `
            <div class="order-card" style="background:#fff; border: 1px solid #e0d0c0; margin-bottom:20px; padding:20px;">
                <div class="order-card-header" style="font-size:14px;">
                    <span><strong>單號：#${order.orderId}</strong> (${order.time})</span>
                    <div>${badgeHTML}</div>
                </div>
                <div class="order-card-body" style="margin:10px 0;">
                    <strong>訂購會員：</strong>${order.user}<br>
                    <strong>甜點品項：</strong><span style="color:#7a5844; font-weight:bold;">${order.items}</span><br>
                    <strong>金額：</strong>NT$ ${order.total}
                </div>
                <div style="text-align:right; border-top:1px dashed #eee; padding-top:10px;">
                    ${actionButtons}
                </div>
            </div>
        `;
    });
}

function updateOrderStatus(orderId, newStatus) {
    let orders = getGlobalOrders();
    const index = orders.findIndex(o => o.orderId === orderId);
    if (index !== -1) {
        orders[index].status = newStatus;
        saveGlobalOrders(orders);
        refreshAdminDashboard();
    }
}
    document.addEventListener('DOMContentLoaded', function() {
        const dropdown = document.querySelector('.dropdown');
        const dropdownContent = document.querySelector('.dropdown-content');
    
        // 點擊觸發開關
        dropdown.addEventListener('click', function(e) {
            e.stopPropagation(); // 防止點擊時事件冒泡
            dropdownContent.classList.toggle('show');
        });
    
        // 點擊頁面其他地方時關閉選單
        document.addEventListener('click', function() {
            dropdownContent.classList.remove('show');
        });
    });
