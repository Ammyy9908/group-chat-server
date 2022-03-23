const User = require("../models/User");
const router = require("express").Router();
const dotenv = require("dotenv");
const jwt = require("jsonwebtoken");
dotenv.config();

router
  .get(
    "/user",
    (req, res, next) => {
      const token = req.headers.authorization;
      if (!token) {
        return res.status(401).json({
          message: "No token provided",
        });
      }
      try {
        const decoded = jwt.verify(token, process.env.APP_SECRET);
        req.user = decoded;
        next();
      } catch (err) {
        return res.status(401).json({
          message: "Token is not valid",
        });
      }
    },
    async (req, res) => {
      const { user } = req;
      const user_data = await User.findOne({ _id: user.userId });
      res.status(200).json(user_data);
    }
  )
  .post("/login", async (req, res) => {
    // first find the user with incoming email in database

    const { email, name, imageUrl } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      const token = jwt.sign({ userId: user._id }, process.env.APP_SECRET);
      res.json({
        token,
      });
    } else {
      const newUser = new User({
        email,
        name,
        imageUrl,
      });
      newUser
        .save()
        .then(() => {
          const token = jwt.sign(
            { userId: newUser._id },
            process.env.APP_SECRET
          );
          res.json({
            token,
          });
        })
        .catch((e) => {
          console.log(e);
        });
    }
  });

module.exports = router;
