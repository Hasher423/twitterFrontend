import axios from "axios";
import { api } from "./axios";

export const setupInterceptor = (
  accessToken: string,
  setAccessToken: (token: string) => void
) => {
  api.interceptors.request.use((config) => {
    if (accessToken) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }

    return config;
  });

  api.interceptors.response.use(
    (response) => response,
    async (error) => {
      const originalRequest = error.config;

      if (
        error.response?.status === 401 &&
        !originalRequest._retry
      ) {
        originalRequest._retry = true;

        const { data } = await axios.get(
          `${import.meta.env.VITE_API_URL}/refreshToken`,
          { withCredentials: true }
        );

        setAccessToken(data.accessToken);

        originalRequest.headers.Authorization =
          `Bearer ${data.accessToken}`;

        return api(originalRequest);
      }

      return Promise.reject(error);
    }
  );
};