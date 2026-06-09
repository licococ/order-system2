// script.js

// 1. 商品資料庫 (確保結構統一，分類清晰)
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

// 2. 核心篩選函式 (修改導覽列點擊後的標題與內容)
function filterCategory(category) {
    const titleElement = document.getElementById('menu-title-text');
    const menuGridBox = document.getElementById('menu-grid-box');
    
    // 更新標題
    titleElement.innerText = category;
    
    // 篩選與渲染
    const filteredProducts = (category === '全部甜點') 
        ? products 
        : products.filter(p => p.category === category);
    
    menuGridBox.innerHTML = '';
    
    filteredProducts.forEach(p => {
        menuGridBox.innerHTML += `
            <div class="menu-item">
                <img src="${p.img}" alt="${p.name}">
                <div class="menu-info">
                    <span class="menu-category-tag">${p.category}</span>
                    <div class="menu-title">${p.name}</div>
                    <div class="menu-price">NT$ ${p.price}</div>
                    <button class="btn-add" onclick="addToCart(${p.id})">加入購物車</button>
                </div>
            </div>
        `;
    });
}

// 3. 確保頁面載入時預設顯示全部
document.addEventListener('DOMContentLoaded', () => {
    filterCategory('全部甜點');
});
