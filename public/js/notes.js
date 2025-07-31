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

// Load notes on page load
document.addEventListener("DOMContentLoaded", loadNotes);

async function loadNotes() {
  const token = localStorage.getItem("token");
  try {
    const res = await fetch("/notes", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });
    if (!res.ok) throw new Error("Failed to fetch notes");
    const notes = await res.json();

    noteList.innerHTML = ""; // Clear previous
    notes.forEach(note => renderNote(note));
  } catch (err) {
    console.error("Load Notes Error:", err);
  }
}

addNoteForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const formData = new FormData(addNoteForm);

  const token = localStorage.getItem("token");

  try {
    const res = await fetch("/notes", {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData
    });

    if (!res.ok) {
      const errorText = await res.json();
      console.error('Server error:', errorText);
      return;
    }

    const newNote = await res.json();
    renderNote(newNote);

    addNoteModal.style.display = 'none';
    addNoteForm.reset();
  } catch (err) {
    alert("Add Note Error: " + err.message);
  }
});

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

  // Buttons container
  const btnContainer = document.createElement('div');
  btnContainer.style.display = 'flex';
  btnContainer.style.gap = '10px';

  // View Button
  if (note.filePath) {
    const viewBtn = document.createElement('button');
    viewBtn.textContent = 'View File';
    viewBtn.onclick = () => {
      const ext = note.filePath.toLowerCase();
      if (ext.endsWith('.pdf')) {
        window.open(note.filePath, '_blank');
      } else if (ext.endsWith('.jpg') || ext.endsWith('.jpeg') || ext.endsWith('.png')) {
        const imgWindow = window.open('', '_blank');
        imgWindow.document.write(`<img src="${note.filePath}" alt="Health File" style="max-width:100%; margin:20px;" />`);
      } else {
        alert("Unsupported file type");
      }
    };
    btnContainer.appendChild(viewBtn);
  }

  // Edit Button (placeholder)
  const editBtn = document.createElement('button');
  editBtn.textContent = 'Edit Details';
  editBtn.onclick = () => {
    alert(`Editing note: ${note.title}`);
  };
  btnContainer.appendChild(editBtn);

  // Delete Button
  const deleteBtn = document.createElement('button');
  deleteBtn.textContent = 'Delete';
  deleteBtn.style.backgroundColor = '#b00020'; // Optional: red button
  deleteBtn.onclick = async () => {
    const confirmDelete = confirm(`Are you sure you want to delete "${note.title}"?`);
    if (!confirmDelete) return;

    const token = localStorage.getItem("token");
    try {
      const res = await fetch(`/notes/${note.noteId}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error("Failed to delete note");

      card.remove(); // Remove from DOM
    } catch (err) {
      alert("Delete Error: " + err.message);
    }
  };
  btnContainer.appendChild(deleteBtn);

  card.appendChild(infoDiv);
  card.appendChild(btnContainer);
  noteList.appendChild(card);
}
