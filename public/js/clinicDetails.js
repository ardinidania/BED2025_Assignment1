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

  // Start Route Now button: Store clinicId separately for directions
  document.getElementById('startRouteBtn').addEventListener('click', () => {
    localStorage.setItem('selectedClinicId', clinic.clinic_id);
    window.location.href = 'directions.html';
  });

  // Save Place button
  const saveBtn = document.querySelector('.save-btn');

  saveBtn.addEventListener('click', () => {
    const savedPlaces = JSON.parse(localStorage.getItem('savedPlaces')) || [];

    const isAlreadySaved = savedPlaces.some(place => place.name === clinic.name);
    if (isAlreadySaved) {
      alert('This place is already saved.');
      return;
    }

    const newClinic = {
      name: clinic.name,
      address: clinic.address,
      phone: clinic.phone,
      hours: clinic.opening_hours
    };

    savedPlaces.push(newClinic);
    localStorage.setItem('savedPlaces', JSON.stringify(savedPlaces));
    alert('Place saved successfully!');
  });
});





