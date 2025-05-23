
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

            mostrarPedidosRecientes(pedidosRecientes);
        })
        .catch(error => console.error('Error al cargar los pedidos:', error));
}

function mostrarPedidosRecientes(pedidos) {
    const contenedor = document.querySelector('.recent-orders');
    const lista = document.createElement('ul');

    // Limpiar contenido anterior si se vuelve a llamar
    contenedor.innerHTML = '<h3>Pedidos Recientes</h3>';

    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0); // Ignorar hora

    const en7Dias = new Date();
    en7Dias.setDate(hoy.getDate() + 7);
    en7Dias.setHours(23, 59, 59, 999); // Fin del séptimo día

    // Filtrar pedidos entre hoy y los próximos 7 días
    const pedidosRecientes = pedidos.filter(pedido => {
        const fechaPedido = new Date(pedido.fecha);
        return fechaPedido >= hoy && fechaPedido <= en7Dias;
    });

    // Ordenar por fecha ascendente
    pedidosRecientes.sort((a, b) => new Date(a.fecha) - new Date(b.fecha));

    // Mostrar resultados
    if (pedidosRecientes.length === 0) {
        lista.innerHTML = '<li>No hay pedidos para los próximos 7 días.</li>';
    } else {
        pedidosRecientes.forEach(pedido => {
            const li = document.createElement('li');
            li.textContent = `${pedido.fecha} - ${pedido.nombre} - ${pedido.pedido} - ${pedido.estado}`;
            lista.appendChild(li);
        });
    }

    contenedor.appendChild(lista);
}



