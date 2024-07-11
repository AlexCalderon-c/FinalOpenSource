const openModal = document.querySelector('.bill-manager__add');
const modal = document.querySelector('.modal');
const closeModal = document.querySelector('.modal__close')

const openModalAccount = document.querySelector('.bill-account__add');
const modal2 = document.querySelector('.modal--account');
const closeModalAccount = document.querySelector('.modal__close--account');


openModal.addEventListener('click', (e)=>{
    e.preventDefault();
    modal.classList.add('modal--show');
});

closeModal.addEventListener('click', (e)=>{
    e.preventDefault();
    modal.classList.remove('modal--show');
})

openModalAccount.addEventListener('click', (e)=>{
    e.preventDefault();
    modal2.classList.add('modal--show__account');
});

closeModalAccount.addEventListener('click', (e)=>{
    e.preventDefault();
    modal2.classList.remove('modal--show__account');
})
