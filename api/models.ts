import apiClient from "./apiClient";
import { ENDPOINTS } from "./endPoints";
import { handleApi } from "./index";
import { ModelsResponse } from "../types";

export const ModelsAPI = {
  getModels: (): Promise<ModelsResponse> => handleApi<ModelsResponse>(apiClient.get(ENDPOINTS.MODELS.LIST)),
};
