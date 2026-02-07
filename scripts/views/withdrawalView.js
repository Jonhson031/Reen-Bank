function checkBalance(currentAccount, amountValue, error) {
    const calcBalance = Number(currentAccount.movements.map(mov => mov.amount).reduce((acc, curr) => acc + curr, 0).toFixed(2));
    if (calcBalance < amountValue) {
        error.style.display = 'block';
        return false;
    } else {
        error.style.display = 'none';
        return true;
    }
}
function attachAccountWithdrawEvent(modal, handler, user, currentAccount) {
    const btnWithdraw = modal.querySelector('.account__button-green');
    const message = document.querySelector('.account__message-withdraw');
    const newBtnWithdraw = btnWithdraw.cloneNode(true);
    const error = modal.querySelector('.account__amount-withdraw--error');
    btnWithdraw.parentNode.replaceChild(newBtnWithdraw, btnWithdraw);

    newBtnWithdraw.addEventListener('click', function (e) {
        e.preventDefault();
        const input = modal.querySelector('input[type="number"], input[type="text"]');
        const amountValue = parseFloat(input?.value || 0);
        const enoughBalance = checkBalance(currentAccount, amountValue, error);
        if (!enoughBalance) return;

        const source = 'Withdrawal';
        if (amountValue > 0) {
            if (input) input.value = '';
            handler(modal, user, currentAccount, amountValue, source, message);
        }
    });
}
export default attachAccountWithdrawEvent;