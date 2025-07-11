document.addEventListener('DOMContentLoaded', () => {
  const clinic = JSON.parse(sessionStorage.getItem('selectedClinic'));

  if (!clinic) {
    alert('No clinic selected.');
    window.location.href = 'clinics.html';
    return;
  }

  document.getElementById('clinic-name').textContent = clinic.name;
  document.getElementById('clinic-address').textContent = clinic.address;
  document.getElementById('clinic-phone').textContent = clinic.phone;
  document.getElementById('clinic-hours').textContent = clinic.opening_hours;

  // Google Map embed
  const mapFrame = document.createElement('iframe');
  mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(clinic.address)}&output=embed`;
  mapFrame.width = "100%";
  mapFrame.height = "100%";
  mapFrame.style.border = "0";
  mapFrame.allowFullscreen = "";
  mapFrame.loading = "lazy";
  document.getElementById('clinic-map').appendChild(mapFrame);

  // Start Route button
  document.getElementById('startRouteBtn').addEventListener('click', () => {
    sessionStorage.setItem('routeClinicName', clinic.name);
    window.location.href = 'directions.html';
  });
});


//===========================================================================================//
// For the Save Place
document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.querySelector('.save-btn');

  // Get clinic data from the DOM
  const clinicName = document.getElementById('clinic-name').textContent;
  const clinicAddress = document.getElementById('clinic-address').textContent;
  const clinicPhone = document.getElementById('clinic-phone').textContent;
  const clinicHours = document.getElementById('clinic-hours').textContent;

  saveBtn.addEventListener('click', () => {
    const savedPlaces = JSON.parse(localStorage.getItem('savedPlaces')) || [];

    // Check if it's already saved to avoid duplicates
    const isAlreadySaved = savedPlaces.some(place => place.name === clinicName);
    if (isAlreadySaved) {
      alert('This place is already saved.');
      return;
    }

    // Create clinic object
    const clinic = {
      name: clinicName,
      address: clinicAddress,
      phone: clinicPhone,
      hours: clinicHours
    };

    savedPlaces.push(clinic);
    localStorage.setItem('savedPlaces', JSON.stringify(savedPlaces));
    alert('Place saved successfully!');

    // OPTIONAL: redirect to savedplaces.html after saving
    // window.location.href = 'savedplaces.html';
  });
});
