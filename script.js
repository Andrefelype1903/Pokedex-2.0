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

async function carregarEvolucao(id, area2) {
    try {
        const speciesResp = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}/`);
        const speciesData = await speciesResp.json();

        const chainUrl = speciesData.evolution_chain.url;
        const chainResp = await fetch(chainUrl);
        const chainData = await chainResp.json();

        const evolucoes = [];
        let atual = chainData.chain;

        while (atual) {
            evolucoes.push(atual.species.name);
            atual = atual.evolves_to[0];
        }

        area2.innerHTML = `
            <div class="evo-wrapper">
                <h3>Linha Evolutiva</h3>
            </div>
        `;

        const wrapper = area2.querySelector(".evo-wrapper");

        for (let i = 0; i < evolucoes.length; i++) {
            const nome = evolucoes[i];
            const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${nome}`);
            const pokeData = await resp.json();

            // --- seta entre evoluções ---
            if (i > 0) {
                const seta = document.createElement("div");
                seta.classList.add("seta-evo");
                wrapper.appendChild(seta);
            }

            const evoDiv = document.createElement("div");
            evoDiv.classList.add("evo-div");

            evoDiv.innerHTML = `
                <img src="${pokeData.sprites.front_default}" width="80">
                <span>${pokeData.name[0].toUpperCase() + pokeData.name.slice(1)}</span>
            `;

            wrapper.appendChild(evoDiv);
        }

        setTimeout(() => ajustarEvolucao(area2), 10);

    } catch (e) {
        console.error("Erro ao carregar evolução", e);
        area2.innerHTML = "Linha evolutiva não encontrada.";
    }
}


function ajustarEvolucao(area2) {
    const evoWrapper = area2.querySelector(".evo-wrapper");
    if (!evoWrapper) return;

    // reseta o scale
    evoWrapper.style.transform = "scale(1)";

    const areaH = area2.clientHeight;
    const conteudoH = evoWrapper.scrollHeight;

    if (conteudoH > areaH) {
        const scale = areaH / conteudoH;
        evoWrapper.style.transform = `scale(${scale})`;
    }
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

    const pokeID = card.querySelector(".number").textContent; // ID já formatado 001
    const idNum = parseInt(pokeID); // Converter para número normal

    const container = document.createElement("div");
    container.classList.add("carta-container");

    const cloneFrente = card.cloneNode(true);
    const verso = document.createElement("div");
    


    const area1 = document.createElement("div");
    area1.classList.add("area1")
    const area2 = document.createElement("div");
    area2.classList.add("area2")

    
    
    const numero = card.querySelector(".number").textContent; // pega o id do card


    const area3 = document.createElement("div");
    area3.classList.add("area3")


     const imgHQ = document.createElement("img");
    imgHQ.src = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${idNum}.png`;
    imgHQ.classList.add("img-oficial");

    area1.appendChild(imgHQ);

    verso.appendChild(area1)
    verso.appendChild(area2)
    verso.appendChild(area3)



    // Botão X
    const virar = document.createElement("span");
    virar.innerText = "x";
    virar.classList.add("virar");
    cloneFrente.appendChild(virar);

    // Classes
    cloneFrente.classList.add("pokemon-modal-card", "modal-frente");
    verso.classList.add("pokemon-modal-card", "modal-verso");

    // Limpa e insere temporariamente o container
    modalBg.innerHTML = "";
    modalBg.appendChild(container);
    container.appendChild(cloneFrente);

    // Medir a frente
    const largura = cloneFrente.offsetWidth;
    const altura = cloneFrente.offsetHeight;

    // Aplicar tamanho no verso
    verso.style.width = largura + "px";
    verso.style.height = altura + "px";

    // Colocar verso dentro do container
    container.appendChild(verso);

    modalBg.classList.add("active");

    virar.addEventListener("click", () => {
        container.classList.add("active");
        carregarEvolucao(idNum, area2);
    });
}



// Fechar ao clicar fora
modalBg.addEventListener("click", (e) => {
    if (e.target === modalBg) {
        modalBg.classList.remove("active");
    }
});