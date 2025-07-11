const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());

const loanRoutes = require('./routes/loanRoutes');
app.use('/api', loanRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(3007, () => {
    console.log('🚀 Server running on http://localhost:3007');
  });
})
.catch(err => console.error('❌ Connection error:', err));
