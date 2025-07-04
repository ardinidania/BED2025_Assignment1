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
