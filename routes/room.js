const User = require("../models/User");
const Room = require("../models/Room");
const router = require("express").Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

router

  .get("/room/:id", async (req, res) => {
    const { id } = req.params;
    const room = await Room.findOne({ _id: id });
    if (room) {
      res.status(200).json(room);
    } else {
      res.status(404).json({ message: "Room not found" });
    }
  })
  .get("/rooms", async (req, res) => {
    const rooms = await Room.find();
    res.status(200).json(rooms);
  })
  .post("/new", async (req, res) => {
    const { name, description, author } = req.body;
    // check if the room is already in database with the given name

    const room = await Room.findOne({ name });
    if (room) {
      res.status(400).json({ message: "Room already exists" });
    } else {
      const newRoom = new Room({
        name,
        description,
        author,
      });
      newRoom
        .save()
        .then(() => {
          res.status(200).json(newRoom);
        })
        .catch((e) => {
          res.status(400).json({ message: "Error creating room" });
        });
    }
  });

module.exports = router;
