const mongoose = require('mongoose');

const loanSchema = new mongoose.Schema({
  lenderName: { type: String, required: true },
  principal: { type: Number, required: true },
  interestRate: { type: Number, required: true },
  periods: { type: Number, required: true },
  interestAmount: { type: Number, required: true },
  futureValue: { type: Number, required: true },
}, {collection: 'loan'});

module.exports = mongoose.model('Loan', loanSchema, 'loan');

