const productosSeleccionados = [];

document.getElementById('producto').addEventListener('change', mostrarOpciones);

function mostrarOpciones() {
    const producto = document.getElementById('producto').value;
    const opcionesDiv = document.getElementById('opcionesCantidad');
    const checkboxesDiv = document.getElementById('opcionesCheckboxes');

    checkboxesDiv.innerHTML = ''; // Limpiar las opciones anteriores

    if (!producto) {
        opcionesDiv.style.display = 'none';
        return;
    }

    opcionesDiv.style.display = 'block';

    if (producto === 'Cheesecake') {
        checkboxesDiv.innerHTML = `
            <label>
                <input type="checkbox" id="pedazo" name="tipoPedido" value="Pedazo">
                Pedazo
            </label>
            <label>
                <input type="checkbox" id="completo" name="tipoPedido" value="Completo">
                Completo
            </label>
        `;
    } else {
        // Para Brownies, Galletas, Cinnamon Rolls
        checkboxesDiv.innerHTML = `
            <label>
                <input type="checkbox" id="individual" name="tipoPedido" value="Individual">
                Individual
            </label>
            <label>
                <input type="checkbox" id="caja3" name="tipoPedido" value="Caja de 3">
                Caja de 3
            </label>
        `;
    }
}

function agregarProducto() {
    const producto = document.getElementById('producto').value;
    const tipoPedidoInputs = document.querySelectorAll('#opcionesCheckboxes input[type="checkbox"]');
    let tipoSeleccionado = '';

    tipoPedidoInputs.forEach(input => {
        if (input.checked) {
            tipoSeleccionado = input.value;
        }
    });

    if (!producto) {
        alert('Por favor selecciona un producto.');
        return;
    }

    if (!tipoSeleccionado) {
        alert('Por favor selecciona el tipo de pedido.');
        return;
    }

    productosSeleccionados.push({ nombre: producto, cantidad: tipoSeleccionado });
    actualizarLista();

    // Limpiar selección
    document.getElementById('producto').value = '';
    document.getElementById('opcionesCantidad').style.display = 'none';
}

function actualizarLista() {
    const lista = document.getElementById('productosSeleccionados');
    lista.innerHTML = '';

    productosSeleccionados.forEach((prod, index) => {
        const li = document.createElement('li');
        li.textContent = `${prod.nombre} - ${prod.cantidad} `;

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = '❌';
        botonEliminar.style.marginLeft = '10px';
        botonEliminar.style.background = 'transparent';
        botonEliminar.style.border = 'none';
        botonEliminar.style.cursor = 'pointer';
        botonEliminar.style.color = '#ff5555';
        botonEliminar.style.fontSize = '18px';

        botonEliminar.onclick = function() {
            eliminarProducto(index);
        };

        li.appendChild(botonEliminar);
        lista.appendChild(li);
    });
}

function eliminarProducto(index) {
    productosSeleccionados.splice(index, 1);
    actualizarLista();
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

    // Adaptar para enviar también el tipo de pedido
    const productosFormateados = productosSeleccionados.map(prod => `${prod.nombre} (${prod.cantidad})`);

    const data = {
        nombre: nombre,
        pedido: productosFormateados.join(', '), // Ej: Brownies (Individual), Cheesecake (Completo)
        fecha: fecha
    };

    console.log('Nombre:', nombre);
    console.log('Productos:', productosFormateados);
    console.log('Fecha:', fecha);

    // Enviar a Google Sheets
    fetch(URL_SHEET, {
        method: 'POST',
        mode: 'no-cors',
        body: JSON.stringify(data),
        headers: {
            'Content-Type': 'application/json'
        }
    })
    .then(() => {
        console.log('Pedido enviado.');
        alert('Pedido guardado exitosamente en Google Sheets.');
        this.reset();
        productosSeleccionados.length = 0;
        actualizarLista();
        document.getElementById('opcionesCantidad').style.display = 'none'; // También ocultar checkboxes
    })
    .catch(error => {
        console.error('Error:', error);
        alert('Hubo un error al guardar el pedido.');
    });
});

