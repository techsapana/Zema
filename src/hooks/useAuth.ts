import { useState } from "react";
import {
  loginApi,
  logoutApi,
  type LoginCredentials,
  type User,
} from "../api/authApi";

const getStoredUser = (): User | null => {
  try {
    const user = localStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  } catch {
    return null;
  }
};

export function useAuth() {
  const [user, setUser] = useState<User | null>(getStoredUser);

  const login = async (credentials: LoginCredentials) => {
    const user = await loginApi(credentials);
    setUser(user);
  };

  const logout = () => {
    logoutApi();
    setUser(null);
  };

  return {
    user,
    isLoggedIn: !!user,
    login,
    logout,
  };
}
