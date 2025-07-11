document.addEventListener('DOMContentLoaded', () => {
  const savedPlaces = JSON.parse(localStorage.getItem('savedPlaces')) || [];
  const container = document.getElementById('saved-places-container');
  const noSavedMsg = document.getElementById('no-saved-message');

  // Clear the container first
  container.innerHTML = "";

  if (savedPlaces.length === 0) {
    noSavedMsg.style.display = 'block';
  } else {
    noSavedMsg.style.display = 'none';

    savedPlaces.forEach((place, index) => {
      const placeCard = document.createElement('div');
      placeCard.className = 'clinic-box';

      placeCard.innerHTML = `
        <h3>${place.name}</h3>
        <p><strong>Address:</strong> ${place.address}</p>
        <p><strong>Phone:</strong> ${place.phone}</p>
        <p><strong>Opening Hours:</strong> ${place.hours}</p>
        <button class="remove-btn" data-index="${index}">Remove</button>
      `;

      container.appendChild(placeCard);
    });

    // Attach event listeners for remove buttons
    document.querySelectorAll('.remove-btn').forEach(button => {
      button.addEventListener('click', (e) => {
        const indexToRemove = parseInt(e.target.getAttribute('data-index'), 10);
        savedPlaces.splice(indexToRemove, 1); // remove from array
        localStorage.setItem('savedPlaces', JSON.stringify(savedPlaces)); // update localStorage
        location.reload(); // refresh the page to reflect changes
      });
    });
  }
});

