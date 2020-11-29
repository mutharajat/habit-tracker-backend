const express = require("express");

const habits = require("./habits");

const router = express.Router();

router.get("/", (req, res) => {
  res.json({
    message: "API - 👋🌎🌍🌏",
  });
});

router.use("/habits", habits);

module.exports = router;
