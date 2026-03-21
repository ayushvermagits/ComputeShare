const mongoose = require('mongoose');

const contributionSchema = new mongoose.Schema({
  workerId: String,
  cpuDonated: Number,
  tasksCompleted: Number,
  uptime: Number,
  joinedAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Contribution', contributionSchema);