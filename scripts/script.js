'use strict';

const login = document.querySelector('.login');
const body = document.querySelector('body');
const labelSumIn = document.querySelectorAll('.section__statistics-value--income');
const labelSumOut = document.querySelectorAll('.section__statistics-value--expense')
const labelBalance = document.querySelector('.total-balance');
const inputEmail = document.getElementById('login__email');
const inputPassowrd = document.getElementById('login__password');
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
const accountsRowDetailed = document.querySelector('.section__accounts-detailed');
const modalFund = document.querySelector('.account__modal-fund');
const accountAddOverview = document.querySelector('.section__accound-add');

// Login
document.querySelector('.header__button').addEventListener('click', (e) => {
    e.preventDefault();
    login.classList.add('active');
    body.style.overflow = 'hidden';
})

if (login.classList.contains('active')) {

}


// Accounts

const user1 = {
    owner: 'Joe Doe',
    email: 'test@email.com',
    id: '1234567890',
    password: 'test',
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

// Display acounts
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
displayAccountsOverview(user1);

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
displayAccountsDetailed(user1);


// Date
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


// All movements combined
const getAllMovements = function (user) {
    return user.accounts.flatMap(account =>
        account.movements
    )
};

// Calcule and Display Balance. 
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
displayBalance(user1)


// Modal
const modalActive = function (modal) {
    modal.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('lock');
}
const modalRemoveActive = function (modal) {
    modal.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('lock');
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

const modalMessage = function (message, amount, user) {
    overlay.classList.add('active');
    message.classList.add('active');
    body.classList.add('lock');

    message.querySelector('button').addEventListener('click', e => {
        e.preventDefault();
        overlay.classList.remove('active');
        message.classList.remove('active');
        body.classList.remove('lock');
    })

    if (message.classList.contains('account__message-add')) {
        message.querySelector('span').textContent = `${amount}`; // amount here is new acount name
        const newAccount = user.accounts.find(acc => acc.name === amount);
        message.querySelector('.account__button-green').addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.remove('active');
            message.classList.remove('active');
            body.classList.remove('lock');
            modalFunc(modalFund);
            accountFund(modalFund, user, newAccount);
        })

    } else message.querySelector('span').textContent = `$${amount}`;
}

// Fund Acounts
function accountFund(modal, user, currentAccount) {
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

            // Reset input, close modal, update UI
            if (input) input.value = '';
            modalRemoveActive(modal);
            movements(user);
            displayBalance(user)
            displayAccountsDetailed(user);
            displayAccountsOverview(user);
            modalMessage(message, amountValue);
        }
    });
};

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

            // Reset input, close modal, update UI
            if (input) input.value = '';
            movements(user);
            modalRemoveActive(modal);
            displayBalance(user)
            displayAccountsDetailed(user);
            displayAccountsOverview(user);
            modalMessage(message, amountValue);
        }
    });
}

const accountAdd = function (modal, user) {
    const btnWithdraw = modal.querySelector('.account__button-green');
    const newBtnWithdraw = btnWithdraw.cloneNode(true);
    btnWithdraw.parentNode.replaceChild(newBtnWithdraw, btnWithdraw);

    const message = document.querySelector('.account__message-add');

    // Handle fund button click only once
    newBtnWithdraw.addEventListener('click', function (e) {
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

            // Reset input, close modal, update UI
            if (input) input.value = '';
            movements(user);
            modalRemoveActive(modal);
            displayBalance(user)
            displayAccountsDetailed(user);
            displayAccountsOverview(user);
            modalMessage(message, accountName, user);
        }
    });
}

const toggleActiveAccount = function (user, containerTransactionsAccounts, containerTransactionsAll, sortedAccountMovements) {
    const currentRow = document.querySelector('.dashboard__section.active').querySelector('.section__accounts-row')

    const modalWithdraw = document.querySelector('.account__modal-withdraw');
    const modalAdd = document.querySelector('.account__modal-add');

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


// Movements
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
movements(user1);

// Change name, id of account
labelName.textContent = user1.owner;
labelAccountNum.textContent = user1.id;


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
function toggleValue(value, img) {
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







// Change section
sectionBtnList.addEventListener('click', function (e) {
    const currentBtn = e.target.closest('.dashboard__item');
    if (!currentBtn) return;

    sectionBtn.forEach(btn => btn.classList.remove('active'));
    sections.forEach(section => section.classList.remove('active'));

    currentBtn.classList.add('active');
    document.querySelector(`.dashboard__section--${currentBtn.dataset.btn}`).classList.add('active');
    dashboardTitle.textContent = currentBtn.dataset.btn.at(0).toUpperCase() + currentBtn.dataset.btn.slice(1);

    movements(user1);
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
        movements(user1);
    })
})


accountAddOverview.addEventListener('click', function (e) {
    e.preventDefault();

})