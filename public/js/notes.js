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

  console.log("addNoteForm",addNoteForm)
  console.log("e", e)
  const formData = new FormData(addNoteForm);
  //formData.append('userId', userId); // add userId if needed by backend
  console.log("formData", formData);

  //const title = e.target.elements['title'].value;
  //formData.append('title', title); // optional if it's not already in FormData

  const token = localStorage.getItem("token");
  try {
    const res = await fetch(`/notes`, {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${token}`
      },
      body: formData, // multipart/form-data will be automatically set
    });

    if (!res.ok) {
      // Try to extract and log error response from server
      const errorText = await res.json(); // or res.json() if server sends JSON
      console.error('Server responded with error:', errorText);
      return;
    }

    //if (!res.ok) throw new Error('Failed to add note');

    addNoteModal.style.display = 'none';
    addNoteForm.reset();
    //loadNotes();
  } catch (err) {
    alert(err.message);
  }
});
