/* Account View: Account interactions, visibility toggles */
'use strict';
import * as View from '../view.js';

export function attachHideHandlers() {
    document.querySelectorAll('.section__accounts-row').forEach(row => row.addEventListener('click', function (e) {
        const clickedHide = e.target.closest('.section__accounts-hide')
        if (!clickedHide) return;
        e.stopPropagation();
        const block = clickedHide.closest('.section__block');
        const value = block.querySelector('.section__block-value');
        const img = clickedHide.querySelector('img');
        View.toggleValue(value, img);
    }))

    document.querySelector('.section__hide')?.addEventListener('click', function (e) {
        e.preventDefault();
        const img = document.querySelector('.section__hide > img');
        const values = document.getElementById('section-overview')?.querySelectorAll('.section__block-value');
        values?.forEach(value => {
            View.toggleValue(value, img);
        })
    })
}

export function attachAccountRowEvents(user, onAccountBlockClick) {
    const currentRow = document.querySelector('.dashboard__section.active')?.querySelector('.section__accounts-row');
    if (!currentRow) return;
    const allBlocks = currentRow.querySelectorAll('.section__block');
    allBlocks.forEach(block => block.classList.remove('active'));
    if (allBlocks.length > 0) allBlocks[0].classList.add('active');

    currentRow.addEventListener('click', function (e) {
        const clickedBlock = e.target.closest('.section__block');
        if (!clickedBlock) return;

        onAccountBlockClick(e, clickedBlock, allBlocks, user);
    });
}

export function attachAccountAddOverviewEvents(onAccountAddClick) {
    const accountAddOverview = document.querySelector('.section__accound-add');
    accountAddOverview?.addEventListener('click', function (e) {
        e.preventDefault();
        onAccountAddClick();
    })
}
