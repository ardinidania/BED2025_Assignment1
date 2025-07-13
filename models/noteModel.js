const mongoose = require('mongoose');

const noteSchema = new mongoose.Schema({
  userId: { type: String, required: true },
  title: { type: String, required: true },
  savedName: { type: String, required: true },
  clinicName: { type: String, required: true },
  filePath: { type: String },   // stored file path, e.g. 'uploads/abc123.pdf'
  fileName: { type: String },   // original file name
}, { timestamps: true });

module.exports = mongoose.model('Note', noteSchema);

