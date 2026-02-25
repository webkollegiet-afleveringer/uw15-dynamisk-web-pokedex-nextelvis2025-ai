const listElement = document.getElementById('pokemon-list');
const theOneDiv = document.querySelector('.TheOne');

let currentOffset = 0;
const limit = 20;
let isLoading = false;
let hasMore = true;

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && hasMore && !isLoading) {
            observer.unobserve(entry.target);
            fetchBatch();
        }
    });
}, { threshold: 0.1 });

function fetchBatch() {
    if (isLoading || !hasMore) return;
    isLoading = true;
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${currentOffset}`)
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
                const link = document.createElement('a');
                link.href = `detail.html?name=${pokemon.name}`;
                link.textContent = pokemon.name;
                listItem.appendChild(link);
                listElement.appendChild(listItem);
            });
            currentOffset += limit;
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

// Initial fetch
fetchBatch();

// Search functionality
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