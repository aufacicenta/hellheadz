const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("audience_demographics", {
      demographics_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: Sequelize.literal("gen_random_uuid()"), // Correct default value for generating UUIDs
        comment: "Unique identifier for each audience demographic entry.",
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
        comment: "Descriptive name or identifier for the demographic group.",
      },
      age_ranges: {
        type: DataTypes.TEXT, // Storing structured JSON data.
        allowNull: true,
        comment: "JSON string to store an array or object of age ranges interested.",
      },
      gender: {
        type: DataTypes.STRING,
        allowNull: true,
        comment: "Gender the demographic targets, if applicable.",
      },
      interests: {
        type: DataTypes.TEXT, // Storing structured JSON data.
        allowNull: true,
        comment: "JSON string to store an array of interests for the demographic.",
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        comment: "Timestamp when the record was created.",
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
        comment: "Timestamp when the record was last updated.",
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("audience_demographics");
  },
};
