const labelSumIn = document.querySelectorAll('.section__statistics-value--income');
const labelSumOut = document.querySelectorAll('.section__statistics-value--expense')
const labelBalance = document.querySelector('.total-balance');
const labelName = document.querySelector('.dashboard__account-name');
const labelAccountNum = document.querySelector('.dashboard__account-number');
const accountsRowDetailed = document.querySelector('.section__accounts-detailed');
const images = document.querySelectorAll('.profile-image');

import movements from './movementsView.js';

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

export function attachHideHandlers() {
    document.querySelectorAll('.section__accounts-row').forEach(row => row.addEventListener('click', function (e) {
        const clickedHide = e.target.closest('.section__accounts-hide')
        if (!clickedHide) return;
        e.stopPropagation();
        const block = clickedHide.closest('.section__block');
        const value = block.querySelector('.section__block-value');
        const img = clickedHide.querySelector('img');
        toggleValue(value, img);
    }))

    document.querySelector('.section__hide')?.addEventListener('click', function (e) {
        e.preventDefault();
        const img = document.querySelector('.section__hide > img');
        const values = document.getElementById('section-overview')?.querySelectorAll('.section__block-value');
        values?.forEach(value => {
            toggleValue(value, img);
        })
    })
}

export function attachProfileImageChange(handler) {
    const images = document.querySelectorAll('.profile-image');
    const imageChangeInput = document.getElementById('image-change');
    imageChangeInput?.addEventListener('change', function (e) {
        const file = e.target.files[0];
        if (!file?.type.startsWith('image/')) return;
        const url = URL.createObjectURL(file);
        images.forEach(img => {
            img.src = url;
            img.onload = () => URL.revokeObjectURL(url);
        })
        handler(url);
    })
}

export function attatchToggleActiveAccountEvent({ onAccountClick, onAddAccountClick, onFundClick, onWithdrawClick }) {
    const containerTransactionsAccounts = document.querySelector('.section__transactions-list--accounts')
    const containerTransactionsAll = document.querySelector('.section__transactions-list--all');
    const currentRow = document.querySelector('.dashboard__section.active')?.querySelector('.section__accounts-row');
    if (!currentRow) return;
    const allBlocks = currentRow.querySelectorAll('.section__block');
    allBlocks.forEach(block => block.classList.remove('active'));
    if (allBlocks.length > 0) allBlocks[0].classList.add('active');

    currentRow.addEventListener('click', function (e) {
        const clickedBlock = e.target.closest('.section__block');
        if (!clickedBlock) return;

        if (clickedBlock && clickedBlock.classList.contains('section__accounts-add')) {
            e.stopPropagation();
            onAddAccountClick();
            return;
        }
        if (!clickedBlock || clickedBlock.classList.contains('section__accounts-add')) return;
        document.querySelectorAll('.section__block').forEach(block => block.classList.remove('active'));
        containerTransactionsAll.innerHTML = '';
        containerTransactionsAccounts.innerHTML = '';
        allBlocks.forEach(block => block.classList.remove('active'));
        clickedBlock.classList.add('active');
        const accountName = clickedBlock.querySelector('h4').textContent;
        onAccountClick(accountName, containerTransactionsAccounts, containerTransactionsAll);

        if (e.target.classList.contains('section__accounts-fund')) {
            e.stopPropagation();
            // Modals.modalFunc(modalFund);
            // attachAccountFundEvent(modalFund, handleFund, currentUser, currentAccount);
            onFundClick(accountName);
            return
        }
        if (e.target.classList.contains('section__accounts-withdraw')) {
            e.stopPropagation();
            onWithdrawClick(accountName);
            return
        }
    });
}

export function attatchChangeSectionEvent(user, handle) {
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
        handle(user);
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
            handle(user);
        })
    })
}