export const routes = {
  home: () => `/`,
  oauth: {
    discord: () => `${process.env.NEXT_PUBLIC_ORIGIN}/oauth/discord`,
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
        callback: () => `${process.env.NEXT_PUBLIC_ORIGIN}/api/oauth/discord/callback`,
      },
    },
  },
};

export const useRoutes = () => routes;
