module.exports = {
  getAccessibilityByUserId: (userId) => `
    SELECT * FROM AccessibilitySettings WHERE userId = ${userId};
  `,
  saveOrUpdateAccessibility: (userId, fontSize, highContrast, voiceAssist) => `
    MERGE AccessibilitySettings AS target
    USING (SELECT ${userId} AS userId) AS source
    ON target.userId = source.userId
    WHEN MATCHED THEN
      UPDATE SET fontSize = '${fontSize}', highContrast = ${highContrast}, voiceAssist = ${voiceAssist}
    WHEN NOT MATCHED THEN
      INSERT (userId, fontSize, highContrast, voiceAssist)
      VALUES (${userId}, '${fontSize}', ${highContrast}, ${voiceAssist});
  `
};
