const URL_SHEET = 'https://script.google.com/macros/s/AKfycby8_eGggdQMUITQyahL0G9T6dDmCQBzO1wMsu8gHxdudVdYitxsvXLeQ3dSQlVrUGll/exec';
const DAYS_TO_SHOW = 7; // Configurable
let pedidosFiltrados = []; // Variable global para almacenar los pedidos filtrados

document.addEventListener("DOMContentLoaded", () => {
    fetchPedidos();
});

async function fetchPedidos() {
    try {
        showLoadingState();
        
        const response = await fetch(URL_SHEET);
        if (!response.ok) throw new Error('Error en la red');
        
        const data = await response.json();
        if (!Array.isArray(data)) throw new Error('Datos no válidos');
        
        processPedidosData(data);
    } catch (error) {
        console.error('Error al cargar los pedidos:', error);
        showErrorState(error.message);
    } finally {
        hideLoadingState();
    }
}

function processPedidosData(pedidos) {
    // Estadísticas
    const total = pedidos.length;
    const pendientes = pedidos.filter(p => p.estado?.toLowerCase() === 'pendiente').length;
    const entregados = pedidos.filter(p => p.estado?.toLowerCase() === 'entregado').length;
    
    updateSummaryCards(total, pendientes, entregados);
    mostrarPedidosRecientes(pedidos);
}

function updateSummaryCards(total, pendientes, entregados) {
    const formatNumber = num => num.toLocaleString();
    
    document.querySelector('.summary .card:nth-child(1) p').textContent = formatNumber(total);
    document.querySelector('.summary .card:nth-child(2) p').textContent = formatNumber(pendientes);
    document.querySelector('.summary .card:nth-child(3) p').textContent = formatNumber(entregados);
    
    // Opcional: añadir clases para colores según estado
    document.querySelector('.summary .card:nth-child(2)').classList.toggle('warning', pendientes > 0);
}

function mostrarPedidosRecientes(pedidos) {
    const contenedor = document.querySelector('.recent-orders');
    contenedor.innerHTML = '<h3>Pedidos Recientes</h3>';
    
    const hoy = new Date();
    hoy.setHours(0, 0, 0, 0);
    
    const enNDias = new Date();
    enNDias.setDate(hoy.getDate() + DAYS_TO_SHOW);
    enNDias.setHours(23, 59, 59, 999);
    
    pedidosFiltrados = pedidos
        .filter(pedido => {
            const fechaPedido = new Date(pedido.fecha);
            return !isNaN(fechaPedido) && fechaPedido >= hoy && fechaPedido <= enNDias;
        })
        .sort((a, b) => new Date(a.fecha) - new Date(b.fecha));
    
    if (pedidosFiltrados.length === 0) {
        contenedor.innerHTML += '<p class="no-orders">No hay pedidos para los próximos días.</p>';
        return;
    }
    
    const tabla = document.createElement('table');
    tabla.innerHTML = `
        <thead>
            <tr>
                <th>Fecha</th>
                <th>Cliente</th>
                <th>Pedido</th>
                <th>Estado</th>
                <th>Acciones</th>
            </tr>
        </thead>
        <tbody></tbody>
    `;
    
    const tbody = tabla.querySelector('tbody');
    
    pedidosFiltrados.forEach((pedido, index) => {
        const fecha = new Date(pedido.fecha);
        const fechaFormateada = fecha.toLocaleDateString('es-ES');
        
        const tr = document.createElement('tr');
        tr.innerHTML = `
            <td>${fechaFormateada}</td>
            <td>${pedido.nombre || 'Sin nombre'}</td>
            <td>${pedido.pedido || 'Sin detalles'}</td>
            <td><span class="estado ${pedido.estado?.toLowerCase() || 'desconocido'}">${pedido.estado || 'Sin estado'}</span></td>
            <td><button class="btn-small ver-detalle" data-index="${index}">Ver</button></td>
        `;
        tbody.appendChild(tr);
    });
    
    contenedor.appendChild(tabla);
    
    // Añadir event listeners para los botones
    document.querySelectorAll('.ver-detalle').forEach(btn => {
        btn.addEventListener('click', function() {
            const pedidoIndex = parseInt(this.getAttribute('data-index'));
            verDetallePedido(pedidoIndex);
        });
    });
}

function verDetallePedido(index) {
    const pedido = pedidosFiltrados[index];
    
    if (!pedido) {
        alert('Pedido no encontrado');
        return;
    }
    
    mostrarModalDetalles(pedido);
}

function mostrarModalDetalles(pedido) {
    const modal = document.createElement('div');
    modal.className = 'modal-detalle';
    modal.innerHTML = `
        <div class="modal-contenido">
            <span class="cerrar-modal">&times;</span>
            <h3>Detalles del Pedido</h3>
            <p><strong>Fecha:</strong> ${new Date(pedido.fecha).toLocaleDateString('es-ES')}</p>
            <p><strong>Cliente:</strong> ${pedido.nombre || 'Sin nombre'}</p>
            <p><strong>Pedido:</strong> ${pedido.pedido || 'Sin detalles'}</p>
            <p><strong>Estado:</strong> <span class="estado ${pedido.estado?.toLowerCase() || 'desconocido'}">${pedido.estado || 'Sin estado'}</span></p>
            <!-- Agrega más campos según necesites -->
        </div>
    `;
    
    document.body.appendChild(modal);
    
    modal.querySelector('.cerrar-modal').addEventListener('click', () => {
        modal.remove();
    });
    
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            modal.remove();
        }
    });
}

// Funciones de utilidad
function showLoadingState() {
    document.querySelectorAll('.summary .card').forEach(card => {
        card.classList.add('loading');
    });
}

function hideLoadingState() {
    document.querySelectorAll('.summary .card').forEach(card => {
        card.classList.remove('loading');
    });
}

function showErrorState(message) {
    const contenedor = document.querySelector('.dashboard');
    const errorDiv = document.createElement('div');
    errorDiv.className = 'error-message';
    errorDiv.textContent = `Error: ${message}`;
    contenedor.prepend(errorDiv);
}