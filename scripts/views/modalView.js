const overlay = document.querySelector('.overlay');
const login = document.querySelector('.login');
const body = document.querySelector('body');
const modalFund = document.querySelector('.account__modal-fund');
const modalWithdraw = document.querySelector('.account__modal-withdraw');
const modalAdd = document.querySelector('.account__modal-add');

function closeActiveModal() {
    const activeModal = document.querySelector('.modal.active');
    if (activeModal) modalRemoveActive(activeModal);
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

export function initModalCloseEvents() {
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') onClose();
    });

    overlay?.addEventListener('click', closeActiveModal);
}

export function modalFunc(modal, onCancel = null) {
    modalActive(modal);
    const cancelBtn = modal.querySelector('.account__button-cancel');
    if (cancelBtn) {
        const newCancelBtn = cancelBtn.cloneNode(true);
        cancelBtn.parentNode.replaceChild(newCancelBtn, cancelBtn);
        newCancelBtn.addEventListener('click', (e) => {
            e.preventDefault();
            modalRemoveActive(modal);
            if (onCancel) onCancel();
        })
    };
}

export function modalMessage(message, amount = null, handler = null) {
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
        message.querySelector('.account__button-green').addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.remove('active');
            message.classList.remove('active');
            handler();
        })

    }
    if (message.classList.contains('account__message-fund') || message.classList.contains('account__message-withdraw')) {
        message.querySelector('span').textContent = `$${amount}`;
    }
    if (message.classList.contains('account__message-register')) {
        overlay.classList.add('active');
        message.querySelector('.account__button-green').addEventListener('click', (e) => {
            e.preventDefault();
            overlay.classList.remove('active');
            message.classList.remove('active');
            login.classList.remove('active');
            document.querySelector('.dashboard').classList.add('active');
            body.classList.add('lock');
        })
    }
}

export const accountModals = { modalFund, modalWithdraw, modalAdd};