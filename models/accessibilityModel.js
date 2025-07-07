module.exports = {
  getAccessibilityByUserId: (userId) => `
    SELECT * FROM AccessibilitySettings WHERE userId = ${userId};
  `,
  saveOrUpdateAccessibility: (userId, fontSize, contrastLevel, voiceAssist) => `
    MERGE AccessibilitySettings AS target
    USING (SELECT ${userId} AS userId) AS source
    ON target.userId = source.userId
    WHEN MATCHED THEN
      UPDATE SET fontSize = '${fontSize}', contrastLevel = ${contrastLevel}, voiceAssist = ${voiceAssist}
    WHEN NOT MATCHED THEN
      INSERT (userId, fontSize, contrastLevel, voiceAssist)
      VALUES (${userId}, '${fontSize}', ${contrastLevel}, ${voiceAssist});
  `
};
