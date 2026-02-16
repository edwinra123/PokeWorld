const legendarios = [
    'articuno', 'zapdos', 'moltres', 'mewtwo',
    'raikou', 'entei', 'suicune', 'lugia', 'ho-oh',
    'regirock', 'regice', 'registeel', 'latias', 'latios',
    'kyogre', 'groudon', 'rayquaza',
    'dialga', 'palkia', 'giratina'
];

const legendariosInfo = [
    { nombre: 'articuno', id: 144, region: 'Kanto' },
    { nombre: 'zapdos', id: 145, region: 'Kanto' },
    { nombre: 'moltres', id: 146, region: 'Kanto' },
    { nombre: 'mewtwo', id: 150, region: 'Kanto' },
    { nombre: 'raikou', id: 243, region: 'Johto' },
    { nombre: 'entei', id: 244, region: 'Johto' },
    { nombre: 'suicune', id: 245, region: 'Johto' },
    { nombre: 'lugia', id: 249, region: 'Johto' },
    { nombre: 'ho-oh', id: 250, region: 'Johto' },
    { nombre: 'regirock', id: 377, region: 'Hoenn' },
    { nombre: 'regice', id: 378, region: 'Hoenn' },
    { nombre: 'registeel', id: 379, region: 'Hoenn' },
    { nombre: 'latias', id: 380, region: 'Hoenn' },
    { nombre: 'latios', id: 381, region: 'Hoenn' },
    { nombre: 'kyogre', id: 382, region: 'Hoenn' },
    { nombre: 'groudon', id: 383, region: 'Hoenn' },
    { nombre: 'rayquaza', id: 384, region: 'Hoenn' },
    { nombre: 'dialga', id: 483, region: 'Sinnoh' },
    { nombre: 'palkia', id: 484, region: 'Sinnoh' },
    { nombre: 'giratina', id: 487, region: 'Sinnoh' }
];

const coloresFondo = {
    'normal': '#A8A878',
    'fire': '#F08030',
    'water': '#6890F0',
    'electric': '#F8D030',
    'grass': '#78C850',
    'ice': '#98D8D8',
    'fighting': '#C03028',
    'poison': '#A040A0',
    'ground': '#E0C068',
    'flying': '#A890F0',
    'psychic': '#F85888',
    'bug': '#A8B820',
    'rock': '#B8A038',
    'ghost': '#705898',
    'dragon': '#7038F8',
    'dark': '#705848',
    'steel': '#B8B8D0',
    'fairy': '#EE99AC'
};

const coloresClaro = {
    'psychic': '#1a1d2e',
    'dragon': '#e8f5e9',
    'water': '#e3f2fd',
    'fire': '#fff3e0',
    'grass': '#e8f5e9',
    'electric': '#fffde7',
    'ice': '#e0f7fa',
    'fighting': '#fbe9e7',
    'poison': '#f3e5f5',
    'ground': '#efebe9',
    'flying': '#e8eaf6',
    'bug': '#f1f8e9',
    'rock': '#efebe9',
    'ghost': '#ede7f6',
    'steel': '#eceff1',
    'dark': '#efebe9',
    'fairy': '#fce4ec',
    'normal': '#f5f5f5'
};

// Cache para almacenar los pokémon ya obtenidos
let pokemonCache = {};

function obtenerLegendariosAleatorios(cantidad = 3) {
    const aleatorios = [...legendarios]
        .sort(() => Math.random() - 0.5)
        .slice(0, cantidad);
    return aleatorios;
}

async function obtenerPokemon(nombreOId) {
    // Verificar si ya está en cache
    if (pokemonCache[nombreOId]) {
        return pokemonCache[nombreOId];
    }

    try {
        const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${nombreOId}`);
        const data = await response.json();

        // Obtener stats
        const stats = {};
        data.stats.forEach(stat => {
            if (stat.stat.name === 'attack') stats.ataque = stat.base_stat;
            if (stat.stat.name === 'speed') stats.velocidad = stat.base_stat;
            if (stat.stat.name === 'defense') stats.defensa = stat.base_stat;
        });

        const speciesResponse = await fetch(data.species.url);
        const speciesData = await speciesResponse.json();
        const generacion = speciesData.generation.url.split('/').slice(-2)[0];

        const pokemon = {
            id: data.id,
            nombre: data.name,
            imagen: data.sprites.other['official-artwork'].front_default,
            imagenPequeña: data.sprites.front_default,
            tipos: data.types.map(t => t.type.name),
            stats: stats,
            generacion: generacion
        };

        pokemonCache[nombreOId] = pokemon;

        return pokemon;
    } catch (error) {
        console.error('Error al obtener Pokémon:', error);
        return null;
    }
}

function obtenerIconoTipo(tipo) {
    const iconos = {
        'psychic': '🧬',
        'dragon': '🐉',
        'flying': '🌊',
        'water': '💧',
        'fire': '🔥',
        'grass': '🌿',
        'electric': '⚡',
        'ice': '❄️',
        'fighting': '🥊',
        'poison': '☠️',
        'ground': '🗻',
        'bug': '🐛',
        'rock': '🪨',
        'ghost': '👻',
        'steel': '⚙️',
        'dark': '🌙',
        'fairy': '🧚',
        'normal': '⭐'
    };
    return iconos[tipo] || '⭐';
}

async function cargarDestacados() {
    const contenedores = document.querySelectorAll('.lg_destacados');
    const seleccionados = obtenerLegendariosAleatorios(3);

    for (let i = 0; i < seleccionados.length; i++) {
        contenedores[i].innerHTML = '<p class="tp_dst" style="text-align: center;">Cargando...</p>';

        const pokemon = await obtenerPokemon(seleccionados[i]);

        if (pokemon && contenedores[i]) {
            const tipoPrincipal = pokemon.tipos[0];
            const colorFondo = coloresClaro[tipoPrincipal] || '#f5f5f5';
            const esOscuro = tipoPrincipal === 'psychic' || tipoPrincipal === 'dark' || tipoPrincipal === 'ghost';
            const colorTexto = esOscuro ? '#ffffff' : '#1f2937';
            const colorSecundario = esOscuro ? '#9ca3af' : '#6b7280';

            contenedores[i].style.background = colorFondo;
            contenedores[i].innerHTML = `
                <div style="display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 1rem;">
                    <div>
                        <p style="font-size: 0.75rem; color: ${colorSecundario}; text-transform: uppercase; letter-spacing: 0.05em; margin: 0;">
                            ${pokemon.tipos.join(' / ')}
                        </p>
                        <h3 style="font-size: 2rem; font-weight: 700; color: ${colorTexto}; text-transform: capitalize; margin: 0.25rem 0;">
                            ${pokemon.nombre}
                        </h3>
                    </div>
                    <div style="width: 40px; height: 40px; background: rgba(255,255,255,0.2); border-radius: 50%; display: flex; align-items: center; justify-content: center; font-size: 1.5rem;">
                        ${obtenerIconoTipo(tipoPrincipal)}
                    </div>
                </div>
                
                <div style="display: flex; gap: 2rem; margin-bottom: 1rem;">
                    <div>
                        <p style="font-size: 0.7rem; color: ${colorSecundario}; text-transform: uppercase; margin: 0;">ATAQUE</p>
                        <p style="font-size: 1.5rem; font-weight: 700; color: ${colorTexto}; margin: 0;">${pokemon.stats.ataque}</p>
                    </div>
                    <div>
                        <p style="font-size: 0.7rem; color: ${colorSecundario}; text-transform: uppercase; margin: 0;">VELOCIDAD</p>
                        <p style="font-size: 1.5rem; font-weight: 700; color: ${colorTexto}; margin: 0;">${pokemon.stats.velocidad}</p>
                    </div>
                </div>
                
                <p style="font-size: 0.7rem; color: ${colorSecundario}; margin: 0;">
                    NO. ${String(pokemon.id).padStart(4, '0')} **** GEN ${pokemon.generacion}
                </p>
                
                <img src="${pokemon.imagen}" 
                     alt="${pokemon.nombre}" 
                     style="position: absolute; bottom: 0; right: 10px; width: 180px; height: 180px; object-fit: contain;">
            `;
        }
    }
}

async function cargarListaLegendarios() {
    const tbody = document.getElementById('lista-legendarios-tbody');
    tbody.innerHTML = '<tr><td colspan="5" style="text-align: center; padding: 2rem; color: #6b7280;">Cargando lista...</td></tr>';

    let htmlRows = '';

    for (let i = 0; i < legendariosInfo.length; i++) {
        const legendarioInfo = legendariosInfo[i];
        const pokemon = await obtenerPokemon(legendarioInfo.nombre);

        if (pokemon) {
            htmlRows += `
                <tr style="border-bottom: 1px solid #e5e7eb; transition: background 0.2s;" 
                    onmouseover="this.style.background='#f9fafb'" 
                    onmouseout="this.style.background='white'">
                    <td style="padding: 1rem; color: #6b7280; font-weight: 500;">${String(i + 1).padStart(2, '0')}.</td>
                    <td style="padding: 1rem;">
                        <div style="display: flex; align-items: center; gap: 0.75rem;">
                            <img src="${pokemon.imagenPequeña}" alt="${pokemon.nombre}" style="width: 40px; height: 40px;">
                            <span style="font-weight: 600; color: #1f2937; text-transform: capitalize;">${pokemon.nombre}</span>
                        </div>
                    </td>
                    <td style="padding: 1rem; color: #6b7280; text-transform: capitalize;">${pokemon.tipos.join('/')}</td>
                    <td style="padding: 1rem; color: #1f2937; font-weight: 500;">${legendarioInfo.region}</td>
                    <td style="padding: 1rem;">
                        <button onclick="verDetalles('${pokemon.nombre}')" 
                                style="padding: 0.5rem 1.5rem; border: 1px solid #d1d5db; border-radius: 0.5rem; background: white; color: #374151; font-weight: 500; cursor: pointer; transition: all 0.2s;"
                                onmouseover="this.style.background='#f3f4f6'; this.style.borderColor='#9ca3af'"
                                onmouseout="this.style.background='white'; this.style.borderColor='#d1d5db'">
                            Ver Detalles
                        </button>
                    </td>
                </tr>
            `;
        }
    }

    tbody.innerHTML = htmlRows;
}

window.verDetalles = function(nombrePokemon) {
    console.log('Ver detalles de:', nombrePokemon);
    alert(`Ver detalles de ${nombrePokemon}`);
};

export function renderLegendarios() {
    console.log("Renderizando legendarios");
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
        <div class="header-spacer"></div>

        <h3 style="margin: 1.5rem 0 1rem 1.5rem; font-size: 1.25rem; font-weight: 600;">Destacados Legendarios</h3>
        <div class="banner_top_lg">
            <div class="lg_destacados"></div>
            <div class="lg_destacados"></div>
            <div class="lg_destacados"></div>
        </div>

        <h3 style="margin: 3rem 0 1rem 1.5rem; font-size: 1.25rem; font-weight: 600;">Lista de Legendarios</h3>
        <div style="padding: 0 1.5rem 2rem 1.5rem;">
            <div style="background: white; border-radius: 1rem; box-shadow: 0 1px 3px rgba(0,0,0,0.1); overflow: hidden;">
                <table style="width: 100%; border-collapse: collapse;">
                    <thead style="background: #f9fafb; border-bottom: 2px solid #e5e7eb; border-radius:1.5rem;">
                        <tr>
                            <th style="padding: 1rem; text-align: left; font-weight: 600; color: #6b7280; font-size: 0.875rem; text-transform: uppercase;">No.</th>
                            <th style="padding: 1rem; text-align: left; font-weight: 600; color: #6b7280; font-size: 0.875rem; text-transform: uppercase;">Pokémon</th>
                            <th style="padding: 1rem; text-align: left; font-weight: 600; color: #6b7280; font-size: 0.875rem; text-transform: uppercase;">Tipo</th>
                            <th style="padding: 1rem; text-align: left; font-weight: 600; color: #6b7280; font-size: 0.875rem; text-transform: uppercase;">Región</th>
                            <th style="padding: 1rem; text-align: left; font-weight: 600; color: #6b7280; font-size: 0.875rem; text-transform: uppercase;">Acción</th>
                        </tr>
                    </thead>
                    <tbody id="lista-legendarios-tbody">
                    </tbody>
                </table>
            </div>
        </div>
    `;

    cargarDestacados();
    cargarListaLegendarios();
}