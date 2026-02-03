const POKE_URL = "https://pokeapi.co/api/v2/pokemon";
const navigation = document.querySelector(".numbers");
const containerCards = document.querySelector(".container_cards");
const panelpokemon = document.getElementById("panel_pokemon");
const searchInput = document.getElementById("searchInput");

let nextLink = "";
let prevlink = "";
let count = 0;
let perPage = 20;
let currentPage = 1;
let allPokemon = [];

const capitalize = text => text.charAt(0).toUpperCase() + text.slice(1);

function changePg(value) {
  perPage = value;
  currentPage = 1;
  cargarLista(`${POKE_URL}?limit=${perPage}&offset=0`);
}

const prev = () => {
  if (!prevlink) return;
  currentPage--;
  cargarLista(prevlink);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

const next = () => {
  if (!nextLink) return;
  currentPage++;
  cargarLista(nextLink);
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

function cargarLista(url) {

  containerCards.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #64748b; font-size: 1.125rem;">⚡ Loading Pokémon...</div>';
  
  fetch(url)
    .then(res => res.json())
    .then(data => {
      containerCards.innerHTML = "";
      nextLink = data.next;
      prevlink = data.previous;
      count = data.count;

      addNumber();

      data.results.forEach((p, index) => {
        setTimeout(() => cargarPokemon(p.url, index), index * 50);
      });
    })
    .catch(err => {
      console.error("Error:", err);
      containerCards.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #ef4444;">❌ Error loading Pokémon</div>';
    });
}

function cargarPokemon(url, index = 0) {
  fetch(url)
    .then(res => res.json())
    .then(data => {
      const card = document.createElement("div");
      card.classList.add("card_pokemons");
      card.dataset.pokemon = data.name;
      card.style.opacity = "0";
      card.style.animation = `fadeInUp 0.5s ease-out ${index * 0.05}s forwards`;

      // Imagen
      const imgDiv = document.createElement("div");
      imgDiv.classList.add("img_card_pokemon");
      const img = document.createElement("img");
      img.src = data.sprites?.other?.["official-artwork"]?.front_default ||
                data.sprites?.front_default || "";
      img.alt = data.name;
      imgDiv.appendChild(img);
      card.appendChild(imgDiv);

      // Info básica
      const infoDiv1 = document.createElement("div");
      infoDiv1.classList.add("info_poke");
      
      const titleDiv = document.createElement("div");
      titleDiv.classList.add("title_pokemon");
      titleDiv.innerHTML = `<h2>${capitalize(data.name)}</h2>`;
      
      const idDiv = document.createElement("div");
      idDiv.classList.add("id_pk");
      idDiv.innerHTML = `<h6>#${String(data.id).padStart(4, '0')}</h6>`;
      
      infoDiv1.appendChild(titleDiv);
      infoDiv1.appendChild(idDiv);
      card.appendChild(infoDiv1);

      // Tipos
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

      // Icono pokebola
      const icon = document.createElement("img");
      icon.src = "./assets/pokebola_icon.png";
      icon.classList.add("type-icon");
      icon.onerror = function() {
        this.style.display = 'none';
      };

      infoDiv.appendChild(categoryDiv);
      infoDiv.appendChild(icon);
      card.appendChild(infoDiv);

      containerCards.appendChild(card);
    })
    .catch(err => console.error("Error:", err));
}

const addNumber = () => {
  clearNavigation();

  const pages = Math.ceil(count / perPage);
  const blockSize = 5;
  const currentBlock = Math.floor((currentPage - 1) / blockSize);

  const start = currentBlock * blockSize + 1;
  const end = Math.min(start + blockSize - 1, pages);

  for (let i = start; i <= end; i++) {
    const button = document.createElement("button");
    button.textContent = i;

    if (i === currentPage) button.classList.add("active-page");

    button.addEventListener("click", () => {
      currentPage = i;
      const offset = (i - 1) * perPage;
      cargarLista(`${POKE_URL}?limit=${perPage}&offset=${offset}`);
    });

    navigation.appendChild(button);
  }
};

const clearNavigation = () => {
  navigation.innerHTML = "";
};


containerCards.addEventListener("click", e => {
  const card = e.target.closest(".card_pokemons");
  if (!card) return;
  
  const pokemonId = card.dataset.pokemon;
  
  if (window.innerWidth <= 768) {
    abrirModalPokemon(pokemonId);
  } else {
    panelpokemon.classList.add("activo");
    panelpokemon.scrollIntoView({ behavior: "smooth", block: "nearest" });
    cargarDetallePokemon(pokemonId);
  }
});


function abrirModalPokemon(id) {
  const overlay = document.getElementById("overlayPokemon");
  overlay.classList.add("activo");
  document.body.style.overflow = "hidden";
  cargarDetallePokemon(id);
}

document.getElementById("cerrarModal").addEventListener("click", () => {
  const overlay = document.getElementById("overlayPokemon");
  overlay.classList.remove("activo");
  document.body.style.overflow = "";
});

// Cerrar modal con ESC
document.addEventListener("keydown", (e) => {
  if (e.key === "Escape") {
    const overlay = document.getElementById("overlayPokemon");
    if (overlay.classList.contains("activo")) {
      overlay.classList.remove("activo");
      document.body.style.overflow = "";
    }
  }
});

const typeIcons = {
  fire: './assets/Tipo_fuego.svg',
  water: './assets/Tipo_agua.svg',
  grass: './assets/Tipo_planta.svg',
  electric: './assets/Tipo_electrico.svg',
  normal: './assets/Tipo_normal.svg',
  flying: './assets/Tipo_volador.svg',
  fighting: './assets/Tipo_lucha.svg',
  poison: './assets/Tipo_veneno.svg',
  ground: './assets/Tipo_tierra.svg',
  rock: './assets/Tipo_roca.svg',
  bug: './assets/Tipo_bicho.svg',
  ghost: './assets/Tipo_fantasma.svg',
  steel: './assets/Tipo_acero.svg',
  ice: './assets/Tipo_hielo.svg',
  dragon: './assets/Tipo_dragón.svg',
  dark: './assets/Tipo_siniestro.svg',
  fairy: './assets/Tipo_hada.svg',
  psychic: './assets/Tipo_psíquico.svg',
};

function cargarDetallePokemon(name) {

  if (window.innerWidth <= 768) {
    document.getElementById("detallePokemon").innerHTML = '<div style="text-align: center; padding: 3rem;">⚡ Loading...</div>';
  } else {
    panelpokemon.innerHTML = '<div style="text-align: center; padding: 3rem;">⚡ Loading...</div>';
  }

  fetch(`${POKE_URL}/${name}`)
    .then(res => res.json())
    .then(data => {
      return fetch(`https://pokeapi.co/api/v2/pokemon-species/${name}`)
        .then(res => res.json())
        .then(species => {
          const descES = species.flavor_text_entries.find(
            entry => entry.language.name === "es"
          );

          const descripcion = descES
            ? descES.flavor_text.replace(/[\n\f]/g, " ")
            : "Descripción no disponible.";

          if (window.innerWidth <= 768) {
            const mobileContainer = document.getElementById("detallePokemon");
            mobileContainer.innerHTML = `
              <div class="poke_content_mobile">
                <div class="poke_mobile_img">
                  <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}"/>
                </div>
                <div class="info_card_panel">
                  <div class="info_card_two-panel">
                    <div class="card_title_m">
                      <h2 class="title_panel_poke_movil">${capitalize(data.name)}</h2>
                      <p class="id_poke_movil">#${String(data.id).padStart(4, '0')}</p>
                    </div>
                    <div class="card_title_m1" id="categoryDiv"></div>
                  </div>
                  <p class="descripcion_panel_movil">${descripcion}</p>
                </div>
              </div>
            `;

            const mobileCategoryDiv = document.getElementById("categoryDiv");
            data.types.forEach(t => {
              const span = document.createElement("span");
              span.classList.add("type-span");

              const svgIcon = document.createElement("img");
              svgIcon.src = typeIcons[t.type.name];
              svgIcon.alt = t.type.name;
              svgIcon.classList.add("type-icon");
              svgIcon.onerror = function() {
                span.innerHTML = `<span style="font-size: 1.5rem;">${getTypeEmoji(t.type.name)}</span>`;
              };
              span.appendChild(svgIcon);

              mobileCategoryDiv.appendChild(span);
            });
          } else {
            // DESKTOP
            panelpokemon.innerHTML = `
              <div class="poke_content">
                <div class="img_panel">
                  <img src="${data.sprites.other["official-artwork"].front_default}" alt="${data.name}"/>
                </div>

                <div class="info_card_panel">
                  <p class="id_poke">#${String(data.id).padStart(4, '0')}</p>
                  <h2 class="title_panel_poke">${capitalize(data.name)}</h2>

                  <div class="category_panel">
                    <div id="cat_panel">
                      ${data.types
                        .map(t => `<span class="type_tag ${t.type.name}">${capitalize(t.type.name)}</span>`)
                        .join("")}
                    </div>
                  </div>

                  <p class="description_title">Descripción</p>
                  <p class="descripcion_panel">${descripcion}</p>

                  <div class="habilities_panel">
                    <h1 class="title_abilities">Habilidades</h1>
                    <div class="ability_content"></div>
                  </div>

                  <div class="daa2">
                    <div class="information-gnpoke">
                      <p class="title_inf">Altura</p>
                      <p class="title_inf">Peso</p>
                      <p class="info_gn">${(data.height / 10).toFixed(1)} m</p>
                      <p class="info_gn">${(data.weight / 10).toFixed(1)} kg</p>
                    </div>
                  </div>
                </div>
              </div>
            `;

            const abilityContent = panelpokemon.querySelector(".ability_content");
            data.abilities.forEach(({ ability, is_hidden }) => {
              const p = document.createElement("p");
              p.classList.add("ability1");

              if (!is_hidden) {
                p.textContent = capitalize(ability.name);
                p.classList.add("ability_pasiva");
              } else {
                p.innerHTML = `Habilidad oculta <i class="fa-solid fa-eye"></i>`;
                p.classList.add("ability_ocult");

                p.onclick = () => {
                  const revelada = p.classList.toggle("revelada");
                  p.innerHTML = revelada
                    ? `${capitalize(ability.name)} <i class="fa-solid fa-eye-slash"></i>`
                    : `Habilidad oculta <i class="fa-solid fa-eye"></i>`;
                };
              }
              abilityContent.appendChild(p);
            });
          }
        });
    })
    .catch(err => {
      console.error("Error:", err);
      const container = window.innerWidth <= 768 
        ? document.getElementById("detallePokemon") 
        : panelpokemon;
      container.innerHTML = '<div style="text-align: center; padding: 3rem; color: #ef4444;">❌ Error loading details</div>';
    });
}

function getTypeEmoji(type) {
  const emojis = {
    fire: '🔥',
    water: '💧',
    grass: '🌿',
    electric: '⚡',
    psychic: '🔮',
    flying: '🦅',
    normal: '⭐',
    poison: '☠️',
    ground: '🌍',
    rock: '🪨',
    bug: '🐛',
    ghost: '👻',
    steel: '⚙️',
    ice: '❄️',
    dragon: '🐲',
    dark: '🌙',
    fairy: '✨',
    fighting: '👊'
  };
  return emojis[type] || '⚪';

  }
let searchTimeout;
searchInput.addEventListener("input", (e) => {
  clearTimeout(searchTimeout);
  const searchTerm = e.target.value.toLowerCase().trim();
  
  searchTimeout = setTimeout(() => {
    if (searchTerm) {
      buscarPokemon(searchTerm);
    } else {
      cargarLista(`${POKE_URL}?limit=${perPage}&offset=0`);
    }
  }, 300);
});

function buscarPokemon(term) {

  fetch(`${POKE_URL}/${term}`)
    .then(res => {
      if (!res.ok) throw new Error('Not found');
      return res.json();
    })
    .then(data => {
      containerCards.innerHTML = "";
      clearNavigation();
      cargarPokemonFromData(data);
    })
    .catch(() => {
      // Si no se encuentra exacto, buscar coincidencias
      containerCards.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #64748b;">🔍 Searching...</div>';
      
      fetch(`${POKE_URL}?limit=1000`)
        .then(res => res.json())
        .then(data => {
          const matches = data.results.filter(p => 
            p.name.toLowerCase().includes(term)
          ).slice(0, 20);
          
          if (matches.length > 0) {
            containerCards.innerHTML = "";
            clearNavigation();
            matches.forEach((p, index) => {
              setTimeout(() => cargarPokemon(p.url, index), index * 50);
            });
          } else {
            containerCards.innerHTML = `
              <div style="grid-column: 1/-1; text-align: center; padding: 3rem;">
                <div style="font-size: 3rem; margin-bottom: 1rem;">😔</div>
                <p style="color: #64748b; font-size: 1.125rem;">No Pokémon found matching "${term}"</p>
              </div>
            `;
          }
        });
    });
}

function cargarPokemonFromData(data) {
  const card = document.createElement("div");
  card.classList.add("card_pokemons");
  card.dataset.pokemon = data.name;

  const imgDiv = document.createElement("div");
  imgDiv.classList.add("img_card_pokemon");
  const img = document.createElement("img");
  img.src = data.sprites?.other?.["official-artwork"]?.front_default ||
            data.sprites?.front_default || "";
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
  idDiv.innerHTML = `<h6>#${String(data.id).padStart(4, '0')}</h6>`;
  
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

  containerCards.appendChild(card);
}

const typeButtons = document.querySelectorAll('.type-btn');
typeButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    const type = btn.textContent.trim().toLowerCase();
    filtrarPorTipo(type);
  });
});

function filtrarPorTipo(type) {
  containerCards.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #64748b;">🔍 Filtering...</div>';
  
  fetch(`https://pokeapi.co/api/v2/type/${type}`)
    .then(res => res.json())
    .then(data => {
      containerCards.innerHTML = "";
      clearNavigation();
      
      const pokemon = data.pokemon.slice(0, 20);
      pokemon.forEach((p, index) => {
        setTimeout(() => cargarPokemon(p.pokemon.url, index), index * 50);
      });
    })
    .catch(err => {
      console.error('Error:', err);
      containerCards.innerHTML = '<div style="grid-column: 1/-1; text-align: center; padding: 3rem; color: #ef4444;">❌ Error filtering</div>';
    });
}

const regionButtons = document.querySelectorAll('.region-btn');
regionButtons.forEach(btn => {
  btn.addEventListener('click', () => {
    regionButtons.forEach(b => b.classList.remove('active'));
    btn.classList.add('active');
    
    const region = btn.textContent.trim().toLowerCase();
    if (region === 'all') {
      cargarLista(`${POKE_URL}?limit=${perPage}&offset=0`);
    } else {
      filtrarPorRegion(region);
    }
  });
});

function filtrarPorRegion(region) {
  const regionOffsets = {
    'kanto': { offset: 0, limit: 151 },
    'johto': { offset: 151, limit: 100 },
    'hoenn': { offset: 251, limit: 135 }
  };
  
  const config = regionOffsets[region];
  if (config) {
    cargarLista(`${POKE_URL}?limit=${config.limit}&offset=${config.offset}`);
  }
}

document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});


cargarLista(`${POKE_URL}?limit=${perPage}&offset=0`);

if (!document.querySelector('style#custom-animations')) {
  const style = document.createElement('style');
  style.id = 'custom-animations';
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(20px);
      }
      to {
        opacity: 1;
        transform: translateY(0);
      }
    }
  `;
  document.head.appendChild(style);
}