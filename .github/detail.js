const urlParams = new URLSearchParams(window.location.search);
        const name = urlParams.get('name');
        if (name) {
            fetch(`https://pokeapi.co/api/v2/pokemon/${name}`)
                .then(response => response.json())
                .then(data => {
                    const detailDiv = document.getElementById('pokemon-detail');
                    detailDiv.innerHTML = `
                        <h1>${data.name}</h1>
                        <img src="${data.sprites.front_default}" alt="${data.name}">
                        <p>Height: ${data.height}</p>
                        <p>Weight: ${data.weight}</p>
                        <p>Types: ${data.types.map(t => t.type.name).join(', ')}</p>
                        <p>Abilities: ${data.abilities.map(a => a.ability.name).join(', ')}</p>
                    `;
                })
                .catch(error => {
                    document.getElementById('pokemon-detail').innerHTML = '<p>Error loading Pokemon details.</p>';
                });
        } else {
            document.getElementById('pokemon-detail').innerHTML = '<p>No Pokemon specified.</p>';
        }