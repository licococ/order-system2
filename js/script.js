let currentUser = null;
let cart = [];

// 系統初始化
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

// ... (請將您原本 script 中的 switchSystem, showPage, 等所有函式與我上方補充的邏輯貼在此處)

// 頁面載入後自動執行
window.onload = () => {
    filterCategory('全部甜點');
};
