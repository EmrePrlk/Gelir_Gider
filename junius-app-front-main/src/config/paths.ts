const ROOTS = {
  AUTH: '/auth',
  AUTH_DEMO: '/auth-demo',
  DASHBOARD: '/dashboard',
  LANDING: '/landing',
};

// ----------------------------------------------------------------------

export const paths = {
  // ERROR
  page403: '/error/403',
  page404: '/error/404',
  page500: '/error/500',

  // AUTH
  auth: {
    login: `${ROOTS.AUTH}/login`,
    register: `${ROOTS.AUTH}/register`,
  },

  // LANDING
  landing: {
    root: ROOTS.LANDING,
    developer: `${ROOTS.LANDING}/developer`,
    investor: `${ROOTS.LANDING}/investor`,
    mastermind: `${ROOTS.LANDING}/mastermind`,
    approval: `${ROOTS.LANDING}/approval`,
  },

  // ACCOUNT
  account: {
    root: `/account`,
    edit: (userId: string) => `/account/${userId}/edit`,
    view: (userId: string) => `/account/${userId}`,
    new: `/account/new`,
    settings: `/account/settings`,
  },

  // DASHBOARD
  dashboard: {
    root: ROOTS.DASHBOARD,
    projects: {
      root: `${ROOTS.DASHBOARD}/projects`,
      view: (projectId: string) => `${ROOTS.DASHBOARD}/projects/${projectId}`,
      edit: (projectId: string) =>
        `${ROOTS.DASHBOARD}/projects/${projectId}/edit`,
    },
    ideas: {
      root: `${ROOTS.DASHBOARD}/ideas`,
      new: `${ROOTS.DASHBOARD}/ideas/new`,
      view: (ideaId: string) => `${ROOTS.DASHBOARD}/ideas/${ideaId}`,
      edit: (ideaId: string) => `${ROOTS.DASHBOARD}/ideas/${ideaId}/edit`,
    },
    admin: {
      userList: `${ROOTS.DASHBOARD}/user-list`,
    },
    su: {
      permissions: `${ROOTS.DASHBOARD}/su/permissions`,
    },
  },
};
