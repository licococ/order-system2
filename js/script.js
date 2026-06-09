// --- 基礎變數與設定 ---
let currentUser = null;
let cart = [];

// 預設帳號
localStorage.setItem("user_sweet@123", "123");

const products = [
    { id: 1, name: "法式盛夏芒果塔", price: 160, category: "法式塔類", img: "images (2).jpg" },
    { id: 2, name: "小山園宇治抹茶塔", price: 150, category: "法式塔類", img: "images (3).jpg" },
    { id: 3, name: "炙燒焦糖檸檬塔", price: 140, category: "法式塔類", img: "images (800x).jpg" },
    { id: 4, name: "經典草莓戚風蛋糕", price: 240, category: "招牌蛋糕", img: "images (4).jpg" },
    { id: 5, name: "比利時濃郁榛果黑巧蛋糕", price: 220, category: "招牌蛋糕", img: "images (5).jpg" },
    { id: 6, name: "海鹽焦糖巴斯克乳酪蛋糕", price: 180, category: "招牌蛋糕", img: "images (6).jpg" }
];

document.addEventListener('DOMContentLoaded', () => {
    filterCategory('全部甜點');
});

// --- 註冊與登入功能 (新增註冊邏輯) ---
function handleRegister(e) {
    e.preventDefault();
    const email = document.getElementById('login-email').value;
    const pwd = document.getElementById('login-password').value;
    if (localStorage.getItem(`user_${email}`)) {
        alert("此帳號已存在！");
    } else {
        localStorage.setItem(`user_${email}`, pwd);
        alert("註冊成功！請直接登入。");
    }
}

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
        renderHistoryOrders();
    } else {
        alert("帳號或密碼錯誤！");
    }
}

// --- 購物車與訂單管理 ---
function updateCartUI() {
    const container = document.getElementById('cart-items');
    const totalBox = document.getElementById('cart-total-box');
    container.innerHTML = '';
    let total = 0;

    if (cart.length === 0) {
        document.getElementById('empty-cart-msg').style.display = 'block';
        totalBox.style.display = 'none';
        return;
    }

    document.getElementById('empty-cart-msg').style.display = 'none';
    totalBox.style.display = 'block';
    cart.forEach((item, index) => {
        total += item.price * item.quantity;
        container.innerHTML += `
            <li class="cart-item">
                <div><strong>${item.name}</strong><br>(NT$ ${item.price}) x ${item.quantity}</div>
                <div>NT$ ${item.price * item.quantity} <button onclick="removeFromCart(${index})">❌</button></div>
            </li>`;
    });
    document.getElementById('total-amount').innerText = total;
}

// (保留你原有的 checkout, renderHistoryOrders, switchSystem 等函式...)
// 注意：刪除或註解掉原本裡面用到 cartCount 的程式碼即可。
