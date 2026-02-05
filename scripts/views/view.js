export function attachFaqsTabEvents() {
    const faqsTabs = document.querySelector('.faqs__tabs');
    faqsTabs?.addEventListener('click', function (e) {
        const clickedTab = e.target.closest('.faqs__tab');
        if (!clickedTab) return;
        document.querySelectorAll('.faqs__content').forEach(content => content.classList.remove('active'));
        document.querySelectorAll('.faqs__tab').forEach(tab => tab.classList.remove('active'));
        clickedTab.classList.add('active');
        document.querySelector(`.faqs__content-${clickedTab.dataset.tab}`).classList.add('active');
    })
}
