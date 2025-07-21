let listaProductos = [];
const contenedor = document.getElementById('contenedor-cards');
document.addEventListener("DOMContentLoaded", cargarProductos);

document.querySelector('form').addEventListener('submit', function (event) {
    event.preventDefault();
    buscarProducto();
  });

function crearCard(nombre, imagen, precio){
    const card = document.createElement('div');
    card.className = 'card';
    card.innerHTML = ` 
              
               
                        <div class="card-image">
                        <img src="${imagen}" alt="Imagen de la card">
                        </div>
                        <div class="card-content">                
                            <h2>$${formatoMoneda(precio)} Kg</h2>
                            <p>${nombre}</p>
                            <button onclick="verDetalle('${nombre}')">Ver más</button>
                        </div>`
                          document.getElementById('contenedor-cards').appendChild(card);
                   

}

function cargarProductos(){
 
        fetch("http://localhost:8080/productos")
        .then(res => res.json())
        .then(productos =>{
            productos.forEach(producto => {
                crearCard(producto.nombre, producto.imagenesProducto[0]?.urlImagen, producto.precio)
            });    
        }).catch(error => console.error('Error:', error));
}

function verDetalle(nombre){  
    window.location.href = `../detalle_producto/detalle_producto.html?nombre=${nombre}` ;  
}

function formatoMoneda(numero){
    let valorMoneda = numero.toLocaleString('es-Co', {
        minimumFractionDigits: 0,
        maximumFractionDigits: 0
    })
    return valorMoneda
}

function buscarProducto(){  
    contenedor.innerHTML ="";
    let nombreProducto = document.querySelector('[name="buscar"]').value;
    if (!nombreProducto) {
        cargarProductos();
        return;
    }
        fetch(`http://localhost:8080/productos/nombres/${nombreProducto}`)
        .then(res =>  res.json())
        .then(productos =>{
            console.log("productos.length : "+productos.length )
            if(productos.length > 0){
                productos.forEach(producto => {
                    console.log("creando card ")
                    crearCard(producto.nombre, producto.imagenesProducto[0]?.urlImagen, producto.precio)
                });
            }else{
                mostrarMensajeNoEncontrado(nombreProducto)
            }
            
        }).catch(error => {
            console.error('Error:', error)
            mostrarMensajeNoEncontrado(nombreProducto)

        });
    
}

function mostrarMensajeNoEncontrado(nombre) {
    contenedor.innerHTML = `<p>No se encontró el producto "${nombre}".</p>`;
  }





/*document.addEventListener('DOMContentLoaded', function(){
    
fetch('../productos.json')
.then(response => response.json())
.then(data => {console.log(data)
    listaProductos = data.productos;
    console.log("Esta es la lista", listaProductos);
    let Lista = listaProductos;
    
    Lista.forEach(element => {
        crearCard(element.nombre, element.imagen, element.precio, element.descripcion)
    
});
})
.catch(error => console.error('Error:', error));


let local = JSON.parse(localStorage.getItem("KeyLista"))

if (local != null){
    local.forEach(element => {
        crearCard(element.nombre, "../img/arroz-removebg-preview.png", element.precio, element.descripcion)
    });
}

});*/


////Detalle producto
/*const contenedor = document.getElementById('contenedor-cards');

contenedor.addEventListener("click", function (event) {

    const card = event.target.closest(".card");
    if (card) {
        const detalleProducto = [{
            precio: card.querySelector(".card-content h2").textContent,
            nombre: card.querySelector(".card-content p").textContent,
            imagen: "../img/"+card.querySelector(".card-image img").src.split("/img/").pop(),
            descripcion: card.querySelector(".descripcion").textContent
        }];
        

        console.log(detalleProducto);
        localStorage.setItem("productoSeleccionado",JSON.stringify(detalleProducto));
    }
});*/


// fetch('../productos.json')
//     .then(response => response.json();
//     })
//     .then(data => {
//         // Si el JSON contiene un objeto con una propiedad "productos"
//         const productos = Array.isArray(data) ? data : data.productos;
//         if (!Array.isArray(productos)) {
//             throw new Error('El JSON no contiene un arreglo válido.');
//         }
//         productos.forEach(producto => {
//             console.log(`ID: ${producto.id}, Producto: ${JSON.stringify(producto)}`);
//         });
//     })
//     .catch(error => console.error('Error al cargar el archivo JSON:', error));




