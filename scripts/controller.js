'use strict';
import * as Model from './model.js';
import * as View from './views/view.js';
import * as Modals from './views/modalView.js';
import * as FormView from './views/formView.js';
import { attachBurgerEvents, attachLogoutEvent } from './views/sliderbarView.js';
import * as DashboardView from './views/dashboardView.js';
import { attachNotificationEvent, initNotificationsHandler, displayNotifications } from './views/notificationView.js';
import attachAccountFundEvent from './views/fundVIew.js';
import attachAccountWithdrawEvent from './views/withdrawalView.js';
import { attatchAddNewAccountEvent, attachAccountAddOverviewEvent } from './views/addNewAccountView.js';


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

const { modalFund, modalWithdraw, modalAdd } = Modals.accountModals;

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

function handleFund(modal, user, currentAccount, amount, source, message) {
    if (!(amount > 0)) return;
    Model.addMovement(currentAccount, amount, source);
    Modals.modalRemoveActive(modal);
    handleToggleActiveAccount(user);
    Modals.modalMessage(message, amount, user);
    Model.addNotification(user, 'Your account was credited with', amount);

    sessionStorage.setItem('currentUser', JSON.stringify(user));
    displayNotifications(user);
}


function handleWithdraw(modal, user, currentAccount, amountValue, source, message) {
    if (!amountValue > 0) return;
    Model.addMovement(currentAccount, -amountValue, source);
    Modals.modalRemoveActive(modal);
    handleToggleActiveAccount(user);
    Modals.modalMessage(message, amountValue, user);
    Model.addNotification(user, 'Your account was debited with', -amountValue);
    sessionStorage.setItem('currentUser', JSON.stringify(user));
    displayNotifications(user);
}

function accountAddHandler(modal, user, accountName, message) {
    const accountExist = user.accounts.find(acc => acc.name === accountName);
    if (accountName.trim().length > 0 && !accountExist) {
        Model.addAccount(user, accountName);
        const currentAccount = user.accounts.find(account => account.name === accountName);
        Modals.modalRemoveActive(modal);
        handleToggleActiveAccount(user);
        const handler = function () {
            Modals.modalFunc(modalFund);
            attachAccountFundEvent(modalFund, handleFund, currentUser, currentAccount);
        }
        Modals.modalMessage(message, accountName, handler);
    }
}

function handleToggleActiveAccount(user) {
    const sortedAccountMovements = DashboardView.displayUI(user, Model.getAllMovements);
    DashboardView.attatchToggleActiveAccountEvent({
        onAddAccountClick: () => {
            Modals.modalFunc(modalAdd);
            attatchAddNewAccountEvent(modalAdd, accountAddHandler, user);
        },

        onAccountClick: (accountName, containerTransactionsAccounts, containerTransactionsAll) => {
            const currentAccount = user.accounts.find(account => account.name === accountName);
            const sortedCurrentMovements = currentAccount.movements.sort((a, b) => new Date(b.date) - new Date(a.date));
            sortedCurrentMovements.slice(0, 8).forEach(mov => sortedAccountMovements(mov, containerTransactionsAccounts));
            sortedCurrentMovements.forEach(mov => sortedAccountMovements(mov, containerTransactionsAll));
        },
        onFundClick: (accountName) => {
            // const activeBlock = rowElement.querySelector('.section__block.active');
            const currentAccount = user.accounts.find(acc => acc.name === accountName);
            Modals.modalFunc(modalFund);
            attachAccountFundEvent(modalFund, handleFund, user, currentAccount);
        },

        onWithdrawClick: (accountName) => {
            // const activeBlock = rowElement.querySelector('.section__block.active');
            const currentAccount = user.accounts.find(acc => acc.name === accountName);

            Modals.modalFunc(modalWithdraw);
            attachAccountWithdrawEvent(modalWithdraw, handleWithdraw, user, currentAccount);
        }
    })
}

function handleChangeSectionEvent(user) {
    handleToggleActiveAccount(user);
}

function markSeen(user, index, element) {
    if (user.notifications[index].seen) return;

    // Update model
    user.notifications[index].seen = true;
    Model.saveUsers();

    // Update UI
    element.classList.add('dashboard__notifications-item--seen');

    displayNotifications(user);
}

function handleNotificationEvents(index, item) {
    markSeen(currentUser, index, item);
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
}

function handleLoginFormEvents(email, password) {
    currentUser = Model.findUserByEmail(email);
    if (currentUser?.password === password) {
        Model.addNotification(currentUser, `New login from ${getBrowser()} on ${getOS()}`);
        // Store current user in sessionStorage so dashboard can access it
        sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
        // Navigate to dashboard page
        window.location.href = 'dashboard.html';
        displayNotifications(currentUser);
    }
};

function handleRegisterFormEvents(userName, userEmail, userPassword, userPhone, userGender) {
    if (Model.users.some(u => u.email === userEmail.trim())) {
        return 'Email already registered.';;
    }
    Model.addUser(userName, userEmail, userPassword, userPhone, userGender);

    currentUser = Model.users[Model.users.length - 1];
    const message = document.querySelector('.account__message-register');
    Modals.modalMessage(message, null, currentUser);
    Model.addNotification(currentUser, 'Welcome to Reen Bank!');
    sessionStorage.setItem('currentUser', JSON.stringify(currentUser));
    displayNotifications(currentUser);
};

function hadleProfileImageChange(url) {
    if (currentUser) {
        currentUser.img = url;
        const idx = Model.users.findIndex(u => u.email === currentUser.email);
        if (idx >= 0) Model.users[idx].img = url;
        Model.saveUsers();
    }
}

function initApp() {
    // Attach a few static handlers
    DashboardView.attachHideHandlers();
    Modals.initModalCloseEvents();

    // If on dashboard page and user is logged in, initialize dashboard
    if (dashboardEl && currentUser) {
        DashboardView.setProfileUI(currentUser);
        displayNotifications(currentUser);
        initNotificationsHandler();
        attachNotificationEvent(handleNotificationEvents);
        handleToggleActiveAccount(currentUser);
        DashboardView.attatchChangeSectionEvent(currentUser, handleChangeSectionEvent);
    }

    // Login / Register
    FormView.attachLoginFormEvents(handleLoginFormEvents);
    FormView.attachRegisterFormEvents(handleRegisterFormEvents, currentUser);

    // Account Add button at overview section
    attachAccountAddOverviewEvent(() => {
        Modals.modalFunc(modalAdd);
        attatchAddNewAccountEvent(modalAdd, accountAddHandler, currentUser);
    });

    // Profile image change
    DashboardView.attachProfileImageChange(hadleProfileImageChange);

    // FAQs tabs
    View.attachFaqsTabEvents();

    attachBurgerEvents();
    attachLogoutEvent(() => {
        sessionStorage.removeItem('currentUser');
        window.location.href = 'index.html';
    });
}

initApp();

if (dashboardEl && !currentUser) {
    window.location.href = 'login.html';
}