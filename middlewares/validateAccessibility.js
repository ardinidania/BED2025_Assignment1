module.exports = (req, res, next) => {
  let { userId, fontSize, contrastLevel, darkMode } = req.body;

  const allowedFonts = ['small', 'medium', 'large'];
  const parsedUserId = parseInt(userId);
  const parsedContrast = parseInt(contrastLevel);
  const font = fontSize?.toLowerCase();

  let normalizedDarkMode;
  if (darkMode === true || darkMode === 'true' || darkMode === 1 || darkMode === '1') {
    normalizedDarkMode = true;
  } else if (darkMode === false || darkMode === 'false' || darkMode === 0 || darkMode === '0') {
    normalizedDarkMode = false;
  } else {
    normalizedDarkMode = null;
  }

  if (isNaN(parsedUserId)) {
    return res.status(400).json({ error: 'Invalid userId – must be a number.' });
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

  req.body.userId = parsedUserId;
  req.body.fontSize = font;
  req.body.contrastLevel = parsedContrast;
  req.body.darkMode = normalizedDarkMode;

  next();
};
