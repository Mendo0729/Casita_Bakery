const productosSeleccionados = [];

    function agregarProducto() {
        const producto = document.getElementById('producto').value;
        if (producto) {
            productosSeleccionados.push(producto);
            actualizarLista();
            // Limpia la selección después de agregar
            document.getElementById('producto').value = '';
        } else {
            alert('Por favor selecciona un producto.');
        }
    }

    function actualizarLista() {
        const lista = document.getElementById('productosSeleccionados');
        lista.innerHTML = ''; // Limpia la lista anterior
        productosSeleccionados.forEach(prod => {
            const li = document.createElement('li');
            li.textContent = prod;
            lista.appendChild(li);
        });
    }

function agregarProducto() {
    const producto = document.getElementById('producto').value;
    if (producto) {
        productosSeleccionados.push(producto);
        actualizarLista();
        document.getElementById('producto').value = '';
    } else {
        alert('Por favor selecciona un producto.');
    }
}

function actualizarLista() {
    const lista = document.getElementById('productosSeleccionados');
    lista.innerHTML = '';
    productosSeleccionados.forEach(prod => {
        const li = document.createElement('li');
        li.textContent = prod;
        lista.appendChild(li);
    });
}

const URL_SHEET = 'https://script.google.com/macros/s/AKfycbxjYMh2K0G9e7fDRaup5i1kUhwcMxzEKj4lv_7Pqgira6GlTcqIyJCz7oPVhInB3rBM/exec'; // tu URL

document.getElementById('pedidoForm').addEventListener('submit', function(e) {
    e.preventDefault();
    const nombre = document.getElementById('nombre').value.trim();
    const fecha = document.getElementById('fecha').value;
    
    if (nombre === '' || productosSeleccionados.length === 0 || fecha === '') {
        alert('Por favor completa todos los campos y agrega al menos un producto.');
        return;
    }

    const productos = [...productosSeleccionados];

    const data = {
        nombre: nombre,
        pedido: productos.join(', '),
        fecha: fecha
    };

    // Mostrar en consola
    console.log('Nombre:', nombre);
    console.log('Productos:', productos);
    console.log('Fecha:', fecha);

    // Enviar a Google Sheets
    fetch(URL_SHEET, {
        method: 'POST',
        mode: 'no-cors', // 🔥 Aquí añadimos
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(response => {
        console.log('Pedido enviado.');
        alert('Pedido guardado exitosamente en Google Sheets.');
        this.reset();
        productosSeleccionados.length = 0;
        actualizarLista();
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al guardar el pedido.');
    });
});
