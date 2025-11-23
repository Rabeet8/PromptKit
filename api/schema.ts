import apiClient from "./apiClient";
import { ENDPOINTS } from "./endPoints";
import { handleApi } from "./index";

export const SchemaAPI = {
  generateSchema: (payload: { description: string }) =>
    handleApi(apiClient.post(ENDPOINTS.SCHEMA, payload)),
};
