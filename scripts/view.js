'use strict';
// DOM selectors used by view
const labelSumIn = document.querySelectorAll('.section__statistics-value--income');
const labelSumOut = document.querySelectorAll('.section__statistics-value--expense')
const labelBalance = document.querySelector('.total-balance');
const containerTransactionsOverview = document.querySelector('.section__transactions-list');
const containerTransactionsAll = document.querySelector('.section__transactions-list--all');
const containerTransactionsAccounts = document.querySelector('.section__transactions-list--accounts');
const labelName = document.querySelector('.dashboard__account-name');
const labelAccountNum = document.querySelector('.dashboard__account-number');
const overlay = document.querySelector('.overlay');
const accountsRowDetailed = document.querySelector('.section__accounts-detailed');
const accountAddOverview = document.querySelector('.section__accound-add');
const modalFund = document.querySelector('.account__modal-fund');
const modalWithdraw = document.querySelector('.account__modal-withdraw');
const modalAdd = document.querySelector('.account__modal-add');
export const images = document.querySelectorAll('.profile-image');

export function formatedDate(movDate) {
    let date = new Date(movDate);
    const formated = new Intl.DateTimeFormat('en-US', {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
    return formated;
}

export function displayAccountsOverview(user) {
    const accountsRowOverview = document.querySelector('.section__content-accounts');
    const accountsRowTransactions = document.querySelector('.section__accounts-transactions');

    if (!accountsRowOverview || !accountsRowTransactions) return;

    accountsRowOverview.innerHTML = '';
    accountsRowTransactions.innerHTML = '';

    user.accounts.forEach((account, i) => {
        const calcBalance = Number(account.movements.map(mov => mov.amount).reduce((acc, curr) => acc + curr, 0).toFixed(2));
        const activeClass = i === 0 ? ' active' : '';
        const htmlOverview = `
        <div class="section__block">
            <h4>${account.name}</h4>
            <p class="section__block-value main-account">$ ${calcBalance}</p>
        </div>`;
        const htmlTransactions = `
        <div class="section__block ${activeClass}">
            <h4>${account.name}</h4>
            <div class="section__accounts-hide">
                <img src="images/icons/eye-closed.svg" alt="eye closed icon">
            </div>
            <p class="section__block-value main-account">$ ${calcBalance}</p>
        </div>`;
        accountsRowOverview.insertAdjacentHTML('beforeend', htmlOverview);
        accountsRowTransactions.insertAdjacentHTML('beforeend', htmlTransactions);
    })
}

export function displayAccountsDetailed(user) {
    if (!accountsRowDetailed) return;
    accountsRowDetailed.innerHTML = '';

    user.accounts.forEach((account, i) => {
        const calcBalance = Number(account.movements.map(mov => mov.amount).reduce((acc, curr) => acc + curr, 0).toFixed(2));
        const activeClass = i === 0 ? ' active' : '';
        const html = `
        <div class="section__block ${activeClass}">
            <h4>${account.name}</h4>
            <div class="section__accounts-hide">
                <img src="images/icons/eye-closed.svg" alt="eye closed icon">
            </div>
            <p class="section__block-value holiday-plan">$ ${calcBalance}</p>
            <div class="section__accounts-buttons">
                <button class="section__accounts-fund section__account-button">Fund</button>
                <button class="section__accounts-withdraw section__account-button">Withdraw</button>
            </div>
        </div>`
        accountsRowDetailed.insertAdjacentHTML('beforeend', html);
    })
}

export function displayBalance(user, getAllMovements) {
    const allMovements = getAllMovements(user);
    const income = Number(allMovements.filter(mov => mov.amount > 0).reduce((acc, curr) => acc + curr.amount, 0).toFixed(2));
    labelSumIn.forEach(label => label.textContent = `$ ${income}`);
    const expenses = Number(allMovements.filter(mov => mov.amount < 0).reduce((acc, curr) => acc + curr.amount, 0).toFixed(2));
    labelSumOut.forEach(label => label.textContent = `$ ${Math.abs(expenses)}`);

    const totalBalance = Number(allMovements.reduce((sum, curr) => sum + curr.amount, 0).toFixed(2));
    labelBalance.textContent = `$ ${totalBalance}`;
    user.totalBalance = totalBalance;
}

export function toggleValue(value, img) {
    if (!value) return;
    if (value.dataset.originalValue) {
        value.textContent = value.dataset.originalValue;
        value.dataset.originalValue = '';
    } else {
        value.dataset.originalValue = value.textContent;
        value.textContent = 'XXXXXXX';
    }

    if (value.dataset.originalValue) {
        img.src = 'images/icons/eye-open.svg';
    } else {
        img.src = 'images/icons/eye-closed.svg';
    }
}

export function setProfileUI(currentUser) {
    if (!currentUser) return;
    labelName.textContent = currentUser.owner;
    labelAccountNum.textContent = currentUser.id;
    images.forEach(img => img.src = currentUser.img)
    const profileNameEl = document.querySelector('.section__profile-name');
    const profileEmailEl = document.querySelector('.section__profile-email');
    const profilePhoneEl = document.querySelector('.section__profile-phone');
    const profileGenderEl = document.querySelector('.section__profile-gender');
    if (profileNameEl) profileNameEl.textContent = currentUser.owner;
    if (profileEmailEl) profileEmailEl.innerHTML = `<span>Email</span> ${currentUser.email || ''}`;
    if (profilePhoneEl) profilePhoneEl.innerHTML = `<span>Phone Number</span> ${currentUser.phone || ''}`;
    if (profileGenderEl) profileGenderEl.innerHTML = `<span>Gender</span> ${currentUser.gender || ''}`;
}

export function displayUI(user, getAllMovements) {
    const sortedAccountMovements = movements(user, getAllMovements);
    displayBalance(user, getAllMovements);
    displayAccountsDetailed(user);
    displayAccountsOverview(user);
    return sortedAccountMovements;
}

export function movements(user, getAllMovements) {
    const allMovements = getAllMovements(user);
    if (containerTransactionsOverview) containerTransactionsOverview.innerHTML = '';
    if (containerTransactionsAll) containerTransactionsAll.innerHTML = '';
    if (containerTransactionsAccounts) containerTransactionsAccounts.innerHTML = '';

    const sortedMovements = allMovements.sort((a, b) => new Date(b.date) - new Date(a.date));

    function movementData(mov) {
        const movementDate = mov.date
        const amount = Number(parseFloat(mov.amount).toFixed(2));
        const type = amount > 0 ? 'deposit' : 'withdrawal'
        const source = mov.source;
        const date = new Date(movementDate).toLocaleString();
        const displayDate = formatedDate(date);
        const displayMovement = amount > 0 ? '+ ' + amount : '- ' + Math.abs(amount);

        return { amount, type, displayDate, displayMovement, source };
    }

    sortedMovements.slice(0, 8).forEach((mov) => {
        const { type, displayDate, displayMovement, source } = movementData(mov);
        const transactionsOverview = `
        <li class="section__transactions-info">
           <div class="section__transactions-name">${source}</div>
           <div class="section__transactions-date">${displayDate}</div>
           <div class="section__transactions-value section__transactions-value--${type}">${displayMovement}</div>
        </li>`;
        containerTransactionsOverview.insertAdjacentHTML('beforeend', transactionsOverview);
    })

    const sortedAccountMovements = function (mov, container) {
        const { type, displayDate, displayMovement, source } = movementData(mov);
        const transactionsFull = `
        <li class="section__transactions-info">
            <div class="section__transactions-circle section__transactions-circle--${type}"></div>

            <div class="section__transactions-source">${source}</div>
            <div class="section__transactions-date">${displayDate}</div>
            <div class="section__transactions-value section__transactions-value--${type}">${displayMovement}</div>
            <div class="section__transactions-status">Completed</div>
        </li>`
        container.insertAdjacentHTML('beforeend', transactionsFull);
    }

    // By default, show first account movements
    if (user.accounts && user.accounts[0]) {
        user.accounts[0].movements.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8).forEach(mov => sortedAccountMovements(mov, containerTransactionsAccounts))
        user.accounts[0].movements.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(mov => sortedAccountMovements(mov, containerTransactionsAll))
    }

    return sortedAccountMovements;
}

function formatNotificationDate(dateString) {
    const now = new Date();
    const notifDate = new Date(dateString);
    const diffMs = now - notifDate;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        if (diffMinutes < 1) return "Just now";
        return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
    }

    if (diffHours < 24) {
        return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }

    if (diffDays === 1) return "1 day ago";
    if (diffDays === 3) return "3 days ago";
    if (diffDays === 7) return "7 days ago";

    // More than 7 days → show real date
    return notifDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

export function displayNotifications(user) {
    const notificationsContainer = document.querySelector('.dashboard__notifications-list');
    const notificationsCounter = document.querySelector('.dashboard__notifications-count');
    if (notificationsCounter && user.notifications) {
        const unreadCount = user.notifications.filter(notif => !notif.seen).length;
        notificationsCounter.textContent = unreadCount;
        notificationsCounter.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
    if (!notificationsContainer || !user.notifications) return;
    notificationsContainer.innerHTML = '';
    user.notifications.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((notif, index) => {
        const displayDate = formatNotificationDate(notif.date);
        const notifValue = notif.value > 0
            ? `<span class="dashboard__notifications-item--deposit">$${notif.value.toFixed(2)}</span>`
            : `<span class="dashboard__notifications-item--withdraw">$${Math.abs(notif.value).toFixed(2)}</span>`;
        const seenClass = notif.seen ? 'dashboard__notifications-item--seen' : '';
        const notifHTML = `
            <li 
                class="dashboard__notifications-item ${seenClass}" data-index="${index}">
            <p class="dashboard__notifications-text">${notif.message} ${notif.value ? notifValue : ''}</p>
            <span class="dashboard__notifications-time">${displayDate}</span>
         </li>`;
        notificationsContainer.insertAdjacentHTML('beforeend', notifHTML);
    });
}

export const accountModals = { modalFund, modalWithdraw, modalAdd, accountAddOverview };

// Event handler setup functions for controller callbacks

export function attachHideHandlers(onToggleValue) {
    document.querySelectorAll('.section__accounts-row').forEach(row => row.addEventListener('click', function (e) {
        const clickedHide = e.target.closest('.section__accounts-hide')
        if (!clickedHide) return;
        e.stopPropagation();
        const block = clickedHide.closest('.section__block');
        const value = block.querySelector('.section__block-value');
        const img = clickedHide.querySelector('img');
        onToggleValue(value, img);
    }))

    document.querySelector('.section__hide')?.addEventListener('click', function (e) {
        e.preventDefault();
        const img = document.querySelector('.section__hide > img');
        const values = document.getElementById('section-overview')?.querySelectorAll('.section__block-value');
        values?.forEach(value => {
            onToggleValue(value, img);
        })
    })
}

export function attachAccountRowEvents(user, onAccountSelect) {
    const currentRow = document.querySelector('.dashboard__section.active')?.querySelector('.section__accounts-row');
    if (!currentRow) return;
    const allBlocks = currentRow.querySelectorAll('.section__block');
    allBlocks.forEach(block => block.classList.remove('active'));
    if (allBlocks.length > 0) allBlocks[0].classList.add('active');

    currentRow.addEventListener('click', function (e) {
        const clickedBlock = e.target.closest('.section__block');
        if (!clickedBlock) return;

        onAccountSelect(e, clickedBlock, allBlocks, user);
    });
}

export function attachSectionChangeEvents(onSectionChange) {
    const sectionBtnList = document.querySelector('.dashboard__sections-list');
    const sectionBtn = document.querySelectorAll('.dashboard__item');
    const sections = document.querySelectorAll('.dashboard__section');
    const dashboardTitle = document.querySelector('.dashboard__title');

    sectionBtnList?.addEventListener('click', function (e) {
        const currentBtn = e.target.closest('.dashboard__item');
        if (!currentBtn) return;
        sectionBtn.forEach(btn => btn.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));
        currentBtn.classList.add('active');
        document.querySelector(`.dashboard__section--${currentBtn.dataset.btn}`).classList.add('active');
        dashboardTitle.textContent = currentBtn.dataset.btn.at(0).toUpperCase() + currentBtn.dataset.btn.slice(1);
        onSectionChange();
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
            document.getElementById('section-transactions').classList.add('active');
            onSectionChange();
        })
    })
}

export function attachNotificationEvents(onNotificationHover, onNotificationClick) {
    const list = document.querySelector('.dashboard__notifications-list');

    if (!list) return;

    list.addEventListener('mouseover', function (e) {
        const item = e.target.closest('.dashboard__notifications-item');
        if (!item) return;
        const index = Number(item.dataset.index);
        onNotificationHover(index, item);
    });

    list.addEventListener('click', function (e) {
        const item = e.target.closest('.dashboard__notifications-item');
        if (!item) return;
        const index = Number(item.dataset.index);
        onNotificationClick(index, item);
    });
}

export function initNotificationsHandler(onNotificationToggle) {
    const notificationsBtn = document.querySelector('.dashboard__notifications');
    const notificationsContainer = document.querySelector('.dashboard__notifications-list');
    if (!notificationsBtn || !notificationsContainer) return;
    notificationsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationsBtn.classList.toggle('active');
        onNotificationToggle();
    });
    document.addEventListener('click', (e) => {
        notificationsBtn.classList.remove('active');
    });
}

export function attachAccountFundModalEvents(onFundSubmit) {
    const radioBtns = modalFund.querySelectorAll('.account__input-radio');
    const btnFund = modalFund.querySelector('.account__button-green');
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
        const activePayment = modalFund.querySelector('.account__fund-section.active');
        if (!activePayment) return;
        const input = activePayment.querySelector('input[type="number"], input[type="text"]');
        const amountValue = parseFloat(input?.value || 0);

        onFundSubmit(amountValue, input);
    });
}

export function attachAccountWithdrawModalEvents(onWithdrawSubmit) {
    const btnWithdraw = modalWithdraw.querySelector('.account__button-green');
    const newBtnWithdraw = btnWithdraw.cloneNode(true);
    btnWithdraw.parentNode.replaceChild(newBtnWithdraw, btnWithdraw);

    newBtnWithdraw.addEventListener('click', function (e) {
        e.preventDefault();
        const input = modalWithdraw.querySelector('input[type="number"], input[type="text"]');
        const amountValue = parseFloat(input?.value || 0);

        onWithdrawSubmit(amountValue, input);
    });
}

export function attachAccountAddModalEvents(onAddSubmit) {
    const btnAdd = modalAdd.querySelector('.account__button-green');
    const newBtnAdd = btnAdd.cloneNode(true);
    btnAdd.parentNode.replaceChild(newBtnAdd, btnAdd);

    newBtnAdd.addEventListener('click', function (e) {
        e.preventDefault();
        const input = modalAdd.querySelector('input[type="text"]');
        const accountName = input.value;

        onAddSubmit(accountName, input);
    });
}

export function attachAccountAddOverviewEvents(onAccountAddClick) {
    accountAddOverview?.addEventListener('click', function (e) {
        e.preventDefault();
        onAccountAddClick();
    })
}

export function attachLoginFormEvents(onLoginSubmit, onRegisterToggle, onLoginToggle) {
    const loginEmail = document.getElementById('login__email');
    const loginPassword = document.getElementById('login__password');
    const loginBtn = document.querySelector('.login__button');
    const questionRegisterBtn = document.querySelector('.login__question-btn--register');
    const questionLoginBtn = document.querySelector('.register__question-btn--login');
    const loginTitle = document.querySelector('.login__title');
    const loginText = document.querySelector('.login__text');
    const loginBox = document.querySelector('.login__box');
    const registerBox = document.querySelector('.register__box');

    loginBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        onLoginSubmit(loginEmail.value, loginPassword.value);
    })

    questionRegisterBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        loginTitle.innerHTML = document.querySelector('.hero__title').innerHTML;
        loginText.innerHTML = document.querySelector('.hero__text').innerHTML;
        loginBox.classList.remove('active');
        registerBox.classList.add('active');
        onRegisterToggle();
    })

    questionLoginBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        loginTitle.innerHTML = 'Welcome Back';
        loginText.innerHTML = 'Enter Your Details to login to your Banking Dashboard again!';
        loginBox.classList.add('active');
        registerBox.classList.remove('active');
        onLoginToggle();
    })
}

export function attachRegisterFormEvents(onRegisterSubmit) {
    const registerForm = document.querySelector('.register__form');
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

    registerForm?.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', validateForm)
    })

    document.querySelector('.register__button')?.addEventListener('click', function (e) {
        e.preventDefault();
        if (!validateForm()) return;
        onRegisterSubmit(
            userName.value,
            userEmail.value,
            userPassword.value,
            userPhone?.value || '',
            userGender?.value || '',
            nameError,
            emailError,
            passwordError
        );
    })
}

export function attachProfileImageChangeEvents(onImageChange) {
    const imageChangeInput = document.getElementById('image-change');
    imageChangeInput?.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file?.type.startsWith('image/')) return;
        const url = URL.createObjectURL(file);
        images.forEach(img => { img.src = url; img.onload = () => URL.revokeObjectURL(url); })
        onImageChange(url);
    })
}

export function attachFaqsTabEvents() {
    const faqsTabs = document.querySelector('.faqs__tabs');
    faqsTabs?.addEventListener('click', function (e) {
        const clickedTab = e.target.closest('.faqs__tab');
        if (!clickedTab) return;
        document.querySelectorAll('.faqs__content').forEach(content => content.classList.remove('active'));
        document.querySelectorAll('.faqs__tab').forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');
        document.querySelector(`.faqs__content-${clickedTab.dataset.tab}`).classList.add('active');
    })
}

export function attachSidebarEvents(onSidebarToggle, onSectionClick, onLogoutClick) {
    const burgerBtn = document.querySelector('.burger');
    const sidebar = document.querySelector('.dashboard__sidebar');
    const logoutBtn = document.querySelector('.dashboard__logout');

    function sidebarRemoveActive() {
        burgerBtn?.classList.remove('active');
        overlay?.classList.remove('active');
        sidebar?.classList.remove('active');
        document.body.classList.remove('lock');
    }

    if (burgerBtn) {
        burgerBtn.addEventListener('click', function () {
            burgerBtn.classList.add('active');
            overlay?.classList.add('active');
            sidebar?.classList.add('active');
            document.body.classList.add('lock');
            onSidebarToggle();
        })
        overlay?.addEventListener('click', function () {
            sidebarRemoveActive();
        })
        document.querySelector('.dashboard__sections-list')?.addEventListener('click', function (e) {
            if (e.target.closest('.dashboard__item')) {
                sidebarRemoveActive();
                onSectionClick();
            }
        })
    }

    logoutBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        onLogoutClick(sidebarRemoveActive);
    })
}
