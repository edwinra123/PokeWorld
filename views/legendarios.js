import { capitalize, getLegendarySpeciesInfo, translateType } from "../assets/utils.js";
import { appState } from "../assets/state.js";

const POKE_URL     = "https://pokeapi.co/api/v2/pokemon";

const coloresClaro = {
    psychic: "#fce4ec", dragon: "#ede7f6", water: "#e3f2fd", fire: "#fff3e0",
    grass: "#e8f5e9", electric: "#fffde7", ice: "#e0f7fa", fighting: "#fbe9e7",
    poison: "#f3e5f5", ground: "#efebe9", flying: "#e8eaf6", bug: "#f1f8e9",
    rock: "#efebe9", ghost: "#ede7f6", steel: "#eceff1", dark: "#efebe9",
    fairy: "#fce4ec", normal: "#f5f5f5",
};

const iconosTipo = {
    psychic: "🧬", dragon: "🐉", flying: "🌊", water: "💧", fire: "🔥",
    grass: "🌿", electric: "⚡", ice: "❄️", fighting: "🥊", poison: "☠️",
    ground: "🗻", bug: "🐛", rock: "🪨", ghost: "👻", steel: "⚙️",
    dark: "🌙", fairy: "🧚", normal: "⭐",
};

const STAT_MAP = { attack: "ataque", speed: "velocidad", defense: "defensa" };

async function fetchPokemon(nombre) {
    const cached = appState.getCachedPokemon(nombre);
    if (cached) return cached;
    try {
        const res = await fetch(`${POKE_URL}/${nombre}`);
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data = await res.json();

        const stats = {};
        data.stats.forEach((s) => {
            if (STAT_MAP[s.stat.name]) stats[STAT_MAP[s.stat.name]] = s.base_stat;
        });

        const speciesRes  = await fetch(data.species.url);
        const speciesData = await speciesRes.json();
        const generacion  = speciesData.generation.url.split("/").filter(Boolean).pop();

        const pokemon = {
            ...data,
            nombre: data.name,
            imagen: data.sprites.other["official-artwork"].front_default,
            imagenPequeña: data.sprites.front_default,
            tipos: data.types.map((t) => t.type.name),
            stats,
            generacion,
            stats_raw: data.stats,
        };

        appState.cachePokemon(nombre, pokemon);
        return pokemon;
    } catch (err) {
        console.error("Error al obtener Pokémon:", err);
        return null;
    }
}

function skeletonDestacado(contenedor) {
    contenedor.innerHTML = `
        <div class="skel-lg-img"></div>
        <div class="skel-lg-info">
            <div class="skel-lg-line skel-lg-tipo"></div>
            <div class="skel-lg-line skel-lg-nombre"></div>
            <div class="skel-lg-stats">
                <div class="skel-lg-stat"></div>
                <div class="skel-lg-stat"></div>
            </div>
        </div>
    `;
}

async function cargarDestacados() {
    const contenedores = document.querySelectorAll(".lg_destacados");
    contenedores.forEach(c => skeletonDestacado(c));

    // Elegimos 3 aleatorios de la lista dinámica
    const lista       = await getLegendarySpeciesInfo();
    const seleccionados = [...lista]
        .sort(() => Math.random() - 0.5)
        .slice(0, 3)
        .map(l => l.nombre);

    const pokemons = await Promise.all(seleccionados.map(fetchPokemon));

    pokemons.forEach((pokemon, i) => {
        if (!pokemon || !contenedores[i]) return;

        const tipoPrincipal = pokemon.tipos[0];
        const colorFondo = coloresClaro[tipoPrincipal] || "#f5f5f5";
        const esOscuro = ["psychic", "dark", "ghost"].includes(tipoPrincipal);
        const colorTexto = esOscuro ? "#ffffff" : "#1f2937";
        const colorSecundario = esOscuro ? "#9ca3af" : "#6b7280";

        contenedores[i].style.background = colorFondo;
        contenedores[i].style.position = "relative";
        contenedores[i].style.overflow = "hidden";
        contenedores[i].style.cursor = "pointer";

        contenedores[i].innerHTML = `
            <div style="display:flex;justify-content:space-between;align-items:flex-start;margin-bottom:1rem;">
                <div>
                    <p style="font-size:0.75rem;color:${colorSecundario};text-transform:uppercase;letter-spacing:0.05em;margin:0;">
                        ${pokemon.tipos.join(" / ")}
                    </p>
                    <h3 style="font-size:2rem;font-weight:700;color:${colorTexto};text-transform:capitalize;margin:0.25rem 0;">
                        ${pokemon.nombre}
                    </h3>
                </div>
                <div style="width:40px;height:40px;background:rgba(255,255,255,0.2);border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:1.5rem;">
                    ${iconosTipo[tipoPrincipal] || "⭐"}
                </div>
            </div>
            <div style="display:flex;gap:2rem;margin-bottom:1rem;">
                <div>
                    <p style="font-size:0.7rem;color:${colorSecundario};text-transform:uppercase;margin:0;">ATAQUE</p>
                    <p style="font-size:1.5rem;font-weight:700;color:${colorTexto};margin:0;">${pokemon.stats.ataque}</p>
                </div>
                <div>
                    <p style="font-size:0.7rem;color:${colorSecundario};text-transform:uppercase;margin:0;">VELOCIDAD</p>
                    <p style="font-size:1.5rem;font-weight:700;color:${colorTexto};margin:0;">${pokemon.stats.velocidad}</p>
                </div>
            </div>
            <p style="font-size:0.7rem;color:${colorSecundario};margin:0;">
                NO. ${String(pokemon.id).padStart(4, "0")} **** GEN ${pokemon.generacion}
            </p>
            <img src="${pokemon.imagen}" alt="${pokemon.nombre}"
                 style="position:absolute;bottom:0;right:10px;width:180px;height:180px;object-fit:contain;pointer-events:none;">
        `;

        contenedores[i].addEventListener("click", () => showLegendarioDetails(pokemon));
    });
}

async function cargarListaLegendarios() {
    const tbody = document.getElementById("lista-legendarios-tbody");
    tbody.innerHTML = Array(8).fill(`
        <tr class="tr_table">
            <td class="tr1"><div class="skel-td skel-td-sm"></div></td>
            <td>
                <div class="pokemon-info">
                    <div class="skel-td-circle"></div>
                    <div class="skel-td skel-td-md"></div>
                </div>
            </td>
            <td class="tr2"><div class="skel-td skel-td-sm"></div></td>
            <td class="tr3"><div class="skel-td skel-td-sm"></div></td>
            <td class="td-btn"><div class="skel-td skel-td-btn"></div></td>
        </tr>
    `).join("");

    // Obtenemos la lista dinámica (ya cacheada si cargarDestacados se llamó antes)
    const lista    = await getLegendarySpeciesInfo();
    const pokemons = await Promise.all(lista.map((l) => fetchPokemon(l.nombre)));

    tbody.innerHTML = "";
    pokemons.forEach((pokemon, i) => {
        if (!pokemon) return;
        const region = lista[i].region;
        const tr = document.createElement("tr");
        tr.className = "tr_table";
        tr.style.cursor = "pointer";
        tr.dataset.search = [
            pokemon.nombre,
            pokemon.tipos.map(t => translateType(t)).join(" "),
            region,
        ].join(" ").toLowerCase();
        tr.innerHTML = `
            <td class="tr1">${String(i + 1).padStart(2, "0")}.</td>
            <td>
                <div class="pokemon-info">
                    <img src="${pokemon.imagenPequeña}" alt="${pokemon.nombre}">
                    <span>${capitalize(pokemon.nombre)}</span>
                </div>
            </td>
            <td class="tr2">${pokemon.tipos.map(t => translateType(t)).join(" / ")}</td>
            <td class="tr3">${region}</td>
            <td class="td-btn">
                <button class="btn-detalles">Ver Detalles</button>
            </td>
        `;

        tr.querySelector(".btn-detalles").addEventListener("click", (e) => {
            e.stopPropagation();
            showLegendarioDetails(pokemon);
        });

        tbody.appendChild(tr);
    });

    filtrarLegendarios(document.getElementById("searchInput")?.value || "");
}


const coloresGradiente = {
    psychic: ["#f857a4", "#ff5858"],
    dragon:  ["#4776e6", "#8e54e9"],
    water:   ["#1a6dff", "#00c6ff"],
    fire:    ["#f7971e", "#ffd200"],
    grass:   ["#56ab2f", "#a8e063"],
    electric:["#f7971e", "#ffd200"],
    ice:     ["#74ebd5", "#9face6"],
    fighting:["#c0392b", "#e74c3c"],
    poison:  ["#8e54e9", "#4776e6"],
    ground:  ["#c97b3a", "#e8b87a"],
    flying:  ["#7f7fd5", "#86a8e7"],
    bug:     ["#78c800", "#b8e800"],
    rock:    ["#8e7355", "#c4a882"],
    ghost:   ["#4b0082", "#7c3aed"],
    steel:   ["#71717a", "#a1a1aa"],
    dark:    ["#1a1a2e", "#16213e"],
    fairy:   ["#f093fb", "#f5576c"],
    normal:  ["#9ca3af", "#6b7280"],
};

const statLabels = {
    hp: "PS", attack: "Ataque", defense: "Defensa",
    "special-attack": "At. Esp.", "special-defense": "Def. Esp.", speed: "Velocidad"
};

function showLegendarioDetails(pokemon) {
    const tipo = pokemon.tipos[0];
    const [c1, c2] = coloresGradiente[tipo] || ["#7c3aed", "#a855f7"];
    const totalStats = pokemon.stats_raw
        ? pokemon.stats_raw.reduce((sum, s) => sum + s.base_stat, 0)
        : Object.values(pokemon.stats || {}).reduce((a, b) => a + b, 0);

    // Obtener stats completas si están disponibles
    const statsHtml = pokemon.stats_raw ? pokemon.stats_raw.map(s => {
        const pct = ((s.base_stat / 255) * 100).toFixed(1);
        const label = statLabels[s.stat.name] || s.stat.name;
        return `
            <div class="lg-modal-stat-row">
                <span class="lg-modal-stat-name">${label}</span>
                <span class="lg-modal-stat-val">${s.base_stat}</span>
                <div class="lg-modal-stat-track">
                    <div class="lg-modal-stat-fill" style="width:${pct}%; background: linear-gradient(90deg, ${c1}, ${c2});"></div>
                </div>
            </div>`;
    }).join("") : "";

    const tiposHtml = pokemon.tipos.map(t =>
        `<span class="lg-modal-type-badge type-${t}">${translateType(t)}</span>`
    ).join("");

    const overlay = document.createElement("div");
    overlay.className = "lg-modal-overlay";
    overlay.innerHTML = `
        <div class="lg-modal">
            <button class="lg-modal-close">&times;</button>

            <!-- Header con gradiente del tipo -->
            <div class="lg-modal-header" style="background: linear-gradient(135deg, ${c1}, ${c2});">
                <div class="lg-modal-header-info">
                    <span class="lg-modal-numero">#${String(pokemon.id).padStart(3, "0")}</span>
                    <h2 class="lg-modal-nombre">${capitalize(pokemon.nombre)}</h2>
                    <div class="lg-modal-tipos">${tiposHtml}</div>
                </div>
                <img class="lg-modal-img" src="${pokemon.imagen}" alt="${pokemon.nombre}">
            </div>

            <!-- Body -->
            <div class="lg-modal-body">
                <!-- Datos físicos -->
                <div class="lg-modal-fisicos">
                    <div class="lg-modal-fisico-item">
                        <i class="fas fa-ruler-vertical"></i>
                        <span class="lg-modal-fisico-val">${pokemon.height ? (pokemon.height / 10).toFixed(1) + " m" : "—"}</span>
                        <span class="lg-modal-fisico-label">Altura</span>
                    </div>
                    <div class="lg-modal-fisico-item">
                        <i class="fas fa-weight-hanging"></i>
                        <span class="lg-modal-fisico-val">${pokemon.weight ? (pokemon.weight / 10).toFixed(1) + " kg" : "—"}</span>
                        <span class="lg-modal-fisico-label">Peso</span>
                    </div>
                    <div class="lg-modal-fisico-item">
                        <i class="fas fa-globe"></i>
                        <span class="lg-modal-fisico-val">${pokemon.generacion ? "Gen " + pokemon.generacion : "—"}</span>
                        <span class="lg-modal-fisico-label">Generación</span>
                    </div>
                    <div class="lg-modal-fisico-item">
                        <i class="fas fa-bolt"></i>
                        <span class="lg-modal-fisico-val" style="color:${c1}">${totalStats}</span>
                        <span class="lg-modal-fisico-label">Poder Total</span>
                    </div>
                </div>

                <!-- Stats -->
                ${statsHtml ? `
                <div class="lg-modal-stats-section">
                    <h3 class="lg-modal-section-title">Estadísticas Base</h3>
                    <div class="lg-modal-stats">${statsHtml}</div>
                </div>` : ""}

                <!-- Habilidades -->
                ${pokemon.abilities ? `
                <div class="lg-modal-abilities-section">
                    <h3 class="lg-modal-section-title">Habilidades</h3>
                    <div class="lg-modal-abilities">
                        ${pokemon.abilities.map(a => `
                            <div class="lg-modal-ability">
                                <span>${capitalize(a.ability.name.replace(/-/g, " "))}</span>
                                ${a.is_hidden ? '<span class="lg-modal-hidden-badge">OCULTA</span>' : ""}
                            </div>`).join("")}
                    </div>
                </div>` : ""}

                <!-- Botón favorito -->
                <button class="lg-modal-fav-btn" id="lg-fav-btn">
                    <i class="fas fa-star"></i>
                    <span>Agregar a Favoritos</span>
                </button>
            </div>
        </div>
    `;

    document.body.appendChild(overlay);
    setTimeout(() => overlay.classList.add("active"), 10);

    const favBtn = overlay.querySelector("#lg-fav-btn");
    import("../assets/utils.js").then(({ getFavorites, toggleFavorite }) => {
        const favs = getFavorites();
        if (favs.some(f => f.id === pokemon.id)) {
            favBtn.classList.add("active");
            favBtn.querySelector("span").textContent = "Quitar de Favoritos";
        }
        favBtn.addEventListener("click", () => toggleFavorite(pokemon, favBtn));
    });

    overlay.querySelector(".lg-modal-close").addEventListener("click", () => {
        overlay.classList.remove("active");
        setTimeout(() => overlay.remove(), 300);
    });
    overlay.addEventListener("click", e => {
        if (e.target === overlay) {
            overlay.classList.remove("active");
            setTimeout(() => overlay.remove(), 300);
        }
    });
    document.addEventListener("keydown", function esc(e) {
        if (e.key === "Escape") {
            overlay.classList.remove("active");
            setTimeout(() => overlay.remove(), 300);
            document.removeEventListener("keydown", esc);
        }
    });
}

function filtrarLegendarios(query) {
    const tbody = document.getElementById("lista-legendarios-tbody");
    if (!tbody) return;

    const normalizedQuery = query.toLowerCase().trim();
    const rows = [...tbody.querySelectorAll("tr.tr_table")];
    let visibleCount = 0;

    rows.forEach(row => {
        const isVisible = !normalizedQuery || row.dataset.search.includes(normalizedQuery);
        row.style.display = isVisible ? "" : "none";
        if (isVisible) visibleCount++;
    });

    tbody.querySelector(".empty-legendarios-row")?.remove();
    if (rows.length > 0 && visibleCount === 0) {
        const tr = document.createElement("tr");
        tr.className = "empty-legendarios-row";
        tr.innerHTML = `<td colspan="5" style="padding:1.5rem;text-align:center;color:#6b7280;">No se encontraron legendarios.</td>`;
        tbody.appendChild(tr);
    }
}

export function renderLegendarios() {
    const app = document.getElementById("main-content");
    app.innerHTML = `
        <div class="div-top">
            <div class="item_flex">
                <div class="input-search-div">
                    <i class="fa-solid fa-magnifying-glass"></i>
                    <input type="text" class="input-search" id="searchInput" placeholder="Escribe aquí">
                </div>
            </div>
        </div>

        <h3 class="title_dark_lg" style="margin:1.5rem 0 1rem 1.5rem;font-size:1.25rem;font-weight:600;">
            Destacados Legendarios
        </h3>
        <div class="banner_top_lg">
            <div class="lg_destacados"></div>
            <div class="lg_destacados"></div>
            <div class="lg_destacados"></div>
        </div>

        <h3 class="title_dark_lg" style="margin:3rem 0 1rem 1.5rem;font-size:1.25rem;font-weight:600;">
            Lista de Legendarios
        </h3>
        <div style="padding:0 1.5rem 2rem 1.5rem;">
            <div class="table_div">
                <table class="table">
                    <thead class="darkthead">
                        <tr>
                            <th class="dark_th">No.</th>
                            <th class="dark_th">Pokémon</th>
                            <th class="dark_th">Tipo</th>
                            <th class="dark_th">Región</th>
                            <th class="dark_th">Acción</th>
                        </tr>
                    </thead>
                    <tbody id="lista-legendarios-tbody"></tbody>
                </table>
            </div>
        </div>
    `;

    document.getElementById("searchInput").addEventListener("input", (e) => {
        filtrarLegendarios(e.target.value);
    });

    cargarDestacados();
    cargarListaLegendarios();
}