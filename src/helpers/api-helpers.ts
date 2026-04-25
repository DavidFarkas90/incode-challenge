import { APIRequestContext, expect } from "@playwright/test";
import { API_URLS } from "../constants/urls";
import { StatusCodes } from "../constants/status-codes";

let _token = "";
let _apiKey = "";

const DEFAULT_SEARCH_PARAMS = { offset: 0, limit: 20, avoidCounting: true };

export function setApiCredentials(token: string, apiKey: string): void {
  _token = token;
  _apiKey = apiKey;
}

function buildHeaders() {
  return {
    accept: "application/json",
    "api-version": "1.0",
    "content-type": "application/json",
    "x-api-key": _apiKey,
    "x-incode-hardware-id": _token,
  };
}

export async function deleteFlowsById(request: APIRequestContext, flowId: string): Promise<void> {
  const response = await request.delete(API_URLS.DELETE_FLOW_BY_ID(flowId), {
    headers: buildHeaders(),
  });
  expect(response.status()).toBe(StatusCodes.SUCCESS);
  expect((await response.json()).success).toBe(true);
}

async function deleteCustomerIdentitiesById(
  request: APIRequestContext,
  customerId: string,
): Promise<void> {
  const response = await request.delete(API_URLS.DELETE_CUSTOMER_IDENTITY_BY_ID(customerId), {
    headers: buildHeaders(),
  });
  expect(response.status()).toBe(StatusCodes.SUCCESS);
  expect((await response.json()).success).toBe(true);
}

export async function deleteAllExistingIdentities(request: APIRequestContext): Promise<void> {
  const identityIdsToDelete: string[] = await getAllIdentityIds(request);
  await Promise.all(
    identityIdsToDelete.map((identityId) => deleteCustomerIdentitiesById(request, identityId)),
  );
}

export async function deleteFlowsByName(
  request: APIRequestContext,
  flowName: string,
): Promise<void> {
  const flowIdsToDelete: string[] = await getFlowsIdsByName(request, flowName);
  await Promise.all(flowIdsToDelete.map((flowId) => deleteFlowsById(request, flowId)));
}

export async function logout(request: APIRequestContext): Promise<void> {
  const response = await request.post(API_URLS.LOGOUT(), {
    headers: buildHeaders(),
  });
  expect(response.status()).toBe(StatusCodes.SUCCESS);
}

export async function getValidatedSessionNames(request: APIRequestContext): Promise<string[]> {
  const response = await request.post(API_URLS.VALIDATION_RESULTS_SEARCH_V2(), {
    headers: buildHeaders(),
    params: DEFAULT_SEARCH_PARAMS,
    data: {},
  });
  expect(response.status()).toBe(StatusCodes.SUCCESS);
  const body = await response.json();
  return body.interviews.map((interview: { name: string }) => interview.name).filter(Boolean);
}

export async function getAllIdentityIds(request: APIRequestContext): Promise<string[]> {
  const response = await request.post(API_URLS.IDENTITIES_SEARCH_V2(), {
    headers: buildHeaders(),
    params: DEFAULT_SEARCH_PARAMS,
    data: {},
  });
  expect(response.status()).toBe(StatusCodes.SUCCESS);
  const body = await response.json();
  return body.identities.map((identity: { _id: string }) => identity._id).filter(Boolean);
}

export async function getFlowsIdsByName(
  request: APIRequestContext,
  name: string,
): Promise<string[]> {
  const response = await request.get(API_URLS.FLOWS_LIST(), {
    headers: buildHeaders(),
  });
  expect(response.status()).toBe(StatusCodes.SUCCESS);
  const body = await response.json();
  return body.content
    .filter((flow: { name: string; _id: string }) => flow.name.includes(name))
    .map((flow: { _id: string }) => flow._id)
    .filter(Boolean);
}
