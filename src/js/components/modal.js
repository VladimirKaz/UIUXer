
const openModalBtns = document.querySelectorAll('[data-action="modal-open"]');
const closeModalBtn = document.querySelector('#modalClose');
const modal = document.querySelector('.modal');
const modalOverlay = document.querySelector('.modal__overlay');

/* Functions */
function openModal() {
  modal.classList.add('modal--is-open');
  document.body.style.overflow = 'hidden';
} 

function closeModal() {
  if (!modal || !modal.classList.contains('modal--is-open')) return; 
  modal.classList.remove('modal--is-open');
  document.body.style.overflow = '';
}

if (!modal || !modalOverlay) {
  console.warn('⚠️  Элементы модалки не найдены. Проверьте классы в HTML.');
}

/* Open modal */ 
openModalBtns.forEach(item => item.addEventListener('click', openModal));

/* Close modal */ 
[closeModalBtn, modalOverlay].forEach(e => {
  if (e) e.addEventListener('click', closeModal);
});

/* Close modal on Escape  */ 
const handleEscapeKey = (e) => {
  if (e.key === 'Escape' && modal.classList.contains('modal--is-open')) {
    e.preventDefault();
    closeModal();
  }
}

document.addEventListener('keydown', handleEscapeKey);
