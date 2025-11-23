import axios from "axios";

const apiClient = axios.create({
  baseURL: "https://d2f6c380b656.ngrok-free.app",  // <-- your main backend
  timeout: 15000,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// OPTIONAL: attach token to headers dynamically
apiClient.interceptors.request.use(
  async (config) => {
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
