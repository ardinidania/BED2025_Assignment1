document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token'); // or sessionStorage if you use that

  if (!token) return;

  try {
    const response = await fetch('http://localhost:3000/accessibility/accessibility-settings', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (!response.ok) throw new Error('Failed to fetch accessibility settings');

    const settings = await response.json();

    // Dark mode
    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    }

    // Font size
    if (settings.fontSize) {
      const fontSizeMap = {
  small: '20px',
  medium: '26px',
  large: '32px'
};
const appliedSize = fontSizeMap[settings.fontSize?.toLowerCase()] || '20px';
document.documentElement.style.setProperty('--base-font-size', appliedSize);
    }

    // Contrast (requires supporting CSS)
    if (settings.contrastLevel) {
      document.body.setAttribute('data-contrast', settings.contrastLevel);
    }

  } catch (err) {
    console.error('Accessibility fetch/apply error:', err.message);
  }
});
