const listElement = document.getElementById('pokemon-list');
const prevBtn = document.getElementById('prevBtn');
const nextBtn = document.getElementById('nextBtn');
const pageInfo = document.getElementById('pageInfo');

const pokemonsPerPage = 20;
let currentPage = 1;
let totalPokemon = 0;
let allPokemon = [];

// Fetch all pokemon data
fetch('https://pokeapi.co/api/v2/pokemon?limit=151')
    .then(response => response.json())
    .then(data => {
        allPokemon = data.results;
         totalPokemon = data.results.length; //thing to note: the API returns 151 pokemon, but we can adjust this if needed
        displayPage(currentPage);
        updateButtons();
        updatePageInfo();
    });

function displayPage(page) {
    listElement.innerHTML = '';
    const startIndex = (page - 1) * pokemonsPerPage;
    const endIndex = startIndex + pokemonsPerPage;
    const pokemonToShow = allPokemon.slice(startIndex, endIndex);

    pokemonToShow.forEach(pokemon => {
        const listItem = document.createElement('li');
        const link = document.createElement('a');
        link.href = `detail.html?name=${pokemon.name}`;
        link.textContent = pokemon.name;
        listItem.appendChild(link);
        listElement.appendChild(listItem);
    });
}

function updateButtons() {
    const totalPages = Math.ceil(totalPokemon / pokemonsPerPage);
    
    prevBtn.disabled = currentPage === 1;
    nextBtn.disabled = currentPage === totalPages;
}

function updatePageInfo() {
    const totalPages = Math.ceil(totalPokemon / pokemonsPerPage);
    pageInfo.textContent = `side ${currentPage} af ${totalPages}`;
}

prevBtn.addEventListener('click', function() {
    if (currentPage > 1) {
        currentPage--;
        displayPage(currentPage);
        updateButtons();
        updatePageInfo();
    }
});

nextBtn.addEventListener('click', function() {
    const totalPages = Math.ceil(totalPokemon / pokemonsPerPage);
    if (currentPage < totalPages) {
        currentPage++;
        displayPage(currentPage);
        updateButtons();
        updatePageInfo();
    }
});

document.getElementById('searchInput').addEventListener('input', function (event) {
    const searchTerm = event.target.value.toLowerCase();
    const listItems = document.querySelectorAll('#pokemon-list li');

    listItems.forEach(function (item) {
        const itemText = item.textContent.toLowerCase();

        if (itemText.includes(searchTerm)) {
            item.style.display = 'list-item';
        } else {
            item.style.display = 'none';
        }
    });
});