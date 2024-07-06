document.getElementById("btn__iniciar-sesion").addEventListener("click", iniciarSesion);
document.getElementById("btn__registrarse").addEventListener("click", register);

async function iniciarSesion(event) {
    event.preventDefault();
    const email = document.querySelector(".formulario__login input[type='text']").value;
    const password = document.querySelector(".formulario__login input[type='password']").value;

    try {
        const res = await fetch('/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ email, password })
        });

        const data = await res.json();
        if (res.status === 200) {
            localStorage.setItem('token', data.token);
            alert('Inicio de sesión exitoso');
            // Redirigir a una página de usuario o actualizar la UI
        } else {
            alert('Error: ' + data);
        }
    } catch (err) {
        console.error(err);
    }
}

async function register(event) {
    event.preventDefault();
    const fullName = document.querySelector(".formulario__register input[placeholder='Nombre completo']").value;
    const email = document.querySelector(".formulario__register input[placeholder='Correo Electronico']").value;
    const username = document.querySelector(".formulario__register input[placeholder='Usuario']").value;
    const password = document.querySelector(".formulario__register input[placeholder='Contraseña']").value;

    try {
        const res = await fetch('/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ fullName, email, username, password })
        });

        if (res.status === 201) {
            alert('Usuario registrado exitosamente');
            iniciarSesion();
        } else {
            alert('Error al registrar usuario');
        }
    } catch (err) {
        console.error(err);
    }
}
