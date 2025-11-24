import apiClient from "./apiClient";
import { ENDPOINTS } from "./endPoints";
import { handleApi } from "./index";
import { SchemaResponse } from "../types";

export const SchemaAPI = {
  generateSchema: (payload: { description: string }): Promise<SchemaResponse> =>
    handleApi<SchemaResponse>(apiClient.post(ENDPOINTS.SCHEMA, payload)),
};
