const listElement = document.getElementById('pokemon-list');
const theOneDiv = document.querySelector('.TheOne');

let currentOffset = 0;
const limit = 20;
let isLoading = false;
let hasMore = true;

const STORAGE_SCROLL = 'pokedex-scroll-top';
const STORAGE_OFFSET = 'pokedex-offset';


const savedScroll = parseInt(localStorage.getItem(STORAGE_SCROLL) || '0', 10) || 0;
const savedOffset = parseInt(localStorage.getItem(STORAGE_OFFSET) || '0', 10) || 0;

let allLoaded = false;
let allPokemonData = [];


const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && hasMore && !isLoading) {
            observer.unobserve(entry.target);
            fetchBatch();
        }
    });
}, { threshold: 0.1 });

function loadAll() {
    if (allLoaded) return Promise.resolve();
    return fetch('https://pokeapi.co/api/v2/pokemon?limit=100000')
        .then(res => res.json())
        .then(data => {
            allPokemonData = data.results;
            allLoaded = true;
            hasMore = false; // No more to load
            // Build the full list
            listElement.innerHTML = '';
            allPokemonData.forEach(pokemon => {
                const listItem = document.createElement('li');
                const parts = pokemon.url.split('/').filter(Boolean);
                const id = parts[parts.length - 1];
                const artworkUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;
                const formattedId = String(id).padStart(3, "0");
                listItem.innerHTML = `
    <a href="detail.html?name=${pokemon.name}" class="pokemon-card-link">
        <span class="pokemon-id">#${formattedId}</span>
        <img src="${artworkUrl}" alt="${pokemon.name}" class="pokemon-artwork">
        <span class="pokemon-name">${pokemon.name}</span>
    </a>
`;
                listElement.appendChild(listItem);
            });
        });
}

function fetchBatch() {
    if (isLoading || !hasMore) return Promise.resolve();
    isLoading = true;
    return fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${currentOffset}`)
        .then(response => response.json())
        .then(data => {
            const pokemonToShow = data.results;
            if (pokemonToShow.length === 0) {
                hasMore = false;
                isLoading = false;
                return;
            }
            pokemonToShow.forEach(pokemon => {
                const listItem = document.createElement('li');

                const parts = pokemon.url.split('/').filter(Boolean);
                const id = parts[parts.length - 1];
                const artworkUrl = `https://raw.githubusercontent.com/PokeAPI/sprites/master/sprites/pokemon/other/official-artwork/${id}.png`;

                const formattedId = String(id).padStart(3, "0");

                listItem.innerHTML = `
    <a href="detail.html?name=${pokemon.name}" class="pokemon-card-link">
        <span class="pokemon-id">#${formattedId}</span>
        <img src="${artworkUrl}" alt="${pokemon.name}" class="pokemon-artwork">
        <span class="pokemon-name">${pokemon.name}</span>
    </a>
`;

                listElement.appendChild(listItem);
            });
            currentOffset += limit;
            
            try { localStorage.setItem(STORAGE_OFFSET, String(currentOffset)); } catch (e) {}
            isLoading = false;

            const lastItem = listElement.lastElementChild;
            if (lastItem) {
                observer.observe(lastItem);
            }

            if (currentOffset === limit) {
                theOneDiv.classList.add('TheOne--visible');
            }
        })
        .catch(error => {
            console.error('Error fetching Pokémon:', error);
            isLoading = false;
        });
}



async function restoreAndFetch() {
    
    await fetchBatch(); 

    if (savedScroll > 0) {
        let attempts = 0;
        while (theOneDiv.scrollHeight < savedScroll && hasMore && attempts < 100) {
            attempts++;
            await fetchBatch();
            
            await new Promise(r => setTimeout(r, 30));
        }
        
        setTimeout(() => { theOneDiv.scrollTop = savedScroll; }, 50);
    }
}


restoreAndFetch();


let searchMode = 'name';

document.getElementById('toggleSearch').addEventListener('click', function() {
    searchMode = searchMode === 'name' ? 'id' : 'name';
    this.textContent = searchMode === 'name' ? 'Search by Name' : 'Search by ID';
    // Re-trigger search to update display
    document.getElementById('searchInput').dispatchEvent(new Event('input'));
});

document.getElementById('searchInput').addEventListener('input', async function (event) {
    const searchTerm = event.target.value.toLowerCase();
    if (searchTerm) {
        if (!allLoaded) {
            await loadAll();
        }
    }
    const listItems = document.querySelectorAll('#pokemon-list li');
    listItems.forEach(function (item) {
        const nameText = item.querySelector('.pokemon-name').textContent.toLowerCase();
        const idText = item.querySelector('.pokemon-id').textContent.toLowerCase();
        let matches = false;
        if (searchMode === 'name') {
            matches = nameText.includes(searchTerm);
        } else {
            matches = idText.includes(searchTerm);
        }
        item.style.display = matches || searchTerm === '' ? 'list-item' : 'none';
    });
});


let _scrollSaveTimer = null;
theOneDiv.addEventListener('scroll', function () {
    if (_scrollSaveTimer) clearTimeout(_scrollSaveTimer);
    _scrollSaveTimer = setTimeout(() => {
        try {
            localStorage.setItem(STORAGE_SCROLL, String(theOneDiv.scrollTop));
            localStorage.setItem(STORAGE_OFFSET, String(currentOffset));
        } catch (e) {}
    }, 150);
});