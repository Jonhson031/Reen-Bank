/* Model: data and persistence */
'use strict';
export const users = [
    {
        owner: 'Joe Doe',
        email: 'test@email.com',
        phone: '+1 234 567 8901',
        gender: 'Female',
        id: '1234567890',
        password: 'test',
        img: 'images/profile-img.svg',
        notifications: [
            { message: 'Your account has been updated.', date: '2020-02-15T12:30:00.000Z', seen: false },
            { message: 'Your account was credited with', value: 1000, date: '2020-02-15T12:30:00.000Z', seen: false },
            { message: 'Your account was debited with', value: -500, date: '2020-02-15T12:30:00.000Z', seen: false },
        ],
        accounts: [
            {
                name: 'Main Account',
                currency: 'USD',
                movements: [
                    { amount: 200, date: '2019-11-18T21:31:17.178Z', source: 'Direct Deposit' },
                    { amount: 455.23, date: '2019-12-23T07:42:02.383Z', source: 'Credit Card' },
                    { amount: 4244.23242424, date: '2019-12-23T07:42:02.383Z', source: 'Credit Card' },
                    { amount: -306.5, date: '2020-01-28T09:15:04.904Z', source: 'Jane Doe' },
                    { amount: 25000, date: '2020-04-01T10:17:24.185Z', source: 'Direct Deposit' },
                    { amount: -642.21, date: '2020-05-08T14:11:59.604Z', source: 'Credit Card' },
                    { amount: -133.9, date: '2020-05-27T17:01:17.194Z', source: 'Jane Doe' },
                    { amount: 79.97, date: '2020-07-11T23:36:17.929Z', source: 'Direct Deposit' },
                    { amount: 1300, date: '2020-07-13T10:51:36.790Z', source: 'Credit Card' },
                    { amount: 1300, date: '2020-07-14T10:51:36.790Z', source: 'Credit Card' },
                    { amount: 1300, date: '2020-07-15T10:51:36.790Z', source: 'Credit Card' },
                    { amount: -5300, date: '2020-07-15T11:51:36.790Z', source: 'Credit Card' },
                    { amount: 310.5, date: '2020-07-15T12:51:36.790Z', source: 'Credit Card' },
                ]
            },
            {
                name: 'Savings Account',
                currency: 'USD',
                movements: [
                    { amount: 400, date: '2020-11-18T21:31:17.178Z', source: 'Direct Deposit' },
                    { amount: 953.2, date: '2020-12-23T07:42:02.383Z', source: 'Credit Card' },
                    { amount: -42.5, date: '2021-01-28T09:15:04.904Z', source: 'Jane Doe' },
                    { amount: 2400, date: '2021-04-01T10:17:24.185Z', source: 'Direct Deposit' },
                    { amount: -642.21, date: '2021-05-08T14:11:59.604Z', source: 'Credit Card' },
                    { amount: -213.9, date: '2021-05-27T17:01:17.194Z', source: 'Jane Doe' },
                    { amount: 719.97, date: '2021-07-11T23:36:17.929Z', source: 'Direct Deposit' },
                    { amount: 2743, date: '2021-07-12T10:51:36.790Z', source: 'Credit Card' }
                ]
            },
            {
                name: 'Holiday Savings',
                currency: 'USD',
                movements: [
                    { amount: 155.5, date: '2022-11-18T21:31:17.178Z', source: 'Transfer' },
                    { amount: 144.4, date: '2022-12-23T07:42:02.383Z', source: 'Credit Card' },
                    { amount: -42.5, date: '2023-01-28T09:15:04.904Z', source: 'Jane Doe' },
                    { amount: 1400, date: '2023-04-01T10:17:24.185Z', source: 'Direct Deposit' },
                ]
            },
        ],
    }
];

export const saveUsers = function () {
    try {
        localStorage.setItem('users', JSON.stringify(users));
    } catch (err) {
        console.error('Saving users to localStorage failed', err);
    }
};

export const loadUsers = function () {
    try {
        const stored = localStorage.getItem('users');
        if (!stored) return;
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed)) {
            users.splice(0, users.length, ...parsed);
        }
    } catch (err) {
        console.error('Loading users from localStorage failed', err);
    }
};

export const findUserByEmail = function (email) {
    return users.find(u => u.email === email);
};

export const addUser = function (userObj) {
    users.push(userObj);
    saveUsers();
    return userObj;
};

export const addAccount = function (user, account) {
    user.accounts.push(account);
    saveUsers();
    return account;
};

export const addMovement = function (account, movement) {
    account.movements.push(movement);
    saveUsers();
    return movement;
};

export const getAllMovements = function (user) {
    return user.accounts.flatMap(account => account.movements);
};

export const addNotification = function (user, message, value = undefined) {
    const notification = {
        message,
        value,
        date: new Date().toISOString(),
        seen: false,
    };
    user.notifications.push(notification);
    saveUsers();
    return notification;
}