
# Proyecto Elden Ring Bosses

Este proyecto es una aplicación web que muestra una lista de jefes legendarios de *Elden Ring*, obteniendo los datos de un servidor backend desarrollado con **Flask** (Python). Los jefes se presentan con información detallada como su nombre, ubicación, descripción, salud, y objetos que sueltan al derrotarlos. El frontend se encarga de renderizar los datos usando JavaScript, y se genera un gráfico que muestra la salud de los jefes.

## Descripción

La aplicación se divide en dos partes:

1. **Backend (Flask/Python)**: Un servidor que proporciona datos de los jefes de *Elden Ring* en formato JSON.
2. **Frontend (HTML/JavaScript)**: Interfaz web que obtiene los datos del servidor y los presenta de manera visual, permitiendo al usuario explorar los jefes y ver un gráfico con la salud de cada uno.

## Características

- **Backend**:
  - Se utiliza Flask para crear un servidor que sirve los datos de los jefes en formato JSON.
  - Permite consultar la lista de jefes mediante una solicitud HTTP GET a la ruta `/dlc`.
  
- **Frontend**:
  - Se utiliza HTML y JavaScript para mostrar los datos de los jefes.
  - Implementa una interfaz interactiva donde los jefes son presentados con su información (nombre, ubicación, descripción, salud, objetos).
  - Se genera un gráfico que muestra la salud de cada jefe usando JavaScript.

## Estructura del Proyecto

```
EldenRingBosses/
│
├──app.py                # Archivo de la aplicación Flask (Backend)
│
├── templates/
│   ├── base.html            # Página HTML del juego base (Frontend)
│   ├── dlc.html            # Página HTML del DLC (Frontend)
│
├── static/
│   ├── css
│   │    ├── base.css             # Estilos CSS para la interfaz de usuario del juego base
│   │    └── base.css             # Estilos CSS para la interfaz de usuario del DLC
│
│   ├── js
│   │   ├── main.js             # Archivo JavaScript que maneja la lógica del frontend del juego base
│   │   └── dlc.js             # Archivo JavaScript que maneja la lógica del frontend del DLC
│
│   ├── cursor
│    │   ├── cursor.cur        #Cursor personalizado
│
└── README.md                 # Este archivo
```

## Requisitos

### Backend (Python)
- Python 3.x
- Flask
- Flask-CORS

### Frontend
- Navegador web moderno (Chrome, Firefox, etc.)

## Instalación y Ejecución

### 1. Configuración del Backend (Flask)

#### Paso 1: Clonar el Repositorio

Clona este repositorio en tu máquina local.

```bash
git clone https://github.com/tu-usuario/EldenRingBosses.git
cd EldenRingBosses
```

#### Paso 2: Instalar dependencias

Dentro del directorio del proyecto, instala las dependencias de Python necesarias.

```bash
pip install -r backend/requirements.txt
```

Si no tienes un archivo `requirements.txt`, puedes instalar Flask y Flask-CORS manualmente:

```bash
pip install Flask Flask-CORS
```

#### Paso 3: Ejecutar el Backend

Para ejecutar el servidor Flask, navega a la carpeta del backend y ejecuta el siguiente comando:

```bash
python backend/app.py
```

El servidor se ejecutará por defecto en `http://127.0.0.1:5000/`.

### 2. Configuración del Frontend

#### Paso 1: Abrir la Página Web

Ve a la carpeta `frontend/` y abre el archivo `index.html` en tu navegador. El frontend se conectará automáticamente al backend Flask para obtener los datos de los jefes.

## Cómo Funciona

- Cuando el frontend se carga, se realiza una solicitud HTTP a `http://127.0.0.1:5000/dlc` para obtener los datos de los jefes desde el servidor.
- Los datos son devueltos como un archivo JSON, que contiene la información de los jefes (nombre, ubicación, descripción, etc.).
- El frontend procesa estos datos, los muestra de manera visual en la interfaz, y genera un gráfico con la salud de los jefes.

## Rutas del Servidor

- **GET `/dlc`**: Devuelve un JSON con los detalles de los jefes legendarios de *Elden Ring*.

Ejemplo de respuesta:

```json
[
  {
    "id": 1,
    "name": "Bestia divina León Danzante",
    "ubicacion": "Belurat, asentamiento de la torre",
    "region": "Belurat, asentamiento de la torre",
    "descripcion": "Divine Beast Dancing Lion is a Legend Boss...",
    "suelta": ["120.000 Runes", "Rememberance of the Dancing Lion", "Divine Beast Head"],
    "hp": 22571,
    "image": "https://eldenring.wiki.fextralife.com/file/Elden-Ring/divine_beast_dancing_lion_bosses_elden_ring_wiki_300px.jpg"
  },
  {
    "id": 2,
    "name": "Rellana, Caballera de la Luna Gemela",
    "ubicacion": "Castillo de Ensis",
    "region": "Castillo de Ensis",
    "descripcion": "Rellana, Twin Moon Knight is a Legend Boss...",
    "suelta": ["240.000 Runes", "Rememberance of the Twin Moon Knight"],
    "hp": 29723,
    "image": "https://eldenring.wiki.fextralife.com/file/Elden-Ring/rellana_twin_moon_knight2_300px.jpg"
  }
  // Más datos...
]
```

## Desarrollo Futuro

- **Añadir más jefes**: Ampliar la lista de jefes legendarios de *Elden Ring* en el backend.
- **Mejoras en el frontend**: Añadir funcionalidades interactivas como filtros, búsqueda por nombre, etc.
- **Mejoras en el gráfico**: Implementar gráficos más complejos para mostrar más estadísticas de los jefes.

## Contribuciones

Las contribuciones son bienvenidas. Si tienes ideas o mejoras, abre un issue o un pull request. 
