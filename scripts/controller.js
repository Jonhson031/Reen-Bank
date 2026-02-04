'use strict';
import * as Model from './model.js';
import * as View from './view.js';

// Load persisted users
Model.loadUsers();

let currentUser;

// Restore currentUser from sessionStorage if on dashboard page
const dashboardEl = document.querySelector('.dashboard');
if (dashboardEl) {
    const storedUser = sessionStorage.getItem('currentUser');
    if (storedUser) {
        currentUser = JSON.parse(storedUser);
    }
}

const { modalFund, modalWithdraw, modalAdd, accountAddOverview } = View.accountModals;

function getOS() {
    const ua = navigator.userAgent;

    if (ua.includes("Windows")) return "Windows";
    if (ua.includes("Macintosh")) return "MacOS";
    if (ua.includes("iPhone") || ua.includes("iPad")) return "iOS";
    if (ua.includes("Android")) return "Android";
    if (ua.includes("Linux")) return "Linux";

    return "Unknown OS";
}

function getBrowser() {
    const ua = navigator.userAgent;

    if (ua.includes("Chrome") && !ua.includes("Edg")) return "Chrome";
    if (ua.includes("Firefox")) return "Firefox";
    if (ua.includes("Safari") && !ua.includes("Chrome")) return "Safari";
    if (ua.includes("Edg")) return "Edge";
    if (ua.includes("Opera") || ua.includes("OPR")) return "Opera";

    return "Unknown Browser";
}

function accountFundHandler(modal, user, currentAccount) {
    const radioBtns = modal.querySelectorAll('.account__input-radio');
    const btnFund = modal.querySelector('.account__button-green');
    const message = document.querySelector('.account__message-fund');
    const newBtnFund = btnFund.cloneNode(true);
    btnFund.parentNode.replaceChild(newBtnFund, btnFund);

    radioBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.account__fund-section').forEach(section => section.classList.remove('active'));
            const payment = document.getElementById(`form__fund-${btn.dataset.payment}`);
            if (payment) payment.classList.add('active');
        });
    });

    newBtnFund.addEventListener('click', function (e) {
        e.preventDefault();
        const activePayment = modal.querySelector('.account__fund-section.active');
        if (!activePayment) return;
        const input = activePayment.querySelector('input[type="number"], input[type="text"]');
        const amountValue = parseFloat(input?.value || 0);

        if (amountValue > 0) {
            const newMovement = { amount: Number(amountValue.toFixed(2)), date: new Date(), source: `${input.dataset.source}` };
            Model.addMovement(currentAccount, newMovement);
            if (input) input.value = '';
            View.modalRemoveActive(modal);
            const sortedAccountMovements = View.displayUI(user, Model.getAllMovements);
            toggleActiveAccount(user, document.querySelector('.section__transactions-list--accounts'), document.querySelector('.section__transactions-list--all'), sortedAccountMovements);
            View.modalMessage(message, amountValue, user);
            Model.addNotification(user, 'Your account was credited with', amountValue);
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            View.displayNotifications(user);
        }
    });
}

function closeActiveModal() {
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) View.modalRemoveActive(activeModal);
}

View.initModalCloseEvents(closeActiveModal);

function accountWithdrawHandler(modal, user, currentAccount) {
    const btnWithdraw = modal.querySelector('.account__button-green');
    const newBtnWithdraw = btnWithdraw.cloneNode(true);
    const calcBalance = Number(currentAccount.movements.map(mov => mov.amount).reduce((acc, curr) => acc + curr, 0).toFixed(2));
    btnWithdraw.parentNode.replaceChild(newBtnWithdraw, btnWithdraw);
    const message = document.querySelector('.account__message-withdraw');

    newBtnWithdraw.addEventListener('click', function (e) {
        e.preventDefault();
        const input = modal.querySelector('input[type="number"], input[type="text"]');
        const amountValue = parseFloat(input?.value || 0);
        if (amountValue > 0 && amountValue <= calcBalance) {
            const newMovement = { amount: Number(-amountValue.toFixed(2)), date: new Date(), source: `Withdraw` };
            Model.addMovement(currentAccount, newMovement);
            if (input) input.value = '';
            View.modalRemoveActive(modal);
            const sortedAccountMovements = View.displayUI(user, Model.getAllMovements);
            toggleActiveAccount(user, document.querySelector('.section__transactions-list--accounts'), document.querySelector('.section__transactions-list--all'), sortedAccountMovements);
            View.modalMessage(message, amountValue, user);
            Model.addNotification(user, 'Your account was debited with', -amountValue);
            sessionStorage.setItem('currentUser', JSON.stringify(user));
            View.displayNotifications(user);
        }
    });
}

function accountAddHandler(modal, user) {
    const btnAdd = modal.querySelector('.account__button-green');
    const newBtnAdd = btnAdd.cloneNode(true);
    btnAdd.parentNode.replaceChild(newBtnAdd, btnAdd);
    const message = document.querySelector('.account__message-add');

    newBtnAdd.addEventListener('click', function (e) {
        e.preventDefault();
        const input = modal.querySelector('input[type="text"]');
        const accountName = input.value
        const accountExist = user.accounts.find(acc => acc.name === accountName);
        if (accountName.trim().length > 0 && !accountExist) {
            const newAccount = { name: accountName, currency: 'USD', movements: [] };
            Model.addAccount(user, newAccount);
            if (input) input.value = '';
            View.modalRemoveActive(modal);
            const sortedAccountMovements = View.displayUI(user, Model.getAllMovements);
            toggleActiveAccount(user, document.querySelector('.section__transactions-list--accounts'), document.querySelector('.section__transactions-list--all'), sortedAccountMovements);
            View.modalMessage(message, accountName, user);

        }
    });
}

function toggleActiveAccount(user, containerTransactionsAccounts, containerTransactionsAll, sortedAccountMovements) {
    const currentRow = document.querySelector('.dashboard__section.active')?.querySelector('.section__accounts-row');
    if (!currentRow) return;
    const allBlocks = currentRow.querySelectorAll('.section__block');
    allBlocks.forEach(block => block.classList.remove('active'));
    if (allBlocks.length > 0) allBlocks[0].classList.add('active');

    currentRow.addEventListener('click', function (e) {
        const clickedBlock = e.target.closest('.section__block');
        if (clickedBlock && clickedBlock.classList.contains('section__accounts-add')) {
            e.stopPropagation();
            View.modalFunc(modalAdd);
            accountAddHandler(modalAdd, user);
            return;
        }
        if (!clickedBlock || clickedBlock.classList.contains('section__accounts-add')) return;
        document.querySelectorAll('.section__block').forEach(block => block.classList.remove('active'));
        containerTransactionsAll.innerHTML = '';
        containerTransactionsAccounts.innerHTML = '';
        allBlocks.forEach(block => block.classList.remove('active'));
        clickedBlock.classList.add('active');

        const currentAccount = user.accounts.find(account => account.name === clickedBlock.querySelector('h4').textContent);
        const sortedCurrentMovements = currentAccount.movements.sort((a, b) => new Date(b.date) - new Date(a.date));
        sortedCurrentMovements.slice(0, 8).forEach(mov => sortedAccountMovements(mov, containerTransactionsAccounts));
        sortedCurrentMovements.forEach(mov => sortedAccountMovements(mov, containerTransactionsAll));

        if (e.target.classList.contains('section__accounts-fund')) {
            e.stopPropagation();
            View.modalFunc(modalFund);
            accountFundHandler(modalFund, user, currentAccount);
            return
        }
        if (e.target.classList.contains('section__accounts-withdraw')) {
            e.stopPropagation();
            View.modalFunc(modalWithdraw);
            accountWithdrawHandler(modalWithdraw, user, currentAccount);
            return
        }
    });
}

function attachHideHandlers() {
    document.querySelectorAll('.section__accounts-row').forEach(row => row.addEventListener('click', function (e) {
        const clickedHide = e.target.closest('.section__accounts-hide')
        if (!clickedHide) return;
        e.stopPropagation();
        const block = clickedHide.closest('.section__block');
        const value = block.querySelector('.section__block-value');
        const img = clickedHide.querySelector('img');
        View.toggleValue(value, img);
    }))

    document.querySelector('.section__hide')?.addEventListener('click', function (e) {
        e.preventDefault();
        const img = document.querySelector('.section__hide > img');
        const values = document.getElementById('section-overview')?.querySelectorAll('.section__block-value');
        values?.forEach(value => {
            View.toggleValue(value, img);
        })
    })
}

function changeSectionAttach(user) {
    const sectionBtnList = document.querySelector('.dashboard__sections-list');
    const sectionBtn = document.querySelectorAll('.dashboard__item');
    const sections = document.querySelectorAll('.dashboard__section');
    const dashboardTitle = document.querySelector('.dashboard__title');
    const sectionTransactions = document.getElementById('section-transactions');

    sectionBtnList?.addEventListener('click', function (e) {
        const currentBtn = e.target.closest('.dashboard__item');
        if (!currentBtn) return;
        sectionBtn.forEach(btn => btn.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        currentBtn.classList.add('active');
        document.querySelector(`.dashboard__section--${currentBtn.dataset.btn}`).classList.add('active');
        dashboardTitle.textContent = currentBtn.dataset.btn.at(0).toUpperCase() + currentBtn.dataset.btn.slice(1);
        const sortedAccountMovements = View.displayUI(user, Model.getAllMovements);
        toggleActiveAccount(user, document.querySelector('.section__transactions-list--accounts'), document.querySelector('.section__transactions-list--all'), sortedAccountMovements);
    })

    document.querySelectorAll('.section__transactions-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            sectionBtn.forEach(btn => {
                btn.classList.remove('active');
                if (btn.dataset.btn === 'transactions') {
                    btn.classList.add('active');
                    dashboardTitle.textContent = btn.dataset.btn.at(0).toUpperCase() + btn.dataset.btn.slice(1);
                }
            });
            sections.forEach(section => section.classList.remove('active'));
            sectionTransactions.classList.add('active');
            const sortedAccountMovements = View.displayUI(user, Model.getAllMovements);
            toggleActiveAccount(user, document.querySelector('.section__transactions-list--accounts'), document.querySelector('.section__transactions-list--all'), sortedAccountMovements);
        })
    })
}

function markSeen(user, index, element, counter) {
    if (user.notifications[index].seen) return;

    // Update model
    user.notifications[index].seen = true;
    Model.saveUsers();

    // Update UI
    element.classList.add('dashboard__notifications-item--seen');

    View.displayNotifications(user);
}

function attachNotificationEvents(user) {
    const list = document.querySelector('.dashboard__notifications-list');
    const counter = document.querySelector('.dashboard__notifications-count');

    if (!list) return;

    list.addEventListener('mouseover', function (e) {
        const item = e.target.closest('.dashboard__notifications-item');
        if (!item) return;

        const index = Number(item.dataset.index);
        markSeen(user, index, item, counter);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    });

    list.addEventListener('click', function (e) {
        const item = e.target.closest('.dashboard__notifications-item');
        if (!item) return;
        const index = Number(item.dataset.index);
        markSeen(user, index, item, counter);
        sessionStorage.setItem('currentUser', JSON.stringify(user));
    });
}

function initNotificationsHandler() {
    const notificationsBtn = document.querySelector('.dashboard__notifications');
    const notificationsContainer = document.querySelector('.dashboard__notifications-list');
    if (!notificationsBtn || !notificationsContainer) return;
    notificationsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationsBtn.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        notificationsBtn.classList.remove('active');
    });
}

function initApp() {
    // Attach a few static handlers
    attachHideHandlers();

    // If on dashboard page and user is logged in, initialize dashboard
    if (dashboardEl && currentUser) {
        View.setProfileUI(currentUser);
        View.displayNotifications(currentUser);
        initNotificationsHandler();
        attachNotificationEvents(currentUser);
        const sortedAccountMovements = View.displayUI(currentUser, Model.getAllMovements);
        toggleActiveAccount(currentUser, document.querySelector('.section__transactions-list--accounts'), document.querySelector('.section__transactions-list--all'), sortedAccountMovements);
        changeSectionAttach(currentUser);
    }

    // Login / Register
    const loginEmail = document.getElementById('login__email');
    const loginPassword = document.getElementById('login__password');
    const loginBtn = document.querySelector('.login__button');
    const questionRegisterBtn = document.querySelector('.login__question-btn--register');
    const questionLoginBtn = document.querySelector('.register__question-btn--login');
    const loginTitle = document.querySelector('.login__title');
    const loginText = document.querySelector('.login__text');
    const loginBox = document.querySelector('.login__box');
    const registerBox = document.querySelector('.register__box');
    const os = getOS();
    const browser = getBrowser();

    loginBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        currentUser = Model.findUserByEmail(loginEmail.value);
        if (currentUser?.password === loginPassword.value) {
            Model.addNotification(currentUser, `'New login from ${browser} on ${os}`);
            // Store current user in sessionStorage so dashboard can access it
            sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
            // Navigate to dashboard page
            window.location.href = 'dashboard.html';
            View.displayNotifications(currentUser);
        }
    })

    questionRegisterBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        loginTitle.innerHTML = document.querySelector('.hero__title').innerHTML;
        loginText.innerHTML = document.querySelector('.hero__text').innerHTML;
        loginBox.classList.remove('active');
        registerBox.classList.add('active');
    })
    questionLoginBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        loginTitle.innerHTML = 'Welcome Back';
        loginText.innerHTML = 'Enter Your Details to login to your Banking Dashboard again!';
        loginBox.classList.add('active');
        registerBox.classList.remove('active');
    })

    // Register
    const userName = document.getElementById('register__name');
    const userEmail = document.getElementById('register__email');
    const userPassword = document.getElementById('register__password');
    const userPhone = document.getElementById('register__phone');
    const userGender = document.getElementById('register__gender');
    const nameError = document.querySelector('.register__error-name');
    const emailError = document.querySelector('.register__error-email');
    const passwordError = document.querySelector('.register__error-password');

    const validateForm = function () {
        let valid = true;
        if (!userName.value.trim() || userName.value.trim().length < 1) {
            nameError.style.display = 'block'; valid = false;
        }
        else { nameError.style.display = 'none'; }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userEmail.value.trim())) {
            emailError.style.display = 'block';
            valid = false;
        }
        else {
            emailError.style.display = 'none';
        }
        if (!userPassword.value.trim() || userPassword.value.trim().length < 8) {
            passwordError.style.display = 'block';
            valid = false;
        }
        else {
            passwordError.style.display = 'none';
        }
        return valid;
    }

    function registerUser() {
        if (!validateForm()) return;
        if (Model.users.some(u => u.email === userEmail.value.trim())) {
            emailError.textContent = 'Email already registered.';
            emailError.style.display = 'block';
            return;
        }
        const newUser = {
            owner: userName.value,
            email: userEmail.value,
            phone: userPhone?.value || '',
            gender: userGender?.value || '',
            id: Date.now().toString().slice(-10),
            password: userPassword.value,
            img: 'images/profile-img-placeholder.webp',
            notifications: [],
            accounts: [{
                name: 'Main Account',
                currency: 'USD',
                movements: []
            },],
        };
        Model.addUser(newUser);
        userName.value = '';
        userEmail.value = '';
        userPassword.value = '';
        if (userPhone) userPhone.value = '';
        if (userGender) userGender.value = '';
        currentUser = Model.users[Model.users.length - 1];
        const message = document.querySelector('.account__message-register');
        View.modalMessage(message, null, currentUser);
        Model.addNotification(currentUser, 'Welcome to Reen Bank!');
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        message.querySelector('.account__button-green').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'dashboard.html';
        })
        setTimeout(() => {
            window.location.href = 'dashboard.html';
        }, 3000);
        View.displayNotifications(currentUser);
    }


    document.querySelector('.register__form')?.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', validateForm)
    })
    document.querySelector('.register__button')?.addEventListener('click', function (e) { e.preventDefault(); registerUser(); })

    // Account Add button at overview section
    accountAddOverview?.addEventListener('click', function (e) {
        e.preventDefault();
        View.modalFunc(modalAdd);
        accountAddHandler(modalAdd, currentUser);
    })

    // Profile image change
    const imageChangeInput = document.getElementById('image-change');
    imageChangeInput?.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file?.type.startsWith('image/')) return;
        const url = URL.createObjectURL(file);
        View.images.forEach(img => { img.src = url; img.onload = () => URL.revokeObjectURL(url); })
        if (currentUser) { currentUser.img = url; const idx = Model.users.findIndex(u => u.email === currentUser.email); if (idx >= 0) Model.users[idx].img = url; Model.saveUsers(); }
    })

    // FAQs tabs
    const faqsTabs = document.querySelector('.faqs__tabs');
    faqsTabs?.addEventListener('click', function (e) {
        const clickedTab = e.target.closest('.faqs__tab');
        if (!clickedTab) return;
        document.querySelectorAll('.faqs__content').forEach(content => content.classList.remove('active'));
        document.querySelectorAll('.faqs__tab').forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');
        document.querySelector(`.faqs__content-${clickedTab.dataset.tab}`).classList.add('active');
    })

    // Sidebar / burger
    const burgerBtn = document.querySelector('.burger');
    const sidebar = document.querySelector('.dashboard__sidebar');
    const overlay = document.querySelector('.overlay');
    const logoutBtn = document.querySelector('.dashboard__logout');

    function sidebarRemoveActive() {
        burgerBtn.classList.remove('active');
        overlay.classList.remove('active');
        sidebar.classList.remove('active');
        document.body.classList.remove('lock');
    }

    if (burgerBtn) {
        burgerBtn.addEventListener('click', function () {
            burgerBtn.classList.add('active');
            overlay.classList.add('active');
            sidebar.classList.add('active');
            document.body.classList.add('lock');
        })
        overlay?.addEventListener('click', function () {
            sidebarRemoveActive();
        })
        document.querySelector('.dashboard__sections-list')?.addEventListener('click', function (e) {
            if (e.target.closest('.dashboard__item')) {
                sidebarRemoveActive();
            }
        })
    }

    logoutBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        const message = document.querySelector('.account__message-logout');
        View.modalMessage(message)
        message.querySelector('button').addEventListener('click', e => {
            e.preventDefault();
            message.classList.remove('active');
            sidebarRemoveActive();
        })
        message.querySelector('.account__button-green').addEventListener('click', (e) => {
            e.preventDefault();
            // Clear sessionStorage and redirect to login page
            sessionStorage.removeItem('currentUser');
            window.location.href = 'index.html';
        })
    })
}


initApp();

if (dashboardEl && !currentUser) {
    window.location.href = 'login.html';
}
