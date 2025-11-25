import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL;

// Debug: Log the base URL to verify it's being loaded
console.log("🔍 API Base URL from env:", baseURL);
console.log("🔍 All EXPO_PUBLIC_ vars:", Object.keys(process.env).filter(key => key.startsWith('EXPO_PUBLIC_')));

if (!baseURL) {
  console.error("❌ EXPO_PUBLIC_API_BASE_URL is not defined!");
  throw new Error(
    "EXPO_PUBLIC_API_BASE_URL is not defined in environment variables. Please check your .env file."
  );
}

const apiClient = axios.create({
  baseURL,
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// OPTIONAL: attach token to headers dynamically
apiClient.interceptors.request.use(
  async (config) => {
    // Debug: Log the full URL being called
    const fullURL = `${config.baseURL}${config.url}`;
    console.log("🌐 API Request:", config.method?.toUpperCase(), fullURL);

    // If you store token in async storage:
    // const token = await AsyncStorage.getItem("token");

    const token = null; // replace logic later
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default apiClient;
