
const URL_SHEET = 'https://script.google.com/macros/s/AKfycby8_eGggdQMUITQyahL0G9T6dDmCQBzO1wMsu8gHxdudVdYitxsvXLeQ3dSQlVrUGll/exec';

document.addEventListener("DOMContentLoaded", () => {
    fetchPedidos();
});

function fetchPedidos() {
    fetch(URL_SHEET)
        .then(response => response.json())
        .then(data => {
            if (!Array.isArray(data)) return;

            let total = data.length;
            let pendientes = 0;
            let entregados = 0;
            const pedidosRecientes = [];

            const hoy = new Date();
            const hace7Dias = new Date(hoy);
            hace7Dias.setDate(hoy.getDate() - 7);

            data.forEach(pedido => {
                const estado = pedido.estado?.toLowerCase();
                if (estado === 'pendiente') pendientes++;
                if (estado === 'entregado') entregados++;

                const fechaPedido = new Date(pedido.fecha);
                if (!isNaN(fechaPedido) && fechaPedido >= hace7Dias && fechaPedido <= hoy) {
                    pedidosRecientes.push(pedido);
                }
            });

            document.querySelector('.summary .card:nth-child(1) p').textContent = total;
            document.querySelector('.summary .card:nth-child(2) p').textContent = pendientes;
            document.querySelector('.summary .card:nth-child(3) p').textContent = entregados;

            mostrarPedidosRecientes(data); // pasamos todos los datos
        })
        .catch(error => console.error('Error al cargar los pedidos:', error));
}

function mostrarPedidosRecientes(pedidos) {
    const contenedor = document.querySelector('.recent-orders');
    const lista = document.createElement('ul');

    contenedor.innerHTML = '<h3>Pedidos Recientes</h3>';

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);

    const en7Dias = new Date();
    en7Dias.setDate(hoy.getDate() + 7);
    en7Dias.setHours(23, 59, 59, 999);

    const pedidosRecientes = pedidos.filter(pedido => {
        const fechaPedido = new Date(pedido.fecha);
        return !isNaN(fechaPedido) && fechaPedido >= hoy && fechaPedido <= en7Dias;
    });

    pedidosRecientes.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    if (pedidosRecientes.length === 0) {
        lista.innerHTML = '<li>No hay pedidos para los próximos 7 días.</li>';
    } else {
        pedidosRecientes.forEach(pedido => {
            const fecha = new Date(pedido.fecha);
            const fechaFormateada = `${fecha.getDate().toString().padStart(2, '0')}/${
                (fecha.getMonth() + 1).toString().padStart(2, '0')}/${fecha.getFullYear()}`;

            const li = document.createElement('li');
            li.textContent = `${fechaFormateada} - ${pedido.nombre ?? 'Sin nombre'} - ${pedido.pedido ?? 'Sin pedido'} - ${pedido.estado ?? 'Sin estado'}`;
            lista.appendChild(li);
        });
    }

    contenedor.appendChild(lista);
}
