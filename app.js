require('dotenv').config();
const express = require('express');
const path = require('path');
const app = express();
const swaggerUi = require("swagger-ui-express");
const swaggerDocument = require("./swagger-output.json");

const authRoutes = require("./routes/auth");
const verifyToken = require("./middlewares/verifyToken");
const clinicRoutes = require('./routes/clinics');
const directionRoutes = require('./routes/directions');
const accessibilityRoutes = require('./routes/accessibility');
const savedPlacesRoutes = require('./routes/savedPlaces');
const reminderRoutes = require('./routes/reminders');
const noteRoutes = require('./routes/notes');
const appointmentRoutes = require('./routes/appointments');

app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use("/api-docs", swaggerUi.serve, swaggerUi.setup(swaggerDocument));

app.use("/auth", authRoutes);
app.use('/clinics', clinicRoutes);
app.use('/directions', directionRoutes);
app.use('/reminders', verifyToken, reminderRoutes);
app.use('/accessibility', verifyToken, accessibilityRoutes);
app.use('/saved-places', verifyToken, savedPlacesRoutes);
app.use('/notes', verifyToken, noteRoutes);
app.use('/appointments', appointmentRoutes);

app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "public", "login.html"));
});

app.use(express.static(path.join(__dirname, 'public')));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

module.exports = app;
