module.exports = (req, res, next) => {
  const { fontSize, contrastLevel, darkMode } = req.body;
  const userId = parseInt(req.userId);

  const allowedFonts = ['small', 'medium', 'large'];
  const font = fontSize?.toLowerCase();
  const parsedContrast = parseInt(contrastLevel);

  let normalizedDarkMode;
  if (darkMode === true || darkMode === 'true' || darkMode === 1 || darkMode === '1') {
    normalizedDarkMode = true;
  } else if (darkMode === false || darkMode === 'false' || darkMode === 0 || darkMode === '0') {
    normalizedDarkMode = false;
  } else {
    normalizedDarkMode = null;
  }

  if (!userId || isNaN(userId)) {
    return res.status(400).json({ error: 'Invalid user ID from token.' });
  }

  if (!allowedFonts.includes(font)) {
    return res.status(400).json({ error: 'Invalid fontSize – must be small, medium, or large.' });
  }

  if (isNaN(parsedContrast) || parsedContrast < 0 || parsedContrast > 100) {
    return res.status(400).json({ error: 'Invalid contrastLevel – must be between 0 and 100.' });
  }

  if (normalizedDarkMode === null) {
    return res.status(400).json({ error: 'Invalid darkMode – must be true or false.' });
  }

  req.body.fontSize = font;
  req.body.contrastLevel = parsedContrast;
  req.body.darkMode = normalizedDarkMode;

  next();
};

