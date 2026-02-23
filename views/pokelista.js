import { appState } from "../assets/state.js";
import { showPokemonDetails, capitalize, padId } from "../assets/utils.js";

const POKE_URL = "https://pokeapi.co/api/v2/pokemon";
let currentPage = 1;
const perPage = 20;

const TYPES = [
    { name: "fire",     label: "Fuego",    color: "#F08030" },
    { name: "water",    label: "Agua",     color: "#6890F0" },
    { name: "grass",    label: "Planta",   color: "#78C850" },
    { name: "electric", label: "Eléctrico",color: "#F8D030" },
    { name: "psychic",  label: "Psíquico", color: "#F85888" },
    { name: "ice",      label: "Hielo",    color: "#98D8D8" },
    { name: "dragon",   label: "Dragón",   color: "#7038F8" },
    { name: "dark",     label: "Siniestro",color: "#705848" },
    { name: "fairy",    label: "Hada",     color: "#EE99AC" },
    { name: "fighting", label: "Lucha",    color: "#C03028" },
    { name: "poison",   label: "Veneno",   color: "#A040A0" },
    { name: "ground",   label: "Tierra",   color: "#E0C068" },
    { name: "flying",   label: "Volador",  color: "#A890F0" },
    { name: "bug",      label: "Bicho",    color: "#A8B820" },
    { name: "rock",     label: "Roca",     color: "#B8A038" },
    { name: "ghost",    label: "Fantasma", color: "#705898" },
    { name: "steel",    label: "Acero",    color: "#B8B8D0" },
    { name: "normal",   label: "Normal",   color: "#A8A878" },
];

const GENERATIONS = [
    { value: "1", label: "Gen 1", offset: 0,   limit: 151 },
    { value: "2", label: "Gen 2", offset: 151,  limit: 100 },
    { value: "3", label: "Gen 3", offset: 251,  limit: 135 },
    { value: "4", label: "Gen 4", offset: 386,  limit: 107 },
    { value: "5", label: "Gen 5", offset: 493,  limit: 156 },
    { value: "6", label: "Gen 6", offset: 649,  limit: 72  },
    { value: "7", label: "Gen 7", offset: 721,  limit: 88  },
    { value: "8", label: "Gen 8", offset: 809,  limit: 96  },
    { value: "9", label: "Gen 9", offset: 905,  limit: 120 },
];

let activeType = null;
let activeGen  = null;

export function renderPokeLista() {
    currentPage = 1;
    activeType  = null;
    activeGen   = null;

    const main = document.getElementById("main-content");
    main.innerHTML = `
        <div class="div-top">
            <div class="item_flex">
                <div class="input-search-div">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" class="input-search" id="searchInput" placeholder="Escribe aquí">
                </div>
            </div>

            <!-- FILTROS -->
            <button class="filtros-toggle" id="filtros-toggle">
                <i class="fas fa-sliders-h"></i> Filtros
                <i class="fas fa-chevron-down filtros-toggle-arrow"></i>
            </button>
            <div class="filtros-wrap" id="filtros-wrap">
                <!-- Por Tipo -->
                <div class="filtro-group">
                    <span class="filtro-label"><i class="fas fa-tag"></i> Tipo</span>
                    <div class="filtro-chips" id="chips-tipo">
                        ${TYPES.map(t => `
                            <button class="filtro-chip" data-type="${t.name}"
                                style="--chip-color: ${t.color}">
                                ${t.label}
                            </button>`).join("")}
                    </div>
                </div>

                <!-- Por Generación -->
                <div class="filtro-group">
                    <span class="filtro-label"><i class="fas fa-globe"></i> Generación</span>
                    <div class="filtro-chips" id="chips-gen">
                        ${GENERATIONS.map(g => `
                            <button class="filtro-chip" data-gen="${g.value}">
                                ${g.label}
                            </button>`).join("")}
                    </div>
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
    const container   = document.querySelector(".container_cards");

    // --- Toggle filtros en móvil ---
    const toggleBtn = document.getElementById("filtros-toggle");
    const filtrosWrap = document.getElementById("filtros-wrap");
    if (toggleBtn) {
        toggleBtn.addEventListener("click", () => {
            const isOpen = filtrosWrap.classList.toggle("open");
            toggleBtn.classList.toggle("open", isOpen);
        });
    }

    // --- Chips de Tipo ---
    document.querySelectorAll("#chips-tipo .filtro-chip").forEach(btn => {
        btn.addEventListener("click", () => {
            const tipo = btn.dataset.type;
            if (activeType === tipo) {
                activeType = null;
                btn.classList.remove("active");
            } else {
                document.querySelectorAll("#chips-tipo .filtro-chip").forEach(b => b.classList.remove("active"));
                activeType = tipo;
                btn.classList.add("active");
            }
            activeGen = null;
            document.querySelectorAll("#chips-gen .filtro-chip").forEach(b => b.classList.remove("active"));
            currentPage = 1;
            loadWithFilters();
        });
    });

    // --- Chips de Generación ---
    document.querySelectorAll("#chips-gen .filtro-chip").forEach(btn => {
        btn.addEventListener("click", () => {
            const gen = btn.dataset.gen;
            if (activeGen === gen) {
                activeGen = null;
                btn.classList.remove("active");
            } else {
                document.querySelectorAll("#chips-gen .filtro-chip").forEach(b => b.classList.remove("active"));
                activeGen = gen;
                btn.classList.add("active");
            }
            activeType = null;
            document.querySelectorAll("#chips-tipo .filtro-chip").forEach(b => b.classList.remove("active"));
            currentPage = 1;
            loadWithFilters();
        });
    });

    // --- Paginación ---
    document.querySelector(".prev").addEventListener("click", () => {
        if (currentPage > 1) { currentPage--; loadWithFilters(); }
    });
    document.querySelector(".next").addEventListener("click", () => {
        currentPage++;
        loadWithFilters();
    });

    // --- Búsqueda ---
    if (appState.searchQuery) {
        searchInput.value = appState.searchQuery;
        appState.searchQuery = "";
        searchInput.dispatchEvent(new Event("input"));
    } else {
        loadWithFilters();
    }

    searchInput.addEventListener("keydown", async (e) => {
        if (e.key !== "Enter") return;
        const query = searchInput.value.toLowerCase().trim();
        if (!query) return;
        showSkeletons(container, 4);
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

    let debounceTimeout;
    searchInput.addEventListener("input", (e) => {
        clearTimeout(debounceTimeout);
        const query = e.target.value.toLowerCase().trim();
        if (!query) { loadWithFilters(); return; }
        debounceTimeout = setTimeout(async () => {
            try {
                const res = await fetch(`${POKE_URL}?limit=1000`);
                const data = await res.json();
                const results = data.results.filter(p => p.name.startsWith(query)).slice(0, 10);
                container.innerHTML = "";
                if (results.length === 0) {
                    container.innerHTML = "<p style='color:red;'>No se encontraron coincidencias</p>";
                    return;
                }
                const pokemons = await Promise.all(results.map(p => fetch(p.url).then(r => r.json())));
                pokemons.forEach(p => container.appendChild(createCard(p)));
                applyCompactMode(container);
            } catch (err) {
                container.innerHTML = "<p style='color:red;'>Error al buscar</p>";
            }
        }, 300);
    });
}

async function loadWithFilters() {
    const container = document.querySelector(".container_cards");
    if (!container) return;
    showSkeletons(container);

    try {
        if (activeType) {
            // Filtrar por tipo
            const res  = await fetch(`https://pokeapi.co/api/v2/type/${activeType}`);
            const data = await res.json();
            const all  = data.pokemon.map(p => p.pokemon);
            const total = all.length;
            const offset = (currentPage - 1) * perPage;
            const slice  = all.slice(offset, offset + perPage);
            const pokemons = await Promise.all(slice.map(p => fetch(p.url).then(r => r.json())));
            container.innerHTML = "";
            pokemons.forEach(p => container.appendChild(createCard(p)));
            setupPagination(total);
            applyCompactMode(container);

        } else if (activeGen) {
            // Filtrar por generación
            const gen = GENERATIONS.find(g => g.value === activeGen);
            const res  = await fetch(`${POKE_URL}?limit=${gen.limit}&offset=${gen.offset}`);
            const data = await res.json();
            const slice = data.results.slice((currentPage - 1) * perPage, currentPage * perPage);
            const pokemons = await Promise.all(slice.map(p => fetch(p.url).then(r => r.json())));
            container.innerHTML = "";
            pokemons.forEach(p => container.appendChild(createCard(p)));
            setupPagination(gen.limit);
            applyCompactMode(container);

        } else {
            // Sin filtro — comportamiento original
            await loadPage(currentPage);
        }
    } catch (err) {
        container.innerHTML = "<p>Error al cargar Pokémon</p>";
        console.error(err);
    }
}

async function loadPage(page) {
    const container = document.querySelector(".container_cards");
    if (!container) return;
    showSkeletons(container);
    try {
        const offset = (page - 1) * perPage;
        const res  = await fetch(`${POKE_URL}?limit=${perPage}&offset=${offset}`);
        const data = await res.json();
        const pokemons = await Promise.all(data.results.map(p => fetch(p.url).then(r => r.json())));
        container.innerHTML = "";
        pokemons.forEach(p => container.appendChild(createCard(p)));
        setupPagination(data.count);
        applyCompactMode(container);
    } catch (err) {
        container.innerHTML = "<p>Error al cargar Pokémon</p>";
        console.error(err);
    }
}


function showSkeletons(container, count = 20) {
    container.innerHTML = Array(count).fill(`
        <div class="card_pokemons skeleton-card">
            <div class="skeleton-img"></div>
            <div class="skeleton-info">
                <div class="skeleton-line skeleton-name"></div>
                <div class="skeleton-line skeleton-id"></div>
            </div>
        </div>
    `).join("");
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