import { renderHome } from "../views/home.js";
import { renderPokeLista } from "../views/pokelista.js";
import { renderFavoritos } from "../views/favoritos.js"; // ⬅️ IMPORTAR

const routes = {
    home: renderHome,
    pokelista: renderPokeLista,
    favoritos: renderFavoritos,

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


    routes.home();
}

document.addEventListener("DOMContentLoaded", () => {
    initRouter();
});