import Moralis from "moralis";

const loadClient = async () =>
  await Moralis.start({
    apiKey: process.env.MORALIS_API_KEY,
  });

export default {
  loadClient,
  client: Moralis,
};
