import apiClient from "./apiClient";
import { ENDPOINTS } from "./endPoints";
import { handleApi } from "./index";

export const TokenizeAPI = {
  tokenize: (payload: { model: string; text: string }) =>
    handleApi(apiClient.post(ENDPOINTS.TOKENIZE, payload)),
};
