import { appState } from "../assets/state.js";
import { showPokemonDetails, capitalize, padId } from "../assets/utils.js";

const POKE_URL = "https://pokeapi.co/api/v2/pokemon";
let currentPage = 1;
const perPage = 20;

export function renderPokeLista() {
    currentPage = 1; 

    const main = document.getElementById("main-content");
    main.innerHTML = `
        <div class="div-top">
            <div class="item_flex">
                <div class="input-search-div">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" class="input-search" id="searchInput" placeholder="Escribe aquí">
                </div>
            </div>
        </div>
        <section class="pokemon-list-section">
            <div class="container_cards"></div>
            <div class="pagination-container">
                <button class="pagination-btn prev"><i class="fa-solid fa-angle-left"></i></button>
                <div class="numbers"></div>
                <button class="pagination-btn next"><i class="fa-solid fa-angle-right"></i></button>
            </div>
        </section>
    `;

    const searchInput = document.getElementById("searchInput");
    const container = document.querySelector(".container_cards");

    if (appState.searchQuery) {
        searchInput.value = appState.searchQuery;
        appState.searchQuery = "";
        searchInput.dispatchEvent(new Event("input"));
    } else {
        loadPage(currentPage);
    }

    document.querySelector(".prev").addEventListener("click", () => {
        if (currentPage > 1) loadPage(--currentPage);
    });
    document.querySelector(".next").addEventListener("click", () => {
        loadPage(++currentPage);
    });

    // Búsqueda por Enter (nombre exacto)
    searchInput.addEventListener("keydown", async (e) => {
        if (e.key !== "Enter") return;
        const query = searchInput.value.toLowerCase().trim();
        if (!query) return;

        container.innerHTML = "<p>Buscando Pokémon...</p>";
        try {
            const res = await fetch(`${POKE_URL}/${query}`);
            if (!res.ok) throw new Error("Pokémon no encontrado");
            const pokeData = await res.json();
            container.innerHTML = "";
            container.appendChild(createCard(pokeData));
            applyCompactMode(container);
        } catch (err) {
            container.innerHTML = `<p style="color:red;">${err.message}</p>`;
        }
    });

    // Búsqueda en tiempo real con debounce
    let debounceTimeout;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimeout);
        const query = e.target.value.toLowerCase().trim();

        if (!query) {
            loadPage(currentPage);
            return;
        }

        debounceTimeout = setTimeout(async () => {
            try {
                const res = await fetch(`${POKE_URL}?limit=1000`);
                const data = await res.json();
                const results = data.results.filter((p) => p.name.startsWith(query)).slice(0, 10);

                container.innerHTML = "";

                if (results.length === 0) {
                    container.innerHTML = "<p style='color:red;'>No se encontraron coincidencias</p>";
                    return;
                }

                const pokemons = await Promise.all(results.map((p) => fetch(p.url).then((r) => r.json())));
                pokemons.forEach((p) => container.appendChild(createCard(p)));
                applyCompactMode(container);
            } catch (err) {
                container.innerHTML = "<p style='color:red;'>Error al buscar</p>";
                console.error(err);
            }
        }, 300);
    });
}

async function loadPage(page) {
    const container = document.querySelector(".container_cards");
    if (!container) return;
    container.innerHTML = "<p>Cargando Pokémon...</p>";

    try {
        const offset = (page - 1) * perPage;
        const res = await fetch(`${POKE_URL}?limit=${perPage}&offset=${offset}`);
        const data = await res.json();

        const pokemons = await Promise.all(data.results.map((p) => fetch(p.url).then((r) => r.json())));

        container.innerHTML = "";
        pokemons.forEach((p) => container.appendChild(createCard(p)));

        setupPagination(data.count);
        applyCompactMode(container);
    } catch (err) {
        container.innerHTML = "<p>Error al cargar Pokémon</p>";
        console.error(err);
    }
}

function applyCompactMode(container) {
    if (localStorage.getItem("compactMode") === "true") {
        container.classList.add("compacto");
    }
}

function createCard(poke) {
    const card = document.createElement("div");
    card.className = "card_pokemons";
    card.style.cursor = "pointer";
    card.innerHTML = `
        <div class="img_card_pokemon">
            <img src="${poke.sprites.other["official-artwork"].front_default}" alt="${poke.name}">
        </div>
        <div class="info_poke">
            <div class="title_pokemon"><h2>${capitalize(poke.name)}</h2></div>
            <div class="id_pk"><h6>${padId(poke.id)}</h6></div>
        </div>
    `;
    card.addEventListener("click", () => showPokemonDetails(poke));
    return card;
}

function setupPagination(total) {
    const numbers = document.querySelector(".numbers");
    if (numbers) numbers.innerHTML = `Página ${currentPage} / ${Math.ceil(total / perPage)}`;
}
