const links = document.querySelectorAll('.options__menu a');
    const secciones = document.querySelectorAll('.Contenido-principal > div');

    links.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const id = link.getAttribute('href').substring(1); // obtiene "Inicio" o "Pedidos"

            // Oculta todas las secciones
            secciones.forEach(sec => sec.style.display = 'none');

            // Muestra la sección seleccionada
            const seccionMostrar = document.getElementById(id);
            if (seccionMostrar) {
                seccionMostrar.style.display = 'block';
            }
        });
    });

    // Muestra solo la primera sección al cargar (Inicio)
    document.addEventListener('DOMContentLoaded', () => {
        secciones.forEach(sec => sec.style.display = 'none');
        const primera = document.getElementById('Inicio');
        if (primera) primera.style.display = 'block';
    });
