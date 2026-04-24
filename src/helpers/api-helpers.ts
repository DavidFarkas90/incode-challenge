import { APIRequestContext, expect } from "@playwright/test";
import { API_URLS } from "../constants/urls";
import { StatusCodes } from "../constants/status-codes";

let _token = "";
let _apiKey = "";

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
    params: { offset: 0, limit: 20, avoidCounting: true },
    data: {},
  });
  expect(response.status()).toBe(StatusCodes.SUCCESS);
  const body = await response.json();
  return body.interviews.map((interview: { name: string }) => interview.name).filter(Boolean);
}
