const carritodiv = document.getElementById("carrito");
const btproducto1 = document.getElementById("btproducto1");
const btproducto2 = document.getElementById("btproducto2");
const btproducto3 = document.getElementById("btproducto3");
const totalcarrito = document.getElementById("totalcarrito");


class Producto {
    constructor(id, nombre, precio) {
        this.id = id;
        this.nombre = nombre;
        this.precio = precio;
        this.cantidad = 1;
    }
}


class Carrito extends Producto {
    

    static productos = [];
    static {const carritoGuardado = JSON.parse(localStorage.getItem('carrito')) || []
    
    carritoGuardado.forEach(element => {
        this.productos.push (new Carrito(element.id, element.nombre, element.precio, element.cantidad))
    })}


    static actualizarLocalStorage() {
        localStorage.setItem('carrito', JSON.stringify(this.productos));
        
    }

    static agregarProducto(producto) {
        const productoExistente = this.productos.find(p => p.id === producto.id);
        if (productoExistente) {
            productoExistente.cantidad += producto.cantidad; 
        } else {
            this.productos.push(producto); 
        }
        this.actualizarLocalStorage();
    }

    static eliminarProducto(id) {
        const productoExistente = this.productos.find(producto => producto.id === id);
    if (productoExistente) {
        if (productoExistente.cantidad > 1) {
            productoExistente.cantidad--;
        } else {
            this.productos = this.productos.filter(producto => producto.id !== id);
        }
    }
    this.actualizarLocalStorage()
    
    }

    
    
static vercarrito (){
    return this.productos;
}
    
    static vaciarCarrito() {
        this.productos = [];
        this.actualizarLocalStorage()
        mostrarCarrito(Carrito.vercarrito ());

    }
    
}

function actualizaryeliminar (id){
    Carrito.eliminarProducto (id)
    mostrarCarrito(Carrito.vercarrito ());
}

function calcularTotal(array){
    let total=0
    for (let i = 0; i < array.length; i++) {
        total += array[i].precio * array[i].cantidad;
        
    }
    return total;
}


function mostrarCarrito(tablacarrito) {
    if (tablacarrito.length === 0) {
        carritodiv.innerHTML = "El carrito está vacío.";
        totalcarrito.innerHTML = `Total del carrito: $0`;
    } else {
        let tabla = `
            <table>
                <thead>
                    <tr>
                        <th>Producto</th>
                        <th>Precio</th>
                        <th>Cantidad</th>
                        <th>SubTotal</th>
                        <th>Acción</th>
                    </tr>
                </thead>
                <tbody>`;

        tablacarrito.forEach(producto => {
            tabla += `
                <tr>
                    <td>${producto.nombre}</td>
                    <td>$${producto.precio}</td>
                    <td>${producto.cantidad}</td>
                    <td>$${producto.cantidad * producto.precio}</td>
                    <td>
                        <button class="btn-2" onclick="actualizaryeliminar(${producto.id})">Eliminar -1</button>
                    </td>
                </tr>`;
        });

        tabla += `</tbody></table>`;

        carritodiv.innerHTML = tabla;

        totalcarrito.innerHTML = `Total del carrito: $${calcularTotal(Carrito.vercarrito())}`;
    }
}




function agregaryactualizar(id, nombre, precio) {
    const nuevoProducto = new Carrito(id, nombre, precio, 1); 
    Carrito.agregarProducto(nuevoProducto);
    mostrarCarrito(Carrito.vercarrito ());
}



btproducto1.addEventListener("click", () => agregaryactualizar(1, "Camiseta", 500));
btproducto2.addEventListener("click", () => agregaryactualizar(2, "Pantalones", 1000));
btproducto3.addEventListener("click", () => agregaryactualizar(3, "Zapatos", 1500));

mostrarCarrito(Carrito.vercarrito ());

const botonAbonar = document.getElementById("abonar");


botonAbonar.addEventListener("click", () => {
    if (Carrito.productos.length > 0) {
        alert("Compra realizada con exito. ¡Gracias por tu compra!");
        Carrito.vaciarCarrito();
    } else {
        alert("El carrito vacio. cargar los productos antes de abonar.");
    }
});


const botonCancelarCompra = document.getElementById("cancelar");

botonCancelarCompra.addEventListener("click", () => {
    Carrito.vaciarCarrito();
    alert("La compra ha sido cancelada, carrito vacio.");
});