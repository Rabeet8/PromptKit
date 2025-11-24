import apiClient from "./apiClient";
import { ENDPOINTS } from "./endPoints";
import { handleApi } from "./index";
import { CostResponse } from "../types";

export const CostAPI = {
  calculateCost: (payload: {
    model: string;
    input_tokens: number;
    output_tokens: number;
    calls_per_day: number;
    cache_rate: number;
  }): Promise<CostResponse> =>
    handleApi<CostResponse>(apiClient.post(ENDPOINTS.COST, payload)),
};
