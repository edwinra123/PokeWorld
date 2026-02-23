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

function applyDarkMode() {
    const isDark = localStorage.getItem("darkMode") === "true";
    document.documentElement.classList.toggle("dark", isDark);
    document.body.classList.toggle("dark", isDark);
}

export function navigateTo(route) {
    document.querySelectorAll(".nav-item").forEach((l) => l.classList.remove("active"));

    document.querySelectorAll(`[data-route="${route}"]`).forEach(el => el.classList.add("active"));

    document.getElementById("main-content").classList.remove("pagina-banner");

    if (routes[route]) {
        routes[route]();
        applyDarkMode();
    }
}

export function initRouter() {
    document.querySelectorAll(".nav-item").forEach((link) => {
        link.addEventListener("click", (e) => {
            e.preventDefault();
            navigateTo(link.dataset.route);
        });
    });

    navigateTo("home");
}

initRouter();