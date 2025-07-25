
const url = "http://localhost:8080";
 

const listaUsuarios = JSON.parse(localStorage.getItem("KeyUsuarios")) || [];
let animacion;

document.addEventListener("DOMContentLoaded", function() {
    animacion = lottie.loadAnimation({
    container: document.getElementById('modal-animacion'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: '../animaciones/registro_exitoso.json'
    });

    document.getElementById("login").addEventListener("submit", ingresoUsuario);
});

async function ingresoUsuario(event){
    event.preventDefault();
    limpiarErrores();
    const usuario= document.getElementById("correoUsuario").value;
    const contraseña = document.getElementById("passwordUsuario").value;
    if(usuario == "agroshop@gmail.com" && contraseña == 123){
                window.location.href = "../pag_admin/admin.html";

    }




    await validarUsuario(usuario, contraseña);
    // console.log(valor);
    // mostrarErrores(valor);
}

async function validarUsuario(funUsiario, funContraseña) {
    let usuario = {
        correo: funUsiario,
        contraseña: funContraseña
    };
    let numeroError = "Usuario no existente";

    fetch(`http://localhost:8080/auth/login`, {
        method: "POST",
        headers: {
            "Content-Type": "application/json"
        },
        body: JSON.stringify(usuario)
      })
        .then(async response => {
            const mensaje = await response.text();
            if(response.ok){
                localStorage.setItem("jwt", JSON.stringify(mensaje));
                localStorage.setItem("ingresoUsuario", JSON.stringify(usuario.correo));
                mostrarErrores("Inicio exitoso");
            }else{
                mostrarErrores(mensaje);
            }
        })
        .catch(error => {
            console.error("Error al iniciar sesion:", error);
            mostrarErrores(numeroError);
        });

}


function mostrarErrores(caso){
    switch(caso){
        case "Usuario no existente":
            document.getElementById("errorUsuario").textContent="Usuario no existente"
            break
        case "Contraseña incorrecta":
            document.getElementById("errorContraseña").textContent="Contraseña incorrecta"
            break
        
        case "Inicio exitoso":
            limpiarFormulario();
            mostrarModal("Inicio de sesion exitoso", "black");
            break
        default:
             document.getElementById("errorUsuario").textContent="Usuario no existente"
             document.getElementById("errorContraseña").textContent="Contraseña incorrecta"
             
    }
}

/* mostrar el modal durante 3 seg y redirigir a inicio*/
function mostrarModal(mensaje, color='black'){
    console.log("mensaje:", mensaje);
    
    const modal = document.getElementById('modal-mensaje');
    const modalTexto = document.getElementById('modal-texto');
    modal.style.display = 'flex';
    modalTexto.textContent = mensaje;
    modalTexto.style.color = color;

    animacion.goToAndPlay(0, true);

    setTimeout(() => {
        document.getElementById('modal-mensaje').style.display = 'none';
        window.location.href = "/index.html";
    }, 3000);

}

function limpiarFormulario(){
    document.getElementById("correoUsuario").value="";
    document.getElementById("passwordUsuario").value="";
}
function limpiarErrores(){
    document.getElementById("errorUsuario").textContent="";
    document.getElementById("errorContraseña").textContent="";
}