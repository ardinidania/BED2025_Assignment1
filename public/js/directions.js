const clinicId = localStorage.getItem("selectedClinicId");

if (!clinicId) {
  alert("No clinic selected for directions.");
}

const backLink = document.getElementById("back-link");
if (backLink) backLink.href = `clinicDetails.html?clinic_id=${clinicId}`;

mapboxgl.accessToken = 'pk.eyJ1IjoiYXJkaW5pZGFuaWEiLCJhIjoiY21kN25uZ3cxMDZwajJvcTJ4bDBhMmx2eCJ9.-4sdKIS4PyG8mFFNsWjDUg';

let clinicCoordinates = null;
let clinic = null;

// Load clinic info and show static map
fetch("/clinics")
  .then(res => res.json())
  .then(clinics => {
    clinic = clinics.find(c => c.clinic_id == clinicId);
    if (!clinic) return alert("Clinic not found.");

    clinicCoordinates = [clinic.longitude, clinic.latitude];

    document.getElementById("clinic-name").innerText = clinic.name;
    document.getElementById("clinic-address").innerText = "Address: " + clinic.address;
    document.getElementById("clinic-phone").innerText = "Phone: " + clinic.phone;
    document.getElementById("clinic-hours").innerText = "Opening Hours: " + clinic.opening_hours;

    document.getElementById("map").innerHTML = `<iframe src="${clinic.map_embed}" width="100%" height="200" style="border:0;" allowfullscreen></iframe>`;

    showLiveDirections();
  })
  .catch(error => {
    console.error("Error loading clinic info:", error);
  });

function showLiveDirections() {
  if (!navigator.geolocation) {
    alert("Geolocation not supported on this browser.");
    return;
  }

  navigator.geolocation.getCurrentPosition(position => {
    const userCoords = [position.coords.longitude, position.coords.latitude];

    const map = new mapboxgl.Map({
      container: 'live-map',
      style: 'mapbox://styles/mapbox/streets-v11',
      center: userCoords,
      zoom: 13
    });

    const directions = new MapboxDirections({
      accessToken: mapboxgl.accessToken,
      unit: 'metric',
      profile: 'mapbox/walking', 
      controls: { inputs: false }
    });

    map.addControl(directions);

    directions.setOrigin(userCoords);
    directions.setDestination(clinicCoordinates);

  }, error => {
    console.error("Geolocation error:", error);
  });
}

// Load direction steps from backend
fetch(`/directions/${clinicId}`)
  .then(res => res.json())
  .then(steps => {
    const stepsDiv = document.getElementById("steps");
    stepsDiv.innerHTML = "";

    steps.forEach(step => {
      const box = document.createElement("div");
      box.className = "step-box";
      box.innerHTML = `<strong>Step ${step.step_number}:</strong> ${step.icon_path || ""} ${step.instruction}`;
      stepsDiv.appendChild(box);
    });
  })
  .catch(error => {
    console.error("Failed to fetch directions:", error);
  });


