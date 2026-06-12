import { appState } from "../assets/state.js";

export function renderAjustes() {
    const app = document.getElementById("main-content");
    app.classList.add("pagina-banner");

    app.innerHTML = `
        <div class="banner_ajustes">
            <div class="banner_left_js">
                <div class="banner_left_top">
                    <div class="banner_top">
                        <span>Inicio > Ajustes</span>
                        <div class="search_aj">
                            <i class="fas fa-search search-icon"></i>
                            <input type="text" placeholder="Buscar ajuste..." class="input_search_aj" />
                        </div>
                    </div>
                </div>
                <div class="banner_left_bottom">
                    <div class="banner_bottom_padding">
                        <div class="banner_text_bottom">
                            <h1>Ajustes de la pagina</h1>
                            <p class="text_aj">Gestiona tus preferencias de visualización, notificaciones y cuenta.</p>
                        </div>
                        <div class="banner-config-visual">
                            <div class="banner-config-top">
                                <h2>Visualización</h2>
                                <p>Personaliza cómo ves la Pokédex</p>
                            </div>
                            <div class="banner-config-bottom ajuste-item">
                                <div class="left-config">
                                    <div class="icon-left"><i class="fa-solid fa-moon"></i></div>
                                    <div class="config-text">
                                        <h1>Modo Oscuro</h1>
                                        <p>Cambia la interfaz a colores oscuros para reducir la fatiga visual.</p>
                                    </div>
                                </div>
                                <div class="right-config">
                                    <label class="switch">
                                        <input type="checkbox" id="darkToggle">
                                        <span class="slider"></span>
                                    </label>
                                </div>
                            </div>
                            <div class="banner-config-bottom ajuste-item">
                                <div class="left-config">
                                    <div class="icon2"><i class="fa-solid fa-border-all"></i></div>
                                    <div class="config-text">
                                        <h1>Vista de Cuadrícula Compacta</h1>
                                        <p>Muestra más Pokémon por fila reduciendo el tamaño de las tarjetas.</p>
                                    </div>
                                </div>
                                <div class="right-config">
                                    <label class="switch">
                                        <input type="checkbox" id="toggle-compact">
                                        <span class="slider"></span>
                                    </label>
                                </div>
                            </div>
                        </div>
                        <div class="banner_consejo">
                            <div class="banner_lg_cs"><i class="fa-solid fa-lightbulb"></i></div>
                            <div class="text_banner_cs">
                                <h1>Consejo</h1>
                                <p>Tus preferencias se guardan automáticamente y se aplicarán en todas las páginas de la Pokédex. Puedes cambiarlas en cualquier momento.</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="banner_right_js"></div>
        </div>
    `;

    initDarkModeToggle();
    initCompactToggle();
    initSettingsSearch();
}

function initDarkModeToggle() {
    const toggle = document.getElementById("darkToggle");
    if (!toggle) return;

    toggle.checked = appState.prefs.darkMode;

    toggle.addEventListener("change", () => {
        appState.prefs.darkMode = toggle.checked;
    });
}

function initCompactToggle() {
    const toggle = document.getElementById("toggle-compact");
    if (!toggle) return;

    toggle.checked = appState.prefs.compactMode;

    toggle.addEventListener("change", () => {
        appState.prefs.compactMode = toggle.checked;

        const cards = document.querySelector(".container_cards");
        if (cards) cards.classList.toggle("compacto", toggle.checked);
    });
}

function initSettingsSearch() {
    const input = document.querySelector(".input_search_aj");
    const items = [...document.querySelectorAll(".ajuste-item")];
    if (!input || items.length === 0) return;

    input.addEventListener("input", () => {
        const query = input.value.toLowerCase().trim();
        items.forEach((item) => {
            item.style.display = item.textContent.toLowerCase().includes(query) ? "" : "none";
        });
    });
}
