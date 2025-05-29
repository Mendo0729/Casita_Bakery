/*function mostrarMensaje(texto, tipo = 'exito') {
  const mensaje = document.getElementById('mensaje');
  mensaje.textContent = texto;
  mensaje.className = `tarjeta-mensaje ${tipo}`;
  mensaje.classList.remove('oculto');

    setTimeout(() => {
        mensaje.classList.add('oculto');
    }, 3000);
}

const productosSeleccionados = [];

document.addEventListener('DOMContentLoaded', function () {
    const selectProducto = document.getElementById('producto');
    const formulario = document.getElementById('pedidoForm');

    if (selectProducto) {
        selectProducto.addEventListener('change', mostrarOpciones);
    }

    if (formulario) {
        formulario.addEventListener('submit', enviarPedido);
    }
});

function mostrarOpciones() {
    const producto = document.getElementById('producto').value;
    const opcionesDiv = document.getElementById('opcionesCantidad');
    const checkboxesDiv = document.getElementById('opcionesCheckboxes');

    checkboxesDiv.innerHTML = '';

    if (!producto) {
        opcionesDiv.style.display = 'none';
        return;
    }

    opcionesDiv.style.display = 'block';

    if (producto === 'Cheesecake') {
        checkboxesDiv.innerHTML = `
          <label><input type="checkbox" name="tipoPedido" value="Pedazo"> Pedazo</label>
          <label><input type="checkbox" name="tipoPedido" value="Completo"> Completo</label>
          <label for="cantidad">Cantidad:</label>
          <input type="number" id="cantidad" name="cantidad" min="1" value="1">
        `;
    } else {
        checkboxesDiv.innerHTML = `
          <label><input type="checkbox" name="tipoPedido" value="Individual"> Individual</label>
          <label><input type="checkbox" name="tipoPedido" value="Caja de 3"> Caja de 3</label>
          <label for="cantidad">Cantidad:</label>
          <input type="number" id="cantidad" name="cantidad" min="1" value="1">
        `;
    }
}

function agregarProducto() {
    const producto = document.getElementById('producto').value;
    const tipoPedidoInputs = document.querySelectorAll('#opcionesCheckboxes input[type="checkbox"]');
    const cantidad = parseInt(document.getElementById('cantidad').value);

    const tiposSeleccionados = Array.from(tipoPedidoInputs)
        .filter(input => input.checked)
        .map(input => input.value);

    if (!producto) {
        mostrarMensaje('Seleccione un producto', 'error');
        return;
    }

    if (tiposSeleccionados.length === 0) {
        mostrarMensaje('Seleccione al menos un tipo de pedido', 'error');
        return;
    }

    if (isNaN(cantidad) || cantidad < 1) {
        mostrarMensaje('Ingrese una cantidad válida', 'error');
        return;
    }

    productosSeleccionados.push({
        nombre: producto,
        tipo: tiposSeleccionados.join(', '),
        cantidad: cantidad
    });

    actualizarLista();

    document.getElementById('producto').value = '';
    document.getElementById('opcionesCantidad').style.display = 'none';
}

function actualizarLista() {
    const lista = document.getElementById('productosSeleccionados');
    lista.innerHTML = '';

    productosSeleccionados.forEach((prod, index) => {
        const li = document.createElement('li');
        li.textContent = `${prod.nombre} - ${prod.tipo} x${prod.cantidad}`;

        const botonEliminar = document.createElement('button');
        botonEliminar.textContent = '❌';
        botonEliminar.style.marginLeft = '10px';
        botonEliminar.onclick = () => eliminarProducto(index);

        li.appendChild(botonEliminar);
        lista.appendChild(li);
        
    });
}

function eliminarProducto(index) {
    productosSeleccionados.splice(index, 1);
    actualizarLista();
}

const URL_SHEET = 'https://script.google.com/macros/s/AKfycby8_eGggdQMUITQyahL0G9T6dDmCQBzO1wMsu8gHxdudVdYitxsvXLeQ3dSQlVrUGll/exec';


function enviarPedido(e) {
    e.preventDefault();

    const nombre = document.getElementById('nombre').value.trim();
    const fecha = document.getElementById('fecha').value;

    if (nombre === '' || productosSeleccionados.length === 0 || fecha === '') {
        mostrarMensaje('Por favor completa todos los campos y agrega al menos un producto.', 'error');
        return;
    }

    const productosFormateados = productosSeleccionados.map(prod => `${prod.nombre} (${prod.tipo} x${prod.cantidad})`);

    const data = {
        nombre,
        pedido: productosFormateados.join(', '),
        fecha,
        estado: 'Pendiente',
        timestamp: new Date().toISOString(),
        accion: 'agregar'
    };

  fetch(URL_SHEET, {
      method: 'POST',
      mode: 'no-cors',
      body: JSON.stringify(data),
      headers: { 'Content-Type': 'application/json' }
  })
  .then(() => {
      mostrarMensaje('Pedido guardado exitosamente.', 'exito');
      e.target.reset();
      productosSeleccionados.length = 0;
      actualizarLista();
      document.getElementById('opcionesCantidad').style.display = 'none';
  })
  .catch(error => {
      console.error('Error:', error);
      mostrarMensaje('Error al guardar el Pedido', 'error');
  });
}*/
