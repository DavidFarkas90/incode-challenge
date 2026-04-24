export const PAGE_URLS = {
  HOME: "/",
  LOGIN: () => "/log-in",
  FLOWS: () => "/flows",
  IDENTITIES: () => "/identities",
  SESSIONS: () => "/sessions",
};

export const API_URLS = {
  API_BASE_URL: "https://demo-api.incodesmile.com",
  ADD_FACE_TO_DATABASE: () => `${API_URLS.API_BASE_URL}/omni/process/approve`,
  FLOW_BASE_URL: () => `${API_URLS.API_BASE_URL}/omni/flow`,
  FLOWS_LIST: () => `${API_URLS.API_BASE_URL}/omni/flows`,
  DELETE_FLOW_BY_ID: (flowId: string) => `${API_URLS.FLOW_BASE_URL()}/${flowId}`,
  DELETE_CUSTOMER_IDENTITY_BY_ID: (customerId: string) =>
    `${API_URLS.API_BASE_URL}/omni/customer?customerId=${customerId}`,
  LOGOUT: () => `${API_URLS.API_BASE_URL}/executive/logout`,
  VALIDATION_RESULTS_SEARCH_V2: () => `${API_URLS.API_BASE_URL}/omni/validation-results/search/v2`,
  IDENTITIES_SEARCH_V2: () => `${API_URLS.API_BASE_URL}/omni/identities/search/v2`,
};
