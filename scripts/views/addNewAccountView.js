function checkAccountExists(user, accountName, error) {
    const accountExists = user.accounts.find(
        account => account.name.toLowerCase() === accountName.toLowerCase()
    );
    if (accountExists) {
        error.style.display = 'block';
        return true;
    } else {
        error.style.display = 'none';
        return false
    }
}

export function attatchAddNewAccountEvent(modal, handler, user) {
    const btnAdd = modal.querySelector('.account__button-green');
    const newBtnAdd = btnAdd.cloneNode(true);
    btnAdd.parentNode.replaceChild(newBtnAdd, btnAdd);
    const message = document.querySelector('.account__message-add');
    const error = modal.querySelector('.account__modal-add--error');

    newBtnAdd?.addEventListener('click', function (e) {
        e.preventDefault();
        const input = modal.querySelector('input[type="text"]');
        const accountName = input.value
        const exists = checkAccountExists(user, accountName, error);
        if (exists) return;
        console.log(1)
        if (input) input.value = '';
        handler(modal, user, accountName, message);

    });
}

export function attachAccountAddOverviewEvent(handler) {
    const accountAddOverview = document.querySelector('.section__accound-add');
    accountAddOverview?.addEventListener('click', function (e) {
        handler();
    })
}