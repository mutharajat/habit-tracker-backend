const moment = require("moment");

const getCurrentWeek = () => {
  const res = {};
  for (let i = 0; i < 7; i++) {
    res[`day_${i + 1}`] = moment().startOf("week").add(i, "days");
  }
  return res;
};

const constructWeek = (weekReps) => {
  const res = {};
  for (let i = 0; i < 7; i++) {
    const day = moment().startOf("week").add(i, "days");
    const rep = weekReps.find((r) => day.isSame(r.day, "day"));
    if (rep) {
      res[`day_${i + 1}`] = rep.value;
    } else {
      res[`day_${i + 1}`] = false;
    }
  }
  return res;
};

const hasReward = (habit) => {
  console.log(habit);
  let completed = 0;
  for (let i = 1; i <= 7; i++) {
    const day = `day_${i}`;
    if (habit[day]) {
      completed++;
    }
  }
  return completed >= habit.repeat;
};

module.exports = {
  getCurrentWeek,
  constructWeek,
  hasReward,
};
