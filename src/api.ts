import axios from 'axios';

const API_URL = import.meta.env.VITE_BACKEND_URL; 

// In-memory token storage
let memoryToken: string | null = null;

export const setInMemoryToken = (token: string | null) => {
  memoryToken = token;
};

export const getInMemoryToken = () => memoryToken;

export const api = axios.create({
  baseURL: API_URL,
  withCredentials: true, // Crucial for auto-sending the HttpOnly refreshToken cookie
});

// Inject token into every outgoing request
api.interceptors.request.use((config) => {
  if (memoryToken) {
    config.headers.Authorization = `Bearer ${memoryToken}`;
  }
  return config;
});

// Intercept 401s to refresh token silently
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Check if error is 401 and we haven't retried this specific request yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        // Hit the refresh token endpoint silently
        const response = await axios.get(`${API_URL}/auth/refreshToken`, {
          withCredentials: true,
        });

        const { accessToken } = response.data;
        
        // Update local memory token
        setInMemoryToken(accessToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Refresh token expired or missing -> Wipe token and let Route bounce user
        setInMemoryToken(null);
        return Promise.reject(refreshError);
      }
    }

    return Promise.reject(error);
  }
);  