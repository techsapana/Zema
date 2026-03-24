import axios from "axios";

const API_URL = import.meta.env.VITE_API_URL;

const apiClient = axios.create({
  baseURL: API_URL,
});

apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      // window.location.href = "/login";
    }
    return Promise.reject(error);
  },
);

export interface LoginCredentials {
  username: string;
  password: string;
}

export interface User {
  id: string;
  email: string;
  role: string;
}

const decodeToken = (token: string): User => {
  const payload = JSON.parse(atob(token.split(".")[1]));
  console.log(payload);
  return {
    id: payload.id,
    email: payload.email,
    role: payload.role,
  };
};

export const loginApi = async (
  credentials: LoginCredentials,
): Promise<User> => {
  console.log("sending credentila", credentials);
  const response = await apiClient.post("/admin/login", credentials);
  const { token } = response.data;

  const user = decodeToken(token);

  localStorage.setItem("token", token);
  localStorage.setItem("user", JSON.stringify(user));

  return user;
};

export const logoutApi = (): void => {
  localStorage.removeItem("token");
  localStorage.removeItem("user");
};

export default apiClient;
