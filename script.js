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
    normal: 'Normal',
    ice: 'Gelo',
    ghost: 'Fantasma',
    dark: 'Escuridão',
    steel: 'Metal'

}


const typeIcons = {
    normal: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/normal.svg",
    fire: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fire.svg",
    water: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/water.svg",
    electric: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/electric.svg",
    grass: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/grass.svg",
    ice: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ice.svg",
    fighting: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fighting.svg",
    poison: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/poison.svg",
    ground: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ground.svg",
    flying: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/flying.svg",
    psychic: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/psychic.svg",
    bug: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/bug.svg",
    rock: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/rock.svg",
    ghost: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/ghost.svg",
    dragon: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/dragon.svg",
    dark: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/dark.svg",
    steel: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/steel.svg",
    fairy: "https://raw.githubusercontent.com/duiker101/pokemon-type-svg-icons/master/icons/fairy.svg"
};

async function getWeaknessesAndStrengths(id) {
    const url = `https://pokeapi.co/api/v2/pokemon/${id}`;
    const resp = await fetch(url);
    const data = await resp.json();

    const types = data.types.map(t => t.type.url);

    const weaknesses = new Set();
    const strengths = new Set();

    for (const t of types) {
        const respType = await fetch(t);
        const dataType = await respType.json();

        // fraquezas (double_damage_from)
        dataType.damage_relations.double_damage_from.forEach(w => weaknesses.add(w.name));

        // vantagens (double_damage_to)
        dataType.damage_relations.double_damage_to.forEach(s => strengths.add(s.name));
    }

    return {
        weaknesses: Array.from(weaknesses),
        strengths: Array.from(strengths)
    };
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
  console.log(pokeTypes)
  const type = mainTypes.find(type => pokeTypes.indexOf(type) > -1);
  const tipo1 = traduzir(pokeTypes[0]);
  const tipo2 = pokeTypes[1] ? traduzir(pokeTypes[1]) : null;
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
        <small class="type">Tipo: <span>${tipo1}</span></small>
          ${tipo2 ? `<small class="type">Tipo: <span>${tipo2}</span></small>` : ""}

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





async function carregarInfoPokemon(id, area3) {

    // 1. Buscar o pokemon principal (para stats)
    const resp = await fetch(`https://pokeapi.co/api/v2/pokemon/${id}`);
    const pokeData = await resp.json();

    // 2. Buscar species (chance de captura)
    const speciesResp = await fetch(`https://pokeapi.co/api/v2/pokemon-species/${id}`);
    const speciesData = await speciesResp.json();


    // -------------------------
    //  STATS
    // -------------------------
    const statsDiv = document.createElement("div");
    statsDiv.classList.add("stats-box");


    const tituloStats = document.createElement("h3");
    tituloStats.innerText = "Status:";
    tituloStats.classList.add("titulo_stats")
    statsDiv.appendChild(tituloStats);


    pokeData.stats.forEach(s => {
        const linha = document.createElement("p");
        linha.innerText = `${s.stat.name.toUpperCase()}:${s.base_stat}`;
        linha.classList.add("stats-poke")
        statsDiv.appendChild(linha);
    });

    tituloStats.classList.add("titulo-Stats")


    // -------------------------
    //  CHANCE DE CAPTURA
    // -------------------------
    const catchDiv = document.createElement("div");
    catchDiv.classList.add("catch-box");

    const tituloCatch = document.createElement("h3");
    tituloCatch.innerText = "Chance de Captura";
    tituloCatch.classList.add("titulo_stats")
    catchDiv.appendChild(tituloCatch);

    // Fórmula oficial: capture_rate / 255
    const chance = (speciesData.capture_rate / 255) * 100;

    const linhaCatch = document.createElement("p");
    linhaCatch.innerText = `${chance.toFixed(1)}%`;
    linhaCatch.classList.add("porcentagem")
    catchDiv.appendChild(linhaCatch);


    // Inserir tudo na área3
    area3.appendChild(statsDiv);
    area3.appendChild(catchDiv);
}





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

    const fecharFrente = document.createElement("button")
    fecharFrente.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>'
    fecharFrente.classList.add("btn-fechar")
    cloneFrente.appendChild(fecharFrente)

    const fecharVerso = document.createElement("span");
    fecharVerso.innerHTML = '<i class="fa-regular fa-circle-xmark"></i>';
    fecharVerso.classList.add("btn-fechar-verso")
    verso.appendChild(fecharVerso)
    


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


    const FraqVant = () => {
      getWeaknessesAndStrengths(idNum).then(result => {

    const fraqTitulo = document.createElement("h4");
    fraqTitulo.textContent = "Fraquezas:";
    fraqTitulo.classList.add("titulo_stats")
    area3.appendChild(fraqTitulo);

    const fraqBox = document.createElement("div");
    fraqBox.style.display = "flex";
    fraqBox.style.justifyContent = "center"
    fraqBox.style.flexWrap = "wrap";
    fraqBox.style.gap = "6px";
    area3.appendChild(fraqBox);

    result.weaknesses.forEach(type => {
        const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.cursor = "pointer";

    const img = document.createElement("img");
    img.src = typeIcons[type];
    img.style.width = "8px";
    img.style.height = "8px";

    const label = document.createElement("span");
    label.classList.add("span-icon")
    label.textContent = tipos[type];

    wrapper.appendChild(img);
    wrapper.appendChild(label);

    wrapper.addEventListener("click", () => {
        label.style.display = (label.style.display === "none") ? "block" : "none";
    });

    fraqBox.appendChild(wrapper);
    });

    const vantTitulo = document.createElement("h4");
    vantTitulo.textContent = "Vantagens:";
    vantTitulo.classList.add("titulo_stats")
    
    area3.appendChild(vantTitulo);

    const vantBox = document.createElement("div");
    vantBox.style.display = "flex";
    vantBox.style.flexWrap = "wrap";
    vantBox.style.justifyContent = "center"
    vantBox.style.gap = "6px";
    area3.appendChild(vantBox);

    result.strengths.forEach(type => {
        const wrapper = document.createElement("div");
    wrapper.style.display = "flex";
    wrapper.style.flexDirection = "column";
    wrapper.style.alignItems = "center";
    wrapper.style.cursor = "pointer";

    const img = document.createElement("img");
    img.src = typeIcons[type];
    img.style.width = "8px";
    img.style.height = "8px";

    const label = document.createElement("span");
    label.classList.add("span-icon")
    label.textContent = tipos[type];

    wrapper.appendChild(img);
    wrapper.appendChild(label);

    wrapper.addEventListener("click", () => {
        label.style.display = (label.style.display === "none") ? "block" : "none";
    });

    vantBox.appendChild(wrapper);
    });

});
    }


    // Botão virar
    const virar = document.createElement("button");
    virar.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-repeat-icon lucide-repeat"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>`;
    virar.classList.add("virar");
    cloneFrente.appendChild(virar);

    const virarVerso = document.createElement("button");
    virarVerso.innerHTML = `<svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="lucide lucide-repeat-icon lucide-repeat"><path d="m17 2 4 4-4 4"/><path d="M3 11v-1a4 4 0 0 1 4-4h14"/><path d="m7 22-4-4 4-4"/><path d="M21 13v1a4 4 0 0 1-4 4H3"/></svg>`;
    virarVerso.classList.add("virarVerso");
    verso.appendChild(virarVerso);
    


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
        area2.style.display = "flex"
        area3.style.display = "flex"
        container.classList.add("active");
        carregarEvolucao(idNum, area2);
        FraqVant()
        carregarInfoPokemon(idNum, area3);
        virarVerso.style.display ="flex"
        fecharVerso.style.display = "block"
    });

    virarVerso.addEventListener("click", () => {
        container.classList.remove("active");
        area2.style.display = "none";
        area2.innerHTML = "";
        area3.style.display = "none";
        area3.innerHTML = "";
        virarVerso.style.display = "none";
        fecharVerso.style.display = "none"
    });

    fecharFrente.addEventListener("click", () => {
      modalBg.classList.remove("active")
    })

    fecharVerso.addEventListener("click", () => {
      modalBg.classList.remove("active")
    })
}



// Fechar ao clicar fora
modalBg.addEventListener("click", (e) => {
    if (e.target === modalBg) {
        modalBg.classList.remove("active");
    }
});