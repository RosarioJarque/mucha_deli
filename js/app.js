 // Variables
let items = document.querySelector('#items');
let carrito = [];
let total = 0;
let $carrito = document.querySelector('#carrito');
let $total = document.querySelector('#total');
let $botonVaciar = document.querySelector('#boton-vaciar');
let contenidoJson = [];
const miLocalStorage = window.localStorage;
            
window.onload = function () {  

    // Inicio
    cargarCarritoDeLocalStorage();
    renderItems();
    calcularTotal();
    renderizarCarrito();

} 
                
// Funcion para crear cards
function renderItems() {
    $.ajax({
        url:"js/data.json",
        dataType: "json",
        success: function(data){
            contenidoJson = data
            // Bucle que devuelve las cards
            for (let info of contenidoJson) {
                            
                // Div Estructura
                let div = document.createElement('div');
                div.classList.add('card-group', 'col-sm-4');
                           
                // Div Card
                let divCard = document.createElement('div');
                divCard.classList.add('card', 'card-body');
                            
                // Titulo
                let nombre = document.createElement('h5');
                nombre.classList.add('card-title');
                nombre.textContent = info['nombre'];
                           
                // Imagen
                let imagen = document.createElement('img');
                imagen.classList.add('img-fluid');
                imagen.setAttribute('src', info['imagen']);
                            
                // Precio
                let precio = document.createElement('p');
                precio.classList.add('card-text');
                precio.textContent = '$' + info['precio'] ;
                            
                // Boton 
                let boton = document.createElement('button');
                boton.classList.add('btn', 'btn-primary');
                boton.textContent = 'Agregar';
                boton.setAttribute('marcador', info['id']);
                boton.addEventListener('click', agregarCarrito);
                            
                //Incerta al html
                divCard.appendChild(imagen);
                divCard.appendChild(nombre);
                divCard.appendChild(precio);
                divCard.appendChild(boton);
                div.appendChild(divCard);
                items.appendChild(div);
            }   
        }
    })           
}
            
// Funcion que se dispara con el click del boton. 
function agregarCarrito () {
// Agregamos el Nodo a nuestro carrito
    carrito.push(this.getAttribute('marcador'))
                    
    // //Animacion
    // $('#anima-cart').show();    
            
    // Calculo el total
    calcularTotal();
    // Renderizamos el carrito 
    renderizarCarrito();
    guardarCarritoEnLocalStorage();
}
            
                
function renderizarCarrito() {
    // Vaciamos todo el html
    $carrito.textContent = '';
    // Quitamos los duplicados
    let carritoSinDuplicados = [...new Set(carrito)];
    // Generamos los Nodos a partir de carrito
    carritoSinDuplicados.forEach(function (item, indice) {
        // Obtenemos el item que necesitamos de la variable contenidoJson
        let miItem = contenidoJson.filter(function(itemBaseDatos) {
            return itemBaseDatos['id'] == item;
        });
        // Cuenta el número de veces que se repite el producto
        let numeroUnidadesItem = carrito.reduce(function (total, itemId) {
            return itemId === item ? total += 1 : total;
        }, 0);
                       
        // Creamos el nodo del item del carrito
        let div = document.createElement('li');
        div.classList.add('list-group-item', 'text-right', 'mx-2');
        div.textContent = `${numeroUnidadesItem} x ${miItem[0]['nombre']} - $${miItem[0]['precio']}`;
        // Boton de borrar
        let miBoton = document.createElement('button');
        miBoton.classList.add('btn', 'btn-dark', 'mx-5', 'btn-quitar');
        miBoton.textContent = 'X';
        miBoton.style.marginLeft = '1rem';
        miBoton.setAttribute('item', item);
        miBoton.addEventListener('click', borrarItemCarrito);
        // Mezclamos nodos
        div.appendChild(miBoton);
        $carrito.appendChild(div);
    });
}
            
function borrarItemCarrito() {
    // Obtenemos el producto ID que hay en el boton pulsado
    let id = this.getAttribute('item');
    // Borramos todos los productos
    carrito = carrito.filter(function (carritoId) {
        return carritoId !== id;
    });
    // volvemos a renderizar
    renderizarCarrito();
    // Calculamos de nuevo el precio
    calcularTotal();
    guardarCarritoEnLocalStorage();
}
            
                
function calcularTotal() {
// Limpiamos precio anterior
    total = 0;
    // Recorremos el array del carrito
    for (let item of carrito) {
        // De cada elemento obtenemos su precio
        let miItem = contenidoJson.filter(function(itemBaseDatos) {
            return itemBaseDatos['id'] == item;
        });
        total = total + miItem[0]['precio'];
    }
    // Formateamos el total para que solo tenga dos decimales
    let totalDosDecimales = total.toFixed(2);
    // Renderizamos el precio en el HTML
    $total.textContent = totalDosDecimales;
}
            
function vaciarCarrito() {
    // Limpiamos los productos guardados
    carrito = [];
    // Renderizamos los cambios
    renderizarCarrito();
    calcularTotal();
    localStorage.clear();
}
            
function guardarCarritoEnLocalStorage () {
    miLocalStorage.setItem('carrito', JSON.stringify(carrito));
}
            
function cargarCarritoDeLocalStorage () {
// Existe un carrito previo guardado en LocalStorage?
    if (miLocalStorage.getItem('carrito') !== null) {
    // Carga la información
        carrito = JSON.parse(miLocalStorage.getItem('carrito'));
        }
}
            
// Eventos
$botonVaciar.addEventListener('click', vaciarCarrito);

                // function finalizarCompra(){
//     alert('Gracias por confiar en Mucha, en seguida sera redirigido a la pagina de pago');
// }
