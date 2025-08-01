document.addEventListener('DOMContentLoaded', () => {
  const fontSize = localStorage.getItem('fontSize');
  const contrastLevel = localStorage.getItem('contrastLevel');
  const darkMode = localStorage.getItem('darkMode') === 'true';

  if (fontSize) {
    const sizeMap = {
      small: '14px',
      medium: '18px',
      large: '22px'
    };
    document.body.style.fontSize = sizeMap[fontSize] || '18px';
  }

  if (contrastLevel) {
    const ratio = parseInt(contrastLevel) / 50;
    document.body.style.filter = `contrast(${ratio})`;
  }

  document.body.classList.toggle('dark-mode', darkMode);
});
