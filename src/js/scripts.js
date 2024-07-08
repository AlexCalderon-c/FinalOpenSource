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

        const data = await res.json().catch(() => null); // Manejar JSON no válido o vacío
        if (res.ok) {
            localStorage.setItem('token', data.token);
            alert('Inicio de sesión exitoso');
            // Redirigir a una página de usuario o actualizar la UI
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
            alert('Usuario registrado exitosamente');
            iniciarSesion();
        } else {
            const data = await res.json();
            alert('Error: ' + data.message);
        }
    } catch (err) {
        console.error(err);
    }
}
