document.addEventListener('DOMContentLoaded', () => {
  const fontSize = localStorage.getItem('fontSize');
  const contrastLevel = localStorage.getItem('contrastLevel');
  const darkMode = localStorage.getItem('darkMode') === 'true';

  // Set base font size directly on the body
  if (fontSize) {
    const sizeMap = {
      small: '14px',
      medium: '18px',
      large: '22px'
    };
    document.body.style.fontSize = sizeMap[fontSize] || '18px';
  }

  // Apply contrast
  if (contrastLevel) {
    const ratio = parseInt(contrastLevel) / 50;
    document.body.style.filter = `contrast(${ratio})`;
  }

  // Apply dark mode
  document.body.classList.toggle('dark-mode', darkMode);
});
