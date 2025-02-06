const mongoose = require('mongoose');

const predictionSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  match: { type: mongoose.Schema.Types.ObjectId, ref: 'Match', required: true }, 
  predictedWinnerTeam: { type: String}, 
  afterTwoOvers: [{ team: String, decision: String }],
  afterFiveOvers: [{ team: String, decision: String }],
  totalWicket:{type:String,},
  totalRuns:{type:String,},
  amountBetforwinner: { type: Number, default: 0 }, 
  amountBetfortwoover: { type: Number, default: 0 }, 
  amountBetforfiveover: { type: Number, default: 0 }, 
  amountBetfortotalwicket: { type: Number, default: 0 }, 
  amountBetforrotalruns: { type: Number, default: 0 }, 
  status: { type: String, enum: ['pending', 'won', 'lost'], default: 'pending' }, 
  payout: { type: Number, default: 0 }, 
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Prediction', predictionSchema);


