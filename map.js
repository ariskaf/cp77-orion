  // Initialize map
  const map = L.map('map', {
    center: [0, 0], // Initial coords (we’ll use image overlay instead of real coords)
    zoom: 0,
    crs: L.CRS.Simple
  });

  // Map image (replace with your high-res Cyberpunk map)
  const mapBounds = [[0,0], [1000,1000]]; 
  const image = L.imageOverlay('media/icons/map.png', mapBounds).addTo(map);
  map.fitBounds(mapBounds);

  // Example quest markers
  const markers = [
    {coords:[200,300], title:"Dogtown Market", desc:"Main hub of Phantom Liberty."},
    {coords:[600,500], title:"Abandoned NUSA base", desc:"Speculated Orion teaser."},
    {coords:[732,481.5], title:"Regina Jones", desc:"KABUKI FIXER"}
  ];

  markers.forEach(m=>{
    L.marker(m.coords).addTo(map).bindPopup(`<strong>${m.title}</strong><br>${m.desc}`);
  });






  function openModal(text) {
    document.getElementById("modalText").innerText = text;
    document.getElementById("markerModal").style.display = "flex";
  }

  function closeModal() {
    document.getElementById("markerModal").style.display = "none";
  }