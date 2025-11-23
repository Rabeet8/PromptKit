import apiClient from "./apiClient";
import { ENDPOINTS } from "./endPoints";
import { handleApi } from "./index";

export const LintAPI = {
  lintPrompt: (payload: { prompt: string; model: string }) =>
    handleApi(apiClient.post(ENDPOINTS.LINT, payload)),
};
