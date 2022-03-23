const { model, Schema } = require("mongoose");

const user_schema = new Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  imageUrl: {
    type: String,
    required: true,
  },
});

const User = model("user", user_schema);

module.exports = User;
