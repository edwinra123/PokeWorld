import { renderHome } from "../views/home.js";
import { renderPokeLista } from "../views/pokelista.js";

const routes = {
    home: renderHome,
    pokelista: renderPokeLista,
    // favoritos, tipos, habilidades, legendarios
};

export function initRouter() {
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            navItems.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const route = link.dataset.route;
            if (routes[route]) routes[route]();
        });
    });

    // Render home por defecto
    routes.home();
}

document.addEventListener("DOMContentLoaded", () => {
    initRouter();
});
