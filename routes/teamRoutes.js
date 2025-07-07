const express = require('express');
const router = express.Router();
const Team = require('../models/team');
const Player = require('../models/player');
const Match = require('../models/match');


// GET all teams
router.get('/teams', async (req, res) => {
  try {
    const teams = await User.find();
    res.status(200).json(teams);
} catch (error) {
    console.error("Error getting teams:", error);
    res.status(500).json({ message: "Server error while getting teams." });
}
});

// POST create a new team
router.post('/teams', async (req, res) => {
  const { teamId, name, country, founded, stadium } = req.body;

  if (!teamId || !name) {
    return res.status(400).json({ message: "Team ID and name are required." });
  }

  try {
    const newTeam = new Team({
      teamId,
      name,
      country: country || 'Unknown',
      founded: founded || 0,
      stadium: stadium || 'Unknown'
    });

    const savedTeam = await newTeam.save();
    res.status(201).json({ message: "Team created successfully", team: savedTeam });

  } catch (error) {
    console.error("Error creating team:", error);
    res.status(500).json({ message: "Server error while creating team." });
  }
});


//PUT update a team by ID
router.put('/teams/:teamId', async (req, res) => {
  try {
    const updatedTeam = await Team.findOneAndUpdate(
      { teamId: req.params.teamId },
      req.body,
      { new: true }
    );
    if (!updatedTeam) {
      return res.status(404).json({ message: "Team not found." });
    }
    res.status(200).json({ message: "Team updated successfully", team: updatedTeam });
  } catch (error) {
    console.error("Error updating team:", error);
    res.status(500).json({ message: "Server error while updating team." });
  }
});


//DELETE a team by ID
router.delete('/teams/:teamId', async (req, res) => {
  try {
    const deletedTeam = await Team.findOneAndDelete({ teamId: req.params.teamId });
    if (!deletedTeam) {
      return res.status(404).json({ message: "Team not found." });
    }
    res.status(200).json({ message: "Team deleted successfully", team: deletedTeam });
  } catch (error) {
    console.error("Error deleting team:", error);
    res.status(500).json({ message: "Server error while deleting team." });
  }
});


// GET team by ID

router.get('/teams/:teamId', async (req, res) => {
  try {
    const team = await Team.findOne({ teamId: req.params.teamId });
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }
    res.status(200).json(team);
  } catch (error) {
    console.error("Error getting team:", error);
    res.status(500).json({ message: "Server error while getting team." });
  }
});


//BUSSINESS RULE


// GET team stats
router.get('/teams/:teamId/stats', async (req, res) => {
  try {
    const team = await Team.findOne({ teamId: req.params.teamId });
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    const playerCount = await Player.countDocuments({ team: team._id });

    const matches = await Match.find({
      $or: [{ homeTeam: team._id }, { awayTeam: team._id }]
    });

    const goalsScored = matches.reduce((sum, match) => {
      if (String(match.homeTeam) === String(team._id)) return sum + match.homeGoals;
      if (String(match.awayTeam) === String(team._id)) return sum + match.awayGoals;
      return sum;
    }, 0);

    res.status(200).json({
      team: team.name,
      players: playerCount,
      matchesPlayed: matches.length,
      goalsScored
    });
  } catch (error) {
    console.error("Error calculating team stats:", error);
    res.status(500).json({ message: "Server error while calculating stats." });
  }
});


module.exports = router;
