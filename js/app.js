function mostrarMensaje(texto, tipo = 'exito') {
    const mensaje = document.getElementById('mensaje');
    mensaje.textContent = texto;
    mensaje.className = `tarjeta-mensaje ${tipo}`;
    mensaje.classList.remove('oculto');

    // Ocultar automáticamente después de 3 segundos
    setTimeout(() => {
        mensaje.classList.add('oculto');
    }, 3000);
}

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
        mostrarMensaje('Seleccione un producto', 'error');

        return;
    }

    if (!tipoSeleccionado) {
        mostrarMensaje('Seleccione el tipo de pedido', 'error');

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

        botonEliminar.onclick = function () {
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




const URL_SHEET = 'https://script.google.com/macros/s/AKfycbxbW32NY0LUeuFK6D3eV6oXbS1HGGeeDqhaqOeUE9bctOd8Z7hn_YFGshnEqGDxUOJA/exec'; // tu URL


document.getElementById('pedidoForm').addEventListener('submit', function (e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const fecha = document.getElementById('fecha').value;

    // Verificar que todos los campos estén completos
    if (nombre === '' || productosSeleccionados.length === 0 || fecha === '') {
        mostrarMensaje('Por favor completa todos los campos y agrega al menos un producto.', 'error');
        return;
    }

    // Formatear los productos seleccionados
    const productosFormateados = productosSeleccionados.map(prod => `${prod.nombre} (${prod.cantidad})`);

    // Crear el objeto de datos que se enviará a Google Sheets
    const data = {
        nombre: nombre,
        pedido: productosFormateados.join(', '), // Ej: Brownies (Individual), Cheesecake (Completo)
        fecha: fecha, // Fecha de entrega
        estado: 'Pendiente', // Estado inicial
        timestamp: new Date().toISOString() // Timestamp en formato ISO
    };

    console.log('Nombre:', nombre);
    console.log('Productos:', productosFormateados);
    console.log('Fecha:', fecha);
    console.log('Estado:', 'Pendiente');
    console.log('Timestamp:', data.timestamp);

    // Enviar los datos a Google Sheets
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
            mostrarMensaje('Pedido guardado exitosamente en Google Sheets.', 'exito');
            this.reset();
            productosSeleccionados.length = 0;
            actualizarLista();
            document.getElementById('opcionesCantidad').style.display = 'none'; // También ocultar checkboxes
        })
        .catch(error => {
            console.error('Error:', error);
            mostrarMensaje('Error al guardar el Pedido', 'error');
        });
});


document.addEventListener('DOMContentLoaded', function () {
    // Cargar los pedidos al cargar la página
    cargarPedidos();
});

function cargarPedidos() {
    fetch(URL_SHEET)
      .then(response => {
        if (!response.ok) throw new Error('Error de red: ' + response.statusText);
        return response.json(); // parseamos como JSON directamente
      })
      .then(data => {
        console.log(data); // para ver si llegan los datos
        const tbody = document.querySelector('#tablaPedidos tbody');
        tbody.innerHTML = '';
        data.forEach(pedido => {
          const fila = document.createElement('tr');
          fila.innerHTML = `
            <td>${pedido.timestamp}</td>
            <td>${pedido.nombre}</td>
            <td>${pedido.pedido}</td>
            <td>${pedido.fecha}</td>
            <td>${pedido.estado}</td>
          `;
          tbody.appendChild(fila);
        });
      })
      .catch(error => {
        console.error('Error al cargar los pedidos:', error);
        alert('No se pudieron cargar los pedidos');
      });
  }


