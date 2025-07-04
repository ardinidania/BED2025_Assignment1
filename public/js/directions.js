const clinicId = localStorage.getItem("selectedClinicId");

fetch("http://localhost:3000/clinics")
  .then(res => res.json())
  .then(data => {
    const clinic = data.find(c => c.clinic_id == clinicId);
    if (!clinic) return alert("Clinic not found.");

    document.getElementById("clinic-name").innerText = clinic.name;
    document.getElementById("clinic-address").innerText = "Address: " + clinic.address;
    document.getElementById("clinic-phone").innerText = "Phone: " + clinic.phone;
    document.getElementById("clinic-hours").innerText = "Opening Hours: " + clinic.opening_hours;
    document.getElementById("map").innerHTML = `<iframe src="${clinic.map_embed}" allowfullscreen></iframe>`;

    fetch(`http://localhost:3000/directions/${clinicId}`)
      .then(res => res.json())
      .then(steps => {
        const stepsDiv = document.getElementById("steps");
        steps.forEach((step, i) => {
          const box = document.createElement("div");
          box.className = "step-box";
          box.innerHTML = `<strong>Step ${i + 1}:</strong> ${step.description} <br><em>${step.duration}</em>`;
          stepsDiv.appendChild(box);
        });
      });
  });

