document.getElementById("btn__login").addEventListener("click", iniciarSesion);
document.getElementById("btn__register").addEventListener("click", register);

async function iniciarSesion(event) {
    event.preventDefault();
    const email = document.querySelector(".formulario__login input[placeholder='Correo Electronico']").value;
    const password = document.querySelector(".formulario__login input[placeholder='Contraseña']").value;

    try {
        const res = await fetch('/login', {
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
