// Existing MERGE query
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

// Existing SELECT
exports.getAccessibilityByUserIdQuery = `
SELECT * FROM AccessibilitySettings WHERE userId = @userId
`;

// ✅ NEW: Update only (used in PUT)
exports.updateAccessibilityQuery = `
UPDATE AccessibilitySettings
SET fontSize = @fontSize,
    contrastLevel = @contrastLevel,
    darkMode = @darkMode
WHERE userId = @userId
`;

// ✅ NEW: Delete
exports.deleteAccessibilityQuery = `
DELETE FROM AccessibilitySettings WHERE userId = @userId
`;
