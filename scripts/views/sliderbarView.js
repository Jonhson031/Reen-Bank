// ?  Slidebar / Logout View
import * as Modals from './modalView.js';

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

export function attachBurgerEvents(handler) {
    burgerBtn?.addEventListener('click', function () {
        burgerBtn.classList.toggle('active');
        overlay.classList.toggle('active');
        sidebar.classList.toggle('active');
        document.body.classList.toggle('lock');
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

export function attachLogoutEvent(handler) {
    logoutBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        const message = document.querySelector('.account__message-logout');
        Modals.modalMessage(message)
        message.querySelector('button').addEventListener('click', e => {
            e.preventDefault();
            message.classList.remove('active');
            sidebarRemoveActive();
        })
        message.querySelector('.account__button-green').addEventListener('click', (e) => {
            e.preventDefault();
            handler();
        })
    })
}