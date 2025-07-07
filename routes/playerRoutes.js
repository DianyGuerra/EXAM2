const express = require('express');
const router = express.Router();
const Player = require('../models/player');
const Team = require('../models/team');

// GET all players
router.get('/players', async (req, res) => {
  try {
    const players = await Player.find();
    res.status(200).json(players);
  } catch (error) {
    console.error("Error getting players:", error);
    res.status(500).json({ message: "Server error while getting players." });
  }
});

// POST create a new player
router.post('/players', async (req, res) => {
  const { playerId, name, position, age, nationality, teamId } = req.body;

  if (!playerId || !name || !teamId) {
    return res.status(400).json({ message: "Player ID, name, and teamId are required." });
  }

  try {
    const team = await Team.findOne({ teamId });
    if (!team) {
      return res.status(404).json({ message: "Team not found with teamId: " + teamId });
    }

    const newPlayer = new Player({
      playerId,
      name,
      position: position || 'Unknown',
      age: age || 0,
      nationality: nationality || 'Unknown',
      teamId: team._id
    });

    const savedPlayer = await newPlayer.save();
    res.status(201).json({ message: "Player created successfully", player: savedPlayer });

  } catch (error) {
    console.error("Error creating player:", error);
    res.status(500).json({ message: "Server error while creating player." });
  }
});

//PUT update a player by ID
router.put('/players/:playerId', async (req, res) => {
  try {
    const { name, age, position, nationality, teamId } = req.body;

    const player = await Player.findOne({ playerId: req.params.playerId });
    if (!player) {
      return res.status(404).json({ message: "Player not found." });
    }

    if (teamId) {
      const team = await Team.findOne({ teamId });
      if (!team) {
        return res.status(404).json({ message: "Team not found with teamId: " + teamId });
      }
      player.teamId = team._id;
    }

    if (name) player.name = name;
    if (age !== undefined) player.age = age;
    if (position) player.position = position;
    if (nationality) player.nationality = nationality;

    await player.save();
    res.status(200).json({ message: "Player updated successfully", player });

  } catch (error) {
    console.error("Error updating player:", error);
    res.status(500).json({ message: "Server error while updating player." });
  }
});

//DELETE a player by ID
router.delete('/players/:playerId', async (req, res) => {
  try {
    const deletedPlayer = await Player.findOneAndDelete({ playerId: req.params.playerId });

    if (!deletedPlayer) {
      return res.status(404).json({ message: "Player not found." });
    }

    res.status(200).json({ message: "Player deleted successfully", player: deletedPlayer });

  } catch (error) {
    console.error("Error deleting player:", error);
    res.status(500).json({ message: "Server error while deleting player." });
  }
});


// GET player by ID
router.get('/players/:playerId', async (req, res) => {
  try {
    const player = await Player.findOne({ playerId: req.params.playerId })
      .populate('teamId', 'name teamId');

    if (!player) {
      return res.status(404).json({ message: "Player not found." });
    }

    res.status(200).json(player);
  } catch (error) {
    console.error("Error getting player by ID:", error);
    res.status(500).json({ message: "Server error while getting player." });
  }
});


//BUSSINES RULE


// Calculate player salary based on position and age
router.get('/players/:playerId/salary', async (req, res) => {
  try {
    const player = await Player.findOne({ playerId: req.params.playerId });
    if (!player) {
      return res.status(404).json({ message: "Player not found." });
    }

    const baseByPosition = {
      Goalkeeper: 2000,
      Defender: 2500,
      Midfielder: 3000,
      Forward: 3500
    };

    const baseSalary = baseByPosition[player.position] || 2000;
    const bonus = player.age * 100;
    const totalSalary = baseSalary + bonus;

    res.status(200).json({
      playerId: player.playerId,
      name: player.name,
      position: player.position,
      age: player.age,
      baseSalary,
      bonus,
      totalSalary
    });

  } catch (error) {
    console.error("Error calculating salary:", error);
    res.status(500).json({ message: "Server error while calculating salary." });
  }
});


module.exports = router;
