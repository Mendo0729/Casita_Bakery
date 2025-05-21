export function createSidebar() {
    // Crear contenedor principal del sidebar
    const menuSide = document.createElement("div");
    menuSide.className = "menu__side";

    // Botón hamburguesa con imagen
    const toggleButton = document.createElement("button");
    toggleButton.className = "hamburger-btn";
    const toggleIcon = document.createElement("img");
    toggleIcon.src = "img/menu.png";
    toggleIcon.alt = "Menú";
    toggleIcon.className = "menu-icon";
    toggleButton.appendChild(toggleIcon);
    menuSide.appendChild(toggleButton);

    // Crear nombre de la página
    const namePage = document.createElement("div");
    namePage.className = "name__page";
    const h4 = document.createElement("h4");
    h4.textContent = "Casita Bakery";
    namePage.appendChild(h4);

    // Crear contenedor de opciones del menú
    const optionsMenu = document.createElement("div");
    optionsMenu.className = "options__menu";

    // Datos de enlaces
    const links = [
        { href: "index.html", text: "Inicio", icon: "img/inicio.png" },
        { href: "entrada_pedido.html", text: "Entrada de Pedidos", icon: "img/entrada.png" },
        { href: "pedidos.html", text: "Ver Pedidos", icon: "img/pedido.png" }
    ];

    // Crear los enlaces
    links.forEach(link => {
        const a = document.createElement("a");
        a.href = link.href;

        const img = document.createElement("img");
        img.src = link.icon;
        img.alt = link.text;
        img.className = "menu-icon";

        const span = document.createElement("span");
        span.textContent = link.text;

        a.appendChild(img);
        a.appendChild(span);
        optionsMenu.appendChild(a);

        // Cerrar el menú al hacer clic (solo útil en móvil)
        a.addEventListener("click", () => {
            optionsMenu.classList.remove("active");
        });
    });

    // Agregar elementos al sidebar
    menuSide.appendChild(namePage);
    menuSide.appendChild(optionsMenu);

    // Toggle del menú con el botón hamburguesa
    toggleButton.addEventListener("click", () => {
        optionsMenu.classList.toggle("active");
    });

    return menuSide;
}
