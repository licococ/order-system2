let currentUser = null;
let cart = [];

// 系統初始化
const products = [
    { id: 1, name: "法式盛夏芒果塔", price: 160, category: "法式塔類", img: "images/images (2).jpg" },
    { id: 2, name: "小山園宇治抹茶塔", price: 150, category: "法式塔類", img: "images/images (3).jpg" },
    { id: 3, name: "經典草莓戚風蛋糕", price: 240, category: "招牌蛋糕", img: "images/images (4).jpg" },
    { id: 4, name: "法式經典香草可麗露 (2入)", price: 120, category: "常溫點心", img: "images/images (8).jpg" },
    { id: 5, name: "海鹽焦糖巴斯克乳酪蛋糕", price: 140, category: "法式塔類", img: "images/800x.jpg" },
    { id: 6, name: "靜岡抹茶瑪德蓮 (3入)", price: 110, category: "常溫點心", img: "images/images (7).jpg" },
    { id: 7, name: "比利時濃郁榛果黑巧蛋糕", price: 180, category: "招牌蛋糕", img: "images/images (5).jpg" }
];

// 頁面切換核心邏輯
function showPage(pageId, scrollToCart = false) {
    document.querySelectorAll('.page-section').forEach(sec => sec.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// 產品篩選渲染
function filterCategory(category) {
    const titleElement = document.getElementById('menu-title-text');
    const menuGridBox = document.getElementById('menu-grid-box');
    
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

// 購物車邏輯
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    cart.push(product);
    document.getElementById('cart-count').innerText = cart.length;
    renderCart();
}

function renderCart() {
    const cartList = document.getElementById('cart-items');
    const cartBox = document.getElementById('cart-total-box');
    const emptyMsg = document.getElementById('empty-cart-msg');
    
    if(cart.length === 0) {
        cartList.innerHTML = '';
        emptyMsg.style.display = 'block';
        cartBox.style.display = 'none';
    } else {
        emptyMsg.style.display = 'none';
        cartBox.style.display = 'block';
        cartList.innerHTML = cart.map(item => `<li class="cart-item">${item.name} <span>NT$${item.price}</span></li>`).join('');
        document.getElementById('total-amount').innerText = cart.reduce((sum, item) => sum + item.price, 0);
    }
}

// 系統切換 (前台/後台)
function switchSystem(systemType) {
    document.getElementById('user-view').style.display = (systemType === 'user') ? 'block' : 'none';
    document.getElementById('admin-view').style.display = (systemType === 'admin') ? 'block' : 'none';
}

// 初始化
filterCategory('全部甜點');
