// 全域變數
let currentUser = null; // null 代表未登入
let cart = [];

// 產品數據
const products = [
    { id: 1, name: "法式盛夏芒果塔", price: 160, category: "法式塔類", img: "images/images-2.jpg" },
    { id: 2, name: "小山園宇治抹茶塔", price: 150, category: "法式塔類", img: "images/images-3.jpg" },
    { id: 3, name: "經典草莓戚風蛋糕", price: 240, category: "招牌蛋糕", img: "images/images-4.jpg" },
    { id: 4, name: "法式經典香草可麗露 (2入)", price: 120, category: "常溫點心", img: "images/images-8.jpg" },
    { id: 5, name: "海鹽焦糖巴斯克乳酪蛋糕", price: 140, category: "法式塔類", img: "images/800x.jpg" },
    { id: 6, name: "靜岡抹茶瑪德蓮 (3入)", price: 110, category: "常溫點心", img: "images/images-7.jpg" },
    { id: 7, name: "比利時濃郁榛果黑巧蛋糕", price: 180, category: "招牌蛋糕", img: "images/images-5.jpg" }
];

// --- 1. 會員系統 ---
function login() {
    const username = document.getElementById('username-input').value;
    if (username.trim() === "") return alert("請輸入姓名！");
    
    currentUser = username;
    document.getElementById('user-display').innerText = `歡迎回來, ${currentUser}`;
    document.getElementById('login-area').style.display = 'none'; // 隱藏登入框
    document.getElementById('member-area').style.display = 'block'; // 顯示會員功能
}

// --- 2. 購物車與訂單 ---
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    renderCart();
}

function submitOrder() {
    if (!currentUser) return alert("請先登入會員！");
    if (cart.length === 0) return alert("購物車是空的！");

    const order = {
        id: new Date().getTime(),
        date: new Date().toLocaleDateString(),
        total: cart.reduce((sum, item) => sum + item.price, 0)
    };

    let history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    history.push(order);
    localStorage.setItem('orderHistory', JSON.stringify(history));

    alert("訂單已送出！");
    cart = [];
    renderCart();
}

// --- 3. 渲染邏輯 ---
function renderCart() {
    document.getElementById('cart-count').innerText = cart.length;
    document.getElementById('total-amount').innerText = cart.reduce((sum, item) => sum + item.price, 0);
}

function renderHistory() {
    const historyList = document.getElementById('history-list');
    const history = JSON.parse(localStorage.getItem('orderHistory') || '[]');
    historyList.innerHTML = history.map(o => `<li>訂單 #${o.id} - ${o.date} - $${o.total}</li>`).join('');
}

// --- 4. 初始化 ---
document.addEventListener('DOMContentLoaded', () => {
    // 預設狀態
    document.getElementById('member-area').style.display = 'none';
});
