const mongoose = require('mongoose');

const playerSchema = new mongoose.Schema({
  name: String,
  runs: { type: Number, default: 0 },
  ballsFaced: { type: Number, default: 0 },
  isOut: { type: Boolean, default: false },
  perbowlerbowl: { type: Number, default: 0 },
});

const teamSchema = new mongoose.Schema({
  teamName: { type: String, required: true },
  totalRuns: { type: Number, default: 0 },
  totalWickets: { type: Number, default: 0 },
  players: [playerSchema],
  totalOvers: { type: Number, default: 0.0 },
  isMatchEnded: { type: Boolean, default: false },
  isBatting: { type: Boolean, default: false },
});

const matchSchema = new mongoose.Schema({
  target: { type: Number,default:0 },
  overs: { type: Number, required: true },
  teams: [teamSchema],
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  status: {
    type: String,
    enum: ['draft', 'live', 'completed'], // Status to track match stage
    default: 'live',
  },
  isHosting: { type: Boolean, default: false },
  WiningTeam: { type: String },
});

module.exports = mongoose.model('Match', matchSchema);
