import { renderHome } from "../views/home.js";
import { renderPokeLista } from "../views/pokelista.js";
import { renderFavoritos } from "../views/favoritos.js";
import { renderLegendarios } from "../views/legendarios.js";
import { renderAjustes } from "../views/ajustes.js";

const routes = {
    home: renderHome,
    pokelista: renderPokeLista,
    favoritos: renderFavoritos,
    legendarios: renderLegendarios,
    ajustes: renderAjustes,
};

// ⭐ NUEVA FUNCIÓN: Aplica dark mode
function applyDarkMode() {
    if (localStorage.getItem("darkMode") === "true") {
        document.body.classList.add("dark");
    } else {
        document.body.classList.remove("dark");
    }
}

export function initRouter() {
    const navItems = document.querySelectorAll(".nav-item");

    navItems.forEach(link => {
        link.addEventListener("click", (e) => {
            e.preventDefault();

            navItems.forEach(l => l.classList.remove("active"));
            link.classList.add("active");

            const route = link.dataset.route;

            const mainContent = document.getElementById("main-content");
            mainContent.classList.remove("pagina-banner");

            if (routes[route]) {
                routes[route]();

                applyDarkMode();
            }
        });
    });

    applyDarkMode();
    routes.home();
}

document.addEventListener("DOMContentLoaded", () => {
    initRouter();
});