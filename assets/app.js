// app.js
export const POKE_URL = "https://pokeapi.co/api/v2/pokemon";
export let perPage = 20;
export let currentPage = 1;
export let nextLink = "";
export let prevLink = "";
export let count = 0;

// Capitalizar texto
export const capitalize = (text) => text.charAt(0).toUpperCase() + text.slice(1);

// Cargar Pokémon desde URL
export async function fetchPokemons(url) {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Error al cargar Pokémon");
    const data = await res.json();
    return data;
}

// Cargar detalle Pokémon
export async function fetchPokemonDetail(name) {
    const res = await fetch(`${POKE_URL}/${name}`);
    if (!res.ok) throw new Error("Error al cargar detalle Pokémon");
    return res.json();
}

// Renderizar card Pokémon en un contenedor
export function renderPokemonCard(container, data, index = 0) {
    const card = document.createElement("div");
    card.classList.add("card_pokemons");
    card.dataset.pokemon = data.name;
    card.style.opacity = "0";
    card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.05}s forwards`;

    const imgDiv = document.createElement("div");
    imgDiv.classList.add("img_card_pokemon");
    const img = document.createElement("img");
    img.src = data.sprites?.other?.["official-artwork"]?.front_default || data.sprites?.front_default || "";
    img.alt = data.name;
    imgDiv.appendChild(img);
    card.appendChild(imgDiv);

    const infoDiv1 = document.createElement("div");
    infoDiv1.classList.add("info_poke");

    const titleDiv = document.createElement("div");
    titleDiv.classList.add("title_pokemon");
    titleDiv.innerHTML = `<h2>${capitalize(data.name)}</h2>`;

    const idDiv = document.createElement("div");
    idDiv.classList.add("id_pk");
    idDiv.innerHTML = `<h6>#${String(data.id).padStart(4, "0")}</h6>`;

    infoDiv1.appendChild(titleDiv);
    infoDiv1.appendChild(idDiv);
    card.appendChild(infoDiv1);

    const infoDiv = document.createElement("div");
    infoDiv.classList.add("information_card");

    const categoryDiv = document.createElement("div");
    categoryDiv.classList.add("category_pokemon");
    data.types.forEach(t => {
        const span = document.createElement("span");
        span.textContent = capitalize(t.type.name);
        span.classList.add(t.type.name);
        categoryDiv.appendChild(span);
    });

    infoDiv.appendChild(categoryDiv);
    card.appendChild(infoDiv);
    container.appendChild(card);
}
