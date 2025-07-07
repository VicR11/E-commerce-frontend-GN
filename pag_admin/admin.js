
/*import { initializeApp } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-app.js";
import { getStorage, ref, uploadBytes, getDownloadURL } from "https://www.gstatic.com/firebasejs/10.11.0/firebase-storage.js";*/
//const url = "https://xpnrrkuyw4.us-east-1.awsapprunner.com";
const url = "http://localhost:8080";
const CLOUD_NAME = 'dusm0i6o7';  // reemplaza por tu cloud name
const UPLOAD_PRESET = 'productos_agroshop_unsigned';

let animacion;
let urlsImagenes =[];
let listaProductos = JSON.parse(localStorage.getItem("KeyLista")) || [];
let contador = listaProductos?.length;


document.querySelector(".formulario").addEventListener("submit", async function (event) {
   event.preventDefault();
  const nombre = document.getElementById("nombreProducto").value;
  const desc = document.getElementById("descripcionProducto").value;
  const precio = parseFloat(document.getElementById("precioProducto").value);
  const cantidad = parseInt(document.getElementById("cantidadProducto").value); 
  const imagenInput = document.getElementById("imageUpload");
  const imagenes = imagenInput.files;

  if (!imagenes) {
    alert("Por favor selecciona una imagen.");
    return;
  }

  
  

  try {
      for (const imagen of imagenes) {
        
          const formData = new FormData();
          formData.append('file', imagen);
          formData.append('upload_preset', UPLOAD_PRESET);

          const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
            method: 'POST',
            body: formData
          });

          const data = await res.json();
          console.log('✅ Imagen subida:', data);
          console.log("data.secure_url -->"+data.secure_url);
          urlsImagenes.push({ urlImagen: data.secure_url  });
      }
    
    const producto = {
      nombre: nombre,
      precio: precio,
      descripcion: desc,
      cantidad: cantidad,
      imagenesProducto: urlsImagenes // Guardamos la URL de descarga
    };
    
    guardarProducto(producto)
    listaProductos.push(producto);
    localStorage.setItem("KeyLista", JSON.stringify(listaProductos));

    renderizarTablaProductos()
    alert("✅ Producto agregado correctamente");

    // Limpia el formulario
    document.querySelector(".formulario").reset();

    // Opcional: recarga la tabl
  } catch (error) {
    console.error("❌ Error al subir la imagen:", error);
    alert("Ocurrió un error al subir la imagen.");
  }
});



 

document.addEventListener('DOMContentLoaded', renderizarTablaProductos());



// Función para mostrar los productos en la tabla
function renderizarTablaProductos() {

  limpiarTablar();

  fetch(`${url}/productos`)
 .then(response => response.json())
 .then(data => {console.log(data)

  
    data.forEach(element => {
        crearTabla(element.id, element.nombre, element.precio, element.imagenesProducto)
    
 });
 })
.catch(error => console.error('Error:', error));


}

// Función para eliminar un producto (opcional)
function eliminarProducto(id) {
  
  if (confirm("¿Seguro que deseas eliminar este producto?")) {

     fetch(`${url}/productos/borrar/${id}`, {
        method: "DELETE",
      })
      .then(response => {
      if (response.ok) {
        alert("Producto eliminado con éxito");
        renderizarTablaProductos();
      } else {
        alert("Error al eliminar el producto");
      }
      })
  }
}



function crearTabla(id, nombre, precio, imagenes){
  const tbody = document.getElementById("tabla-productos-body");
    const fila = document.createElement("tr");
    const linksImagenes = imagenes.map(imagen => `<a href="${imagen.urlImagen}" target="_blank">Ver imagen</a>`).join(' | ')

    fila.innerHTML += `
      <th scope="row">${id}</th>
      <td>${nombre}</td>
      <td>${precio}</td>
      <td>${linksImagenes}</td>
      <td><button class="btn btn-outline-success" onclick="mostrarModalActualizar(${id})">Actualizar</button></td>
      <td><button class="btn btn-outline-danger" onclick="eliminarProducto(${id})">Eliminar</button></td>
    `;

    tbody.appendChild(fila);
}
function mostrarModalActualizar(id){

  const modal = document.getElementById("modal-actualizar")
  modal.style.display = 'flex'


  fetch(`${url}/productos/${id}`)
  .then(response => response.json())
  .then(data => {
  document.getElementById("id-producto").textContent = `Id: ${data.id}`
  document.getElementById("nombreModal").value = data.nombre;
  document.getElementById("descripcionModal").value = data.descripcion;
  document.getElementById("precioModal").value = data.precio;
  document.getElementById("cantidadModal").value = data.cantidad; 
  document.getElementById("imageModal").textContent = data.imagen;

});

}

function guardarProducto(producto){

 fetch(`${url}/productos`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(producto)
      })
        .then(response => response.text()) // <- importante: leer como texto
        .then(message => {
          alert(message); // mostrará: "Pedido borrado con exito"
        })
        .catch(error => {
          console.error("Error al eliminar el pedido:", error);
        });

}

function limpiarTablar(){
   const tbody = document.getElementById("tabla-productos-body");
  tbody.innerHTML = "";
}



document.getElementById("botonModalActualizar").addEventListener('click', actualizarProducto)

async function actualizarProducto(){

  const nombre = document.getElementById("nombreModal").value;
  const desc = document.getElementById("descripcionModal").value;
  const precio = parseFloat(document.getElementById("precioModal").value);
  const cantidad = parseInt(document.getElementById("cantidadModal").value); 
  const imagenInput = document.getElementById("imageModal");
  const imagenes = imagenInput.files;
  
  const idProducto = document.getElementById("id-producto").textContent.split("Id:").pop().trim()
  console.log(idProducto);
  

    for (const imagen of imagenes) {
          
      const formData = new FormData();
      formData.append('file', imagen);
      formData.append('upload_preset', UPLOAD_PRESET);

      const res = await fetch(`https://api.cloudinary.com/v1_1/${CLOUD_NAME}/image/upload`, {
        method: 'POST',
        body: formData
      });

      const data = await res.json();
      console.log('✅ Imagen subida:', data);
      console.log("data.secure_url -->"+data.secure_url);
      urlsImagenes.push({ urlImagen: data.secure_url  });
  }

  const productoActualizado = {
  nombre: nombre,
  precio: precio,
  descripcion: desc,
  cantidad: cantidad,
  imagenesProducto: urlsImagenes // Guardamos la URL de descarga
  };

    console.log(productoActualizado);
    

  fetch(`${url}/productos/editar/${idProducto}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify(productoActualizado)
      })
        .then(response => response.text()) // <- importante: leer como texto
        .then(message => {
          const modal = document.getElementById("modal-actualizar")
          modal.style.display = 'none'
          mostrarModal(message, "black")
          renderizarTablaProductos() // mostrará: "Pedido borrado con exito"
        })
        .catch(error => {
          console.error("Error al editar producto:", error);
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
    }, 3000);

}

/*const listaProductos = JSON.parse(localStorage.getItem("KeyLista")) || []; // Se trae los productos del local storage O se inicializa el array
let contador = listaProductos?.length;// SE cuenta la longitud del json
// console.log("Esta es la lista " + listaProductos); // se
// console.log("La longitud es ",contador);



document.querySelector(".formulario").addEventListener("submit", function(event) {
    event.preventDefault(); 


    
    const nombre = document.getElementById("nombreProducto").value;
    const desc = document.getElementById('descripcionProducto').value
    const precio = document.getElementById("precioProducto").value;
    const imagenInput = document.getElementById("imageUpload");
    const imagen = imagenInput.files[0];
    
    
    const producto = {
      id: contador++,
      nombre: nombre,
      descripcion: desc,
      precio: "$"+precio,
      imagen: imagen ? imagen.name : null
    };
    
    
    listaProductos.push(producto);
    console.log(JSON.stringify(listaProductos, null, 2));
    localStorage.setItem("KeyLista",JSON.stringify(listaProductos));

  });*/

