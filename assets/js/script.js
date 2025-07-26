'use strict';

/* ================= MODAL ================= */
const modal = document.querySelector('[data-modal]');
const modalCloseBtn = document.querySelector('[data-modal-close]');
const modalCloseOverlay = document.querySelector('[data-modal-overlay]');

const modalCloseFunc = () => {
  modal.classList.add('closed');
  document.body.classList.remove('no-scroll'); // optional UX
};

modalCloseOverlay?.addEventListener('click', modalCloseFunc);
modalCloseBtn?.addEventListener('click', modalCloseFunc);


/* ================= TOAST ================= */
const notificationToast = document.querySelector('[data-toast]');
const toastCloseBtn = document.querySelector('[data-toast-close]');

toastCloseBtn?.addEventListener('click', () => {
  notificationToast.classList.add('closed');
});

// Auto close after 5 seconds
if (notificationToast) {
  setTimeout(() => {
    notificationToast.classList.add('closed');
  }, 5000);
}


/* ================= MOBILE MENU ================= */
const mobileMenuOpenBtn = document.querySelectorAll('[data-mobile-menu-open-btn]');
const mobileMenu = document.querySelectorAll('[data-mobile-menu]');
const mobileMenuCloseBtn = document.querySelectorAll('[data-mobile-menu-close-btn]');
const overlay = document.querySelector('[data-overlay]');

mobileMenuOpenBtn.forEach((openBtn, i) => {
  const menu = mobileMenu[i];
  const closeBtn = mobileMenuCloseBtn[i];

  const openMenu = () => {
    menu.classList.add('active');
    overlay.classList.add('active');
    document.body.classList.add('no-scroll'); // optional
  };

  const closeMenu = () => {
    menu.classList.remove('active');
    overlay.classList.remove('active');
    document.body.classList.remove('no-scroll'); // optional
  };

  openBtn?.addEventListener('click', openMenu);
  closeBtn?.addEventListener('click', closeMenu);
  overlay?.addEventListener('click', closeMenu);
});


/* ================= ACCORDION ================= */
const accordionBtn = document.querySelectorAll('[data-accordion-btn]');
const accordion = document.querySelectorAll('[data-accordion]');

accordionBtn.forEach((btn, index) => {
  btn.addEventListener('click', () => {
    const currentActive = accordion[index].classList.contains('active');

    accordion.forEach((acc, i) => {
      acc.classList.remove('active');
      accordionBtn[i].classList.remove('active');
    });

    if (!currentActive) {
      accordion[index].classList.add('active');
      btn.classList.add('active');
    }
  });
});
