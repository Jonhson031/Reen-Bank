/* View: DOM rendering and UI helpers */
'use strict';
// DOM selectors used by view
const login = document.querySelector('.login');
const body = document.querySelector('body');
const labelSumIn = document.querySelectorAll('.section__statistics-value--income');
const labelSumOut = document.querySelectorAll('.section__statistics-value--expense')
const labelBalance = document.querySelector('.total-balance');
const containerTransactionsOverview = document.querySelector('.section__transactions-list');
const containerTransactionsAll = document.querySelector('.section__transactions-list--all');
const containerTransactionsAccounts = document.querySelector('.section__transactions-list--accounts');
const labelName = document.querySelector('.dashboard__account-name');
const labelAccountNum = document.querySelector('.dashboard__account-number');
const overlay = document.querySelector('.overlay');
const overlayLogin = document.querySelector('.overlay-login');
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

export function modalActive(modal) {
    if (!modal) return;
    modal.classList.add('active');
    overlay.classList.add('active');
}

export function modalRemoveActive(modal) {
    if (!modal) return;
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

export function initModalCloseEvents(onClose) {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') onClose();
    });

    overlay?.addEventListener('click', onClose);
}

export function modalFunc(modal) {
    modalActive(modal);
    const cancelBtn = modal.querySelector('.account__button-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modalRemoveActive(modal);
        })
    };
}

export function modalMessage(message, amount = null, user) {
    if (!message) return;
    overlay.classList.add('active');
    message.classList.add('active');

    message.querySelector('button').addEventListener('click', e => {
        e.preventDefault();
        overlay.classList.remove('active');
        message.classList.remove('active');
    })

    if (message.classList.contains('account__message-add')) {
        message.querySelector('span').textContent = `${amount}`;
        const newAccount = user.accounts.find(acc => acc.name === amount);
        message.querySelector('.account__button-green').addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.remove('active');
            message.classList.remove('active');
            modalFunc(modalFund);
        })

    }
    if (message.classList.contains('account__message-fund') || message.classList.contains('account__message-withdraw')) {
        message.querySelector('span').textContent = `$${amount}`;
    }
    if (message.classList.contains('account__message-register')) {
        overlayLogin.classList.add('active');
        message.querySelector('.account__button-green').addEventListener('click', (e) => {
            e.preventDefault();
            overlayLogin.classList.remove('active');
            message.classList.remove('active');
            login.classList.remove('active');
            document.querySelector('.dashboard').classList.add('active');
            body.classList.add('lock');
        })
    }
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
        console.log(unreadCount)
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
