const express = require('express');
const router = express.Router();
const Loan = require('../models/loan');

//GET all loans
router.get('/loans', async (req, res) => {
  try {
    const loans = await Loan.find();
    res.status(200).json(loans);
  } catch (error) {
    console.error("Error fetching loans:", error);
    res.status(500).json({ message: "Server error while fetching loans." });
  }
});

// POST /api/loan/calculate
router.post('/loans/calculate', async (req, res) => {
  const { lenderName, principal, interestRate, periods } = req.body;

  if (!lenderName || !principal || !interestRate || !periods) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const futureValue = principal * Math.pow(1 + interestRate, periods);
    const interestAmount = futureValue - principal;

    const newLoan = new Loan({
      lenderName,
      principal,
      interestRate,
      periods,
      interestAmount,
      futureValue
    });

    await newLoan.save();
    res.status(201).json({
      message: "Loan calculated and saved successfully",
      result: {
        lenderName,
        principal,
        interestRate,
        periods,
        interestAmount: interestAmount.toFixed(2),
        futureValue: futureValue.toFixed(2)
      }
    });
  } catch (error) {
    console.error("Error calculating loan:", error);
    res.status(500).json({ message: "Server error while calculating loan." });
  }
});

module.exports = router;
