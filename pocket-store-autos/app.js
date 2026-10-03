const API_URL = "https://dummyjson.com/products/category/vehicle";

const catalog = document.getElementById("catalog");
const message = document.getElementById("message");
const reloadButton = document.getElementById("reload-button");
const connectionStatus = document.getElementById("connection-status");
const searchInput = document.getElementById("search");

let cars = [];

function updateConnectionStatus() {
  const online = navigator.onLine;
  connectionStatus.textContent = online ? "En línea" : "Sin conexión";
  connectionStatus.classList.toggle("online", online);
  connectionStatus.classList.toggle("offline", !online);
}

function formatPrice(price) {
  return new Intl.NumberFormat("es-MX", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0
  }).format(price);
}

function createCarCard(car) {
  const article = document.createElement("article");
  article.className = "card";

  const image = car.thumbnail || (car.images && car.images[0]) || "";
  const brand = car.brand || "Marca no especificada";

  article.innerHTML = `
    <div class="car-image-wrap">
      ${image ? `<img class="car-image" src="${image}" alt="${car.title}" loading="lazy">` : "🚘"}
    </div>
    <div class="card-body">
      <h3>${car.title}</h3>
      <p class="brand-name">${brand}</p>
      <p class="description">${car.description}</p>
      <div class="meta">
        <span class="price">${formatPrice(car.price)}</span>
        <span class="rating">★ ${car.rating}</span>
      </div>
    </div>
  `;

  return article;
}

function renderCars(list) {
  catalog.innerHTML = "";

  if (!list.length) {
    catalog.innerHTML = `<div class="empty"><h3>No se encontraron autos</h3><p>Prueba con otro término de búsqueda.</p></div>`;
    message.textContent = "0 vehículos encontrados";
    return;
  }

  list.forEach(car => catalog.appendChild(createCarCard(car)));
  message.textContent = `${list.length} vehículos disponibles`;
}

function filterCars() {
  const query = searchInput.value.trim().toLowerCase();
  const filtered = cars.filter(car =>
    car.title.toLowerCase().includes(query) ||
    (car.brand || "").toLowerCase().includes(query) ||
    car.description.toLowerCase().includes(query)
  );
  renderCars(filtered);
}

async function loadCars() {
  reloadButton.disabled = true;
  message.textContent = navigator.onLine ? "Consultando API de vehículos..." : "Cargando catálogo guardado...";

  try {
    const response = await fetch(API_URL);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);

    const data = await response.json();
    cars = data.products || [];
    filterCars();
  } catch (error) {
    console.error(error);
    catalog.innerHTML = `
      <div class="empty">
        <h3>No fue posible cargar el catálogo</h3>
        <p>Abre la aplicación una vez con Internet para guardar los vehículos y luego podrás consultarlos offline.</p>
      </div>`;
    message.textContent = "Catálogo no disponible";
  } finally {
    reloadButton.disabled = false;
  }
}

if ("serviceWorker" in navigator) {
  window.addEventListener("load", async () => {
    try {
      await navigator.serviceWorker.register("./sw.js");
      console.log("Service Worker registrado.");
    } catch (error) {
      console.error("No se pudo registrar el Service Worker:", error);
    }
  });
}

searchInput.addEventListener("input", filterCars);
reloadButton.addEventListener("click", loadCars);
window.addEventListener("online", () => { updateConnectionStatus(); loadCars(); });
window.addEventListener("offline", updateConnectionStatus);

updateConnectionStatus();
loadCars();
