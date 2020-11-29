const moment = require("moment");
const { Op } = require("sequelize");
const { Habit, Rep, sequelize } = require(".");
const { constructWeek, hasReward } = require("./utils");

const listHabits = async () => {
  try {
    const habits = await Habit.findAll();
    const promises = habits.map((h) => {
      const weekReps = listCurrentWeekReps(h.id);
      return weekReps;
    });
    const results = await Promise.all(promises);
    const res = results.map((r) => r.body);
    return { status: 200, body: res };
  } catch (error) {
    return { status: 500, body: error };
  }
};

const addHabit = async (data) => {
  const { habit, repeat, time } = data;
  try {
    const createdHabit = await Habit.create({ habit, repeat, time });
    const weekReps = await listCurrentWeekReps(createdHabit.id);
    return weekReps;
  } catch (error) {
    return { status: 500, body: error };
  }
};

const listCurrentWeekReps = async (habitId) => {
  try {
    const habit = await Habit.findByPk(habitId);
    if (!habit) {
      return {
        status: 400,
        body: { error: `Habit with id ${habitId} not found` },
      };
    }
    const repResults = await Rep.findAll({
      where: {
        habitId,
        day: {
          [Op.between]: [moment().startOf("week"), moment().endOf("week")],
        },
      },
    });

    const reps = repResults.map((r) => r.dataValues);
    const currentWeek = constructWeek(reps);
    const habitWeek = { ...habit.dataValues, ...currentWeek };
    const reward = hasReward(habitWeek);
    return { status: 200, body: { ...habitWeek, reward } };
  } catch (error) {
    return { status: 500, body: error };
  }
};

const updateRep = async (data) => {
  const { habitId, day } = data;
  try {
    const habit = Habit.findByPk(habitId);
    if (!habit) {
      return {
        status: 400,
        body: { error: `Habit with id ${habitId} not found` },
      };
    }
    const rep = await Rep.findOne({
      where: {
        habitId,
        day,
      },
    });
    if (!rep) {
      console.log("Day didn't exist for habit. Creating...");
      await Rep.create({
        habitId,
        day,
        value: true,
      });
    } else {
      await Rep.update(
        { value: !rep.value },
        {
          where: {
            id: rep.id,
          },
        }
      );
    }
    const weekReps = await listCurrentWeekReps(habitId);
    return weekReps;
  } catch (error) {
    return { status: 500, body: error };
  }
};

module.exports = {
  listHabits,
  addHabit,
  updateRep,
  listCurrentWeekReps,
};
