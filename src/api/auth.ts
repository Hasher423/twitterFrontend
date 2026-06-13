// import axios from "axios";
import axios from "axios";

export const refreshAccessToken = async () => {
  const response = await axios.get(`${import.meta.env.VITE_BACKEND_URL}/auth/refreshToken`,{
    withCredentials:true
  });

  return response.data.accessToken;
};