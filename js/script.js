// 系統切換 (前台/後台)
function switchSystem(type) {
    document.getElementById('user-view').style.display = (type === 'user') ? 'block' : 'none';
    document.getElementById('admin-view').style.display = (type === 'admin') ? 'block' : 'none';
    
    // 更新按鈕樣式
    document.getElementById('btn-user').classList.toggle('active', type === 'user');
    document.getElementById('btn-admin').classList.toggle('active', type === 'admin');
}

// 頁面切換 (關於我們/點餐/會員)
function showPage(pageId) {
    document.querySelectorAll('.page-section').forEach(s => s.classList.remove('active'));
    document.getElementById(pageId).classList.add('active');
}

// 登入邏輯
function login() {
    const name = document.getElementById('username-input').value;
    if(name) {
        document.getElementById('login-area').style.display = 'none';
        document.getElementById('member-area').style.display = 'block';
        document.getElementById('user-display').innerText = `歡迎回來，${name}`;
    }
}

function logout() {
    document.getElementById('login-area').style.display = 'block';
    document.getElementById('member-area').style.display = 'none';
}
