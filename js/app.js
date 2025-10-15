//Obtener datos de la API
async function getPokemon(id) {
  const response = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
  const data = await response.json();
  return data;
}

// Crear una carta DOM 
function crearCarta(pokemon) {
  const card = document.createElement("div");
  card.classList.add("pokemon-card");
  card.style.background = colorTipo(pokemon);

  // Nombre
  const name = document.createElement("h3");
  name.textContent = pokemon.name.charAt(0).toUpperCase() + pokemon.name.slice(1);
  card.appendChild(name);

  // Imagen
  const img = document.createElement("img");
  img.src = pokemon.sprites.front_default;
  img.alt = pokemon.name;
  card.appendChild(img);

  //Listener para cambiar el sprite al hacer click
  img.addEventListener("click", () => cambiarSprite(img,pokemon));

  // Altura
  const height = document.createElement("p");
  height.textContent = `Altura: ${pokemon.height / 10} m`;
  card.appendChild(height);

  // Peso
  const weight = document.createElement("p");
  weight.textContent = `Peso: ${pokemon.weight / 10} kg`;
  card.appendChild(weight);

  // ID
  const id = document.createElement("p");
  id.textContent = `ID: ${pokemon.id}`;
  card.appendChild(id);

  // Tipos
  const types = document.createElement("p");
  const typeNames = pokemon.types
    .map(type => type.type.name.charAt(0).toUpperCase() + type.type.name.slice(1))
    .join(", ");
  types.textContent = `Tipos: ${typeNames}`;
  card.appendChild(types);

  return card;
}

//Lista que tendrá todos los colores de los tipos de Pokémon
const coloresTipo = {
  normal: '#E0D1CE',
  fire: '#F72D2D',
  water: '#1F98ED',
  grass: '#1AC436',
  electric: '#DCE522',
  ice: '#27F5E2',
  fighting: '#C45914',
  poison: '#961B8D',
  ground: '#EDB14C',
  flying: '#A0D9E8',
  psychic: '#DF4CE0',
  bug: '#8FEA57',
  rock: '#8F6D36',
  ghost: '#DC82F5',
  dragon: '#5C38D9',
  steel: '#95919C',
  dark: '#515152',
  fairy: '#DD7AA8',
};

//Función que asignara el color 
function colorTipo(pokemon){
  const tipos = pokemon.types.map(t => t.type.name);

  if (tipos.length === 1) {
    return coloresTipo[tipos[0]];
  } 
  if(tipos.length === 2) {
    const color1 = coloresTipo[tipos[0]];
    const color2 = coloresTipo[tipos[1]];

   return `linear-gradient(135deg, ${color1} 45%, ${color2} 55%)`;
  }
}


//Función para cambiar el sprite al hacer click

function cambiarSprite(img, pokemon) {
const actual = img.getAttribute("data-actual") || "normal";
if (actual === "normal") {
  img.src = pokemon.sprites.front_shiny || pokemon.sprites.front_default;
  img.setAttribute("data-actual", "shiny");
} else {
  img.src = pokemon.sprites.front_default;
  img.setAttribute("data-actual", "normal");
} 
}

async function cargarPokemonDOM() {
  const grid = document.getElementById("pokemon-grid");
  grid.innerHTML = "";

  const promises = [];
  for (let i = 1; i <= 1025; i++) {
    promises.push(getPokemon(i));
  }

  const pokemons = await Promise.all(promises);

  pokemons.forEach(p => {
    const card = crearCarta(p);
    grid.appendChild(card);
  });
}

// --- Buscar Pokémon por nombre ---
async function buscarPokemon() {
  const searchInput = document.getElementById("search");
  const grid = document.getElementById("pokemon-grid");
  const nombre = searchInput.value.trim().toLowerCase();


  while (grid.firstChild) {
    grid.removeChild(grid.firstChild);
  }

  if (nombre === "") {
    // Si no hay búsqueda, carga todos
    await cargarPokemonDOM();
    return;
  }

  try {
    const pokemon = await getPokemon(nombre);
    if (pokemon) {
      const card = crearCarta(pokemon);
      grid.appendChild(card);
    }
  } catch (error) {

    const msg = document.createElement("p");
    msg.textContent = "Pokémon no encontrado";
    msg.style.fontWeight = "bold";
    msg.style.color = "red";
    grid.appendChild(msg);
  }
}


document.getElementById("search-button").addEventListener("click", buscarPokemon);
document.getElementById("search").addEventListener("keypress", (e) => {
  if (e.key === "Enter") buscarPokemon();
});

cargarPokemonDOM();
