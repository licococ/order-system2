let currentUser = null;
        let cart = [];

        // 🧠 核心更改：預設全新的管理者通行證
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
                if(currentUser) renderHistoryOrders();
            }
        }

        function getGlobalOrders() {
            return JSON.parse(localStorage.getItem('global_bakery_orders')) || [];
        }

        function saveGlobalOrders(orders) {
            localStorage.setItem('global_bakery_orders', JSON.stringify(orders));
        }

        function showPage(pageId, scrollToCart = false) {
            const sections = document.querySelectorAll('.page-section');
            sections.forEach(sec => sec.classList.remove('active'));
            document.getElementById(pageId).classList.add('active');

            document.getElementById('nav-home').classList.remove('active');
            document.getElementById('nav-order').classList.remove('active');
            document.getElementById('nav-login').classList.remove('active');

            if (pageId === 'home-section') document.getElementById('nav-home').classList.add('active');
            if (pageId === 'order-section') document.getElementById('nav-order').classList.add('active');
            if (pageId === 'login-section') document.getElementById('nav-login').classList.add('active');

            if (scrollToCart && window.innerWidth <= 950) {
                setTimeout(() => {
                    const cartAnchor = document.getElementById('cart-anchor');
                    if (cartAnchor) {
                        const topOffset = cartAnchor.getBoundingClientRect().top + window.pageYOffset - 90;
                        window.scrollTo({top: topOffset, behavior: 'smooth'});
                    }
                }, 50);
            } else {
                window.scrollTo({top: 0, behavior: 'smooth'});
            }
        }

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
                    </div>
                `;
            });
        }

        window.onload = function() {
            filterCategory('全部甜點');
        };

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

            container.innerHTML = '';
            let total = 0, count = 0;

            if (cart.length === 0) {
                emptyMsg.style.display = 'block';
                totalBox.style.display = 'none';
                cartCount.innerText = '0';
                return;
            }

            emptyMsg.style.display = 'none';
            totalBox.style.display = 'block';

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
            totalSpan.innerText = total;
            cartCount.innerText = count;
        }

        function removeFromCart(index) {
            cart.splice(index, 1);
            updateCartUI();
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
            document.getElementById('login-form-box').style.display = type === 'register' ? 'none' : 'block';
            document.getElementById('register-form-box').style.display = type === 'register' ? 'block' : 'none';
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

        // 🧠 會員登入核心控制器（已更新為判斷 sweet@123）
        function handleLogin(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const enteredPassword = document.getElementById('login-password').value;

            if (localStorage.getItem(`user_${email}`) === enteredPassword) {
                currentUser = email;
                document.getElementById('login-form-box').style.display = 'none';
                document.getElementById('user-status').style.display = 'block';
                document.getElementById('user-display-email').innerText = email;
                document.getElementById('history-box').style.display = 'block';
                
                // 🔐 核心防線：精準識別全新管理者帳號 sweet@123
                if (email === 'sweet@123') {
                    document.getElementById('admin-switcher-bar').style.display = 'flex'; // 解鎖切換列
                    document.getElementById('admin-badge-notice').style.display = 'block'; // 顯現管理提示
                } else {
                    document.getElementById('admin-switcher-bar').style.display = 'none';
                    document.getElementById('admin-badge-notice').style.display = 'none';
                }

                renderHistoryOrders();
            } else {
                alert("帳號或密碼錯誤！");
            }
        }

        function handleLogout() {
            currentUser = null; cart = []; updateCartUI();
            document.getElementById('login-form-box').style.display = 'block';
            document.getElementById('user-status').style.display = 'none';
            document.getElementById('history-box').style.display = 'none';
            
            // 🔒 登出時重置狀態，隱藏控制列並退回普通顧客前台
            document.getElementById('admin-switcher-bar').style.display = 'none';
            switchSystem('user'); 
        }

        function renderHistoryOrders() {
            const container = document.getElementById('history-list-content');
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

            document.getElementById('stat-new-orders').innerText = `${newCount} 筆`;
            document.getElementById('stat-cooking-orders').innerText = `${cookingCount} 筆`;
            document.getElementById('stat-total-revenue').innerText = revenue;

            const listContainer = document.getElementById('admin-orders-list-box');
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

// 頁面載入後自動執行
window.onload = () => {
    filterCategory('全部甜點');
};
