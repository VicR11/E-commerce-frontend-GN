const form = document.querySelector("form"); 

document.addEventListener("DOMContentLoaded",cargarInformacion)
form.addEventListener("submit", actualizarInformacion)

const correoUsuario = JSON.parse(localStorage.getItem("ingresoUsuario"));

const urlPerfil= "http://localhost:8080/usuarios/";
//const urlBusqueda = "http://localhost:8080/usuarios/correo/";
//const urlActualizar = "http://localhost:8080/usuarios/editar/";

const nombre = document.getElementById("nombre");
const correo= document.getElementById("email");
const telefono = document.getElementById("celular");
const localidad = document.getElementById("ubicacion");
const direccion = document.getElementById("direccion");
let id;
let contraseña;



function cargarInformacion(event){
    event.preventDefault();
    fetch(`${urlPerfil}correo/${correoUsuario}`)
    .then(res => res.json())
    .then(usuario =>{
            nombre.value = usuario.nombre;
            correo.value = usuario.correo;
            telefono.value = usuario.telefono;
            direccion.value = usuario.direccion;
            id = usuario.idUsuario;
            contraseña = usuario.contraseña;

            console

            for (let i = 0; i < localidad.options.length; i++) {
                if (localidad.options[i].value === usuario.localidad) {
                    localidad.selectedIndex = i;
                  break;
                }
              }
    }).catch(error => console.error('Error:', error));
}

function actualizarInformacion(event){
  event.preventDefault();
    const nuevoUusuario ={
        nombre : nombre.value,
        direccion : direccion.value,
        localidad : localidad.value,
        telefono : telefono.value,
        correo : correo.value,
        contraseña : contraseña,
    }

    fetch(`${urlPerfil}editar/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(nuevoUusuario)
      })
    .then(response => response.text()) // <- importante: leer como texto
    .then(message => {
        mostrarModal(message, "black")
      })
    .catch(error => {
        console.error("Error al actualizar usuario:", error);
    });
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


