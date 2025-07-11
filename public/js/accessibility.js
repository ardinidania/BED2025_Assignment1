document.addEventListener('DOMContentLoaded', () => {
  // ✅ Font Size
  const savedFontSize = localStorage.getItem('fontSizePreference') || 'small';
  const root = document.documentElement;

  switch (savedFontSize) {
    case 'small':
      root.style.setProperty('--base-font-size', '20px');
      break;
    case 'medium':
      root.style.setProperty('--base-font-size', '26px');
      break;
    case 'large':
      root.style.setProperty('--base-font-size', '32px');
      break;
    default:
      root.style.setProperty('--base-font-size', '20px');
  }

  // ✅ Contrast Level
  const savedContrast = parseInt(localStorage.getItem('contrastLevel')) || 50; // default 50 = normal
  const contrastRatio = savedContrast / 50;
  document.body.style.filter = `contrast(${contrastRatio})`;

  // ✅ Dark Mode
  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  if (savedDarkMode) {
    document.body.classList.add('dark-mode');
  }
});
