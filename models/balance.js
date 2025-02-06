const mongoose = require('mongoose');

const userBalanceSchema = new mongoose.Schema({
    user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true }, 
    balance: { type: Number, default: 0 }, // Available Balance
    lastTransaction: { type: Date, default: Date.now } // Last transaction timestamp
});

module.exports = mongoose.model('UserBalance', userBalanceSchema);