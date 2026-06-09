function showPage(pageId) {
    // 隱藏所有頁面
    document.querySelectorAll('.page-section').forEach(section => {
        section.classList.remove('active');
    });
    // 顯示目標頁面
    document.getElementById(pageId).classList.add('active');
}
