document.addEventListener("DOMContentLoaded", () => {
    const toggleBtn = document.getElementById("toggleFormBtn");
    const form = document.getElementById("formProducto");
    const tabla = document.getElementById("tablainventario").querySelector("tbody");

    const URL_SCRIPT = "https://script.google.com/macros/s/AKfycbxoI4noEDmGBCgD1jxj-mmYYjumw2xLfwV6dqifsyrH0YaoaIrlaEUsS63QQ3pTJCl5/exec";

    // Mostrar/Ocultar formulario
    toggleBtn.addEventListener("click", () => {
        form.classList.toggle("oculto");
    });

    // Cargar inventario al cargar la página
    async function cargarInventario() {
        try {
            const respuesta = await fetch(URL_SCRIPT); // doGet
            const productos = await respuesta.json();

            tabla.innerHTML = ""; // Limpiar tabla

            productos.forEach(producto => {
                const fila = document.createElement("tr");

                fila.innerHTML = `
        <td class="celda-id">${producto.id}</td>
        <td class="celda-producto">${producto.producto}</td>
        <td class="celda-marca">${producto.marca}</td>
        <td class="celda-cantidad">${producto.cantidad}</td>
        <td class="celda-observaciones">${producto.observaciones}</td>
        <td>
            <button class="btn-editar"><img src="img/editar.png" alt="Editar"></button>
            <button class="btn-guardar" style="display: none;"><img src="img/guardar.png" alt="Guardar"></button>
            <button class="btn-eliminar"><img src="img/basura.png" alt="Eliminar"></button>
        </td>
    `;

                const btnEditar = fila.querySelector(".btn-editar");
                const btnGuardar = fila.querySelector(".btn-guardar");
                const btnEliminar = fila.querySelector(".btn-eliminar");

                // Editar fila
                btnEditar.addEventListener("click", () => {
                    [...fila.querySelectorAll("td")].forEach((td, i) => {
                        if (i > 0 && i < 5) { // Evita la columna ID y botones
                            const valor = td.textContent;
                            td.innerHTML = `<input type="text" value="${valor}">`;
                        }
                    });
                    btnEditar.style.display = "none";
                    btnGuardar.style.display = "inline-block";
                });

                // Guardar cambios
                btnGuardar.addEventListener("click", async () => {
                    const id = fila.querySelector(".celda-id").textContent;
                    const inputs = fila.querySelectorAll("input");

                    const datosActualizados = {
                        id: id,
                        producto: inputs[0].value,
                        marca: inputs[1].value,
                        cantidad: inputs[2].value,
                        observaciones: inputs[3].value
                    };

                    try {
                        await fetch(URL_SCRIPT, {
                            method: "POST", // Puedes usar "PUT" si lo configuras en el backend
                            mode: "no-cors",
                            headers: {
                                "Content-Type": "application/json"
                            },
                            body: JSON.stringify({ ...datosActualizados, action: "editar" })
                        });

                        setTimeout(cargarInventario, 1000); // Recarga tabla
                    } catch (error) {
                        console.error("Error al guardar:", error);
                        alert("No se pudo guardar el producto.");
                    }
                });

                // Eliminar fila
                btnEliminar.addEventListener("click", async () => {
                    const id = fila.querySelector(".celda-id").textContent;
                    if (confirm("¿Estás seguro de que quieres eliminar este producto?")) {
                        try {
                            await fetch(URL_SCRIPT, {
                                method: "POST",
                                mode: "no-cors",
                                headers: {
                                    "Content-Type": "application/json"
                                },
                                body: JSON.stringify({ id, action: "eliminar" })
                            });

                            setTimeout(cargarInventario, 1000);
                        } catch (error) {
                            console.error("Error al eliminar:", error);
                            alert("No se pudo eliminar el producto.");
                        }
                    }
                });
                

                tabla.appendChild(fila);
            });

        } catch (error) {
            console.error("Error al cargar el inventario:", error);
            alert("No se pudo cargar el inventario. Verifica tu conexión.");
        }
    }

    // Envío del formulario
    form.addEventListener("submit", async (e) => {
        e.preventDefault();

        const producto = form.producto.value.trim();
        const marca = form.marca.value.trim();
        const cantidad = form.cantidad.value.trim();
        const observaciones = form.observaciones.value.trim();

        if (!producto || !marca || !cantidad) {
            alert("Por favor, completa los campos obligatorios.");
            return;
        }

        const datos = { producto, marca, cantidad, observaciones };

        try {
            await fetch(URL_SCRIPT, {
                method: "POST",
                mode: "no-cors", // requerido por CORS desde localhost
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(datos)
            });

            form.reset();
            form.classList.add("oculto");

            // Volver a cargar la tabla desde Google Sheets
            setTimeout(cargarInventario, 1000); // Esperar un segundo antes de recargar

        } catch (error) {
            console.error("Error al enviar los datos:", error);
            alert("No se pudo enviar el producto. Verifica tu conexión.");
        }
    });

    // Carga inicial
    cargarInventario();
});
