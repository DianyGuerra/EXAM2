const express = require('express');
const router = express.Router();
const Match = require('../models/match');
const Team = require('../models/team');

// GET all matches
router.get('/matches', async (req, res) => {
  try {
    const matches = await Match.find()
      .populate('homeTeam', 'name teamId')
      .populate('awayTeam', 'name teamId');

    res.status(200).json(matches);
  } catch (error) {
    console.error("Error getting matches:", error);
    res.status(500).json({ message: "Server error while getting matches." });
  }
});


// POST create a new match
router.post('/matches', async (req, res) => {
  const { matchId, date, homeTeamId, awayTeamId, homeGoals, awayGoals } = req.body;

  if (!matchId || !homeTeamId || !awayTeamId) {
    return res.status(400).json({ message: "matchId, homeTeamId and awayTeamId are required." });
  }

  try {
    const homeTeam = await Team.findOne({ teamId: homeTeamId });
    const awayTeam = await Team.findOne({ teamId: awayTeamId });

    if (!homeTeam || !awayTeam) {
      return res.status(404).json({ message: "One or both teams not found." });
    }

    const match = new Match({
      matchId,
      date,
      homeTeam: homeTeam._id,
      awayTeam: awayTeam._id,
      homeGoals,
      awayGoals
    });

    const savedMatch = await match.save();
    res.status(201).json({ message: "Match created successfully", match: savedMatch });

  } catch (error) {
    console.error("Error creating match:", error);
    res.status(500).json({ message: "Server error while creating match." });
  }
});




//PUT update a match by ID
router.put('/matches/:matchId', async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: req.params.matchId });
    if (!match) {
      return res.status(404).json({ message: "Match not found." });
    }

    const { date, homeGoals, awayGoals, homeTeamId, awayTeamId } = req.body;

    if (date) match.date = date;
    if (homeGoals !== undefined) match.homeGoals = homeGoals;
    if (awayGoals !== undefined) match.awayGoals = awayGoals;

    if (homeTeamId) {
      const homeTeam = await Team.findOne({ teamId: homeTeamId });
      if (!homeTeam) return res.status(404).json({ message: "Home team not found." });
      match.homeTeam = homeTeam._id;
    }

    if (awayTeamId) {
      const awayTeam = await Team.findOne({ teamId: awayTeamId });
      if (!awayTeam) return res.status(404).json({ message: "Away team not found." });
      match.awayTeam = awayTeam._id;
    }

    await match.save();
    res.status(200).json({ message: "Match updated successfully", match });

  } catch (error) {
    console.error("Error updating match:", error);
    res.status(500).json({ message: "Server error while updating match." });
  }
});

// DELETE a match by ID
router.delete('/matches/:matchId', async (req, res) => {
  try {
    const deletedMatch = await Match.findOneAndDelete({ matchId: req.params.matchId });
    if (!deletedMatch) {
      return res.status(404).json({ message: "Match not found." });
    }

    res.status(200).json({ message: "Match deleted successfully", match: deletedMatch });
  } catch (error) {
    console.error("Error deleting match:", error);
    res.status(500).json({ message: "Server error while deleting match." });
  }
});


// GET match by ID
router.get('/matches/:matchId', async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: req.params.matchId })
      .populate('homeTeam', 'name teamId')
      .populate('awayTeam', 'name teamId');

    if (!match) {
      return res.status(404).json({ message: "Match not found." });
    }

    res.status(200).json(match);
  } catch (error) {
    console.error("Error getting match:", error);
    res.status(500).json({ message: "Server error while getting match." });
  }
});



//BUSSINESS RULE


// GET match analysis for a specific team
router.get('/matches/:matchId/analysis/:teamId', async (req, res) => {
  try {
    const match = await Match.findOne({ matchId: req.params.matchId })
      .populate('homeTeam')
      .populate('awayTeam');

    if (!match) {
      return res.status(404).json({ message: "Match not found." });
    }

    const team = await Team.findOne({ teamId: req.params.teamId });
    if (!team) {
      return res.status(404).json({ message: "Team not found." });
    }

    let isHome = String(match.homeTeam._id) === String(team._id);
    let opponent = isHome ? match.awayTeam.name : match.homeTeam.name;
    let goalsFor = isHome ? match.homeGoals : match.awayGoals;
    let goalsAgainst = isHome ? match.awayGoals : match.homeGoals;

    let result = 'Draw';
    if (goalsFor > goalsAgainst) result = 'Win';
    else if (goalsFor < goalsAgainst) result = 'Loss';

    res.status(200).json({
      team: team.name,
      opponent,
      goalsFor,
      goalsAgainst,
      result
    });

  } catch (error) {
    console.error("Error analyzing match:", error);
    res.status(500).json({ message: "Server error while analyzing match." });
  }
});


//GTET match statistics overview
router.get('/matches/stats/overview', async (req, res) => {
  try {
    const matches = await Match.find();

    if (matches.length === 0) {
      return res.status(404).json({ message: "No matches found." });
    }

    const totalMatches = matches.length;
    const totalGoals = matches.reduce((sum, match) => sum + match.homeGoals + match.awayGoals, 0);
    const averageGoals = (totalGoals / totalMatches).toFixed(2);

    // Encuentra el partido con más goles
    const matchWithMostGoals = matches.reduce((max, match) => {
      const goals = match.homeGoals + match.awayGoals;
      const maxGoals = max.homeGoals + max.awayGoals;
      return goals > maxGoals ? match : max;
    });

    // Populate para mostrar equipos por nombre
    const populatedMatch = await Match.findById(matchWithMostGoals._id)
      .populate('homeTeam', 'name teamId')
      .populate('awayTeam', 'name teamId');

    res.status(200).json({
      totalMatches,
      totalGoals,
      averageGoalsPerMatch: Number(averageGoals),
      highestScoringMatch: {
        matchId: populatedMatch.matchId,
        homeTeam: populatedMatch.homeTeam.name,
        awayTeam: populatedMatch.awayTeam.name,
        homeGoals: populatedMatch.homeGoals,
        awayGoals: populatedMatch.awayGoals,
        totalGoals: populatedMatch.homeGoals + populatedMatch.awayGoals
      }
    });

  } catch (error) {
    console.error("Error calculating match stats:", error);
    res.status(500).json({ message: "Server error while calculating match stats." });
  }
});


module.exports = router;
