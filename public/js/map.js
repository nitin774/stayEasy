document.addEventListener("DOMContentLoaded", () => {
  const mapDiv = document.getElementById("map");
  if (!mapDiv) return; // prevent error if map is missing

  const listing = JSON.parse(mapDiv.dataset.listing);
  const title = mapDiv.dataset.title;

  const [lng, lat] = listing.geometry.coordinates;

  const map = L.map("map").setView([lat, lng], 12);

  L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
    attribution: '&copy; OpenStreetMap contributors',
  }).addTo(map);

  L.marker([lat, lng])
    .addTo(map)
    .bindPopup(`<h5>${listing.title}</h5><p>Exact Location that will provide after booking</p>`)
    .openPopup();
});