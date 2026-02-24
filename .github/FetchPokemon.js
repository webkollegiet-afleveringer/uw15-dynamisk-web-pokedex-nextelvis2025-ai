const listElement = document.getElementById('pokemon-list');

const url = 'https://pokeapi.co/api/v2/pokemon?limit=21';

fetch(url)
    .then(response => response.json())
    .then(data => data.results.forEach(pokemon => {

        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `detail.html?name=${pokemon.name}`;
        link.textContent = pokemon.name;
        listItem.appendChild(link);

        listElement.appendChild(listItem);
    }
    ))
    