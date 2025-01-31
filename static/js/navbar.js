document.addEventListener("DOMContentLoaded", async () => {
    const searchInput = document.getElementById("search-input");
    const searchResults = document.getElementById("search-results");
    const filterSelect = document.getElementById("filter-select");

    document.body.style.cursor = "url('/static/cursor/cursor.cur'), auto";

    const buttons = document.querySelectorAll("button");
    buttons.forEach(button => {
        button.style.cursor = "url('https://sweezy-cursors.com/wp-content/uploads/cursor/world-of-warcraft-frostmourne-pixel/world-of-warcraft-frostmourne-pixel-pointer-32x32.png'), pointer";
    });

    const apiUrls = {
        weapons: [
            "https://eldenring.fanapis.com/api/weapons?limit=200&page=0",
            "https://eldenring.fanapis.com/api/weapons?limit=200&page=1",
            "https://eldenring.fanapis.com/api/weapons?limit=200&page=2",
            "https://eldenring.fanapis.com/api/weapons?limit=200&page=3"
        ],
        armors: [
            "https://eldenring.fanapis.com/api/armors?limit=200&page=0",
            "https://eldenring.fanapis.com/api/armors?limit=200&page=1",
            "https://eldenring.fanapis.com/api/armors?limit=200&page=2",
            "https://eldenring.fanapis.com/api/armors?limit=200&page=3",
            "https://eldenring.fanapis.com/api/armors?limit=200&page=4"
        ],
        talismans: ["https://eldenring.fanapis.com/api/talismans?limit=500"],
        shields: ["https://eldenring.fanapis.com/api/shields?limit=100"]
    };

    let cachedData = [];

    async function fetchCategories() {
        if (cachedData.length > 0) return cachedData;

        let allItems = [];
        for (const [key, urls] of Object.entries(apiUrls)) {
            for (const url of urls) {
                try {
                    const response = await fetch(url);
                    const data = await response.json();
                    if (data.data) {
                        const items = data.data.map(item => ({ ...item, type: key }));
                        allItems = [...allItems, ...items];
                    }
                } catch (error) {
                    console.error(`Error cargando ${key}:`, error);
                }
            }
        }
        cachedData = allItems;
        return allItems;
    }

    async function searchItems() {
        const searchTerm = searchInput.value.toLowerCase().trim();
        const selectedFilter = filterSelect.value;
        searchResults.innerHTML = "";

        if (!searchTerm) {
            hideResults();
            return;
        }

        const categories = await fetchCategories();
        const filteredCategories = categories.filter(item => 
            item.name.toLowerCase().includes(searchTerm) &&
            (selectedFilter ? item.type === selectedFilter : true)
        );

        if (filteredCategories.length === 0) {
            searchResults.innerHTML = "<p class='text-white p-2'>No se encontraron resultados.</p>";
            showResults();
            return;
        }

        filteredCategories.forEach((item, index) => {
            const card = document.createElement("div");
            card.className = `
                flex items-center gap-4 p-4 rounded-lg 
                bg-gray-900 hover:bg-gray-800 
                transition-transform transform hover:scale-105 cursor-pointer opacity-0 translate-y-4
            `;
            card.style.transition = `opacity 0.4s ease-out ${index * 50}ms, transform 0.4s ease-out ${index * 50}ms`;
            card.style.cursor = "url('https://sweezy-cursors.com/wp-content/uploads/cursor/world-of-warcraft-frostmourne-pixel/world-of-warcraft-frostmourne-pixel-pointer-32x32.png'), pointer";

            card.innerHTML = `
                <img src="${item.image || 'static/images/placeholder.png'}" alt="${item.name}" class="w-16 h-16 rounded-lg">
                <div class="flex-grow">
                    <h3 class="text-lg font-bold text-white">${item.name}</h3>
                    <p class="text-sm text-gray-400">${item.description || "Sin descripción disponible"}</p>
                </div>
            `;

            card.addEventListener("click", () => {
                showItemDetails(item);
            });

            searchResults.appendChild(card);
            setTimeout(() => {
                card.classList.remove("opacity-0", "translate-y-4");
            }, 100);
        });

        showResults();
    }

    function formatStatsData(statsData) {
        return statsData && Array.isArray(statsData) ? statsData.map(stat => `${stat.name} - ${stat.amount}`).join("<br>") : "N/A";
    }

    function showItemDetails(item) {
        let additionalInfo = "";
        if (item.type === "weapons" && item.attack) {
            additionalInfo = `<p><strong>Ataque:</strong><br> ${formatStatsData(item.attack)}</p>`;
        } else if (item.type === "armors" && item.dmgNegation && item.resistance) {
            additionalInfo = `<p><strong>Negación de Daño:</strong><br> ${formatStatsData(item.dmgNegation)}</p>
                              <p><strong>Inmunidades:</strong><br> ${formatStatsData(item.resistance)}</p>`;
        } else if (item.type === "talismans") {
            additionalInfo = `<p><strong>Efecto:</strong> ${item.effect || "N/A"}</p>`;
        } else if (item.type === "shields" && item.defence) {
            additionalInfo = `<p><strong>Defensa:</strong><br> ${formatStatsData(item.defence)}</p>`;
        }

        const modal = document.createElement("div");
        modal.className = "fixed inset-0 flex items-center justify-center bg-black/80 z-50";
        modal.innerHTML = `
            <div class="bg-gray-900 p-6 rounded-lg w-96 text-white shadow-lg">
                <h2 class="text-xl font-bold mb-2">${item.name}</h2>
                <img src="${item.image || 'static/images/placeholder.png'}" alt="${item.name}" class="w-full h-40 object-contain mb-4">
                <p>${item.description || "Sin descripción disponible"}</p>
                ${additionalInfo}
                <button class="mt-4 px-4 py-2 bg-red-600 rounded-lg hover:bg-red-700" onclick="this.parentElement.parentElement.remove()" style="style="cursor: url('https://sweezy-cursors.com/wp-content/uploads/cursor/world-of-warcraft-frostmourne-pixel/world-of-warcraft-frostmourne-pixel-pointer-32x32.png'), pointer !important;">Cerrar</button>
            </div>
        `;
        document.body.appendChild(modal);
    }

    function showResults() {
        searchResults.classList.remove("hidden", "opacity-0", "scale-95");
        searchResults.classList.add("opacity-100", "scale-100");
    }

    function hideResults() {
        searchResults.classList.add("opacity-0", "scale-95");
        setTimeout(() => {
            searchResults.classList.add("hidden");
        }, 200);
    }

    searchInput.addEventListener("input", searchItems);
    filterSelect.addEventListener("change", searchItems);

    window.resetSearch = function () {
        searchInput.value = "";
        filterSelect.value = "";
        searchResults.innerHTML = "";
        hideResults();
    };
});

// Redirige a la página de inicio o base
function redirectToBase() {
    window.location.href = "/dashboard";  // Cambia "/" por la URL de la página principal si es diferente
}

// Redirige a la página de personajes o cuenta de usuario
function redirectToCharacters() {
    window.location.href = "/characters";  // Cambia "/characters" por la URL correcta de tu página de personajes o perfil
}
