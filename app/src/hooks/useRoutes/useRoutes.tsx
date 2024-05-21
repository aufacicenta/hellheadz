export const routes = {
  home: () => `/`,
  oauth: {
    discord: {
      lkhh: () =>
        `${process.env.NEXT_PUBLIC_HTTP_PROTOCOL}://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/oauth/discord/lkhh`,
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
        callback: () =>
          `${process.env.NEXT_PUBLIC_HTTP_PROTOCOL}://${process.env.NEXT_PUBLIC_VERCEL_PROJECT_PRODUCTION_URL}/api/oauth/discord/callback`,
      },
    },
  },
};

export const useRoutes = () => routes;
