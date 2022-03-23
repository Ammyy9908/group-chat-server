const { model, Schema } = require("mongoose");

const room_schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  author: {
    type: Object,
    required: true,
  },
});

const Room = model("room", room_schema);

module.exports = Room;
