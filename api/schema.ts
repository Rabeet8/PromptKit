import { SchemaResponse } from "../types";
import { ENDPOINTS } from "./endPoints";

export const SchemaAPI = {
  generateSchema: async (payload: { description: string }): Promise<SchemaResponse> => {
    const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}${ENDPOINTS.SCHEMA}`;
    console.log(`[SchemaAPI] Requesting: ${url}`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout for LLM

      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "Accept": "application/json",
        },
        body: JSON.stringify(payload),
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const text = await response.text();
        console.error(`[SchemaAPI] Error ${response.status}:`, text);
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
      console.error("[SchemaAPI] Exception:", error);
      throw {
        message: error.message || "Network request failed",
        originalError: error
      };
    }
  },
};
