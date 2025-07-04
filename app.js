require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();

const clinicRoutes = require('./routes/clinics');
const directionRoutes = require('./routes/directions');
const accessibilityRoutes = require('./routes/accessibility'); 


// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));


// Serve static frontend files
app.use(express.static(path.join(__dirname, 'public')));

// API routes
app.use('/clinics', clinicRoutes);
app.use('/directions', directionRoutes);
app.use('/', accessibilityRoutes);

// Default route
app.get('/', (req, res) => {
  res.sendFile(path.join(__dirname, 'public', 'clinics.html'));
});

// Start server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});