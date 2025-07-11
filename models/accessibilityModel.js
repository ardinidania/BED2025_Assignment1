// Parameterized SQL query for MERGE (UPSERT)
exports.mergeAccessibilitySettingsQuery = `
MERGE AccessibilitySettings AS target
USING (SELECT @userId AS userId) AS source
ON target.userId = source.userId
WHEN MATCHED THEN
  UPDATE SET 
    fontSize = @fontSize, 
    contrastLevel = @contrastLevel,
    darkMode = @darkMode
WHEN NOT MATCHED THEN
  INSERT (userId, fontSize, contrastLevel, darkMode)
  VALUES (@userId, @fontSize, @contrastLevel, @darkMode);
`;

// Parameterized SQL query for retrieving settings by userId
exports.getAccessibilityByUserIdQuery = `
SELECT * FROM AccessibilitySettings WHERE userId = @userId
`;
