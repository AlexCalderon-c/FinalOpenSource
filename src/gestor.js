document.addEventListener('DOMContentLoaded', async () => {
    const signinButton = document.querySelector('.signin--button');
    const token = localStorage.getItem('token');
    const userMenuContainer = document.querySelector('.user-menu__container');
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');
    const userMenuUsername = document.getElementById('user-menu-username');
    const logoutButton = document.getElementById('logout-button');
    const userMenu = document.getElementById('user-menu');
    const billButton = document.getElementById('bill-button');
    const addAccountButton = document.querySelector('.bill-account__add');
    const balanceContainer = document.querySelector('.banner-section__account');

    if (token) {
        try {
            const userResponse = await fetch('/user', {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });
            const userData = await userResponse.json();
            if (userData.username) {
                signinButton.style.display = 'none';
                userMenuContainer.style.display = 'block';
                userMenuUsername.textContent = `Hola, ${userData.username}`;
            }

            const balanceResponse = await fetch('/current-balance', {
                method: 'GET',
                headers: {
                    'Authorization': token
                }
            });
            const balanceData = await balanceResponse.json();
            const initialBalance = balanceData.initialBalance;

            if (initialBalance !== undefined && !isNaN(initialBalance)) {
                balanceContainer.textContent = `$${initialBalance.toFixed(2)}`;
                if (initialBalance > 0) {
                    addAccountButton.style.display = 'none';
                }
            } else {
                console.error('El balance inicial no es un número válido:', initialBalance);
            }
        } catch (error) {
            console.error('Error:', error);
        }
    }

    if (userMenuButton && userMenuDropdown) {
        userMenuButton.addEventListener('click', (e) => {
            e.stopPropagation();
            userMenuDropdown.style.display = userMenuDropdown.style.display === 'block' ? 'none' : 'block';
            userMenu.style.display = userMenu.style.display === 'block' ? 'none' : 'block';
        });
    }

    if (logoutButton) {
        logoutButton.addEventListener('click', (e) => {
            e.preventDefault();
            fetch('/logout', {
                method: 'POST'
            })
            .then(response => response.json())
            .then(data => {
                if (data.message === 'Sesión cerrada') {
                    localStorage.removeItem('token');
                    window.location.href = '/';
                }
            })
            .catch(error => console.error('Error:', error));
        });
    }

    document.addEventListener('click', (e) => {
        if (userMenuDropdown && !userMenuButton.contains(e.target)) {
            userMenuDropdown.style.display = 'none';
        }
    });
});

document.addEventListener('DOMContentLoaded', function () {
    const addBalanceButton = document.getElementById('modal-agregar-account');
    const balanceInput = document.getElementById('modal-input-account');
    const modalAccount = document.querySelector('.modal--account');
    const closeModalButton = document.querySelector('.modal__close--account');
    const addAccountButton = document.querySelector('.bill-account__add');
    const balanceContainer = document.querySelector('.banner-section__account');

    addBalanceButton.addEventListener('click', async function () {
        const balanceValue = parseFloat(balanceInput.value);

        if (isNaN(balanceValue) || balanceValue <= 0) {
            alert('El saldo es obligatorio y debe ser un número positivo');
            return;
        }

        try {
            const token = localStorage.getItem('token');
            const response = await fetch('/add-balance', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': token
                },
                body: JSON.stringify({ initialBalance: balanceValue })
            });

            const data = await response.json();

            if (response.ok) {
                alert(data.message);
                modalAccount.style.display = 'none';
                balanceInput.value = '';
                addAccountButton.style.display = 'none';  // Ocultar el botón después de agregar saldo exitosamente

                if (token) {
                    fetch('/current-balance', {
                        method: 'GET',
                        headers: {
                            'Authorization': token
                        }
                    })
                    .then(response => response.json())
                    .then(balanceData => {
                        const currentBalance = parseFloat(balanceData.currentBalance);
                        if (!isNaN(currentBalance)) {
                            balanceContainer.textContent = `$${currentBalance.toFixed(2)}`;
                        } else {
                            console.error('El balance actual no es un número:', balanceData.currentBalance);
                        }
                    })
                    .catch(error => console.error('Error al obtener el balance actual:', error));
                }
            } else {
                alert(data.message);
            }
        } catch (error) {
            console.error('Error al agregar saldo:', error);
            alert('Error al agregar saldo');
        }
    });

    closeModalButton.addEventListener('click', () => {
        modalAccount.style.display = 'none';
    });
});
