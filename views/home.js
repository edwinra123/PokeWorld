const POKE_URL = "https://pokeapi.co/api/v2/pokemon?limit=20";

const stackPokemons = [
    { id: 143, name: "Snorlax",    color: "#6B8CFF", tipo: "Normal"        },
    { id: 130, name: "Gyarados",   color: "#4FC3F7", tipo: "Water · Flying"},
    { id: 1,   name: "Bulbasaur",  color: "#66BB6A", tipo: "Grass · Poison"},
    { id: 9,   name: "Blastoise",  color: "#42A5F5", tipo: "Water"         },
    { id: 6,   name: "Charizard",  color: "#FF6B35", tipo: "Fire · Flying" },
];
function getSprite(id) {
    return `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
}

export async function renderHome() {
    const main = document.getElementById("main-content");
    main.innerHTML = `
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
                            <img 
                                src="${getSprite(p.id)}" 
                                alt="${p.name}"
                                class="poke-card-img"
                            />
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
                <div class="left_card">
                    <img class="img_card" src="//icons.veryicon.com/png/o/miscellaneous/broken-linear-icon/pokemon-1.png">
                </div>
                <div class="right_card">
                    <h1 class="number_grid">18</h1>
                    <h2>Tipos</h2>
                </div>
            </div>
            <div class="card_grid">
                <div class="left_card">
                    <img class="img_card" src="//icons.veryicon.com/png/o/miscellaneous/broken-linear-icon/pokemon-1.png">
                </div>
                <div class="right_card">
                    <h1 class="number_grid">9</h1>
                    <h2>Generaciones</h2>
                </div>
            </div>
            <div class="card_grid">
                <div class="left_card">
                    <img class="img_card" src="//icons.veryicon.com/png/o/miscellaneous/broken-linear-icon/pokemon-1.png">
                </div>
                <div class="right_card">
                    <h1 class="number_grid">48</h1>
                    <h2>Legendarios</h2>
                </div>
            </div>
            <div class="card_grid">
                <div class="left_card">
                    <img class="img_card" src="//icons.veryicon.com/png/o/miscellaneous/broken-linear-icon/pokemon-1.png">
                </div>
                <div class="right_card">
                    <h1 class="number_grid">59</h1>
                    <h2>Habilidades</h2>
                </div>
            </div>
        </div>
    </div>
    `;
}