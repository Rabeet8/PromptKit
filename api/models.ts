import apiClient from "./apiClient";
import { ENDPOINTS } from "./endPoints";
import { handleApi } from "./index";

export const ModelsAPI = {
  getModels: () => handleApi(apiClient.get(ENDPOINTS.MODELS.LIST)),
};
