require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

const clinicRoutes = require('./routes/clinics');
const directionRoutes = require('./routes/directions');
const accessibilityRoutes = require('./routes/accessibility'); 
const savedPlacesRoutes = require('./routes/savedPlaces');
const reminderRoutes = require('./routes/reminders');
const noteRoutes = require('./routes/notes');  // Your notes routes with file upload

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));


// **Add this line to serve uploaded files (for file uploads in notes)**
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// API routes
app.use('/clinics', clinicRoutes);
app.use('/directions', directionRoutes);
app.use('/reminders', reminderRoutes); 
app.use('/accessibility', accessibilityRoutes);     
app.use('/saved-places', savedPlacesRoutes);
app.use('/notes', noteRoutes);    // Your notes route with file upload handling

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'clinics.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

