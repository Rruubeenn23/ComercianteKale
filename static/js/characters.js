document.addEventListener("DOMContentLoaded", () => {
    fetchCharacters();
});

async function fetchCharacters() {
    try {
        const response = await fetch("/api/characters");
        if (!response.ok) throw new Error("Failed to fetch characters");

        const characters = await response.json();
        const container = document.getElementById("characters-container");

        // Limpia el contenedor
        container.innerHTML = "";

        // Renderiza los personajes
        characters.forEach(character => {
            const card = document.createElement("div");
            card.className = "character-card";
            card.innerHTML = `
                <img src="${character.photo}" alt="${character.name}" class="character-photo">
                <h3>${character.name}</h3>
            `;
            card.addEventListener("click", () => showCharacterDetails(character));
            container.appendChild(card);
        });
    } catch (error) {
        console.error("Error fetching characters:", error);
        const container = document.getElementById("characters-container");
        container.innerHTML = "<p>Error cargando personajes. Inténtalo más tarde.</p>";
    }
}


function showCharacterDetails(character) {
    alert(`
        Nombre: ${character.name}
        Weapon 1: ${character.Weapon1 || "N/A"}
        Weapon 2: ${character.Weapon2 || "N/A"}
        Shield: ${character.Shield || "N/A"}
        Talisman: ${character.Talisman || "N/A"}
        Helmet: ${character.Helmet || "N/A"}
        Chest: ${character.Chest || "N/A"}
        Gauntlets: ${character.Gauntlets || "N/A"}
        Legs: ${character.Legs || "N/A"}
    `);
}

async function fetchItemImage(itemName, itemType) {
    let apiUrl;
    let filteredItems = [];

    // Determinar el endpoint adecuado según el tipo de equipo
    switch (itemType) {
        case 'weapon':
            apiUrl = `https://eldenring.fanapis.com/api/weapons?name=${encodeURIComponent(itemName)}`;
            break;
        case 'helmet':
            apiUrl = `https://eldenring.fanapis.com/api/armors?name=${encodeURIComponent(itemName)}`;
            // Filtrar por categoría de casco
            filteredItems = allData.filter(item => item.category === 'Helm');
            break;
        case 'chest':
            apiUrl = `https://eldenring.fanapis.com/api/armors?name=${encodeURIComponent(itemName)}`;
            // Filtrar por categoría de armadura de pecho
            filteredItems = allData.filter(item => item.category === 'Chest Armor');
            break;
        case 'gloves':
            apiUrl = `https://eldenring.fanapis.com/api/armors?name=${encodeURIComponent(itemName)}`;
            // Filtrar por categoría de guantes
            filteredItems = allData.filter(item => item.category === 'Gauntlets');
            break;
        case 'legs':
            apiUrl = `https://eldenring.fanapis.com/api/armors?name=${encodeURIComponent(itemName)}`;
            // Filtrar por categoría de armadura de piernas
            filteredItems = allData.filter(item => item.category === 'Leg Armor');
            break;
        case 'amulet':
            apiUrl = `https://eldenring.fanapis.com/api/talismans?name=${encodeURIComponent(itemName)}`;
            break;
        case 'shield':
            apiUrl = `https://eldenring.fanapis.com/api/shields?name=${encodeURIComponent(itemName)}`;
            break;
        default:
            return null;
    }

    // Si se aplica un filtrado, retornar los primeros elementos filtrados en lugar de hacer una nueva petición
    if (filteredItems.length > 0) {
        console.log("Filtrado de elementos:", filteredItems);
        return filteredItems[0].image || 'default-image.jpg'; // Si existe imagen, retornarla
    }

    try {
        const response = await fetch(apiUrl);
        if (!response.ok) throw new Error(`Failed to fetch image for ${itemName}`);

        const data = await response.json();
        // Asegurarse de que haya datos en la respuesta
        if (data.length > 0) {
            return data[0].image; // Obtener la URL de la imagen del primer resultado
        } else {
            console.warn(`No image found for ${itemName}`);
            return 'default-image.jpg'; // Imagen predeterminada si no se encuentra
        }
    } catch (error) {
        console.error(error);
        return 'default-image.jpg'; // Imagen predeterminada en caso de error
    }
}


async function showCharacterDetails(character) {
    try {
        // Verificar si los datos del personaje existen
        if (!character || typeof character !== "object") {
            throw new Error("Datos del personaje no válidos");
        }

        // Generar el HTML para los detalles con el diseño deseado
        const detailsHTML = `
            <main class="flex flex-1 flex-col items-center justify-center p-4 mt-20 sm:mt-24 md:mt-28 h-auto">
                <div class="flex flex-col items-center bg-[#191914e6] p-4 rounded-lg border-4 border-[#3c3c2d] shadow-2xl max-w-lg w-full">
                    
                    <!-- Nombre y foto del personaje -->
                    <h2 class="text-2xl font-bold text-white text-center">${character.name}</h2>
                    <img src="${character.photo || 'default-image.jpg'}" alt="${character.name}" class="mt-2 w-24 h-24 object-cover rounded-full border-4 border-[#3c3c2d]">

                    <!-- Contenedor de equipo ajustado -->
                    <div class="flex justify-center mt-4">
                        <div id="equipmentGrid" class="grid grid-cols-2 gap-2 bg-[#191914e6] p-3 rounded-lg border-2 border-[#3c3c2d] shadow-lg w-fit">
                            <!-- Weapon 1 -->
                            <div class="slot flex justify-center items-center bg-[#2f2f24] rounded-md p-2 w-16 h-16 border border-[#444033]">
                                <img src="${character.Weapon1Image || 'default-image.jpg'}" alt="Weapon 1" class="w-12 h-12 object-contain rounded-md">
                            </div>
                            <!-- Helmet -->
                            <div class="slot flex justify-center items-center bg-[#2f2f24] rounded-md p-2 w-16 h-16 border border-[#444033]">
                                <img src="${character.HelmetImage || 'default-image.jpg'}" alt="Helmet" class="w-12 h-12 object-contain rounded-md">
                            </div>
                            <!-- Weapon 2 -->
                            <div class="slot flex justify-center items-center bg-[#2f2f24] rounded-md p-2 w-16 h-16 border border-[#444033]">
                                <img src="${character.Weapon2Image || 'default-image.jpg'}" alt="Weapon 2" class="w-12 h-12 object-contain rounded-md">
                            </div>
                            <!-- Chest -->
                            <div class="slot flex justify-center items-center bg-[#2f2f24] rounded-md p-2 w-16 h-16 border border-[#444033]">
                                <img src="${character.ChestImage || 'default-image.jpg'}" alt="Chest" class="w-12 h-12 object-contain rounded-md">
                            </div>
                            <!-- Shield -->
                            <div class="slot flex justify-center items-center bg-[#2f2f24] rounded-md p-2 w-16 h-16 border border-[#444033]">
                                <img src="${character.ShieldImage || 'default-image.jpg'}" alt="Shield" class="w-12 h-12 object-contain rounded-md">
                            </div>
                            <!-- Gauntlets -->
                            <div class="slot flex justify-center items-center bg-[#2f2f24] rounded-md p-2 w-16 h-16 border border-[#444033]">
                                <img src="${character.GauntletsImage || 'default-image.jpg'}" alt="Gauntlets" class="w-12 h-12 object-contain rounded-md">
                            </div>
                            <!-- Talisman -->
                            <div class="slot flex justify-center items-center bg-[#2f2f24] rounded-md p-2 w-16 h-16 border border-[#444033]">
                                <img src="${character.TalismanImage || 'default-image.jpg'}" alt="Talisman" class="w-12 h-12 object-contain rounded-md">
                            </div>
                            <!-- Legs -->
                            <div class="slot flex justify-center items-center bg-[#2f2f24] rounded-md p-2 w-16 h-16 border border-[#444033]">
                                <img src="${character.LegsImage || 'default-image.jpg'}" alt="Legs" class="w-12 h-12 object-contain rounded-md">
                            </div>
                        </div>
                    </div>

                </div>
            </main>
        `;

        // Insertar los detalles en el modal
        const modalContent = document.getElementById('modal-character-details');
        modalContent.innerHTML = detailsHTML;

        // Mostrar el modal
        document.getElementById('character-modal').classList.remove('hidden');
    } catch (error) {
        console.error("Error mostrando detalles del personaje:", error);
        alert("Hubo un problema mostrando los detalles del personaje. Revisa la consola para más detalles.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    // Escucha eventos de clic en las tarjetas
    document.querySelectorAll('.character-card').forEach(card => {
        card.addEventListener('click', event => {
            // Obtén los datos del atributo data-character
            const characterData = card.getAttribute('data-character');
            try {
                const character = JSON.parse(characterData); // Parsear el JSON string a un objeto
                showCharacterDetails(character); // Mostrar los detalles usando tu función existente
            } catch (error) {
                console.error("Error parsing character data:", error);
                alert("Hubo un problema con los datos del personaje.");
            }
        });
    });
});

function closeModal() {
    document.getElementById('character-modal').classList.add('hidden');
}
