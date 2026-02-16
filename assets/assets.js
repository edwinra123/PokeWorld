const searchInput = document.getElementById("searchInput");
const resultDiv = document.getElementById("result");

// Escucha cuando el usuario escribe y presiona Enter
searchInput.addEventListener("keydown", function(event) {
    if (event.key === "Enter") {
        const pokemonName = searchInput.value.toLowerCase().trim();
        if (pokemonName) {
            fetchPokemon(pokemonName);
        }
    }
});

function fetchPokemon(name) {
    const url = `https://pokeapi.co/api/v2/pokemon/${name}`;

    fetch(url)
        .then(response => {
            if (!response.ok) throw new Error("Pokémon no encontrado");
            return response.json();
        })
        .then(data => {
            displayPokemon(data);
        })
        .catch(err => {
            resultDiv.innerHTML = `<p style="color:red;">${err.message}</p>`;
        });
}

function displayPokemon(pokemon) {
    resultDiv.innerHTML = `
        <h2>${pokemon.name.toUpperCase()}</h2>
        <img src="${pokemon.sprites.front_default}" alt="${pokemon.name}">
        <p><strong>Altura:</strong> ${pokemon.height}</p>
        <p><strong>Peso:</strong> ${pokemon.weight}</p>
        <p><strong>Tipos:</strong> ${pokemon.types.map(t => t.type.name).join(", ")}</p>
    `;
}