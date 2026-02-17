const POKE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20";

const stackPokemons = [
    { id: 143, name: "Snorlax",    color: "#6B8CFF", tipo: "Normal"        },
    { id: 130, name: "Gyarados",   color: "#4FC3F7", tipo: "Water · Flying"},
    { id: 1,   name: "Bulbasaur",  color: "#66BB6A", tipo: "Grass · Poison"},
    { id: 9,   name: "Blastoise",  color: "#42A5F5", tipo: "Water"         },
    { id: 6,   name: "Charizard",  color: "#FF6B35", tipo: "Fire · Flying" },
];

const MAIN_POKE  = { id: 6, badge: "REY DEL FUEGO", apodo: "Omega", meta: "Gen 1 · Región Kanto" };
const SIDE_POKES = [
    { id: 384, apodo: "Sky",   desc: "Guardián de los cielos y pacificador de los titanes...", stats: ["attack", "defense"] },
    { id: 383, apodo: "Magma", desc: "El creador de la tierra, capaz de evaporar océanos enteros.", stats: ["hp", "attack"] },
];

const TYPE_COLORS = {
    fire: "#FF6B35", water: "#4FC3F7", grass: "#66BB6A", electric: "#FFD54F",
    psychic: "#CE93D8", dragon: "#7986CB", dark: "#78909C", steel: "#B0BEC5",
    fighting: "#EF9A9A", poison: "#AB47BC", ground: "#D7CCC8", flying: "#90CAF9",
    bug: "#AED581", rock: "#BCAAA4", ghost: "#7E57C2", ice: "#80DEEA",
    normal: "#BDBDBD", fairy: "#F48FB1",
};
const TYPE_ES = {
    fire: "Fuego", water: "Agua", grass: "Planta", electric: "Eléctrico",
    psychic: "Psíquico", dragon: "Dragón", dark: "Oscuro", steel: "Acero",
    fighting: "Lucha", poison: "Veneno", ground: "Tierra", flying: "Volador",
    bug: "Bicho", rock: "Roca", ghost: "Fantasma", ice: "Hielo",
    normal: "Normal", fairy: "Hada",
};
const STAT_ES = {
    hp: "HP", attack: "Ataque", defense: "Defensa",
    "special-attack": "Ataque Esp.", "special-defense": "Defensa Esp.", speed: "Velocidad",
};

function getSprite(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}
function capitalize(s) { return s.charAt(0).toUpperCase() + s.slice(1); }
function getAccent(types) { return TYPE_COLORS[types?.[0]?.type?.name] || "#A78BFA"; }

function typeTagsHTML(types) {
    return types.map(t => {
        const c     = TYPE_COLORS[t.type.name] || "#888";
        const label = TYPE_ES[t.type.name] || capitalize(t.type.name);
        return `<span class="dest2-type-tag" style="background:${c}20;color:${c}">${label}</span>`;
    }).join("");
}

function statBarsHTML(stats, accent, keys) {
    return keys.map(key => {
        const s = stats.find(x => x.stat.name === key);
        if (!s) return "";
        const pct = Math.min((s.base_stat / 255) * 100, 100).toFixed(1);
        return `
        <div class="dest2-stat-row">
            <span class="dest2-stat-name">${STAT_ES[key] || key}</span>
            <div class="dest2-stat-track">
                <div class="dest2-stat-fill" style="width:${pct}%;background:linear-gradient(90deg,${accent}88,${accent})"></div>
            </div>
            <span class="dest2-stat-val">${s.base_stat}</span>
        </div>`;
    }).join("");
}

function sideStatBoxesHTML(stats, keys, accent) {
    return keys.map(key => {
        const s = stats.find(x => x.stat.name === key);
        if (!s) return "";
        return `
        <div class="dest2-side-stat">
            <span class="dest2-side-stat-val" style="color:${accent}">${s.base_stat}</span>
            <span class="dest2-side-stat-label">${STAT_ES[key] || key}</span>
        </div>`;
    }).join("");
}

async function renderDestacados(container) {
    container.innerHTML = `<p style="color:#6B7280;font-family:sans-serif;padding:40px;text-align:center;letter-spacing:2px">Cargando...</p>`;

    let pokemons;
    try {
        pokemons = await Promise.all(
            [MAIN_POKE.id, ...SIDE_POKES.map(p => p.id)].map(id =>
                fetch(`https://pokeapi.co/api/v2/pokemon/${id}`).then(r => r.json())
            )
        );
    } catch {
        container.innerHTML = `<p style="color:#EF4444;font-family:sans-serif;padding:40px">Error al cargar Pokémon.</p>`;
        return;
    }

    const [main, side1, side2] = pokemons;
    const mainAccent = getAccent(main.types);
    const s1Accent   = getAccent(side1.types);
    const s2Accent   = getAccent(side2.types);
    const totalPower = main.stats.reduce((a, s) => a + s.base_stat, 0);

    container.innerHTML = `
    <div class="dest2-section">

        <div class="dest2-header">
            <div>
                <h2 class="dest2-title">Pokémon Destacados</h2>
                <p class="dest2-subtitle">Los más poderosos de la Pokédex</p>
            </div>
            
        </div>

        <div class="dest2-grid">

            <div class="dest2-card dest2-main">
                <div class="dest2-main-img-wrap">
                    <img class="dest2-main-img" src="${getSprite(main.id)}" alt="${capitalize(main.name)}">
                </div>
                <div class="dest2-main-badge">${MAIN_POKE.badge}</div>
                <div class="dest2-main-bottom">
                    <div class="dest2-main-name-row">
                        <h3 class="dest2-main-name">
                            ${capitalize(main.name)} <span style="color:${mainAccent}">${MAIN_POKE.apodo}</span>
                        </h3>
                        <div class="dest2-power-block">
                            <span class="dest2-power-num" style="color:${mainAccent}">${totalPower}</span>
                            <span class="dest2-power-label">Poder Total</span>
                        </div>
                    </div>
                    <div class="dest2-meta-row">
                        ${typeTagsHTML(main.types)}
                        <span class="dest2-meta-text">${MAIN_POKE.meta}</span>
                    </div>
                    <div class="dest2-stat-wrap">
                        ${statBarsHTML(main.stats, mainAccent, ["special-attack", "speed"])}
                    </div>
                </div>
            </div>

            <div class="dest2-card dest2-side">
                <div class="dest2-side-icon">🐉</div>
                <div class="dest2-side-img-wrap">
                    <img class="dest2-side-img" src="${getSprite(side1.id)}" alt="${capitalize(side1.name)}">
                </div>
                <h3 class="dest2-side-name">
                    ${capitalize(side1.name)} <span style="color:${s1Accent}">${SIDE_POKES[0].apodo}</span>
                </h3>
                <p class="dest2-side-desc">${SIDE_POKES[0].desc}</p>
                <div class="dest2-side-stats">
                    ${sideStatBoxesHTML(side1.stats, SIDE_POKES[0].stats, s1Accent)}
                </div>
            </div>

            <div class="dest2-card dest2-side">
                <div class="dest2-side-icon">🌋</div>
                <div class="dest2-side-img-wrap">
                    <img class="dest2-side-img" src="${getSprite(side2.id)}" alt="${capitalize(side2.name)}">
                </div>
                <h3 class="dest2-side-name">
                    ${capitalize(side2.name)} <span style="color:${s2Accent}">${SIDE_POKES[1].apodo}</span>
                </h3>
                <p class="dest2-side-desc">${SIDE_POKES[1].desc}</p>
                <div class="dest2-side-stats">
                    ${sideStatBoxesHTML(side2.stats, SIDE_POKES[1].stats, s2Accent)}
                </div>
            </div>

        </div>
    </div>`;
+
    container.querySelectorAll(".dest2-filter-btn").forEach(btn => {
        btn.addEventListener("click", () => {
            container.querySelectorAll(".dest2-filter-btn").forEach(b => b.classList.remove("active"));
            btn.classList.add("active");
        });
    });
}
export async function renderHome() {
    const main = document.getElementById("main-content");
    main.innerHTML = `
    <header class="header_banner" >
    <div class="header_input">
    <i class="fa-brands fa-sistrix"></i>
    <input type="text" placeholder="Buscar Pokémon, movimientos, objetos..."></input>
    </div>
    </header>
    <div class="home_section">
        <div class="banner_principal_home">
            <div class="banner_left_h">
                <span class="sasw">Pokédex · 1,025 Pokémon</span>
                <h1>Descubre el mundo <span class="text_banner-home">Pokémon</span></h1>
                <p>Explora más de 1,000 Pokémon con estadísticas detalladas, 
                cadenas de evolución, habilidades y mucho más.</p>
            </div>
            <div class="banner_right_h">
                <div class="pokemon-stack">
                    ${stackPokemons.map((p, i) => `
                        <div class="poke-card card-${i}" style="background: ${p.color}">
                            <img src="${getSprite(p.id)}" alt="${p.name}" class="poke-card-img"/>
                            <div class="poke-card-info">
                                <span class="poke-card-name">${p.name}</span>
                                <span class="poke-card-tipo">${p.tipo}</span>
                            </div>
                        </div>
                    `).join("")}
                </div>
            </div>
        </div>

        <div class="banner_grid">
            <div class="card_grid">
                <div class="left_card"><img class="img_card" src="//icons.veryicon.com/png/o/miscellaneous/broken-linear-icon/pokemon-1.png"></div>
                <div class="right_card"><h1 class="number_grid">18</h1><h2>Tipos</h2></div>
            </div>
            <div class="card_grid">
                <div class="left_card"><img class="img_card" src="//icons.veryicon.com/png/o/miscellaneous/broken-linear-icon/pokemon-1.png"></div>
                <div class="right_card"><h1 class="number_grid">9</h1><h2>Generaciones</h2></div>
            </div>
            <div class="card_grid">
                <div class="left_card"><img class="img_card" src="//icons.veryicon.com/png/o/miscellaneous/broken-linear-icon/pokemon-1.png"></div>
                <div class="right_card"><h1 class="number_grid">48</h1><h2>Legendarios</h2></div>
            </div>
            <div class="card_grid">
                <div class="left_card"><img class="img_card" src="//icons.veryicon.com/png/o/miscellaneous/broken-linear-icon/pokemon-1.png"></div>
                <div class="right_card"><h1 class="number_grid">59</h1><h2>Habilidades</h2></div>
            </div>
        </div>

        <div class="banner_two" id="dest2-container"></div>
    </div>`;
                        if (window.FontAwesome) FontAwesome.dom.i2svg();
    await renderDestacados(document.getElementById("dest2-container"));
}