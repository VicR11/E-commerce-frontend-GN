const formulario = document.getElementById("formCambiarContraseña")
formulario.addEventListener("submit", validarUsuario);

const urlCambiarContrasena = "http://localhost:8080/"

const correo = JSON.parse(localStorage.getItem("ingresoUsuario"));
const contraseñaActual = document.getElementById("actual");
const contraseñaNueva = document.getElementById("nueva");
const contraseñaConfirmar = document.getElementById("confirmar");




async function validarUsuario(event) {
    event.preventDefault();
    limpiarErrores()

    let usuario = {
        correo: correo,
        contraseña: contraseñaActual.value
    };
   

    fetch(`${urlCambiarContrasena}auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
      })
        .then(async response => {
            const mensaje = await response.text();
            if(response.ok){
                const aprobado=validarContraseña(contraseñaNueva.value);
                const aprobarComparacion =validarComparacion(contraseñaNueva.value, contraseñaConfirmar.value)
                if(aprobado && aprobarComparacion){
                    ActualizarContraseña();
                    
                }

            }else{
                document.getElementById("errorContraseñaActual").textContent = mensaje
               
            }
        })
        .catch(error => {
            
            document.getElementById("errorContraseñaActual").textContent = mensaje
        });

}


function validarContraseña(contraseña){
    // Expresión regular para validar el formato de la contraseña
    const regex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/; // Cambia esto según el formato que necesites
    if(!regex.test(contraseña)){
        document.getElementById("errorContraseñaNueva").textContent="La contraseña debe tener 8 caracteres, con al menos una mayúscula, una minúscula y un número.";
    }
    return regex.test(contraseña);
}

function ActualizarContraseña(){
    const nuevaContrasena = {
        correo : correo,
        contraseña : contraseñaNueva.value

    }
    fetch(`${urlCambiarContrasena}usuarios/cambiar-contrasena`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevaContrasena)
      })
        .then(async response => {
            const mensaje = await response.text();
            if(response.ok){
                formulario.reset();
                mostrarModal(mensaje);
             

            }else{
                document.getElementById("errorContraseñaActual").value = mensaje
            }
        })
        .catch(error => {
           
            document.getElementById("errorContraseñaActual").value = mensaje
        });
}

function validarComparacion(contraseña,validacion){
    if(contraseña!=validacion){
        document.getElementById("errorContraseñaNueva").textContent="Las contraseñas no coinciden";
        return false;
    }
    return true;
}

function limpiarErrores(){
    document.getElementById("errorContraseñaNueva").textContent="";
    document.getElementById("errorContraseñaActual").textContent="";
}


/*  MODAL     */

document.addEventListener("DOMContentLoaded", function() {
    animacion = lottie.loadAnimation({
    container: document.getElementById('modal-animacion'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: '../animaciones/registro_exitoso.json'
    });
});


function mostrarModal(mensaje, color='black'){
    const modal = document.getElementById('modal-mensaje');
    const modalTexto = document.getElementById('modal-texto');
    modal.style.display = 'flex';
    modalTexto.textContent = mensaje;
    modalTexto.style.color = color;

    animacion.goToAndPlay(0, true);

    setTimeout(() => {
        document.getElementById('modal-mensaje').style.display = 'none';
    }, 5000);

}


/* Ojito */
document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', function () {
      const input = document.querySelector(this.getAttribute('toggle'));
      const isPassword = input.type === 'password';
      input.type = isPassword ? 'text' : 'password';
      this.classList.toggle('fa-eye');
      this.classList.toggle('fa-eye-slash');
    });
  });