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

  const mapFrame = document.createElement('iframe');
  mapFrame.src = `https://www.google.com/maps?q=${encodeURIComponent(clinic.address)}&output=embed`;
  mapFrame.width = "100%";
  mapFrame.height = "100%";
  mapFrame.style.border = "0";
  mapFrame.allowFullscreen = "";
  mapFrame.loading = "lazy";
  document.getElementById('clinic-map').appendChild(mapFrame);

  document.getElementById('startRouteBtn').addEventListener('click', () => {
    localStorage.setItem('selectedClinicId', clinic.clinic_id);
    window.location.href = 'directions.html';
  });

  const saveBtn = document.querySelector('.save-btn');
  saveBtn.addEventListener('click', () => {
    const token = localStorage.getItem("token");

    // Check duplicates before calling POST
    fetch("/saved-places", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    })
      .then(res => res.json())
      .then(data => {
        const alreadySaved = data.some(place => place.label === clinic.name);

        if (alreadySaved) {
          alert("You already saved this place.");
        } else {
          fetch('/saved-places', {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
              Authorization: `Bearer ${token}`
            },
            body: JSON.stringify({
              label: clinic.name,
              address: clinic.address,
              phone: clinic.phone
            })
          })
            .then(res => {
              if (res.status === 409) {
                alert("This place is already saved.");
              } else {
                return res.json();
              }
            })
            .then(data => {
              if (data?.message) alert(data.message);
            })
            .catch(err => console.error("Error saving place:", err));
        }
      });
  });
});





