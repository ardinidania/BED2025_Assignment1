document.addEventListener('DOMContentLoaded', async () => {
  const token = localStorage.getItem('token'); 

  if (!token) return;

  try {
    const response = await fetch('http://localhost:3000/accessibility/accessibility-settings', {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    });

    if (!response.ok) throw new Error('Failed to fetch accessibility settings');

    const settings = await response.json();

    if (settings.darkMode) {
      document.body.classList.add('dark-mode');
    }

    if (settings.fontSize) {
      const fontSizeMap = {
  small: '20px',
  medium: '26px',
  large: '32px'
};
const appliedSize = fontSizeMap[settings.fontSize?.toLowerCase()] || '20px';
document.documentElement.style.setProperty('--base-font-size', appliedSize);
    }

    if (settings.contrastLevel) {
      document.body.setAttribute('data-contrast', settings.contrastLevel);
    }

  } catch (err) {
    console.error('Accessibility fetch/apply error:', err.message);
  }
});
