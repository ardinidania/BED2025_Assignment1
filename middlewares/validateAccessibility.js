module.exports = (req, res, next) => {
  const { userId, fontSize, contrastLevel, voiceAssist } = req.body;

  const allowedFonts = ['small', 'medium', 'large'];
  const parsedUserId = parseInt(userId);
  const parsedContrast = parseInt(contrastLevel);
  const normalizedVoice =
    voiceAssist === true || voiceAssist === 'true' || voiceAssist === 1 || voiceAssist === '1'
      ? 1
      : voiceAssist === false || voiceAssist === 'false' || voiceAssist === 0 || voiceAssist === '0'
      ? 0
      : null;

  if (isNaN(parsedUserId)) {
    return res.status(400).json({ error: 'Invalid userId – must be a number.' });
  }

  if (!allowedFonts.includes(fontSize)) {
    return res.status(400).json({ error: 'Invalid fontSize – must be small, medium, large, or x-large.' });
  }

  if (isNaN(parsedContrast) || parsedContrast < 0 || parsedContrast > 100) {
    return res.status(400).json({ error: 'Invalid contrastLevel – must be between 0 and 100.' });
  }

  if (normalizedVoice === null) {
    return res.status(400).json({ error: 'Invalid voiceAssist – must be true or false.' });
  }

  // Attach parsed values to req for controller use
  req.body.userId = parsedUserId;
  req.body.contrastLevel = parsedContrast;
  req.body.voiceAssist = normalizedVoice;

  next(); // validation passed, proceed to controller
};
