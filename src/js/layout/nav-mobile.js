const mobileNavBtn = document.querySelector('#mobileNav');
const mobileNav = document.querySelector('.mobile-nav');
const mobileNavBody = document.querySelector('.mobile-nav__list');
const mobileNavIcon = document.querySelector('#mobileNavIcon');

mobileNavIcon.onerror = function() {
    console.error('Can`t load icon:', this.src);
    this.alt = '[Mobile menu icon]';
};

const toggleMobileMenu = (open) => {

  const isOpen = open !== undefined 
    ? open 
    : mobileNav.classList.toggle('mobile-nav--open');

  mobileNav.classList[isOpen ? 'add' : 'remove']('mobile-nav--open');

  mobileNavIcon.src = isOpen 
    ? '/img/layout/header/cross.svg' 
    : '/img/layout/header/icons8-menu-30.svg';

  mobileNavIcon.alt = isOpen 
    ? 'Close menu' 
    : 'Open menu';

  mobileNavBtn.setAttribute('aria-expanded', isOpen);

  document.body.style.overflow = isOpen 
    ? 'hidden' 
    : '';

  if (isOpen) {
    const firstNavItem = mobileNav.querySelector('a, button');
    firstNavItem?.focus();
  }
}

mobileNavBtn.addEventListener('click', (e) => {
  e.stopPropagation();
  toggleMobileMenu();
})

mobileNav.addEventListener('click', (e) => {
  const isMenuOpen = mobileNav.classList.contains('mobile-nav--open');
  const isClickInsideBody = mobileNavBody.contains(e.target);
  const isClickOnButton = mobileNavBtn.contains(e.target);

  if (isMenuOpen && !isClickInsideBody  && !isClickOnButton) {
    toggleMobileMenu(false);
  }
});

// Close menu on Escape
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && mobileNav.
      classList.contains('mobile-nav--open')) {
        toggleMobileMenu(false);
        mobileNavBtn.focus();
    }
});

// Close menu on click link
const linksMobileNav = mobileNav.querySelectorAll('a, button').forEach((item) => {
  item.addEventListener('click', () => {
    if (mobileNav.classList.contains('mobile-nav--open')) {
      toggleMobileMenu(false);
    }
  });
});