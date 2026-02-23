# 🌍 PokéWorld

> Mi primera página web completa — una Pokédex interactiva construida desde cero con HTML, CSS y JavaScript puro, sin frameworks ni librerías externas.

[![Live Demo](https://img.shields.io/badge/🚀_Live_Demo-ver_proyecto-brightgreen)](https://edwinra123.github.io/PokeWorld)
[![GitHub](https://img.shields.io/badge/GitHub-edwinra123-181717?logo=github)](https://github.com/edwinra123/PokeWorld)
![HTML](https://img.shields.io/badge/HTML5-E34F26?logo=html5&logoColor=white)
![CSS](https://img.shields.io/badge/CSS3-1572B6?logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?logo=javascript&logoColor=black)

---

## 📸 Vista previa
<img width="1518" height="724" alt="Sin título" src="https://github.com/user-attachments/assets/4fc0801c-059c-4ea6-a15d-3f134fe5bfb4" />
<img width="1510" height="720" alt="preview3" src="https://github.com/user-attachments/assets/67a743e6-4f52-4d10-99b5-619fab680ea9" />
<img width="1520" height="724" alt="Preview2" src="https://github.com/user-attachments/assets/b90d3c87-3708-4c33-87c2-fbf33f09ce5c" />
<img width="1513" height="720" alt="preview4" src="https://github.com/user-attachments/assets/499e8482-1203-40e0-beb7-f76eff4fad24" />
<img width="1526" height="726" alt="preview5" src="https://github.com/user-attachments/assets/013ea1a1-4e66-4ab9-8089-88ca3c345c7a" />
<img width="1511" height="720" alt="preview6" src="https://github.com/user-attachments/assets/d9228372-e66c-4bda-98c0-366d0ee08c92" />
<img width="1515" height="726" alt="preview7" src="https://github.com/user-attachments/assets/875db26c-b6b9-4912-a3ba-b1fb066d36a0" />


---

## ✨ Funcionalidades

- **PokéLista** — Explora más de 1,000 Pokémon con paginación, filtros por tipo y por generación
- **Buscador inteligente** — Búsqueda en tiempo real con debounce y caché en memoria (sin peticiones repetidas)
- **Legendarios** — Sección dedicada con todos los Pokémon legendarios y míticos obtenidos dinámicamente desde la API
- **Favoritos** — Guarda y gestiona tus Pokémon favoritos con persistencia en `localStorage`
- **Modal de detalles** — Estadísticas, habilidades, tipos y peso/altura de cada Pokémon
- **Modo oscuro** — Toggle de dark mode persistente entre sesiones
- **Vista compacta** — Modo cuadrícula compacta para ver más Pokémon a la vez
- **Responsive** — Diseño adaptado a móvil, tablet y escritorio con barra de navegación inferior en móvil

---

## 🛠️ Tecnologías

| Tecnología | Uso |
|---|---|
| HTML5 | Estructura semántica |
| CSS3 | Estilos, animaciones, dark mode, responsive |
| JavaScript (ES Modules) | Lógica, routing, estado global |
| [PokéAPI](https://pokeapi.co/) | Fuente de todos los datos |
| Font Awesome | Iconografía |
| Google Fonts (Poppins) | Tipografía |

> **Sin frameworks.** Sin React, Vue ni Angular. Todo construido a mano.

---

## 🏗️ Arquitectura

```
PokeWorld/
├── index.html
├── assets/
│   ├── routes.js      # Router SPA propio (sin librerías)
│   ├── state.js       # Estado global centralizado
│   └── utils.js       # Helpers: favoritos, modal, traducciones
├── views/
│   ├── home.js        # Página de inicio con stats dinámicos
│   ├── pokelista.js   # Lista con filtros y paginación
│   ├── legendarios.js # Sección de legendarios y míticos
│   ├── favoritos.js   # Colección personal
│   └── ajustes.js     # Preferencias de visualización
└── styles/
    ├── styles.css     # Estilos globales y variables
    ├── home.css
    ├── pokelista.css
    ├── legendarios.css
    ├── favoritos.css
    ├── ajustes.css
    └── movil.css      # Media queries responsive
```

---

## ⚙️ Decisiones técnicas

**Router SPA propio**
Implementé un sistema de navegación de una sola página sin recargar el navegador, usando ES Modules y renderizado dinámico del contenido.

**Estado global centralizado**
`appState` centraliza toda la lógica de estado: filtros activos, página actual, preferencias del usuario y caché de API. Evita variables sueltas y hace el código predecible.

**Caché de API en memoria**
La lista completa de Pokémon, los legendarios y las stats del Home se descargan una sola vez por sesión. Las búsquedas siguientes filtran en memoria sin peticiones extra.

**Datos 100% dinámicos**
Los números del Home (tipos, generaciones, legendarios, habilidades) se consultan en tiempo real desde la PokéAPI. Los legendarios se obtienen filtrando por `is_legendary` e `is_mythical` desde `pokemon-species`.

---

## 🚀 Cómo ejecutarlo localmente

```bash
# Clona el repositorio
git clone https://github.com/edwinra123/PokeWorld.git

# Entra a la carpeta
cd PokeWorld

# Ábrelo con un servidor local (necesario por los ES Modules)
# Opción 1: extensión Live Server de VS Code
# Opción 2: con Python
python -m http.server 8000
# Luego abre http://localhost:8000
```

> ⚠️ No funciona abriendo `index.html` directamente por doble clic — necesita un servidor local debido al uso de ES Modules.

---

## 👤 Autor

**Edwin Jesús Ramírez Cáceres**

---

*Construido con ❤️ y muchas horas de café ☕*
