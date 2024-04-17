const { QueryInterface } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("formats", [
      { type: "Billboard" },
      { type: "Digital Screen" },
      { type: "Transit Advertising" },
      { type: "Street Furniture" },
      { type: "Mobile Billboard" },
      { type: "Airport Advertising" },
      { type: "Place-Based Media" },
      {
        type: "Point of Sale Displays",
      },
      {
        type: "Wallscapes and Murals",
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete("formats", null, {});
  },
};
