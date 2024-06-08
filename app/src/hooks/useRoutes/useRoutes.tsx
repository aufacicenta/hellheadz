export const origin =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `${process.env.NEXT_PUBLIC_PROTOCOL_SCHEME}://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : `${process.env.NEXT_PUBLIC_PROTOCOL_SCHEME}://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

export const routes = {
  home: () => `/`,
  marketplaces: {
    opensea: () => `https://opensea.io/collection/larskristo-hellheadz`,
    magiceden: () => `https://magiceden.io/collections/ethereum/0x853bdaa30cfd5a2ec1e1d75935ebca7a0e52626d`,
    x2y2: () => `https://x2y2.io/collection/larskristo-hellheadz/items`,
  },
  oauth: {
    discord: {
      lkhh: () => `${origin}/oauth/discord/lkhh`,
    },
  },
  artists: {
    index: () => `/artists`,
    larskristo: () => `/artists/larskristo`,
  },
  api: {
    discord: {
      verifyOwnership: () => `/api/discord/verify-ownership`,
    },
    oauth: {
      discord: {
        authorize: () => `/api/oauth/discord/authorize`,
        callback: () => `${origin}/api/oauth/discord/callback`,
      },
    },
  },
};

export const useRoutes = () => routes;
