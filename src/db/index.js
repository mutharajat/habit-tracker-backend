const { Sequelize, DataTypes } = require("sequelize");

const sequelize = new Sequelize({
  username: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  ssl: true,
  dialect: "postgres",
  dialectOptions: {
    ssl: {
      require: true,
      rejectUnauthorized: false,
    },
  },
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connection has been established successfully");
  } catch (error) {
    console.error("Unable to connect to the database:", error);
  }
})();

const Habit = sequelize.define(
  "Habit",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    habit: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    repeat: {
      type: DataTypes.INTEGER,
    },
    time: {
      type: DataTypes.TIME,
    },
  },
  { timestamps: false }
);

const Rep = sequelize.define(
  "Rep",
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: Sequelize.UUIDV4,
      primaryKey: true,
    },
    habitId: {
      type: DataTypes.UUID,
      references: {
        model: Habit,
        key: "id",
      },
      allowNull: false,
    },
    day: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },
    value: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
    },
  },
  { timestamps: false }
);

(async () => {
  try {
    await sequelize.sync();
    console.log("Database has been synced successfully");
  } catch (error) {
    console.log("Unable to sync database: ", error);
  }
})();

module.exports = { sequelize, Habit, Rep };
