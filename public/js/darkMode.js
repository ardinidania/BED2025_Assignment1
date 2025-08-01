const BASE_URL = 'http://localhost:3000/accessibility';

window.addEventListener('load', async () => {
  const userId = localStorage.getItem('userId') || 1; 
  try {
    const res = await fetch(`${BASE_URL}/accessibility-settings/${userId}`);
    const data = await res.json();

    if (data.darkMode === true || data.darkMode === 1) {
      document.body.classList.add('dark-mode');
    }
  } catch (err) {
    console.error('Could not apply dark mode:', err);
  }
});
