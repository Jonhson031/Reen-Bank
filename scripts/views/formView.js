'use strict';

export function attachLoginFormEvents(onLoginSubmit) {
    const loginEmail = document.getElementById('login__email');
    const loginPassword = document.getElementById('login__password');
    const loginBtn = document.querySelector('.login__button');
    const questionRegisterBtn = document.querySelector('.login__question-btn--register');
    const questionLoginBtn = document.querySelector('.register__question-btn--login');
    const loginTitle = document.querySelector('.login__title');
    const loginText = document.querySelector('.login__text');
    const loginBox = document.querySelector('.login__box');
    const registerBox = document.querySelector('.register__box');

    loginBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        onLoginSubmit(loginEmail.value, loginPassword.value);
    })

    questionRegisterBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        loginTitle.innerHTML = document.querySelector('.hero__title').innerHTML;
        loginText.innerHTML = document.querySelector('.hero__text').innerHTML;
        loginBox.classList.remove('active');
        registerBox.classList.add('active');
        // onRegisterToggle();
    })

    questionLoginBtn?.addEventListener('click', function (e) {
        e.preventDefault();
        loginTitle.innerHTML = 'Welcome Back';
        loginText.innerHTML = 'Enter Your Details to login to your Banking Dashboard again!';
        loginBox.classList.add('active');
        registerBox.classList.remove('active');
        // onLoginToggle();
    })
}

export function attachRegisterFormEvents(onRegisterSubmit, currentUser) {
    const registerForm = document.querySelector('.register__form');
    const userName = document.getElementById('register__name');
    const userEmail = document.getElementById('register__email');
    const userPassword = document.getElementById('register__password');
    const userPhone = document.getElementById('register__phone');
    const userGender = document.getElementById('register__gender');
    const nameError = document.querySelector('.register__error-name');
    const emailError = document.querySelector('.register__error-email');
    const passwordError = document.querySelector('.register__error-password');
    const message = document.querySelector('.account__message-register');

    const validateForm = function () {
        let valid = true;
        if (!userName.value.trim() || userName.value.trim().length < 1) {
            nameError.style.display = 'block';
            valid = false;
        }
        else {
            nameError.style.display = 'none';
        }
        const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailPattern.test(userEmail.value.trim())) {
            emailError.style.display = 'block';
            valid = false;
        }
        else {
            emailError.style.display = 'none';
        }
        if (!userPassword.value.trim() || userPassword.value.trim().length < 8) {
            passwordError.style.display = 'block';
            valid = false;
        }
        else {
            passwordError.style.display = 'none';
        }
        return valid;
    }

    registerForm?.querySelectorAll('input').forEach(input => {
        input.addEventListener('input', validateForm)
    })

    document.querySelector('.register__button')?.addEventListener('click', function (e) {
        e.preventDefault();
        if (!validateForm()) return;
        onRegisterSubmit(
            userName.value,
            userEmail.value,
            userPassword.value,
            userPhone?.value || '',
            userGender?.value || '',
        );
        userName.value = '';
        userEmail.value = '';
        userPassword.value = '';
        if (userPhone) userPhone.value = '';
        if (userGender) userGender.value = '';
        message.querySelector('.account__button-green').addEventListener('click', (e) => {
            e.preventDefault();
            window.location.href = 'dashboard.html';
        })
    })
}
