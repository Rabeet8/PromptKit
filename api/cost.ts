import apiClient from "./apiClient";
import { ENDPOINTS } from "./endPoints";
import { handleApi } from "./index";

export const CostAPI = {
  calculate: (payload: {
    model: string;
    input_tokens: number;
    output_tokens: number;
    calls_per_day: number;
    cache_hit_rate: number;
  }) =>
    handleApi(apiClient.post(ENDPOINTS.COST, payload)),
};
