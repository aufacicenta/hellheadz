module.exports = {
  up: async (queryInterface) => {
    await queryInterface.bulkInsert("locations", [
      {
        city: "New York",
        state: "NY",
        country: "USA",
        latitude: 40.712776,
        longitude: -74.005974,
      },
      {
        city: "Los Angeles",
        state: "CA",
        country: "USA",
        latitude: 34.052235,
        longitude: -118.243683,
      },
      {
        city: "Chicago",
        state: "IL",
        country: "USA",
        latitude: 41.878113,
        longitude: -87.629799,
      },
      {
        city: "Houston",
        state: "TX",
        country: "USA",
        latitude: 29.760427,
        longitude: -95.369804,
      },
      {
        city: "Phoenix",
        state: "AZ",
        country: "USA",
        latitude: 33.448376,
        longitude: -112.074036,
      },
      {
        city: "Philadelphia",
        state: "PA",
        country: "USA",
        latitude: 39.952584,
        longitude: -75.165222,
      },
      {
        city: "San Antonio",
        state: "TX",
        country: "USA",
        latitude: 29.424122,
        longitude: -98.493629,
      },
      {
        city: "San Diego",
        state: "CA",
        country: "USA",
        latitude: 32.715736,
        longitude: -117.161087,
      },
      {
        city: "Dallas",
        state: "TX",
        country: "USA",
        latitude: 32.776664,
        longitude: -96.796988,
      },
      {
        city: "San Jose",
        state: "CA",
        country: "USA",
        latitude: 37.338207,
        longitude: -121.88633,
      },
    ]);
  },
  down: async (queryInterface) => {
    await queryInterface.bulkDelete("locations", null, {});
  },
};
