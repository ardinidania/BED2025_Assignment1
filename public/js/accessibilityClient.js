const BASE_URL = 'http://localhost:3000/accessibility';
const userId = parseInt(localStorage.getItem('userId'));
const userName = localStorage.getItem('userName') || 'User';

document.addEventListener('DOMContentLoaded', () => {
  const nameEl = document.getElementById('userNameDisplay');
  const saveBtn = document.getElementById('saveBtn');
  const fontSizeInput = document.getElementById('fontSize');
  const contrastInput = document.getElementById('contrastLevel');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const statusEl = document.getElementById('statusMessage');

  // Display user name
  if (nameEl) nameEl.textContent = userName;

  // === Load settings from backend ===
  async function loadSettings() {
    try {
      const res = await fetch(`${BASE_URL}/accessibility-settings/${userId}`);
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
      updateStatus('Unable to load settings for ' + userName, 'red');
    }
  }

  // === Save settings to backend and localStorage ===
  saveBtn?.addEventListener('click', async () => {
    const payload = {
      userId,
      fontSize: fontSizeInput?.value,
      contrastLevel: parseInt(contrastInput?.value),
      darkMode: darkModeToggle?.checked || false
    };

    try {
      const res = await fetch(`${BASE_URL}/accessibility-settings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      const result = await res.json();
      if (!res.ok) {
        return updateStatus(result.error || 'Something went wrong.', 'red');
      }

      // ✅ Save to localStorage for consistency across pages
      localStorage.setItem('fontSizePreference', payload.fontSize);
      localStorage.setItem('contrastLevel', payload.contrastLevel);
      localStorage.setItem('darkMode', payload.darkMode);

      updateStatus(result.message || 'Settings saved successfully!', 'green');
    } catch (err) {
      console.error('Save failed:', err);
      updateStatus('Failed to save settings. Check your network.', 'red');
    }
  });

  // === Event listeners for real-time preview ===
  fontSizeInput?.addEventListener('change', (e) => {
    applyFontSize(e.target.value);
  });

  contrastInput?.addEventListener('input', (e) => {
    applyContrast(e.target.value);
  });

  darkModeToggle?.addEventListener('change', (e) => {
    toggleDarkMode(e.target.checked);
  });

  // === Apply individual settings ===
  function applyFontSize(size) {
    const root = document.documentElement;
    const fontSizeMap = {
      small: '20px',
      medium: '26px',
      large: '32px'
    };
    const appliedSize = fontSizeMap[size] || fontSizeMap.small;
    root.style.setProperty('--base-font-size', appliedSize);

    // Save to localStorage
    localStorage.setItem('fontSizePreference', size);
  }

  function applyContrast(level) {
    const ratio = parseInt(level) / 50; // 50 = normal
    document.body.style.filter = `contrast(${ratio})`;

    // Save to localStorage
    localStorage.setItem('contrastLevel', level);
  }

  function toggleDarkMode(enabled) {
    document.body.classList.toggle('dark-mode', enabled);

    // Save to localStorage
    localStorage.setItem('darkMode', enabled);
  }

  function updateStatus(message, color) {
    statusEl.textContent = message;
    statusEl.style.color = color;
  }

  // Load settings on page ready
  loadSettings();
});
