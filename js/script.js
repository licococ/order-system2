// --- 1. 全域變數與系統初始化 ---
let currentUser = null;
let cart = [];

// 產品數據
const products = [
    { id: 1, name: "法式盛夏芒果塔", price: 160, category: "法式塔類", img: "images/images(2).jpg" },
    { id: 2, name: "小山園宇治抹茶塔", price: 150, category: "法式塔類", img: "images/images(3).jpg" },
    { id: 3, name: "經典草莓戚風蛋糕", price: 240, category: "招牌蛋糕", img: "images/images(4).jpg" },
    { id: 4, name: "法式經典香草可麗露 (2入)", price: 120, category: "常溫點心", img: "images/images(8).jpg" },
    { id: 5, name: "海鹽焦糖巴斯克乳酪蛋糕", price: 140, category: "法式塔類", img: "images/800x.jpg" },
    { id: 6, name: "靜岡抹茶瑪德蓮 (3入)", price: 110, category: "常溫點心", img: "images/images(7).jpg" },
    { id: 7, name: "比利時濃郁榛果黑巧蛋糕", price: 180, category: "招牌蛋糕", img: "images/images(5).jpg" }
];

// --- 2. 頁面顯示控制 ---
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    const target = document.getElementById(pageId);
    if (target) target.classList.add('active');
}

function switchSystem(systemType) {
    document.getElementById('user-view').style.display = (systemType === 'user') ? 'block' : 'none';
    document.getElementById('admin-view').style.display = (systemType === 'admin') ? 'block' : 'none';
}

// --- 3. 會員功能 ---
function login() {
    const input = document.getElementById('username-input');
    if (!input || input.value.trim() === "") return alert("請輸入姓名！");
    
    currentUser = input.value;
    document.getElementById('user-display').innerText = `歡迎回來, ${currentUser}`;
    document.getElementById('login-area').style.display = 'none';
    document.getElementById('member-area').style.display = 'block';
}

function renderHistory() {
    const historyList = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    
    if (history.length === 0) {
        historyList.innerHTML = "<li>目前沒有歷史訂單</li>";
    } else {
        historyList.innerHTML = history.map(o => `<li>訂單 #${o.id} - ${o.date} - $${o.total}</li>`).join('');
    }
}

// --- 4. 購物車與訂單功能 ---
function filterCategory(category) {
    const titleElement = document.getElementById('menu-title-text');
    const menuGridBox = document.getElementById('menu-grid-box');
    
    if (!menuGridBox) return;
    
    titleElement.innerText = category === '全部甜點' ? "精選甜點菜單" : category;
    const filtered = category === '全部甜點' ? products : products.filter(p => p.category === category);
    
    menuGridBox.innerHTML = filtered.map(product => `
        <div class="menu-item">
            <img src="${product.img}" alt="${product.name}">
            <div class="menu-info">
                <div class="menu-title">${product.name}</div>
                <div class="menu-price">NT$ ${product.price}</div>
                <button class="btn-add" onclick="addToCart(${product.id})">加入購物車</button>
            </div>
        </div>
    `).join('');
}

function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product) {
        cart.push(product);
        renderCart();
    }
}

function renderCart() {
    const cartItems = document.getElementById('cart-items');
    const count = document.getElementById('cart-count');
    const total = document.getElementById('total-amount');
    const cartBox = document.getElementById('cart-total-box');
    const emptyMsg = document.getElementById('empty-cart-msg');
    
    if (cart.length === 0) {
        if(cartItems) cartItems.innerHTML = '';
        if(cartBox) cartBox.style.display = 'none';
        if(emptyMsg) emptyMsg.style.display = 'block';
    } else {
        if(cartItems) cartItems.innerHTML = cart.map(item => `<li>${item.name} - NT$${item.price}</li>`).join('');
        if(cartBox) cartBox.style.display = 'block';
        if(emptyMsg) emptyMsg.style.display = 'none';
        if(total) total.innerText = cart.reduce((sum, item) => sum + item.price, 0);
    }
    if(count) count.innerText = cart.length;
}

function checkout() {
    if (!currentUser) return alert("請先至會員中心登入！");
    if (cart.length === 0) return alert("購物車是空的！");

    const order = {
        id: new Date().getTime(),
        date: new Date().toLocaleString(),
        total: cart.reduce((sum, item) => sum + item.price, 0)
    };

    let history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    history.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(history));

    alert("訂單已送出，謝謝您的購買！");
    cart = [];
    renderCart();
}

// --- 5. 初始化 ---
document.addEventListener('DOMContentLoaded', () => {
    filterCategory('全部甜點');
});
