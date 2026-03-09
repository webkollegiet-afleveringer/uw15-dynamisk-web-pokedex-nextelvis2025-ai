 
const PisslistElement = document.querySelector("#pokemon-list");
 
let offset = 0;

let loading = false;

let allPokemon = [];
let searchMode = false;
let allLoaded = false;
 
function loadAllPokemon() {
    return fetch(`https://pokeapi.co/api/v2/pokemon?limit=100000`)
        .then(res => res.json())
        .then(data => {
            allPokemon = data.results;
            allLoaded = true;
        });
}



const animationObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add("visible");
        } else {
            entry.target.classList.remove("visible");
        }
    });
}, {
    threshold: 0
});
 
 
const scrollObserver = new IntersectionObserver((entries) => {
    if (entries[0].isIntersecting && !loading && hasMore) {
        loadPokemon();
    }
}, {
    threshold: 0
});
 
 
const sentinel = document.createElement("div");
sentinel.id = "scroll-trigger";
listElement.after(sentinel);
scrollObserver.observe(sentinel);
 
 
function loadPokemon() {
    loading = true;
 
    fetch(`https://pokeapi.co/api/v2/pokemon?limit=${limit}&offset=${offset}`)
        .then(res => res.json())
        .then(data => {
 
            if (data.results.length === 0) {
                hasMore = false;
                return;
            }
 
            data.results.forEach(pokemon => {
 
                const listitem = document.createElement("div");
                const id = pokemon.url.split("/").filter(Boolean).pop();
 
                
 
                listElement.appendChild(listitem);
 
                const item = listitem.querySelector(".items");
                animationObserver.observe(item);
            });
 
            offset += limit;
            loading = false;
        });
}



document.getElementById('searchInput').addEventListener('input', async function (event) {
 
    const searchTerm = event.target.value.toLowerCase();
 
   
    if (searchTerm.length > 0) {
 
        searchMode = true;
 
       
        scrollObserver.unobserve(sentinel);
 
       
        if (!allLoaded) {
            await loadAllPokemon();
        }
 
       
        PisslistElement.innerHTML = "";
 
       
        const filtered = allPokemon.filter(pokemon =>
            pokemon.name.toLowerCase().includes(searchTerm)
        );
 
        filtered.forEach(pokemon => {
 
            const listitem = document.createElement("div");
            const id = pokemon.url.split("/").filter(Boolean).pop();
 
            listitem.innerHTML = `
                <div class="items visible">
                
                    <h2>${pokemon.name}</h2>
                    <a href="detail.html?name=${pokemon.name}">
                        Se mere om ${pokemon.name}
                    </a>
                </div>
            `;
 
            PisslistElement.appendChild(listitem);
        });
 
    } else {
 
        searchMode = false;
 
        PisslistElement.innerHTML = "";
        offset = 0;
        
 
        scrollObserver.observe(sentinel);
        loadPokemon();
    }
});
