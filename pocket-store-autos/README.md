# PocketStore Autos

PocketStore Autos es una PWA desarrollada con HTML, CSS y JavaScript puro. Consume la categoría `vehicle` de la API pública DummyJSON y almacena la información en caché para poder consultar el catálogo sin Internet.

## Funciones

- Catálogo dinámico de automóviles.
- Datos consumidos con `fetch()` desde una API pública.
- Buscador por nombre, marca o descripción.
- Diseño responsive.
- Service Worker con eventos `install`, `activate` y `fetch`.
- App Shell almacenado en caché.
- Datos de la API almacenados para modo offline.
- Caché de imágenes consultadas.
- Manifest para instalación como PWA.

## API utilizada

`https://dummyjson.com/products/category/vehicle`

## Estructura

```text
pocket-store-autos/
├── index.html
├── styles.css
├── app.js
├── sw.js
├── manifest.json
├── README.md
├── icons/
│   ├── icon-192.png
│   └── icon-512.png
└── images/
```


## Capturas sugeridas para `/images`

- `01-estructura-proyecto.png`
- `02-catalogo-autos.png`
- `03-api-vehiculos.png`
- `04-service-worker.png`
- `05-cache-storage.png`
- `06-modo-offline.png`
- `07-manifest.png`
