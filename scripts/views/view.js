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
export function scrollIntoView() {
    const learnMoreBtn = document.querySelector('.hero__button-learn');
    const aboutBtn = document.querySelector('.header__link-about');
    const contactBtn = document.querySelector('.header__link-contact');
    const faqs = document.getElementById('faqs');
    const footer = document.getElementById('footer');
    const servcies = document.getElementById('services');
    learnMoreBtn.addEventListener('click', function (e) {
        e.preventDefault();
        faqs.scrollIntoView({ behavior: "smooth" });
    })
    aboutBtn.addEventListener('click', function (e) {
        e.preventDefault();
        servcies.scrollIntoView({ behavior: "smooth" });
    })
    contactBtn.addEventListener('click', function (e) {
        e.preventDefault();
        footer.scrollIntoView({ behavior: "smooth" });
    })
}