function attachAccountWithdrawEvent(modal, handler, user, currentAccount) {
    const btnWithdraw = modal.querySelector('.account__button-green');
    const message = document.querySelector('.account__message-withdraw');
    const newBtnWithdraw = btnWithdraw.cloneNode(true);
    btnWithdraw.parentNode.replaceChild(newBtnWithdraw, btnWithdraw);

    newBtnWithdraw.addEventListener('click', function (e) {
        e.preventDefault();
        const input = modal.querySelector('input[type="number"], input[type="text"]');
        const amountValue = parseFloat(input?.value || 0);
        const source = 'Withdrawal';
        if (amountValue > 0) {
            if (input) input.value = '';
            handler(modal, user, currentAccount, amountValue, source, message);
        }
    });
}
export default attachAccountWithdrawEvent;