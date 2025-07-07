const express = require('express');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();

app.use(express.json());

const matchesRoutes = require('./routes/matchRoutes');
app.use('/api', matchesRoutes);

const playersRoutes = require('./routes/playerRoutes');
app.use('/api', playersRoutes);

const teamsRoutes = require('./routes/teamRoutes');
app.use('/api', teamsRoutes);

mongoose.connect(process.env.MONGO_URI)
.then(() => {
  console.log('✅ Connected to MongoDB');
  app.listen(3007, () => {
    console.log('🚀 Server running on http://localhost:3007');
  });
})
.catch(err => console.error('❌ Connection error:', err));
