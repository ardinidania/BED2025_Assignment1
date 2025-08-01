const BASE_URL = 'http://localhost:3000/accessibility';

document.addEventListener('DOMContentLoaded', () => {
  const saveBtn = document.getElementById('saveBtn');
  const fontSizeInput = document.getElementById('fontSize');
  const contrastInput = document.getElementById('contrastLevel');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const statusEl = document.getElementById('statusMessage');

  async function loadSettings() {
    try {
      const token = localStorage.getItem("token");
      const res = await fetch(`${BASE_URL}/accessibility-settings`, {  
        headers: {
          Authorization: `Bearer ${token}`
        }
      });

      if (!res.ok) throw new Error('Settings not found');
      const data = await res.json();

      if (data.fontSize) {
        fontSizeInput.value = data.fontSize;
        applyFontSize(data.fontSize);
      }

      if (!isNaN(data.contrastLevel)) {
        contrastInput.value = data.contrastLevel;
        applyContrast(data.contrastLevel);
      }

      if (darkModeToggle) {
        darkModeToggle.checked = data.darkMode === true || data.darkMode === 1;
        toggleDarkMode(darkModeToggle.checked);
      }

      updateStatus('', '');
    } catch (err) {
      console.error('Error loading settings:', err);
      updateStatus('Unable to load your settings.', 'red');
    }
  }

  saveBtn?.addEventListener('click', async () => {
    const token = localStorage.getItem("token");
    const payload = {
      fontSize: fontSizeInput?.value,
      contrastLevel: parseInt(contrastInput?.value),
      darkMode: darkModeToggle?.checked || false
    };

    try {
      const res = await fetch(`${BASE_URL}/accessibility-settings`, { 
        method: 'POST', 
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) {
        return updateStatus(result.error || 'Something went wrong.', 'red');
      }

      localStorage.setItem('fontSizePreference', payload.fontSize);
      localStorage.setItem('contrastLevel', payload.contrastLevel);
      localStorage.setItem('darkMode', payload.darkMode);

      updateStatus(result.message || 'Settings saved successfully!', 'green');
    } catch (err) {
      console.error('Save failed:', err);
      updateStatus('Failed to save settings. Check your network.', 'red');
    }
  });

  fontSizeInput?.addEventListener('change', (e) => {
    applyFontSize(e.target.value);
  });

  contrastInput?.addEventListener('input', (e) => {
    applyContrast(e.target.value);
  });

  darkModeToggle?.addEventListener('change', (e) => {
    toggleDarkMode(e.target.checked);
  });

  function applyFontSize(size) {
    const root = document.documentElement;
    const fontSizeMap = {
      small: '20px',
      medium: '26px',
      large: '32px'
    };
    const appliedSize = fontSizeMap[size] || fontSizeMap.small;
    root.style.setProperty('--base-font-size', appliedSize);
    localStorage.setItem('fontSizePreference', size);
  }

  function applyContrast(level) {
    const ratio = parseInt(level) / 50;
    document.body.style.filter = `contrast(${ratio})`;
    localStorage.setItem('contrastLevel', level);
  }

  function toggleDarkMode(enabled) {
    document.body.classList.toggle('dark-mode', enabled);
    localStorage.setItem('darkMode', enabled);
  }

  function updateStatus(message, color) {
    statusEl.textContent = message;
    statusEl.style.color = color;
  }

  loadSettings();
});
