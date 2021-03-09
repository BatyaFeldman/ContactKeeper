const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const config = require("config");
//this is importing the express-validator library which we can use
//to validate some data in our request. cooool!!
const { check, validationResult } = require("express-validator");

const User = require("../models/User");

//@route       POST api/users
//@desc        Register a user
//@access      Public
router.post(
  "/", //path
  [
    check("name", "Please add name").not().isEmpty(),
    check("email", "Please include a valid email").isEmail(),
    check(
      "password",
      "Please enter a password with 6 or more characters"
    ).isLength({ min: 6 }),
  ], //express-validator checking array
  async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({ errors: errors.array() });
    }

    const { name, email, password } = req.body;
    try {
      let user = await User.findOne({ email });
      if (user) {
        return res.status(400).json({ msg: "User already exists" });
      }
      user = new User({
        name,
        email,
        password,
      });
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
      //this saves user to mongo db
      await user.save();
      const payload = {
        user: {
          id: user.id,
        },
      };
      //in jwt.sign we pass in the payload with an id, the secret, an object with options, and a callback with a potential error and token
      jwt.sign(
        payload,
        config.get("jwtSecret"),
        { expiresIn: 360000 },
        (err, token) => {
          if (err) throw err;
          res.json({ token });
        }
      );
    } catch (err) {
      console.error(err.message);
      res.status(500).send("Server Error");
    }
  } //callback to handle response
);

module.exports = router;
