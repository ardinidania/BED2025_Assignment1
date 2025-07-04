document.addEventListener('DOMContentLoaded', () => {
  fetch('/clinics')
    .then(response => response.json())
    .then(data => {
      data.forEach(clinic => {
        const regionContainer = document.getElementById(clinic.region);
        if (regionContainer) {
          const clinicBtn = document.createElement('div');
          clinicBtn.className = 'clinic-name';
          clinicBtn.textContent = clinic.name;

          clinicBtn.addEventListener('click', () => {
            sessionStorage.setItem('selectedClinic', JSON.stringify(clinic));
            window.location.href = 'clinicDetails.html';
          });

          regionContainer.appendChild(clinicBtn);
        }
      });
    })
    .catch(error => console.error('Error fetching clinics:', error));
});


