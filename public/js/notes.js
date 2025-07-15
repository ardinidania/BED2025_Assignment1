const addBtn = document.getElementById('addBtn');
const addNoteModal = document.getElementById('addNoteModal');
const addNoteForm = document.getElementById('addNoteForm');
const cancelBtn = document.getElementById('cancelBtn');

addBtn.addEventListener('click', () => {
  addNoteModal.style.display = 'block';
});

cancelBtn.addEventListener('click', () => {
  addNoteModal.style.display = 'none';
  addNoteForm.reset();
});

addNoteForm.addEventListener('submit', async (e) => {
  e.preventDefault();

  const formData = new FormData(addNoteForm);
  formData.append('userId', userId); // add userId if needed by backend

  try {
    const res = await fetch(`/notes`, {
      method: 'POST',
      body: formData, // multipart/form-data will be automatically set
    });

    if (!res.ok) throw new Error('Failed to add note');

    addNoteModal.style.display = 'none';
    addNoteForm.reset();
    loadNotes();
  } catch (err) {
    alert(err.message);
  }
});
