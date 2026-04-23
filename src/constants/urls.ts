export const PAGE_URLS = {
  HOME: "https://demo-dashboard.incode.com",
  LOGIN: () => `${PAGE_URLS.HOME}/log-in`,
  FLOWS: () => `${PAGE_URLS.HOME}/flows`,
  IDENTITIES: () => `${PAGE_URLS.HOME}/identities`,
  SESSIONS: () => `${PAGE_URLS.HOME}/sessions`,
};

export const API_URLS = {
  API_BASE_URL: "https://demo-api.incodesmile.com",
  FLOW_BASE_URL: () => `${API_URLS.API_BASE_URL}/omni/flow`,
  DELETE_FLOW_BY_ID: (flowId: string) => `${API_URLS.FLOW_BASE_URL()}/${flowId}`,
  LOGOUT: () => `${API_URLS.API_BASE_URL}/executive/logout`,
};
