import apiClient from "./apiClient";
import { ENDPOINTS } from "./endPoints";
import { handleApi } from "./index";
import { LintResponse } from "../types";

export const LintAPI = {
  lintPrompt: (payload: { prompt: string; model: string }): Promise<LintResponse> =>
    handleApi<LintResponse>(apiClient.post(ENDPOINTS.LINT, payload)),
};
