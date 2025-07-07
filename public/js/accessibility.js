const userId = 1; // Replace with dynamic user ID if needed

// Load existing settings on page load
window.onload = async () => {
  try {
    const res = await fetch(`/accessibility-settings/${userId}`);
    const data = await res.json();

    // Set dropdown value
    if (data.fontSize) {
      document.getElementById('fontSize').value = data.fontSize;
    }

    // Set contrast level slider
    if (data.contrastLevel !== undefined) {
      document.getElementById('contrastLevel').value = data.contrastLevel;
    }

    // Set voice assistant toggle
    document.getElementById('voiceAssist').checked = data.voiceAssist === 1;
  } catch (error) {
    console.error('Error loading settings:', error);
  }
};

// Save settings when "Save Changes" button is clicked
document.getElementById('saveBtn').addEventListener('click', async () => {
  const fontSize = document.getElementById('fontSize').value;
  const contrastLevel = parseInt(document.getElementById('contrastLevel').value);
  const voiceAssist = document.getElementById('voiceAssist').checked;

  const payload = {
    userId,
    fontSize,
    contrastLevel,
    voiceAssist
  };

  try {
    const res = await fetch('/accessibility-settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    const result = await res.json();
    alert(result.message || 'Settings saved successfully');
  } catch (err) {
    console.error('Failed to save:', err);
    alert('Failed to save settings');
  }
});
