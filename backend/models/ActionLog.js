const mongoose = require('mongoose');

const ActionLogSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  action: { type: String, required: true },
  task: { type: mongoose.Schema.Types.ObjectId, ref: 'Task' },
  details: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('ActionLog', ActionLogSchema); 