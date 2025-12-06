const pokeConteiner = document.querySelector("#pokeConteiner");
const pokemonCount = 250;

const procurar = document.querySelector(".procurar");




const colors = {
    fire: '#FDDFDF',
    grass: '#DEFDE0',
    electric: '#FCF7DE',
    water: '#DEF3FD',
    ground: '#f4e7da',
    rock: '#d5d5d4',
    fairy: '#fceaff',
    poison: '#98d7a5',
    bug: '#f8d5a3',
    dragon: '#97b3e6',
    psychic: '#eaeda1',
    flying: '#F5F5F5',
    fighting: '#E6E0D4',
    normal: '#F5F5F5'
}

const tipos = {
    fire: 'Fogo',
    grass: 'Grama',
    electric: 'Elétrico',
    water: 'Água',
    ground: 'Chão',
    rock: 'Pedra',
    fairy: 'Fada',
    poison: 'Venenoso',
    bug: 'Inseto',
    dragon: 'Dragão',
    psychic: 'Pisíquico',
    flying: 'Voador',
    fighting: 'Lutador',
    normal: 'Normal'
}

const traduzir = (palavra) => {
  return tipos[palavra.toLowerCase()] || palavra;
}

const mainTypes = Object.keys(colors)

const fetchPokemons = async () => {
    for(let i = 1; i <= pokemonCount; i++) {
        await getPokemons(i)
    }
}

const getPokemons = async (id) => {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const resp = await fetch(url);
    const data = await resp.json();
    createPokemonCard(data)
    console.log(data)
}

const createPokemonCard = (poke) => {
  const card = document.createElement('div');
  card.classList.add('pokemon');

  const name = poke.name[0].toUpperCase() + poke.name.slice(1);
  const id = poke.id.toString().padStart(3, '0');

  const pokeTypes = poke.types.map(type => type.type.name);
  const type = mainTypes.find(type => pokeTypes.indexOf(type) > -1);
  const tipos = traduzir(type)
  const color = colors[type];

  const hp = poke.stats[0].base_stat;
  const attack = poke.stats[1].base_stat;
  const defense = poke.stats[2].base_stat;

  card.style.backgroundColor = color;

  const pokemonInnerHTML = `
    <div class="imgConteiner">
        <img src="https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/${poke.id}.png" alt="${name}">
    </div>

    <div class="info">
        <span class="number">${id}</span>
        <h3 class="name">${name}</h3>
        <small class="type">Tipo: <span>${tipos}</span></small>

        <div class="stats">
            <div class="stat-row">
                <span>HP</span>
                <div class="bar"><div style="width:${hp / 2}%"></div></div>
                <span class="value">${hp}</span>
            </div>

            <div class="stat-row">
                <span>ATK</span>
                <div class="bar"><div style="width:${attack / 2}%"></div></div>
                <span class="value">${attack}</span>
            </div>

            <div class="stat-row">
                <span>DEF</span>
                <div class="bar"><div style="width:${defense / 2}%"></div></div>
                <span class="value">${defense}</span>
            </div>
        </div>
    </div>
  `;

  card.innerHTML = pokemonInnerHTML;
  pokeConteiner.appendChild(card);

  card.addEventListener('click', () => abrirModal(card));
};

procurar.addEventListener("input", () => {
    const termo = procurar.value.toLowerCase();
    const cards = document.querySelectorAll(".pokemon");

    cards.forEach(card => {
        const nome = card.querySelector(".name").textContent.toLowerCase();
        const numero = card.querySelector(".number").textContent;
        const tipo = card.querySelector(".type span").textContent.toLowerCase();

        if (
            nome.includes(termo) ||
            numero.includes(termo) ||
            tipo.includes(termo)
        ) {
            card.style.display = "block";
        } else {
            card.style.display = "none";
        }
    });
});

fetchPokemons()

pokeConteiner.addEventListener("click", (e) => {
    const card = e.target.closest(".pokemon");
    if (!card) return;

    const nome = card.querySelector(".name").textContent;
    const numero = card.querySelector(".number").textContent;

    console.log("Clicou no Pokémon:", nome, numero);

    card.style.transform
});


// Cria o fundo do modal
const modalBg = document.createElement("div");
modalBg.classList.add("pokemon-modal-bg");
document.body.appendChild(modalBg);

function abrirModal(card) {
    const clone = card.cloneNode(true);
    clone.classList.add("pokemon-modal-card");

    modalBg.innerHTML = ""; 
    modalBg.appendChild(clone);

    modalBg.classList.add("active");
}

// Fechar ao clicar fora
modalBg.addEventListener("click", (e) => {
    if (e.target === modalBg) {
        modalBg.classList.remove("active");
    }
});