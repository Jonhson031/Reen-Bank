export function initNotificationsHandler() {
    const notificationsBtn = document.querySelector('.dashboard__notifications');
    const notificationsContainer = document.querySelector('.dashboard__notifications-list');
    if (!notificationsBtn || !notificationsContainer) return;
    notificationsBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        notificationsBtn.classList.toggle('active');
    });
    document.addEventListener('click', (e) => {
        notificationsBtn.classList.remove('active');
    });
}

export function attachNotificationEvent(handler) {
    const list = document.querySelector('.dashboard__notifications-list');
    const counter = document.querySelector('.dashboard__notifications-count');

    if (!list) return;

    list.addEventListener('mouseover', function (e) {
        const item = e.target.closest('.dashboard__notifications-item');
        if (!item) return;

        const index = Number(item.dataset.index);
        handler(index, item, counter);
    });

    list.addEventListener('click', function (e) {
        const item = e.target.closest('.dashboard__notifications-item');
        if (!item) return;
        const index = Number(item.dataset.index);
        handler(index, item, counter);
    });
}

function formatNotificationDate(dateString) {
    const now = new Date();
    const notifDate = new Date(dateString);
    const diffMs = now - notifDate;

    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffHours / 24);

    if (diffHours < 1) {
        const diffMinutes = Math.floor(diffMs / (1000 * 60));
        if (diffMinutes < 1) return "Just now";
        return diffMinutes === 1 ? "1 minute ago" : `${diffMinutes} minutes ago`;
    }

    if (diffHours < 24) {
        return diffHours === 1 ? "1 hour ago" : `${diffHours} hours ago`;
    }

    if (diffDays === 1) return "1 day ago";
    if (diffDays === 3) return "3 days ago";
    if (diffDays === 7) return "7 days ago";

    // More than 7 days → show real date
    return notifDate.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric"
    });
}

export function displayNotifications(user) {
    const notificationsContainer = document.querySelector('.dashboard__notifications-list');
    const notificationsCounter = document.querySelector('.dashboard__notifications-count');
    if (notificationsCounter && user.notifications) {
        const unreadCount = user.notifications.filter(notif => !notif.seen).length;
        notificationsCounter.textContent = unreadCount;
        notificationsCounter.style.display = unreadCount > 0 ? 'flex' : 'none';
    }
    if (!notificationsContainer || !user.notifications) return;
    notificationsContainer.innerHTML = '';
    user.notifications.sort((a, b) => new Date(b.date) - new Date(a.date)).forEach((notif, index) => {
        const displayDate = formatNotificationDate(notif.date);
        const notifValue = notif.value > 0
            ? `<span class="dashboard__notifications-item--deposit">$${notif.value.toFixed(2)}</span>`
            : `<span class="dashboard__notifications-item--withdraw">$${Math.abs(notif.value).toFixed(2)}</span>`;
        const seenClass = notif.seen ? 'dashboard__notifications-item--seen' : '';
        const notifHTML = `
            <li 
                class="dashboard__notifications-item ${seenClass}" data-index="${index}">
            <p class="dashboard__notifications-text">${notif.message} ${notif.value ? notifValue : ''}</p>
            <span class="dashboard__notifications-time">${displayDate}</span>
         </li>`;
        notificationsContainer.insertAdjacentHTML('beforeend', notifHTML);
    });
}