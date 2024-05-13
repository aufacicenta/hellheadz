type RouteMap = {
  home: () => string;
  market: {
    price: (args: { marketId: string }) => string;
  };
  artists: {
    index: () => string;
    larskristo: () => string;
  };
  api: {
    promptWars: {
      createGuestAccount: () => string;
      create: () => string;
      reveal: () => string;
      resolve: () => string;
    };
    chat: {
      dropboxESign: () => string;
      openai: {
        completionsAPI: () => string;
        assistantsAPI: () => string;
      };
      googleai: {
        completionsAPI: () => string;
      };
    };
  };
  dashboard: {
    latestTrends: () => string;
    promptWars: {
      home: () => string;
      previousMarkets: () => string;
      market: (args: { marketId: string }) => string;
    };
    market: (args: { marketId: string }) => string;
  };
};

export const routes: RouteMap = {
  home: () => `/`,
  market: {
    price: ({ marketId }) => `/market/price/${marketId}`,
  },
  artists: {
    index: () => `/artists`,
    larskristo: () => `/artists/larskristo`,
  },
  api: {
    promptWars: {
      createGuestAccount: () => `/api/prompt-wars/create-guest-account`,
      create: () => `/api/prompt-wars/create`,
      reveal: () => `/api/prompt-wars/reveal`,
      resolve: () => `/api/prompt-wars/resolve`,
    },
    chat: {
      dropboxESign: () => `/api/chat/dropbox-e-sign`,
      openai: {
        completionsAPI: () => `/api/chat/openai/completions`,
        assistantsAPI: () => `/api/chat/openai/assistant`,
      },
      googleai: {
        completionsAPI: () => `/api/chat/googleai/completions`,
      },
    },
  },
  dashboard: {
    latestTrends: () => `/`,
    promptWars: {
      home: () => `/`,
      previousMarkets: () => `/previous-rounds`,
      market: ({ marketId }) => `/${marketId}`,
    },
    market: ({ marketId }) => `/market/${marketId}`,
  },
};

export const useRoutes: () => RouteMap = () => routes;
