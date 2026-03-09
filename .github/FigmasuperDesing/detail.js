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
    dragon: "#7037ff",
    steel: "#B7B9D0",
    psychic: "#FB5584",
    fighting: "#C12239",
    rock: "#B69E31",
    ghost: "#70559b",
    dark: "#75574c",
    ice: "#9AD6DF",
    fairy: "#EE99AC"
};

if (name) {
    fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
        .then(response => response.json())
        .then(data => {

            const mainType = data.types[0].type.name;
            const bgColor = typeColors[mainType] || "#999";
            // helper to return a lighter version of a hex color. Cool stuff! :D
            function lighten(hex, percent) {
                hex = hex.replace(/^#/, "");
                const num = parseInt(hex, 16);
                const r = (num >> 16) & 0xff;
                const g = (num >> 8) & 0xff;
                const b = num & 0xff;
                const newR = Math.min(255, Math.floor(r + (255 - r) * percent));
                const newG = Math.min(255, Math.floor(g + (255 - g) * percent));
                const newB = Math.min(255, Math.floor(b + (255 - b) * percent));
                return `#${((1 << 24) + (newR << 16) + (newG << 8) + newB).toString(16).slice(1)}`;
            }
            const barBg = lighten(bgColor, 0.4); // about 40% lighter

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
                    <div class="stat-bar" style="background:${barBg}">
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
                    <a href="?name=${data.id - 1}" class="nav-arrow prev" ${data.id > 1 ? '' : 'style="display:none;"'}>‹</a>
                    <a href="?name=${data.id + 1}" class="nav-arrow next">›</a>
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