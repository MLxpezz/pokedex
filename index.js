/*
    Requerimientos de la app pokemon:
    1. Barra de busqueda por nombre o numero
    2. se puede buscar por tipos (electrico, oscuridad, etc).
    3. al dar clic de un pokemon de la lista se abre una pagina con su informacion mas detallada.
    
*/ 

//selectores
const pokeName = document.getElementById('pokeName');
const search = document.getElementById('search');
const searchByType = document.getElementById('searchByType');
const cardsContainer = document.querySelector('.cards-container');
const previous = document.querySelector('.previous');
const next = document.querySelector('.next');
const types = document.querySelectorAll('.type');
const home = document.querySelector('.home');

//variables/constantes
const typesColors = {
    bug: '#1b4b27',
    dark: '#040707',
    dragon: '#448a95',
    electric: '#e2e32a',
    fairy: '#961a45',
    fighting: '#f06239',
    fire: '#fd4b5a',
    flying: '#94b2c7',
    ghost: '#906791',
    grass: '#27cb50',
    ground: '#6e491f',
    ice: '#d8f0fa',
    normal: '#ca98a6',
    poison: '#9b69da',
    psychic: '#f71d92',
    rock: '#8b3e22',
    steel: '#43bd94',
    water: '#85a8fb'
}

let start = 1;
let limit = 15;
let btnByType = false;
let typeName = '';

//funciones
async function dataPokemon(dato) {
    await fetch(`https://pokeapi.co/api/v2/pokemon/${dato}/`)
    .then(res => res.json())
    .then(res => {
        let card = document.createElement('div');
        let imgCard = document.createElement('img');
        let namePokemon = document.createElement('span');
        namePokemon.textContent = res.name;
        imgCard.src = res.sprites.front_default;
        card.append(namePokemon);
        card.append(imgCard);           
        card.className = 'card';
        card.addEventListener('click', e => infoPokemon(res));
        typePokemon(res.types, card);
        cardsContainer.append(card);
    })
    .catch(e => {
        let cardPokemon = document.createElement('div');
        cardPokemon.classList = 'card';
        cardPokemon.textContent = 'No se encontro el pokemon';
        removeChildren();
        cardsContainer.append(cardPokemon);
    });
    
}

const infoPokemon = (info) => {
    removeChildren();
    next.style.display = 'none';
    previous.style.display = 'none';
    home.style.display = 'block';

    let card = document.createElement('div');
    let imgCard = document.createElement('img');
    let namePokemon = document.createElement('span');
    let information = document.createElement('div');
    card.className = 'info';
    imgCard.src = info.sprites.front_default;
    namePokemon.textContent = info.name;
    information.className = 'information';
    information.innerHTML = `
        Vida: ${info.stats[0].base_stat}<br>
        Ataque: ${info.stats[1].base_stat}<br>
        Defensa: ${info.stats[2].base_stat}<br>
        Ataque-Especial: ${info.stats[3].base_stat}<br>
        Defensa-Especial: ${info.stats[4].base_stat}<br>
    `;
    card.append(namePokemon);
    card.append(imgCard); 
    card.append(information);
    typePokemon(info.types, card);
    
    cardsContainer.append(card);
}

async function cardPokemon(start , limit) {
    for(let i = start; i <= (start+limit); i++) {
        await dataPokemon(i);
    }
    home.style.display = 'none';
}
  
function typePokemon(type, selector) {
    type.forEach(type => {
        let typePokemon = document.createElement('p');
        typePokemon.classList = 'tipos';
        typePokemon.textContent = `${type.type.name}`;
        typePokemon.style.color = '#ccc';
        typePokemon.style.background = typesColors[type.type.name];
        selector.append(typePokemon);
    });
}

function searchPokemon(dato) {
        try {
            let cardPokemon = document.createElement('div');
            let imgPokemon = document.createElement('img');
            let namePokemon = document.createElement('span');
            namePokemon.textContent = dato.name;
            cardPokemon.classList = 'card';
            imgPokemon.src = dato.sprites.front_default;
            cardPokemon.append(namePokemon)
            cardPokemon.append(imgPokemon);
            typePokemon(dato.types, cardPokemon);
            removeChildren();
            cardsContainer.append(cardPokemon);
        } catch(e) {
            console.error(`Se produjo un error ${e}`);
        }
}
const removeChildren = () => {
    while(cardsContainer.firstChild) {
        cardsContainer.removeChild(cardsContainer.firstChild);
    }
}

types.forEach(type => {
    type.style.background = typesColors[type.textContent];
});

const searchType = async (dato) => {
    await fetch(`https://pokeapi.co/api/v2/type/${dato}/`)
    .then(res => res.json())
    .then(async res => {
        removeChildren();
        previous.style.display = 'block';
        next.style.display = 'block';
        home.style.display = 'none';
        for(let i = start-1; i <= start+limit-1; i++) {
            await dataPokemon(res.pokemon[i].pokemon.name);
        }
    }).catch (e => {
        console.error(`Se produjo un error al obtener el tipo de pokemon: ${e}`);
        let cardPokemon = document.createElement('div');
        cardPokemon.classList = 'card';
        cardPokemon.textContent = 'No se encontró el tipo de pokemon';
        removeChildren();
        cardsContainer.append(cardPokemon);
    });
}

cardPokemon(start,limit);

//eventos
search.addEventListener('click', e => {
    e.preventDefault();
    if(pokeName.value !== '') {
        removeChildren();
        dataPokemon(pokeName.value.toLowerCase());
        previous.style.display = 'none';
        next.style.display = 'none';
        home.style.display = 'block';
        pokeName.value = '';
    }
})

previous.addEventListener('click', e => {
    if(start <= 1) return;
    if(!btnByType) {
        removeChildren();
        start -= 16;
        cardPokemon(start,limit);
    }else if(btnByType) {
        start -= 16;
        searchType(typeName);
    }
});

next.addEventListener('click', e => {
    if(!btnByType) {
        removeChildren();
        start += 16;
        cardPokemon(start,limit);
    }else if(btnByType) {
        removeChildren();
        start += 16;
        searchType(typeName);
    }
});

home.addEventListener('click', e => {
    removeChildren();
    start = 1;
    btnByType = false;
    cardPokemon(start, limit);
    previous.style.display = 'block';
    next.style.display = 'block';
    home.style.display = 'none';
});

searchByType.addEventListener('click', e => {
    document.querySelector('.types-container').classList.toggle('show');
});

types.forEach(type => {
    type.addEventListener('click', e => {
        searchType(type.textContent.toLowerCase());
        btnByType = true;
        typeName = type.textContent;
    });
})

