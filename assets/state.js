

export const appState = {

    // ── Navegación ────────────────────────────────────────────────────────────
    currentRoute: "home",
    searchQuery:  "",          

    // ── Estado de PokeLista ───────────────────────────────────────────────────
    pokelista: {
        currentPage: 1,
        activeType:  null,     
        activeGen:   null,     
    },

    // ── Preferencias (sincronizadas con localStorage) ─────────────────────────
    prefs: {
        get darkMode()    { return localStorage.getItem("darkMode")    === "true"; },
        get compactMode() { return localStorage.getItem("compactMode") === "true"; },
        set darkMode(val) {
            localStorage.setItem("darkMode", val ? "true" : "false");
            document.documentElement.classList.toggle("dark", val);
            document.body.classList.toggle("dark", val);
        },
        set compactMode(val) {
            localStorage.setItem("compactMode", val ? "true" : "false");
        },
    },

    // ── Caché de API (viven mientras la pestaña esté abierta) ─────────────────
    cache: {
        homeStats:      null,   
        pokemonList:    null,   
        legendariosInfo: null,  
        pokemon:        {},     
    },

    // ── Helpers ───────────────────────────────────────────────────────────────

    /** Resetea el estado de PokeLista al entrar a la vista */
    resetPokelista() {
        this.pokelista.currentPage = 1;
        this.pokelista.activeType  = null;
        this.pokelista.activeGen   = null;
    },

    /** Guarda un Pokémon individual en la caché */
    cachePokemon(nombre, data) {
        this.cache.pokemon[nombre] = data;
    },

    /** Recupera un Pokémon de la caché (o null si no está) */
    getCachedPokemon(nombre) {
        return this.cache.pokemon[nombre] || null;
    },
};