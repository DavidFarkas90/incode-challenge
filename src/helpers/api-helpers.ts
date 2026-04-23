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
