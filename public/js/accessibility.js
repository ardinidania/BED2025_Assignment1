document.addEventListener('DOMContentLoaded', () => {
  const root = document.documentElement;

  const savedFontSize = localStorage.getItem('fontSizePreference') || 'small';
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

  let savedContrast = parseInt(localStorage.getItem('contrastLevel'));
  if (isNaN(savedContrast)) savedContrast = 50; 

  applyContrast(savedContrast);

  function applyContrast(value) {
    document.body.classList.remove('contrast-normal', 'contrast-medium', 'contrast-high');
    if (value < 34) {
      document.body.classList.add('contrast-normal');
    } else if (value < 67) {
      document.body.classList.add('contrast-medium');
    } else {
      document.body.classList.add('contrast-high');
    }
  }

  const savedDarkMode = localStorage.getItem('darkMode') === 'true';
  if (savedDarkMode) {
    document.body.classList.add('dark-mode');
  }

  const saveBtn = document.getElementById('saveBtn');
  const fontSizeSelect = document.getElementById('fontSize');
  const contrastSlider = document.getElementById('contrastLevel');
  const darkModeToggle = document.getElementById('darkModeToggle');
  const statusMessage = document.getElementById('statusMessage');

  if (fontSizeSelect) fontSizeSelect.value = savedFontSize;
  if (contrastSlider) contrastSlider.value = savedContrast;
  if (darkModeToggle) darkModeToggle.checked = savedDarkMode;

  if (saveBtn) {
    saveBtn.addEventListener('click', () => {
      const selectedFontSize = fontSizeSelect.value;
      const selectedContrast = parseInt(contrastSlider.value);
      const isDarkMode = darkModeToggle.checked;

      if (!['small', 'medium', 'large'].includes(selectedFontSize) || isNaN(selectedContrast)) {
        statusMessage.textContent = 'Invalid input. Please try again.';
        return;
      }

      localStorage.setItem('fontSizePreference', selectedFontSize);
      localStorage.setItem('contrastLevel', selectedContrast);
      localStorage.setItem('darkMode', isDarkMode);

      statusMessage.textContent = 'Changes saved!';
    });
  }
});
