const urlParams = new URLSearchParams(window.location.search);
const name = urlParams.get('name');

const typeColors = {
    grass: "#78C850",
    poison: "#A040A0",
    fire: "#F08030",
    water: "#6890F0",
    electric: "#F8D030",
    bug: "#A8B820",
    normal: "#A8A878",
    flying: "#A890F0",
    ground: "#E0C068",
    fairy: "#EE99AC"
};

if (name) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then(response => response.json())
        .then(data => {

            const mainType = data.types[0].type.name;
            const bgColor = typeColors[mainType] || "#999";

            document.body.style.background = bgColor;

            const detailDiv = document.getElementById('pokemon-detail');

            const typesHTML = data.types.map(t => `
                <span class="type-badge" style="background:${typeColors[t.type.name] || "#999"}">
                    ${t.type.name}
                </span>
            `).join("");

            const statsHTML = data.stats.map(stat => `
                <div class="stat-row">
                    <div class="stat-name">${stat.stat.name.slice(0,3)}</div>
                    <div class="stat-value">${stat.base_stat}</div>
                    <div class="stat-bar">
                        <div class="stat-bar-fill"
                             style="width:${stat.base_stat / 2}%; background:${bgColor}">
                        </div>
                    </div>
                </div>
            `).join("");

            detailDiv.innerHTML = `
                <div class="detail-header" style="background:${bgColor}">
                    <a href="index.html" class="back-link">←</a>
                    <h1>${data.name}</h1>
                    <div class="pokemon-number">
                        #${String(data.id).padStart(3, "0")}
                    </div>
                </div>

                <img class="pokemon-image"
                     src="${data.sprites.other['official-artwork'].front_default}"
                     alt="${data.name}">

                <div class="detail-card">
                    <div class="types">${typesHTML}</div>

            

                    <div class="about-grid">
                        <div>
                            ${data.weight / 10} kg
                            <div class="about-label">Weight</div>
                        </div>
                        <div>
                            ${data.height / 10} m
                            <div class="about-label">Height</div>
                        </div>
                        <div>
                            ${data.abilities.map(a => a.ability.name).join(", ")}
                            <div class="about-label">Abilities</div>
                        </div>
                    </div>

                    <div class="section-title">Base Stats</div>
                    <div class="stats">
                        ${statsHTML}
                    </div>
                </div>
            `;
        })
        .catch(() => {
            document.getElementById('pokemon-detail').innerHTML =
                '<p>Error loading Pokémon details.</p>';
        });
} else {
    document.getElementById('pokemon-detail').innerHTML =
        '<p>No Pokémon specified.</p>';
}