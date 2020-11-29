const express = require("express");
const router = express.Router();
const {
  listHabits,
  listCurrentWeekReps,
  addHabit,
  updateRep,
} = require("../db/habits");

router.get("/", async (req, res) => {
  const result = await listHabits();
  res.status(result.status).send(result.body);
});

router.get("/:id/currentweek", async (req, res) => {
  const result = await listCurrentWeekReps(req.params["id"]);
  res.status(result.status).send(result.body);
});

router.post("/", async (req, res) => {
  const result = await addHabit(req.body);
  res.status(result.status).send(result.body);
});

router.put("/reps", async (req, res) => {
  const result = await updateRep(req.body);
  res.status(result.status).send(result.body);
});

module.exports = router;
