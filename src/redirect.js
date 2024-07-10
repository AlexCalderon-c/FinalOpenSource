document.addEventListener('DOMContentLoaded', () => {
    const signinButton = document.querySelector('.signin--button');
    const token = localStorage.getItem('token');
    const userMenuContainer = document.querySelector('.user-menu__container');
    const userMenuButton = document.getElementById('user-menu-button');
    const userMenuDropdown = document.getElementById('user-menu-dropdown');
    const userMenuUsername = document.getElementById('user-menu-username');
    const logoutButton = document.getElementById('logout-button');
    const userMenu = document.getElementById('user-menu');
    const billButton = document.getElementById('bill-button');

    if (signinButton && token) {
        fetch('/user', {
            method: 'GET',
            headers: {
                'Authorization': token
            }
        })
        .then(response => response.json())
        .then(data => {
            if (data.username) {
                signinButton.style.display = 'none';
                userMenuButton.style.display = 'block';
                userMenuContainer.style.display = 'block';
                userMenuUsername.textContent = `Hola, ${data.username}`;
            }
        })
        .catch(error => console.error('Error:', error));
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
