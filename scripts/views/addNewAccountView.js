export function attatchAddNewAccountEvent(modal, handler, user) {
    const btnAdd = modal.querySelector('.account__button-green');
    const newBtnAdd = btnAdd.cloneNode(true);
    btnAdd.parentNode.replaceChild(newBtnAdd, btnAdd);
    const message = document.querySelector('.account__message-add');


    newBtnAdd?.addEventListener('click', function (e) {
        e.preventDefault();
        const input = modal.querySelector('input[type="text"]');
        const accountName = input.value
        if (input) input.value = '';
        handler(modal, user, accountName, message)
    });
}

export function attachAccountAddOverviewEvent(handler) {
    const accountAddOverview = document.querySelector('.section__accound-add');
    accountAddOverview?.addEventListener('click', function (e) {
        handler();
    })
}