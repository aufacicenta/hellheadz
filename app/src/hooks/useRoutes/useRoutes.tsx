export const origin =
  process.env.NEXT_PUBLIC_VERCEL_ENV === "production"
    ? `${process.env.NEXT_PUBLIC_PROTOCOL_SCHEME}://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}`
    : `${process.env.NEXT_PUBLIC_PROTOCOL_SCHEME}://${process.env.NEXT_PUBLIC_VERCEL_URL}`;

export const routes = {
  home: () => `/`,
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
