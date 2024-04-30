const { DataTypes } = require("sequelize");

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable("ooh_media", {
      media_id: {
        type: DataTypes.UUID,
        primaryKey: true,
        unique: true,
        allowNull: false,
        defaultValue: Sequelize.literal("gen_random_uuid()"), // Correct default value for generating UUIDs
        comment: "Unique identifier for each OOH media entry.",
      },
      format_id: {
        type: DataTypes.UUID,
        references: {
          model: "formats", // References the 'formats' table
          key: "format_id", // References the 'format_id' primary key in 'formats' table
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
        allowNull: false,
        comment: "Foreign key linking to the Formats table to specify the OOH format type.",
      },
      location_id: {
        type: DataTypes.UUID,
        allowNull: false,
        comment: "Foreign key linking to the Locations table for geographical data.",
        references: {
          model: "locations", // References the 'locations' table
          key: "location_id", // References the 'location_id' primary key in 'locations' table
        },
        onUpdate: "CASCADE",
        onDelete: "SET NULL",
      },
      size: {
        type: DataTypes.TEXT,
        allowNull: false,
        comment: "Describes physical dimensions or digital resolution (as JSON string).",
      },
      digital: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Indicates whether the OOH media is digital.",
      },
      interactive_capabilities: {
        type: DataTypes.BOOLEAN,
        defaultValue: false,
        comment: "Specifies if the digital media supports interactive features.",
      },
      visibility_score: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: "A derived metric for estimating visibility or foot traffic.",
      },
      availability_start_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "Start date when the media is available for advertising.",
      },
      availability_end_date: {
        type: DataTypes.DATEONLY,
        allowNull: false,
        comment: "End date until the media is available for advertising.",
      },
      price: {
        type: DataTypes.FLOAT,
        allowNull: false,
        comment: "The cost of booking the media for advertising.",
      },
      rating: {
        type: DataTypes.FLOAT,
        allowNull: true,
        comment: "Optional rating based on past campaign performances or quality assessments.",
      },
      media_images: {
        type: DataTypes.TEXT,
        allowNull: true,
        comment: "JSON string containing URLs to images of the ad space.",
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
    await queryInterface.dropTable("ooh_media");
  },
};
