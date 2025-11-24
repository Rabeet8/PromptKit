import apiClient from "./apiClient";
import { ENDPOINTS } from "./endPoints";
import { handleApi } from "./index";
import { TokenizeResponse } from "../types";

export const TokenizeAPI = {
  tokenize: (payload: { text: string; model: string }): Promise<TokenizeResponse> =>
    handleApi<TokenizeResponse>(apiClient.post(ENDPOINTS.TOKENIZE, payload)),
};
