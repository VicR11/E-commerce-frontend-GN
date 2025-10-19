
document.addEventListener("DOMContentLoaded",mostrarInformacion)

const correoUsuario = JSON.parse(localStorage.getItem("ingresoUsuario"));
let productosCarrito = JSON.parse(localStorage.getItem("carrito"));
const urlPedidos = "http://localhost:8080/";
const nombre = document.getElementById("nombre");
const correo= document.getElementById("email");
const telefono = document.getElementById("celular");
const localidad = document.getElementById("localidad");
const direccion = document.getElementById("direccion");
const subtotal = document.querySelector(".resumen-compra .subtotal span:nth-of-type(2)")
const total = document.querySelector(".resumen-compra .total strong:nth-of-type(2)")
const Form = document.querySelector("#form-pago");
const errorPago = document.querySelector(".error-input-radio");
let  wompi  = document.querySelector('input[value="wompi"]');
let idUsuario = null
let subtotalPagar = null
let totalPagar = null
const diaActual = new Date();
console.log("diaActual :"+diaActual)
const valorEnvio = 5000;
let productosPedidoDTO = [];
let tablaProductos = document.querySelector(".informacion-productos > table")


function mostrarInformacion(){
    cargarInfoUsuario()
    cargarProductos()
}

Form.addEventListener("submit", (event)=>{
    event.preventDefault();
    if(wompi.checked){
        errorPago.textContent ="";
        const pedido ={
            "fechaPedido": diaActual.toISOString().split('T')[0],
            "fechaSalida": sumarDias(diaActual,5),
            "direccionEntrega": direccion.value,
            "estadoTransaccion":"PENDIENTE",
            "valorTotal": totalPagar,
            "idUsuario": idUsuario,
            "productos":productosPedidoDTO
        }

        console.log( JSON.stringify(pedido))

        fetch(`${urlPedidos}pedidos/crear`, {
            method: "POST",
            headers: {
            "Content-Type": "application/json"
            },
            body: JSON.stringify(pedido)
        })
        .then(response => response.text()) // <- importante: leer como texto
        .then(message => {
            mostrarModal(message, "black")
        })
        .catch(error => {
            console.error("Error al agregar pedido:", error);
        });
    }else{
        console.log("entro erro")
        errorPago.textContent = "Debe seleccionar el metodo de pago"
    }
})

function cargarInfoUsuario(){
    fetch(`${urlPedidos}usuarios/correo/${correoUsuario}`)
    .then(res => res.json())
    .then(usuario => {
        nombre.value = usuario.nombre;
        correo.value = usuario.correo;
        telefono.value = usuario.telefono;
        localidad.value = usuario.localidad
        direccion.value = usuario.direccion;
        idUsuario = usuario.idUsuario;
        console.log("idUsuario : "+idUsuario)
    })

}


function cargarProductos(){
    productosCarrito.forEach(producto =>{
        subtotalPagar += producto.precio*producto.cantidadCompra
        totalPagar = subtotalPagar + valorEnvio;
        productosPedidoDTO.push({
            idProducto: producto.id,
            cantidad: producto.cantidadCompra
        })
        crearFila(producto.nombre, producto.ImagenesProducto[0].urlImagen, producto.precio, producto.cantidadCompra )
        calcularCostos(subtotalPagar);
    })
}

function crearFila(nombre, imagen, precio, cantidadCompra){
    const row = document.createElement('tr');
    row.innerHTML = ` <td><img src="${imagen}" alt="${nombre}" </td>
                      <td>${nombre}</td>
                      <td>${cantidadCompra}</td>
                      <td>${formatoMoneda(precio*cantidadCompra)}</td>`
      tablaProductos.appendChild(row);
}

function actualizarCantidadesReservadas(productosPedidoDTO){
    fetch(`${urlPedidos}editarCantidadReservada`, {
        method: "PUT",
        headers: {
        "Content-Type": "application/json"
        },
        body: JSON.stringify(productosPedidoDTO)
    })
    .then(response => response.text()) // <- importante: leer como texto
    .catch(error => {
        console.error("Error al agregar actualizar cantidades reservadas:", error);
    });

}
function calcularCostos(subtotalPagar){
    subtotal.textContent = formatoMoneda(subtotalPagar);
    total.textContent = formatoMoneda(subtotalPagar+valorEnvio);
}
//Formato Moneda
function formatoMoneda(numero){
    let valorMoneda = numero.toLocaleString('es-Co', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })
    return valorMoneda
}

//Sumar días
function sumarDias(fecha, dias){
    let nuevaFecha = new Date(fecha);

    nuevaFecha.setDate(nuevaFecha.getDate() + dias);

    return nuevaFecha.toISOString().split('T')[0];
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
        //window.location.href = "../index.html"
    }, 5000);

}
