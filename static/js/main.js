const API_ARMAS_PAGES = [
    "https://eldenring.fanapis.com/api/weapons?limit=200&page=0",
    "https://eldenring.fanapis.com/api/weapons?limit=200&page=1",
    "https://eldenring.fanapis.com/api/weapons?limit=200&page=2",
    "https://eldenring.fanapis.com/api/weapons?limit=200&page=3"
];
const API_ARMADURAS_PAGES = [
    "https://eldenring.fanapis.com/api/armors?limit=200&page=0",
    "https://eldenring.fanapis.com/api/armors?limit=200&page=1",
    "https://eldenring.fanapis.com/api/armors?limit=200&page=2",
    "https://eldenring.fanapis.com/api/armors?limit=200&page=3",
    "https://eldenring.fanapis.com/api/armors?limit=200&page=4",
    "https://eldenring.fanapis.com/api/armors?limit=200&page=5"
];
const API_AMULETOS = "https://eldenring.fanapis.com/api/talismans?limit=500";
const API_ESCUDO = "https://eldenring.fanapis.com/api/shields?limit=100";

const apiEndpoints = {
    weapon1: API_ARMAS_PAGES,
    weapon2: API_ARMAS_PAGES,
    helmet: API_ARMADURAS_PAGES,
    chest: API_ARMADURAS_PAGES,
    gloves: API_ARMADURAS_PAGES,
    legs: API_ARMADURAS_PAGES,
    amulet: API_AMULETOS,
    shield: API_ESCUDO
};

document.addEventListener("DOMContentLoaded", () => {
    Object.keys(apiEndpoints).forEach(slot => {
        document.getElementById(slot).addEventListener("click", () => loadItems(slot));
    });
});

async function loadItems(slot) {
    try {
        let allData = [];
        if (Array.isArray(apiEndpoints[slot])) {
            for (const url of apiEndpoints[slot]) {
                const response = await fetch(url);
                const data = await response.json();
                allData = allData.concat(data.data);
            }
        } else {
            const response = await fetch(apiEndpoints[slot]);
            const data = await response.json();
            allData = data.data;
        }

        let filteredItems = allData;
        if (slot === 'helmet') {
            filteredItems = filteredItems.filter(item => item.category === 'Helm');
        } else if (slot === 'chest') {
            filteredItems = filteredItems.filter(item => item.category === 'Chest Armor');
        } else if (slot === 'gloves') {
            filteredItems = filteredItems.filter(item => item.category === 'Gauntlets');
        } else if (slot === 'legs') {
            filteredItems = filteredItems.filter(item => item.category === 'Leg Armor');
        }

        showSelectionScreen(filteredItems, slot);
    } catch (error) {
        console.error("Error loading items:", error);
        alert("Error al cargar los elementos. Intenta nuevamente.");
    }
}

function showSelectionScreen(items, slot) {
    const overlay = document.createElement("div");
    overlay.id = "selectionOverlay"; // Asignar un ID único al modal
    overlay.className = "fixed top-0 left-0 w-full h-full bg-black bg-opacity-80 flex justify-center items-center z-[9999]";
    overlay.innerHTML = `
        <div class='bg-gray-800 p-6 rounded-lg shadow-xl max-w-4xl w-full h-4/5 relative overflow-hidden'>
            <div class='flex justify-between items-center mb-4'>
                <input type='text' id='searchBox' placeholder='Buscar...' 
                    class='w-4/5 p-2 rounded bg-gray-900 text-white border border-gray-700' 
                    oninput='filterItems()'>
                <button class='text-white text-2xl font-bold ml-4' onclick='closeSelection()'>✖</button>
            </div>
            <h2 class='text-2xl text-white mb-4 font-bold text-center'>Selecciona un ${slot}</h2>
            <div id='itemsContainer' class='grid grid-cols-2 md:grid-cols-3 gap-4 overflow-y-auto h-[calc(100%-120px)] px-2'>
                ${items.map(item => `
                    <div class='bg-[rgba(47,47,36,0.9)] p-4 rounded-lg text-white text-center shadow-lg item-card border border-gray-600 hover:border-[#d0c177]' 
                         data-name='${item.name}' data-image='${item.image}'>
                        <img src='${item.image}' alt='${item.name}' class='w-24 h-24 mx-auto rounded-full mb-2 border border-gray-500' 
                            onerror="this.src='https://via.placeholder.com/150?text=No+Image';">
                        <h3 class='text-lg font-bold'>${item.name}</h3>
                        <button class='mt-2 bg-[#3c3c2d] hover:bg-[#444033] text-[#e2dda5] py-1 px-3 rounded select-btn'>Seleccionar</button>
                    </div>
                `).join('')}
            </div>
        </div>
    `;
    document.body.appendChild(overlay);

    document.querySelectorAll(".select-btn").forEach(btn => {
        btn.addEventListener("click", (e) => {
            const itemCard = e.target.closest(".item-card");
            const itemName = itemCard.dataset.name;
            const itemImage = itemCard.dataset.image;

            saveSelection(slot, itemName, itemImage);
            closeSelection(); // Cierra solo el modal
        });
    });
}


function filterItems() {
    const searchText = document.getElementById('searchBox').value.toLowerCase();
    document.querySelectorAll('.item-card').forEach(card => {
        const itemName = card.querySelector('h3').innerText.toLowerCase();
        card.style.display = itemName.includes(searchText) ? "block" : "none";
    });
}

function closeSelection() {
    const overlay = document.getElementById("selectionOverlay");
    if (overlay) {
        overlay.remove();
    }
}


async function saveSelection(slot, itemName, itemImage) {
    const element = document.getElementById(slot);
    element.innerHTML = `<img src='${itemImage}' alt='${itemName}' class='w-full h-full object-contain rounded-md'>`;
}

async function saveCharacter() {
    const slots = ["weapon1", "helmet", "weapon2", "chest", "shield", "gloves", "amulet", "legs"];
    const selection = {};

    slots.forEach(slot => {
        const element = document.getElementById(slot);
        if (element && element.innerHTML.includes("img")) {
            const img = element.querySelector("img");
            const itemName = img.alt;
            const itemImage = img.src;  // Guardamos la URL de la imagen
            selection[slot] = { itemName, itemImage };
        } else {
            selection[slot] = null;
        }
    });

    const name = prompt("Ingresa un nombre para tu personaje:");
    if (!name) {
        alert("Debes ingresar un nombre para guardar el personaje.");
        return;
    }

    selection.name = name;

    try {
        const response = await fetch("/save_character", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(selection)
        });

        const result = await response.json();
        if (response.ok && result.success) {
            alert("Personaje guardado exitosamente.");
        } else {
            alert("Error al guardar el personaje: ${result.message}");
        }
    } catch (error) {
        console.error("Error al guardar el personaje:", error);
        alert("Error de conexión al guardar.");
    }
}