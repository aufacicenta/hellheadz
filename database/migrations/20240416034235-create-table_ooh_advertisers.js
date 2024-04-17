const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("advertisers", {
      advertiser_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: Sequelize.literal("gen_random_uuid()"), // Updated to use gen_random_uuid()
      },
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      industry: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      preferred_demographics: {
        type: DataTypes.TEXT, // Use TEXT for potential JSON or extensive textual data.
        allowNull: true,
      },
      created_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
      updated_at: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal("CURRENT_TIMESTAMP"),
      },
    });
  },
  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable("advertisers");
  },
};
