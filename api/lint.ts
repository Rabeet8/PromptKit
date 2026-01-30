import { LintResponse } from "../types";
import { ENDPOINTS } from "./endPoints";

export const LintAPI = {
  lintPrompt: async (payload: { prompt: string; model: string }): Promise<LintResponse> => {
    const url = `${process.env.EXPO_PUBLIC_API_BASE_URL}${ENDPOINTS.LINT}`;
    console.log(`[LintAPI] Requesting: ${url}`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 60000); // 60s timeout

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
        console.error(`[LintAPI] Error ${response.status}:`, text);
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
      console.error("[LintAPI] Exception:", error);
      throw {
        message: error.message || "Network request failed",
        originalError: error
      };
    }
  },
};
