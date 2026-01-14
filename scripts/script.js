'use strict';
const login = document.querySelector('.login');
const loginEmail = document.getElementById('login__email');
const loginPassword = document.getElementById('login__password');
const body = document.querySelector('body');
const dashboard = document.querySelector('.dashboard');
const labelSumIn = document.querySelectorAll('.section__statistics-value--income');
const labelSumOut = document.querySelectorAll('.section__statistics-value--expense')
const labelBalance = document.querySelector('.total-balance');
const inputEmail = document.getElementById('login__email');
const loginBtn = document.querySelector('.login__button');
const containerTransactionsOverview = document.querySelector('.section__transactions-list');
const containerTransactionsAll = document.querySelector('.section__transactions-list--all');
const containerTransactionsAccounts = document.querySelector('.section__transactions-list--accounts');
const labelValue = document.querySelectorAll('.section__transactions-value');
const labelName = document.querySelector('.dashboard__account-name');
const labelAccountNum = document.querySelector('.dashboard__account-number');
const sectionOverwiew = document.getElementById('section-overview');
const sectionAccounts = document.getElementById('section-accounts');
const sectionTransactions = document.getElementById('section-transactions');
const sectionBtnList = document.querySelector('.dashboard__sections-list');
const sectionBtn = document.querySelectorAll('.dashboard__item');
const sections = document.querySelectorAll('.dashboard__section');
const dashboardTitle = document.querySelector('.dashboard__title');
const overlay = document.querySelector('.overlay');
const overlayLogin = document.querySelector('.overlay-login');
const accountsRowDetailed = document.querySelector('.section__accounts-detailed');
const modalFund = document.querySelector('.account__modal-fund');
const accountAddOverview = document.querySelector('.section__accound-add');
const modalWithdraw = document.querySelector('.account__modal-withdraw');
const modalAdd = document.querySelector('.account__modal-add');
const burgerBtn = document.querySelector('.burger');
const sidebar = document.querySelector('.dashboard__sidebar');
const logoutBtn = document.querySelector('.dashboard__logout');
const images = document.querySelectorAll('.profile-image');

document.querySelector('.header__button').addEventListener('click', (e) => {
    e.preventDefault();
    login.classList.add('active');
})

// Users
const users = [
    {
        owner: 'Joe Doe',
        email: 'test@email.com',
        id: '1234567890',
        password: 'test',
        img: 'images/profile-img.svg',
        accounts: [
            {
                name: 'Main Account',
                currency: 'USD',
                movements: [
                    {
                        amount: 200,
                        date: '2019-11-18T21:31:17.178Z',
                        source: 'Direct Deposit'
                    },
                    {
                        amount: 455.23,
                        date: '2019-12-23T07:42:02.383Z',
                        source: 'Credit Card'
                    },
                    {
                        amount: 4244.23242424,
                        date: '2019-12-23T07:42:02.383Z',
                        source: 'Credit Card'
                    },
                    {
                        amount: -306.5,
                        date: '2020-01-28T09:15:04.904Z',
                        source: 'Jane Doe'
                    },
                    {
                        amount: 25000,
                        date: '2020-04-01T10:17:24.185Z',
                        source: 'Direct Deposit'
                    },
                    {
                        amount: -642.21,
                        date: '2020-05-08T14:11:59.604Z',
                        source: 'Credit Card'
                    },
                    {
                        amount: -133.9,
                        date: '2020-05-27T17:01:17.194Z',
                        source: 'Jane Doe'
                    },
                    {
                        amount: 79.97,
                        date: '2020-07-11T23:36:17.929Z',
                        source: 'Direct Deposit'
                    },
                    {
                        amount: 1300,
                        date: '2020-07-13T10:51:36.790Z',
                        source: 'Credit Card'
                    },
                    {
                        amount: 1300,
                        date: '2020-07-14T10:51:36.790Z',
                        source: 'Credit Card'
                    },
                    {
                        amount: 1300,
                        date: '2020-07-15T10:51:36.790Z',
                        source: 'Credit Card'
                    },
                    {
                        amount: -5300,
                        date: '2020-07-15T11:51:36.790Z',
                        source: 'Credit Card'
                    },
                    {
                        amount: 310.5,
                        date: '2020-07-15T12:51:36.790Z',
                        source: 'Credit Card'
                    },
                ]
            },

            {
                name: 'Savings Account',
                currency: 'USD',
                movements: [
                    {
                        amount: 400,
                        date: '2020-11-18T21:31:17.178Z',
                        source: 'Direct Deposit'
                    },
                    {
                        amount: 953.2,
                        date: '2020-12-23T07:42:02.383Z',
                        source: 'Credit Card'
                    },
                    {
                        amount: -42.5,
                        date: '2021-01-28T09:15:04.904Z',
                        source: 'Jane Doe'
                    },
                    {
                        amount: 2400,
                        date: '2021-04-01T10:17:24.185Z',
                        source: 'Direct Deposit'
                    },
                    {
                        amount: -642.21,
                        date: '2021-05-08T14:11:59.604Z',
                        source: 'Credit Card'
                    },
                    {
                        amount: -213.9,
                        date: '2021-05-27T17:01:17.194Z',
                        source: 'Jane Doe'
                    },
                    {
                        amount: 719.97,
                        date: '2021-07-11T23:36:17.929Z',
                        source: 'Direct Deposit'
                    },
                    {
                        amount: 2743,
                        date: '2021-07-12T10:51:36.790Z',
                        source: 'Credit Card'
                    }
                ]
            },
            {
                name: 'Holiday Savings',
                currency: 'USD',
                movements: [
                    {
                        amount: 155.5,
                        date: '2022-11-18T21:31:17.178Z',
                        source: 'Transfer'
                    },
                    {
                        amount: 144.4,
                        date: '2022-12-23T07:42:02.383Z',
                        source: 'Credit Card'
                    },
                    {
                        amount: -42.5,
                        date: '2023-01-28T09:15:04.904Z',
                        source: 'Jane Doe'
                    },
                    {
                        amount: 1400,
                        date: '2023-04-01T10:17:24.185Z',
                        source: 'Direct Deposit'
                    },
                ]
            },
        ],
    }
]

/**
 * Persist the in-memory `users` array to localStorage.
 */
const saveUsers = function () {
    try {
        localStorage.setItem('users', JSON.stringify(users));
    } catch (err) {
        console.error('Saving users to localStorage failed', err);
    }
};

/**
 * Load users from localStorage into the in-memory `users` array.
 * Replaces the default fixtures if stored data exists.
 */
const loadUsers = function () {
    try {
        const stored = localStorage.getItem('users');
        if (!stored) return;
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
            users.splice(0, users.length, ...parsed);
        }
    } catch (err) {
        console.error('Loading users from localStorage failed', err);
    }
};

// Initialize from storage
loadUsers();

/**
 * Render the accounts overview blocks for a user.
 * @param {Object} user
 */
const displayAccountsOverview = function (user) {
    const accountsRowOverview = document.querySelector('.section__content-accounts');
    const accountsRowTransactions = document.querySelector('.section__accounts-transactions');

    accountsRowOverview.innerHTML = '';
    accountsRowTransactions.innerHTML = '';

    user.accounts.forEach((account, i) => {
        const calcBalance = Number(account.movements.map(mov => mov.amount).reduce((acc, curr) => acc + curr, 0).toFixed(2));
        const activeClass = i === 0 ? ' active' : ''; // add active class only to first block
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
/**
 * Render detailed account blocks (with action buttons) for a user.
 * @param {Object} user
 */
const displayAccountsDetailed = function (user) {
    accountsRowDetailed.innerHTML = '';

    user.accounts.forEach((account, i) => {
        const calcBalance = Number(account.movements.map(mov => mov.amount).reduce((acc, curr) => acc + curr, 0).toFixed(2));
        const activeClass = i === 0 ? ' active' : ''; // add active class only to first block
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


/**
 * Format a movement date for display.
 * @param {string|Date} movDate
 * @returns {string}
 */
const formatedDate = function (movDate) {
    let date = new Date(movDate);
    // const showData = `${day}/`
    const formated = new Intl.DateTimeFormat('en-US', {
        year: "numeric",
        month: "short",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format(date);
    return formated;
}


/**
 * Return a flat list of all movements across a user's accounts.
 * @param {Object} user
 * @returns {Array}
 */
const getAllMovements = function (user) {
    return user.accounts.flatMap(account =>
        account.movements
    )
};

/**
 * Calculate totals and update balance/income/expense labels.
 * @param {Object} user
 */
const displayBalance = function (user) {
    const allMovements = getAllMovements(user);
    const income = Number(allMovements.filter(mov => mov.amount > 0).reduce((acc, curr) => acc + curr.amount, 0).toFixed(2));
    labelSumIn.forEach(label => label.textContent = `$ ${income}`);
    const expenses = Number(allMovements.filter(mov => mov.amount < 0).reduce((acc, curr) => acc + curr.amount, 0).toFixed(2));
    labelSumOut.forEach(label => label.textContent = `$ ${Math.abs(expenses)}`);

    const totalBalance = Number(allMovements.reduce((sum, curr) => sum + curr.amount, 0).toFixed(2));
    labelBalance.textContent = `$ ${totalBalance}`;
    user.totalBalance = totalBalance;
}


/** Activate modal UI */
const modalActive = function (modal) {
    modal.classList.add('active');
    overlay.classList.add('active');
}

/** Deactivate modal UI */
const modalRemoveActive = function (modal) {
    modal.classList.remove('active');
    overlay.classList.remove('active');
}

// Hide modal by esc
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        const activeModal = document.querySelector('.modal.active');
        if (activeModal) modalRemoveActive(activeModal);
    }
});

// Hide modal by clicling on overlay
overlay.addEventListener('click', () => {
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) modalRemoveActive(activeModal);
});


/** Open modal and attach cancel handler if present */
const modalFunc = function (modal) {
    modalActive(modal);
    const cancelBtn = modal.querySelector('.account__button-cancel');
    if (cancelBtn) {
        cancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modalRemoveActive(modal);
        })
    };
}

/** Update all visible UI pieces for a user */
const displayUI = function (user) {
    movements(user);
    displayBalance(user)
    displayAccountsDetailed(user);
    displayAccountsOverview(user);
}

/**
 * Show a generic modal message and optionally attach actions.
 * @param {HTMLElement} message
 * @param {any} [amount]
 * @param {Object} [user]
 */
const modalMessage = function (message, amount = null, user) {
    if (!message) return;
    overlay.classList.add('active');
    message.classList.add('active');

    message.querySelector('button').addEventListener('click', e => {
        e.preventDefault();
        overlay.classList.remove('active');
        message.classList.remove('active');
    })

    if (message.classList.contains('account__message-add')) {
        message.querySelector('span').textContent = `${amount}`; // amount here is new acount name
        const newAccount = user.accounts.find(acc => acc.name === amount);
        message.querySelector('.account__button-green').addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.remove('active');
            message.classList.remove('active');
            // body.classList.remove('lock');
            modalFunc(modalFund);
            accountFund(modalFund, user, newAccount);
        })

    }
    if (message.classList.contains('.account__message-fund') || message.classList.contains('.account__message-withdraw')) {
        message.querySelector('span').textContent = `$${amount}`;
    }
    if (message.classList.contains('account__message-register')) {
        overlayLogin.classList.add('active');
        message.querySelector('.account__button-green').addEventListener('click', (e) => {
            e.preventDefault();
            overlayLogin.classList.remove('active');
            message.classList.remove('active');
            login.classList.remove('active');
            dashboard.classList.add('active');
            body.classList.add('lock');
        })
    }
}

/**
 * Handle funding an account via the fund modal.
 * @param {HTMLElement} modal
 * @param {Object} user
 * @param {Object} currentAccount
 */
const accountFund = function (modal, user, currentAccount) {
    const radioBtns = modal.querySelectorAll('.account__input-radio');
    const btnFund = modal.querySelector('.account__button-green');
    const message = document.querySelector('.account__message-fund');
    // Remove old listener (important if modal opens multiple times)
    const newBtnFund = btnFund.cloneNode(true);
    btnFund.parentNode.replaceChild(newBtnFund, btnFund);

    // Switch visibility when radio buttons are clicked
    radioBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            document.querySelectorAll('.account__fund-section').forEach(section => section.classList.remove('active'));
            const payment = document.getElementById(`form__fund-${btn.dataset.payment}`);
            if (payment) payment.classList.add('active');
        });
    });

    // Handle fund button click only once
    newBtnFund.addEventListener('click', function (e) {
        e.preventDefault();
        const activePayment = modal.querySelector('.account__fund-section.active');

        if (!activePayment) return; // no payment method selected

        const input = activePayment.querySelector('input[type="number"], input[type="text"]');
        const amountValue = parseFloat(input?.value || 0);


        if (amountValue > 0) {
            const newMovement = {
                amount: Number(amountValue.toFixed(2)),
                date: new Date(),
                source: `${input.dataset.source}`
            };

            currentAccount.movements.push(newMovement);
            // Persist change
            saveUsers();

            // Reset input, close modal, update UI
            if (input) input.value = '';
            modalRemoveActive(modal);
            displayUI(user);
            modalMessage(message, amountValue);
        }
    });
};

/**
 * Handle withdrawing from an account via the withdraw modal.
 * @param {HTMLElement} modal
 * @param {Object} user
 * @param {Object} currentAccount
 */
const accountWithdraw = function (modal, user, currentAccount) {
    const btnWithdraw = modal.querySelector('.account__button-green');
    const newBtnWithdraw = btnWithdraw.cloneNode(true);
    const calcBalance = Number(currentAccount.movements.map(mov => mov.amount).reduce((acc, curr) => acc + curr, 0).toFixed(2));
    btnWithdraw.parentNode.replaceChild(newBtnWithdraw, btnWithdraw);

    const message = document.querySelector('.account__message-withdraw');

    // Handle fund button click only once
    newBtnWithdraw.addEventListener('click', function (e) {
        e.preventDefault();

        const input = modal.querySelector('input[type="number"], input[type="text"]');
        const amountValue = parseFloat(input?.value || 0);

        if (amountValue > 0 && amountValue <= calcBalance) {
            const newMovement = {
                amount: Number(-amountValue.toFixed(2)),
                date: new Date(),
                source: `Withdraw`,
            };

            currentAccount.movements.push(newMovement);
            // Persist change
            saveUsers();

            // Reset input, close modal, update UI
            if (input) input.value = '';
            modalRemoveActive(modal);
            displayUI(user);
            modalMessage(message, amountValue);
        }
    });
}

/**
 * Handle adding a new account for the user.
 * @param {HTMLElement} modal
 * @param {Object} user
 */
const accountAdd = function (modal, user) {
    const btnAdd = modal.querySelector('.account__button-green');
    const newBtnAdd = btnAdd.cloneNode(true);
    btnAdd.parentNode.replaceChild(newBtnAdd, btnAdd);

    const message = document.querySelector('.account__message-add');

    // Handle fund button click only once
    newBtnAdd.addEventListener('click', function (e) {
        e.preventDefault();

        const input = modal.querySelector('input[type="text"]');
        const accountName = input.value
        const accountExist = user.accounts.find(acc => acc.name === accountName);
        if (accountName.trim().length > 0 && !accountExist) {
            const newAccount = {
                name: accountName,
                currency: 'USD',
                movements: [],
            };

            user.accounts.push(newAccount);

            // Persist new account
            saveUsers();

            // Reset input, close modal, update UI
            if (input) input.value = '';
            modalRemoveActive(modal);
            displayUI(user);
            modalMessage(message, accountName, user);
        }
    });
}

// Logout
const sidebarRemoveActive = function () {
    burgerBtn.classList.remove('active');
    overlay.classList.remove('active');
    sidebar.classList.remove('active');
}
logoutBtn.addEventListener('click', function (e) {
    e.preventDefault();
    const message = document.querySelector('.account__message-logout');
    modalMessage(message)
    // dashboard.classList.remove('active');
    message.querySelector('button').addEventListener('click', e => {
        e.preventDefault();
        message.classList.remove('active');
        sidebarRemoveActive();
    })
    message.querySelector('.account__button-green').addEventListener('click', (e) => {
        e.preventDefault();
        message.classList.remove('active');
        dashboard.classList.remove('active');
        body.classList.remove('lock');
        document.querySelectorAll('.dashboard__item').forEach(btn => btn.classList.remove('active'));
        document.querySelector('.dashboard__item').classList.add('active');
        document.querySelectorAll('.dashboard__section').forEach(section => section.classList.remove('active'));
        sectionOverwiew.classList.add('active');
        sidebarRemoveActive();
    })
});

// Account Add button at overview section
accountAddOverview.addEventListener('click', function (e) {
    e.preventDefault();
    modalFunc(modalAdd);
    accountAdd(modalAdd, currentUser);
})

/**
 * Toggle which account block is active and render related transactions.
 */
const toggleActiveAccount = function (user, containerTransactionsAccounts, containerTransactionsAll, sortedAccountMovements) {
    const currentRow = document.querySelector('.dashboard__section.active').querySelector('.section__accounts-row')

    if (!currentRow) return;

    // Remove 'active' from all blocks first
    const allBlocks = currentRow.querySelectorAll('.section__block');
    allBlocks.forEach(block => block.classList.remove('active'));

    // Set first block active by default
    if (allBlocks.length > 0) allBlocks[0].classList.add('active');

    // Handle clicks
    currentRow.addEventListener('click', function (e) {
        const clickedBlock = e.target.closest('.section__block');
        if (clickedBlock && clickedBlock.classList.contains('section__accounts-add')) {
            e.stopPropagation();
            modalFunc(modalAdd);
            accountAdd(modalAdd, user);
            return;
        }

        // Ignore clicks outside block or on add button
        if (!clickedBlock || clickedBlock.classList.contains('section__accounts-add')) return;
        document.querySelectorAll('.section__block').forEach(block => block.classList.remove('active'));

        // Clear containers
        containerTransactionsAll.innerHTML = '';
        containerTransactionsAccounts.innerHTML = '';

        // Toggle active class
        allBlocks.forEach(block => block.classList.remove('active'));
        clickedBlock.classList.add('active');

        const currentAccount = user.accounts.find(account => account.name === clickedBlock.querySelector('h4').textContent);
        const sortedCurrentMovements = currentAccount.movements.sort((a, b) => new Date(b.date) - new Date(a.date));
        sortedCurrentMovements.slice(0, 8).forEach(mov => sortedAccountMovements(mov, containerTransactionsAccounts));
        sortedCurrentMovements.forEach(mov => sortedAccountMovements(mov, containerTransactionsAll));

        // Fund and Withdraw buttons
        if (e.target.classList.contains('section__accounts-fund')) {
            e.stopPropagation();
            modalFunc(modalFund);
            accountFund(modalFund, user, currentAccount);
            return
        }
        if (e.target.classList.contains('section__accounts-withdraw')) {
            e.stopPropagation();
            modalFunc(modalWithdraw);
            accountWithdraw(modalWithdraw, user, currentAccount);
            return
        }
    });
};


/**
 * Render recent movements for overview, per-account, and full lists.
 * @param {Object} user
 */
function movements(user) {
    const allMovements = getAllMovements(user);
    containerTransactionsOverview.innerHTML = '';
    containerTransactionsAll.innerHTML = '';
    containerTransactionsAccounts.innerHTML = '';


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

    sortedMovements.slice(0, 8).forEach((mov) => { // Transactions on Overview. Show only last 8
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
    user.accounts[0].movements.sort((a, b) => new Date(b.date) - new Date(a.date)).slice(0, 8).forEach(mov => sortedAccountMovements(mov, containerTransactionsAccounts))
    user.accounts[0].movements.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach(mov => sortedAccountMovements(mov, containerTransactionsAll))


    // Call external toggleActiveAccount
    toggleActiveAccount(user, containerTransactionsAccounts, containerTransactionsAll, sortedAccountMovements);
}

/** Toggle visibility of a numeric value (mask/unmask) */
const toggleValue = function (value, img) {
    if (value.dataset.originalValue) {
        // Restore
        value.textContent = value.dataset.originalValue;
        value.dataset.originalValue = '';
    } else {
        // Mask
        value.dataset.originalValue = value.textContent;
        value.textContent = 'XXXXXXX';
    }

    // Optional: toggle icon
    if (value.dataset.originalValue) {
        img.src = 'images/icons/eye-open.svg';
    } else {
        img.src = 'images/icons/eye-closed.svg';
    }
}

// Hide values separately
document.querySelectorAll('.section__accounts-row').forEach(row => row.addEventListener('click', function (e) {

    const clickedHide = e.target.closest('.section__accounts-hide')
    if (!clickedHide) return;
    e.stopPropagation();
    const block = clickedHide.closest('.section__block');
    const value = block.querySelector('.section__block-value');
    const img = clickedHide.querySelector('img');
    toggleValue(value, img);
}))

// Hide values all together
document.querySelector('.section__hide').addEventListener('click', function (e) {
    e.preventDefault();
    const img = document.querySelector('.section__hide > img');

    const values = sectionOverwiew.querySelectorAll('.section__block-value');
    values.forEach(value => {
        toggleValue(value, img);
    })
})

/** Attach handlers for changing dashboard sections */
const changeSectiton = function (user) {
    sectionBtnList.addEventListener('click', function (e) {
        const currentBtn = e.target.closest('.dashboard__item');
        if (!currentBtn) return;

        sectionBtn.forEach(btn => btn.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        currentBtn.classList.add('active');
        document.querySelector(`.dashboard__section--${currentBtn.dataset.btn}`).classList.add('active');
        dashboardTitle.textContent = currentBtn.dataset.btn.at(0).toUpperCase() + currentBtn.dataset.btn.slice(1);

        movements(user);
    })

    document.querySelectorAll('.section__transactions-btn').forEach(btn => {
        btn.addEventListener('click', function (e) {
            e.preventDefault();
            sectionBtn.forEach(btn => {
                btn.classList.remove('active')
                if (btn.dataset.btn === 'transactions') {
                    btn.classList.add('active');
                    dashboardTitle.textContent = btn.dataset.btn.at(0).toUpperCase() + btn.dataset.btn.slice(1);
                }
            });

            sections.forEach(section => section.classList.remove('active'));
            sectionTransactions.classList.add('active');
            movements(user);
        })
    })

}

// Login / Register
let currentUser;
if (login) {
    const questionRegisterBtn = document.querySelector('.login__question-btn--register');
    const questionLoginBtn = document.querySelector('.register__question-btn--login');
    const loginTitle = document.querySelector('.login__title');
    const loginText = document.querySelector('.login__text');
    const loginBox = document.querySelector('.login__box');
    const registerBox = document.querySelector('.register__box');
    document.querySelector('.login__button').addEventListener('click', function (e) {
        e.preventDefault();
        body.classList.add('lock');
        currentUser = users.find(user => user.email === loginEmail.value);
        if (currentUser?.password === loginPassword.value) {
            login.classList.remove('active');
            dashboard.classList.add('active');
            // document.querySelector('main').style.display = 'none';
            labelName.textContent = currentUser.owner;
            labelAccountNum.textContent = currentUser.id;
            images.forEach(img => img.src = currentUser.img)
            displayUI(currentUser);
            changeSectiton(currentUser);
        }
    })
    questionRegisterBtn.addEventListener('click', function (e) {
        e.preventDefault();
        loginTitle.innerHTML = document.querySelector('.hero__title').innerHTML;
        loginText.innerHTML = document.querySelector('.hero__text').innerHTML;
        loginBox.classList.remove('active');
        registerBox.classList.add('active');
    })
    questionLoginBtn.addEventListener('click', function (e) {
        e.preventDefault();
        loginTitle.innerHTML = 'Welcome Back';
        loginText.innerHTML = 'Enter Your Details to login to your Banking Dashboard again!';
        loginBox.classList.add('active');
        registerBox.classList.remove('active');
    })
}

// Implement form validation 
const userName = document.getElementById('register__name');
const userEmail = document.getElementById('register__email');
const userPassword = document.getElementById('register__password');

// Error elements
const nameError = document.querySelector('.register__error-name');
const emailError = document.querySelector('.register__error-email');
const passwordError = document.querySelector('.register__error-password');

const validateForm = function () {
    let valid = true;

    // Name validation
    if (!userName.value.trim() || userName.value.trim().length < 1) {
        nameError.style.display = 'block';
        valid = false;
    } else {
        nameError.style.display = 'none';
    }

    // Email validation
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(userEmail.value.trim())) {
        emailError.style.display = 'block';
        valid = false;
    } else {
        emailError.style.display = 'none';
    }

    // Password validation
    if (!userPassword.value.trim() || userPassword.value.trim().length < 8) {
        passwordError.style.display = 'block';
        valid = false;
    } else {
        passwordError.style.display = 'none';
    }
    return valid;
}

const registerUser = function () {
    if (!validateForm()) return;

    // Check if email already exists
    if (users.some(u => u.email === userEmail.value.trim())) {
        emailError.textContent = 'Email already registered.';
        emailError.style.display = 'block';
        return;
    }

    // If all valid, create user
    const newUser = {
        owner: userName.value,
        email: userEmail.value,
        id: Date.now().toString().slice(-10),
        password: userPassword.value,
        img: 'images/profile-img-placeholder.webp',
        accounts: [
            {
                name: 'Main Account',
                currency: 'USD',
                movements: []
            },
        ],
    };
    users.push(newUser);
    console.log(users);

    // Clear form
    userName.value = '';
    userEmail.value = '';
    userPassword.value = '';

    const currentUser = users[users.length - 1];
    const message = document.querySelector('.account__message-register');
    modalMessage(message, null, currentUser);
    labelName.textContent = currentUser.owner;
    labelAccountNum.textContent = currentUser.id;
    images.forEach(img => img.src = currentUser.img)
    displayUI(currentUser);
    changeSectiton(currentUser);

    // Store users in localStorage
    saveUsers();
}

const registerInputs = document.querySelector('.register__form').querySelectorAll('input');
registerInputs.forEach(input => {
    input.addEventListener('input', function () {
        // Hide error message on input
        validateForm();
    })
})
document.querySelector('.register__button').addEventListener('click', function (e) {
    e.preventDefault();
    registerUser();
    // displayUI(currentUser);
});

// Profile Image Change
const imageChangeInput = document.getElementById('image-change');
imageChangeInput.addEventListener('change', function (e) {
    const file = e.target.files[0];
    if (!file.type.startsWith('image/')) return;
    const url = URL.createObjectURL(file);
    images.forEach(img => {
        img.src = url;
        img.onload = () => URL.revokeObjectURL(url);
    })
    // Update current user's profile image and persist
    if (typeof currentUser !== 'undefined' && currentUser) {
        currentUser.img = url;
        const idx = users.findIndex(u => u.email === currentUser.email);
        if (idx >= 0) users[idx].img = url;
        saveUsers();
    }
})


// FAQs Tabs
const faqsTabs = document.querySelector('.faqs__tabs');
faqsTabs.addEventListener('click', function (e) {
    const clickedTab = e.target.closest('.faqs__tab');
    if (!clickedTab) return;
    // Remove active from all
    document.querySelectorAll('.faqs__content').forEach(content => content.classList.remove('active'));
    document.querySelectorAll('.faqs__tab').forEach(tab => tab.classList.remove('active'));
    // Add active to clicked
    clickedTab.classList.add('active');
    document.querySelector(`.faqs__content-${clickedTab.dataset.tab}`).classList.add('active');
})


// Sidebar
if (burgerBtn) {
    burgerBtn.addEventListener('click', function () {
        burgerBtn.classList.toggle('active');
        overlay.classList.toggle('active');
        sidebar.classList.toggle('active');
    })
    overlay.addEventListener('click', function () {
        sidebarRemoveActive();
    })
    sectionBtnList.addEventListener('click', function (e) {
        if (e.target.closest('.dashboard__item')) {
            sidebarRemoveActive();
        }
    })
}

