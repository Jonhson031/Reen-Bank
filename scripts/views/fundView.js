function attachAccountFundEvent(modal, handler, user, currentAccount) {
    const message = document.querySelector('.account__message-fund');
    const radioBtns = modal.querySelectorAll('.account__input-radio');
    const btnFund = modal.querySelector('.account__button-green');
    const newBtnFund = btnFund.cloneNode(true);
    btnFund.parentNode.replaceChild(newBtnFund, btnFund);
    radioBtns.forEach(btn => {
        btn.addEventListener('click', function () {
            modal.querySelectorAll('.account__fund-section').forEach(section => section.classList.remove('active'));
            const payment = modal.querySelector(`#form__fund-${btn.dataset.payment}`);
            if (payment) payment.classList.add('active');
        });
    });

    newBtnFund.addEventListener('click', function (e) {
        e.preventDefault();
        const activePayment = modal.querySelector('.account__fund-section.active');
        if (!activePayment) return;

        const input = activePayment.querySelector('input[type="number"], input[type="text"]');
        const amountValue = parseFloat(input?.value || 0);
        const source = input?.dataset.source;
        if (amountValue > 0) {
            if (input) input.value = '';
            handler(modal, user, currentAccount, amountValue, source, message);
        }
    });
}
export default attachAccountFundEvent;