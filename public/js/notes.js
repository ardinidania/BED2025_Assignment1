const addBtn = document.getElementById('addBtn');
const addNoteModal = document.getElementById('addNoteModal');
const addNoteForm = document.getElementById('addNoteForm');
const cancelBtn = document.getElementById('cancelBtn');
const noteList = document.getElementById('noteList');

addBtn.addEventListener('click', () => {
  addNoteModal.style.display = 'block';
});

cancelBtn.addEventListener('click', () => {
  addNoteModal.style.display = 'none';
  addNoteForm.reset();
});

// Load all notes on page load
document.addEventListener("DOMContentLoaded", loadNotes);

async function loadNotes() {
  try {
    const res = await fetch(`/notes/${userId}`);
    if (!res.ok) throw new Error("Failed to fetch notes");
    const notes = await res.json();

    noteList.innerHTML = ""; // Clear current notes
    notes.forEach(note => renderNote(note));
  } catch (err) {
    console.error("Load Notes Error:", err);
  }
}

// Submit handler
addNoteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(addNoteForm);
  formData.append('userId', userId); // Required for backend

  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`/notes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) {
      const errorText = await res.json();
      console.error('Server responded with error:', errorText);
      return;
    }

    const newNote = await res.json(); // return the newly created note
    renderNote(newNote); // Add new note to the list

    addNoteModal.style.display = 'none';
    addNoteForm.reset();
  } catch (err) {
    alert("Add Note Error: " + err.message);
  }
});

// Helper to create note card
function renderNote(note) {
  const card = document.createElement('div');
  card.className = 'note-card';

  const infoDiv = document.createElement('div');
  const title = document.createElement('h2');
  title.textContent = note.title;

  const saved = document.createElement('small');
  saved.textContent = `Saved Name (according to user): ${note.savedName}`;

  const clinic = document.createElement('small');
  clinic.textContent = `Clinic Name: ${note.clinicName}`;

  infoDiv.appendChild(title);
  infoDiv.appendChild(saved);
  infoDiv.appendChild(clinic);

  const btn = document.createElement('button');
  btn.textContent = 'Edit Details';
  btn.onclick = () => {
    alert(`Editing note: ${note.title}`);
    // Implement editing popup/modal if needed
  };

  card.appendChild(infoDiv);
  card.appendChild(btn);

  noteList.appendChild(card);
}
