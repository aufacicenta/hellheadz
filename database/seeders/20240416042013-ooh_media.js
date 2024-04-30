"use strict";

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkInsert("ooh_media", [
      {
        format_id: "82598e9e-3aff-4ceb-9c1e-cb38d2ce6803",
        location_id: "f1678286-194d-4a26-935e-563f5e1be233",
        size: JSON.stringify({ width: "24", height: "14", units: "feet" }),
        digital: true,
        interactive_capabilities: true,
        visibility_score: 9.5,
        availability_start_date: new Date("2023-01-01").toISOString().split("T")[0],
        availability_end_date: new Date("2023-01-31").toISOString().split("T")[0],
        price: 2500.0,
        media_images: JSON.stringify(["https://example.com/image1.jpg"]),
      },
      {
        format_id: "3e656bde-2cf3-4fdf-a2c9-61a1ed9bc041",
        location_id: "e6447814-58c8-4456-b2e6-2f8432ac46a1",
        size: JSON.stringify({ width: "10", height: "20", units: "feet" }),
        digital: false,
        interactive_capabilities: false,
        visibility_score: 7.0,
        availability_start_date: new Date("2023-02-01").toISOString().split("T")[0],
        availability_end_date: new Date("2023-02-28").toISOString().split("T")[0],
        price: 1500.0,
        media_images: JSON.stringify(["https://example.com/image2.jpg"]),
      },
      // Continue adding 8 more seed entries based on provided format and location UUIDs
      // ...
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete("ooh_media", null, {});
  },
};
