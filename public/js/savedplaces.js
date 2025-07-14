let savedplaces = [];

function fetchSavedplaces() {
  const token = localStorage.getItem("token");

  fetch("/saved-places", {
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(data => {
      savedplaces = data;
      renderSavedplaces();
    })
    .catch(err => console.error("Error fetching saved places:", err));
}

function renderSavedplaces() {
  const list = document.getElementById("saved-places-container");
  list.innerHTML = "";

  if (savedplaces.length === 0) {
    document.getElementById("no-saved-message").style.display = "block";
  } else {
    document.getElementById("no-saved-message").style.display = "none";
  }

  savedplaces.forEach(place => {
    const card = document.createElement("div");
    card.className = "clinic-card"; // Match original clinic-card

    card.innerHTML = `
      <h3>${place.label}</h3>
      <p>${place.address}</p>
      <p>${place.phone || "No phone number"}</p>
      <button onclick="deleteSavedplaces(${place.id})">Delete</button>
    `;

    list.appendChild(card);
  });
}

function deleteSavedplaces(id) {
  const token = localStorage.getItem("token");

  fetch(`/saved-places/${id}`, {
    method: "DELETE",
    headers: {
      Authorization: `Bearer ${token}`
    }
  })
    .then(res => res.json())
    .then(() => fetchSavedplaces())
    .catch(err => console.error("Error deleting saved place:", err));
}

fetchSavedplaces();