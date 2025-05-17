const URL_SHEET = 'https://script.google.com/macros/s/AKfycbzNhM_JqQDj8y94UEDKhIFqfTGbpSGkraEUJq1lxZbs9-jD9ABop60oZDzcxDrFSNML/exec';

document.addEventListener('DOMContentLoaded', function () {
    const tabla = document.getElementById('tablaPedidos');
    if (tabla) {
        cargarPedidos();
    }

    const formBusqueda = document.getElementById('busquedaForm');
    const inputNombre = document.getElementById('buscarNombre');
    const inputFecha = document.getElementById('buscarFecha');
    const btnLimpiar = document.getElementById('limpiarBusqueda');

    let datosPedidos = [];

    formBusqueda.addEventListener('submit', function (e) {
        e.preventDefault();
        const nombreBuscar = inputNombre.value.trim().toLowerCase();
        const fechaBuscar = inputFecha.value;

        const filtrados = datosPedidos.filter(pedido => {
            const nombreMatch = (pedido.nombre || '').toLowerCase().includes(nombreBuscar);
            const fechaMatch = fechaBuscar ? pedido.fecha === fechaBuscar : true;
            return nombreMatch && fechaMatch;
        });

        mostrarPedidos(filtrados);
    });

    btnLimpiar.addEventListener('click', function () {
        inputNombre.value = '';
        inputFecha.value = '';
        mostrarPedidos(datosPedidos);
    });

    function cargarPedidos() {
        fetch(URL_SHEET)
            .then(response => {
                if (!response.ok) throw new Error('Error de red');
                return response.json();
            })
            .then(data => {
                datosPedidos = data.filter(p => p.estado === 'Pendiente');
                mostrarPedidos(datosPedidos);
            })
            .catch(error => {
                console.error('Error al cargar los pedidos:', error);
                alert('No se pudieron cargar los pedidos');
            });
    }

    function limpiarTexto(texto) {
        return texto.replace(/</g, "&lt;").replace(/>/g, "&gt;");
    }

    function mostrarPedidos(pedidos) {
        const tbody = document.querySelector('#tablaPedidos tbody');
        tbody.innerHTML = '';

        if (pedidos.length === 0) {
            const fila = document.createElement('tr');
            fila.innerHTML = `<td colspan="6">No se encontraron resultados.</td>`;
            tbody.appendChild(fila);
            return;
        }

        pedidos.forEach((pedido) => {
            const fila = document.createElement('tr');

            fila.innerHTML = `
                <td>${pedido.timestamp}</td>
                <td contenteditable="false">${pedido.nombre}</td>
                <td contenteditable="false">${pedido.pedido}</td>
                <td contenteditable="false">${pedido.fecha}</td>
                <td>
                    <select class="estado-select" disabled>
                        <option value="Pendiente" ${pedido.estado === 'Pendiente' ? 'selected' : ''}>Pendiente</option>
                        <option value="Entregado" ${pedido.estado === 'Entregado' ? 'selected' : ''}>Entregado</option>
                    </select>
                </td>
                <td>
                    <button class="editar-btn">Editar</button>
                    <button class="guardar-btn" disabled>Guardar</button>
                    <button class="eliminar-btn">Eliminar</button>
                </td>
            `;

            tbody.appendChild(fila);

            const btnEditar = fila.querySelector('.editar-btn');
            const btnGuardar = fila.querySelector('.guardar-btn');
            const btnEliminar = fila.querySelector('.eliminar-btn');

            btnEditar.addEventListener('click', () => {
                fila.querySelectorAll('td[contenteditable]').forEach(td => td.contentEditable = true);
                fila.querySelector('.estado-select').disabled = false;
                btnGuardar.disabled = false;
                btnEditar.disabled = true;
            });

            btnGuardar.addEventListener('click', () => {
                fila.querySelectorAll('td[contenteditable]').forEach(td => td.contentEditable = false);
                btnGuardar.disabled = true;
                btnEditar.disabled = false;
                fila.querySelector('.estado-select').disabled = true;

                const nombre = limpiarTexto(fila.children[1].textContent.trim());
                const pedidoTexto = limpiarTexto(fila.children[2].textContent.trim());
                const fechaTexto = fila.children[3].textContent.trim();
                let fechaISO = '';

                if (!isNaN(Date.parse(fechaTexto))) {
                    fechaISO = new Date(fechaTexto).toISOString();
                } else {
                    alert('La fecha no es válida. Usa el formato YYYY-MM-DD.');
                    return;
                }

                const datosActualizados = {
                    accion: 'actualizar',
                    timestamp: fila.children[0].textContent,
                    nombre: nombre,
                    pedido: pedidoTexto,
                    fecha: fechaISO,
                    estado: fila.querySelector('.estado-select').value
                };

                fetch(URL_SHEET, {
                    method: 'POST',
                    mode: 'no-cors',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(datosActualizados)
                })
                    .then(() => {
                        alert("Pedido actualizado correctamente.");
                        cargarPedidos(); // recargar lista
                    })
                    .catch(error => {
                        console.error('Error al actualizar el pedido:', error);
                        alert('Error al intentar actualizar el pedido.');
                    });
            });

            btnEliminar.addEventListener('click', () => {
                if (confirm('¿Estás seguro de eliminar este pedido?')) {
                    fetch(URL_SHEET, {
                        method: 'POST',
                        mode:'no-cors',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify({
                            accion: 'eliminar',
                            timestamp: pedido.timestamp
                        })
                    })
                        .then(() => {
                            alert("Pedido eliminado correctamente.");
                            cargarPedidos();
                        })
                        .catch(error => {
                            console.error('Error al eliminar el pedido:', error);
                            alert('Error al intentar eliminar el pedido.');
                        });
                }
            });
        });
    }
});
