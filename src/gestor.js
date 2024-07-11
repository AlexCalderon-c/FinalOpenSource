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

    if (token) {
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


async function ingresarGasto(event) {
    event.preventDefault();
    const date = document.querySelector("#modal-input-date").value;
    const expense = document.querySelector("#modal-input-balance").value;
    const title = document.querySelector("#modal-input-title").value;
    const description = document.querySelector("#modal-input-desc").value;

    try {
        const res = await fetch('/expense', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json().catch(() => null);
        if (res.ok) {
            localStorage.setItem('token', data.token);
            localStorage.setItem('username', data.username);
            alert('Inicio de sesión exitoso');
            window.location.href = '/';
        } else {
            alert('Error: ' + (data?.message || 'Error desconocido'));
        }
    } catch (err) {
        console.error(err);
    }
}

async function register(event) {
    event.preventDefault();
    const fullName = document.querySelector("#input-fname-register").value;
    const email = document.querySelector("#input-mail-register").value;
    const username = document.querySelector("#input-user-register").value;
    const password = document.querySelector("#input-password-register").value;

    try {
        const res = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullName, email, username, password })
        });

        if (res.ok) {
            const data = await res.json();
            alert('Registro exitoso');
        } else {
            const text = await res.text(); 
            alert('Error: ' + (text || 'Error desconocido'));
        }
    } catch (err) {
        console.error(err);
    }
}
