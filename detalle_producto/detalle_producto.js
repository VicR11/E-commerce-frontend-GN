
let productSelected = {};
let cantidadCompra = 1;
let animacion;
const url = "http://localhost:8080";

//Variables

const productNameElement = document.getElementById("producto-nombre");
const productCostElement = document.getElementById("final-costo");
const productImgElement1 = document.getElementById("imagen1");
const productImgElement2 = document.getElementById("imagen2");
const productImgElement3 = document.getElementById("imagen3");
const descripcionP = document.getElementById("producto-descripcion");
const productAmountElement = document.getElementById("cantidad");
const productTotal = document.getElementById("resumen-compra").querySelector('h3');
const addAmountButton = document.getElementById("signo-mayor");
const subAmountButton = document.getElementById("signo-menor");
const restablecerButton = document.getElementById("restablecer-cantidad");
const shoppingCartButton = document.getElementById("shopping-cart");
let cantidadTotalProducto = null

//Funciones

function leerProducto(){
    const params = new URLSearchParams(window.location.search);
    const nombre = params.get("nombre");
    fetch(`${url}/productos/nombre/${nombre.toLowerCase()}`)
    .then(res => res.json())
    .then(data => {
      console.log("Producto:", data);
      //let product = data;
      productSelected = data;
      //productSelected.cantidad = cantidad;
      //cantidadTotalProducto = product.cantidad
      console.log("cantidadCompra :"+cantidadCompra)
    renderizar();
    });
}

function renderizar(){
    let nombreProducto = productSelected.nombre;
    let precioProducto = productSelected.precio;
    let imagenProducto = productSelected.imagenesProducto;
    let descripcionProducto = productSelected.descripcion;

    mostrarProducto(nombreProducto, precioProducto, imagenProducto, descripcionProducto, cantidadCompra);
}

function mostrarProducto(nombre, precio, imagen, descripcion, cantidadCompra){
    ///let precioFloat = parseFloat(precio.replace("$", "").replace("Kg", "").trim());
    productNameElement.textContent = nombre;
    productCostElement.textContent = `$ ${precio} / Kg`;
    productImgElement1.src = imagen[0]?.urlImagen;
    productImgElement1.alt = `Imagen de ${nombre}`;
    productImgElement2.src = imagen[1]?.urlImagen;
    productImgElement2.alt = `Imagen de ${nombre}`;
    productImgElement3.src = imagen[2]?.urlImagen;
    productImgElement3.alt = `Imagen de ${nombre}`;
    descripcionP.textContent = descripcion;
    productAmountElement.textContent = `${cantidadCompra}`;
    productTotal.textContent = `$ ${cantidadCompra * precio}`;
}

function aumentarCantidad(){
    if (cantidadCompra >= 1){
        console.log("cantidadCompra : "+cantidadCompra)
        if(cantidadCompra < productSelected.cantidad)
            cantidadCompra += 1;
        else
            alert("Has alcanzado la cantidad máxima disponible para este producto")
    }
    console.log(cantidadCompra)

    //cantidadCompra = cantidadCompra;
}

function disminuirCantidad(){
    if (cantidadCompra > 1){
        cantidadCompra -= 1;
    }
    console.log(cantidadCompra)
    //cantidadCompra = cantidadCompra;
}

function restablecerCantidad(){
    cantidadCompra = 1;
   
}

function agregarCarrito(){
    //Leer productos existentes, agregar producto actual y escribir en localstorage
    if (localStorage.getItem("carrito") !== null){
        let listaCarrito = JSON.parse(localStorage.getItem("carrito") || []);
        const productoExistente  = listaCarrito.find(producto =>producto.nombre ==productSelected.nombre) // find devuelve una referencia al objeto por eso se modifica el objeto del array directamente
            if(productoExistente ){
                if(productoExistente.cantidadCompra < productoExistente.cantidad){
                    productoExistente.cantidadCompra +=cantidadCompra; 
                    mostrarModal("", "black");
                }    
                else
                    alert("Has alcanzado la cantidad máxima disponible para este producto")
            }else{
                listaCarrito.push({
                    ...productSelected,
                    cantidadCompra : cantidadCompra
                });
                mostrarModal("", "black");
            } 
        localStorage.setItem("carrito", JSON.stringify(listaCarrito));
    } else {
        let carritoVacio = [];
        carritoVacio.push(productSelected);
        localStorage.setItem("carrito", JSON.stringify(carritoVacio));
        mostrarModal("", "black");
    }
}

//Modal
function mostrarModal(mensaje, color='black'){
    const modal = document.getElementById('modal-mensaje');
    const modalTexto = document.getElementById('modal-texto');
    modal.style.display = 'flex';
    modalTexto.textContent = mensaje;
    modalTexto.style.color = color;

    animacion.goToAndPlay(0, true);

    setTimeout(() => {
        document.getElementById('modal-mensaje').style.display = 'none';
        window.location.href = '../carrito_compras/carrito.html';
        
    }, 2500);
}

/*const aElement = document.getElementById("resumen-compra").querySelector('a');
aElement.addEventListener('click', (e) => {
    e.preventDefault();

    mostrarModal("", "black");
})*/

//Eventos

addAmountButton.addEventListener('click', () => {
    aumentarCantidad();
    renderizar();
})

subAmountButton.addEventListener('click', () => {
    disminuirCantidad();
    renderizar();
})

restablecerButton.addEventListener('click', () => {
    restablecerCantidad();
    renderizar();
})

shoppingCartButton.addEventListener('click', () => {
    agregarCarrito();
})

document.addEventListener('DOMContentLoaded', () => {
    //Funcionalidad
    leerProducto();

    //Modal
    animacion = lottie.loadAnimation({
    container: document.getElementById('modal-animacion'),
    renderer: 'svg',
    loop: false,
    autoplay: false,
    path: '../animaciones/producto_agregado.json'
    });
})

//Carrusel
let index = 0;
const items = document.querySelectorAll('.carrusel-item');

function showImage(newIndex) {
  items[index].classList.remove('visible');
  index = (newIndex + items.length) % items.length;
  items[index].classList.add('visible');
}

document.querySelector('.carrusel-next').addEventListener('click', () => {
  showImage(index + 1);
});

document.querySelector('.carrusel-prev').addEventListener('click', () => {
  showImage(index - 1);
});
