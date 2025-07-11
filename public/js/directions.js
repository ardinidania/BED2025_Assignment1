const clinicId = localStorage.getItem("selectedClinicId");

if (!clinicId) {
  alert("No clinic selected for directions.");
}

// Set back arrow link to go back to clinic details
const backLink = document.getElementById("back-link");
if (backLink) backLink.href = `clinicDetails.html?clinic_id=${clinicId}`;

// Load clinic info
fetch("/clinics")
  .then(res => res.json())
  .then(clinics => {
    const clinic = clinics.find(c => c.clinic_id == clinicId);
    if (!clinic) return alert("Clinic not found.");

    document.getElementById("clinic-name").innerText = clinic.name;
    document.getElementById("clinic-address").innerText = "Address: " + clinic.address;
    document.getElementById("clinic-phone").innerText = "Phone: " + clinic.phone;
    document.getElementById("clinic-hours").innerText = "Opening Hours: " + clinic.opening_hours;
    document.getElementById("map").innerHTML = `<iframe src="${clinic.map_embed}" width="100%" height="200" style="border:0;" allowfullscreen></iframe>`;
  })
  .catch(error => {
    console.error("Error loading clinic info:", error);
  });

// Load direction steps from backend
fetch(`/directions/${clinicId}`)
  .then(res => res.json())
  .then(steps => {
    const stepsDiv = document.getElementById("steps");
    stepsDiv.innerHTML = "";

    steps.forEach(step => {
      const box = document.createElement("div");
      box.className = "step-box";
      box.innerHTML = `
        <strong>Step ${step.step_number}:</strong> ${step.icon_path || ""} ${step.instruction}
      `;
      stepsDiv.appendChild(box);
    });
  })
  .catch(error => {
    console.error("Failed to fetch directions:", error);
  });

