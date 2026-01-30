import { ModelsResponse } from "../types";
import { ENDPOINTS } from "./endPoints";

export const ModelsAPI = {
  getModels: async (): Promise<ModelsResponse> => {
    const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}${ENDPOINTS.MODELS.LIST}`;
    console.log(`[ModelsAPI] Requesting: ${url}`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 30000); // 30s timeout for simple GET

      const response = await fetch(url, {
        method: "GET",
        headers: {
          "Accept": "application/json",
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const text = await response.text();
        console.error(`[ModelsAPI] Error ${response.status}:`, text);
        try {
          const json = JSON.parse(text);
          throw new Error(json.message || json.error || `Server returned ${response.status}`);
        } catch (e) {
          throw new Error(`Server returned ${response.status}: ${text}`);
        }
      }

      const data = await response.json();
      return data;
    } catch (error: any) {
      console.error("[ModelsAPI] Exception:", error);
      throw {
        message: error.message || "Network request failed",
        originalError: error
      };
    }
  },
};
