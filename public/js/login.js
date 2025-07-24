document.addEventListener("DOMContentLoaded", () => {
  const loginForm = document.getElementById("login-form");

  loginForm.addEventListener("submit", async (e) => {
    e.preventDefault();

    const ic = document.getElementById("ic").value.trim().toUpperCase();
    const phone = document.getElementById("phone").value.trim();
    const pin = document.getElementById("pin").value.trim();

    const icRegex = /^[STFG]\d{7}[A-Z]$/;
    const phoneRegex = /^[89]\d{7}$/;
    const pinRegex = /^\d{4}$/;

    if (!icRegex.test(ic)) {
      alert("Please enter a valid IC number.");
      return;
    }

    if (!phoneRegex.test(phone)) {
      alert("Please enter a valid Singapore phone number.");
      return;
    }

    if (!pinRegex.test(pin)) {
      alert("Please enter a valid 4-digit PIN.");
      return;
    }

    try {
      const res = await fetch("http://localhost:3000/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ic, phone, pin })
      });

      const data = await res.json();

      if (res.ok) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);

        // Fetch accessibility settings immediately
        await fetchAccessibilitySettings(data.token);

        // Redirect after settings are saved
        window.location.href = "index.html";
      } else {
        alert(data.message || "Login failed");
      }
    } catch (err) {
      console.error(err);
      alert("Server error");
    }
  });
});

// Fetch accessibility settings using token
async function fetchAccessibilitySettings(token) {
  try {
    const res = await fetch("http://localhost:3000/accessibility/accessibility-settings", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) throw new Error("Failed to load accessibility settings");

    const settings = await res.json();

    if (settings.fontSize) localStorage.setItem("fontSizePreference", settings.fontSize);
    if (!isNaN(settings.contrastLevel)) localStorage.setItem("contrastLevel", settings.contrastLevel);
    if (settings.darkMode !== undefined) localStorage.setItem("darkMode", settings.darkMode);
  } catch (err) {
    console.error("Accessibility settings not found:", err.message);
  }
}