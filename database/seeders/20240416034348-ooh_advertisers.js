const { QueryInterface } = require("sequelize");

module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("advertisers", [
      {
        name: "Advertiser One",
        industry: "Technology",
        preferred_demographics: JSON.stringify({ age: "25-35", interests: ["Tech", "Gaming"] }),
      },
      {
        name: "Advertiser Two",
        industry: "Fashion",
        preferred_demographics: JSON.stringify({ age: "18-24", interests: ["Fashion", "Lifestyle"] }),
      },
      // Add more records as needed.
    ]);
  },
  down: async (queryInterface) => {
    // Example simple criteria for deletion. Adjust according to actual identifiable attributes or requirements.
    await queryInterface.bulkDelete("advertisers", { industry: ["Technology", "Fashion"] }, {});
  },
};
