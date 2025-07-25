const urlBusquedaCorreo = "http://localhost:8080/usuarios/correo/";
const cerrarSesionBoton = document.querySelector(".cerrar-sesion")
const inicioSesion = document.querySelector(".item-inicio-sesion");
const nombreUsuario = document.querySelector(".item-nombre-usuario");


cerrarSesionBoton.addEventListener("click", cerrarSesion)

document.addEventListener("DOMContentLoaded",()=>{ 
    const token = localStorage.getItem("jwt");
    const correoUsuario = JSON.parse(localStorage.getItem("ingresoUsuario"));

    if(token){
        inicioSesion.style.display = "none"
        mostrarNombreUsuario(correoUsuario)
    }else{
        inicioSesion.style.display = "block"
        //nombreUsuario.style.display = "none"

    }

})



function mostrarNombreUsuario(correo){
    fetch(`${urlBusquedaCorreo}${correo}`)
    .then(res => res.json())
    .then(usuario =>{
        nombreUsuario.style.display = "block";
       nombreUsuario.textContent = `¡Hola, ${usuario.nombre}!`;
    }).catch(error => console.error('Error:', error));
}

function cerrarSesion(){

    localStorage.removeItem("ingresoUsuario");
    localStorage.removeItem("jwt");
    inicioSesion.style.display = "block"
    window.location.href = "/index.html";
}

