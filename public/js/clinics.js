document.addEventListener('DOMContentLoaded', () => {
  fetch('/clinics')
    .then(response => response.json())
    .then(data => {
      data.forEach(clinic => {
        const regionContainer = document.getElementById(clinic.region);
        if (regionContainer) {
          const clinicCard = document.createElement('div');
          clinicCard.className = 'clinic-card';

          const clinicBtn = document.createElement('div');
          clinicBtn.className = 'clinic-name';
          clinicBtn.textContent = clinic.name;

          clinicBtn.addEventListener('click', () => {
            sessionStorage.setItem('selectedClinic', JSON.stringify(clinic));
            window.location.href = 'clinicDetails.html';
          });

          clinicCard.appendChild(clinicBtn);
          regionContainer.appendChild(clinicCard);
        }
      });
    })
    .catch(error => console.error('Error fetching clinics:', error));
});

function savePlace(placeName, address) {
  const elderlyName = localStorage.getItem("elderlyName");

  if (!elderlyName) {
    alert("Elderly name not found. Please log in again.");
    return;
  }

  fetch("/savedplaces", {
    method: "POST",
    headers: {
      "Content-Type": "application/json"
    },
    body: JSON.stringify({
      elderlyName: elderlyName,
      placeName: placeName,
      address: address || "No address provided"
    })
  })
    .then(res => res.json())
    .then(data => {
      alert("Place saved successfully!");
    })
    .catch(err => {
      console.error(err);
      alert("Error saving place.");
    });
}
