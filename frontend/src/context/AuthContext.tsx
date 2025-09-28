import { createContext, useContext, useState, useEffect, ReactNode } from "react";
import axios from "axios";

interface User {
  id: number;
  name: string;
  email: string;
  mobile: string;
}

interface RegisterData {
  name: string;
  email: string;
  mobile: string;
  password: string;
}

export interface AuthContextType {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (data: RegisterData) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(
    localStorage.getItem("token")
  );

  const isAuthenticated = token ? true : false;

  useEffect(() => {
    const fetchUser = async () => {
      try {
        if (token) {
          const res = await axios.get("http://localhost:8000/api/me/", {
            headers: { Authorization: `Bearer ${token}` },
          });
          setUser(res.data);
        }
      } catch (err) {
        console.error("Failed to fetch user from token", err);
        logout();
      }
    };

    fetchUser();
  }, [token]);

  const login = async (email: string, password: string) => {
    const res = await axios.post("http://localhost:8000/auth/jwt/create/", {
      email,
      password,
    });

    const accessToken = res.data.access;
    localStorage.setItem("token", accessToken);
    // localStorage.setItem("refresh", res.data.refresh);
    setToken(accessToken);

    const profile = await axios.get("http://localhost:8000/api/me/", {
      headers: { Authorization: `Bearer ${accessToken}` },
    });

    setUser(profile.data);
  };

  const register = async (data: RegisterData) => {
    await axios.post("http://localhost:8000/auth/users/", data)
  };

  const logout = async () => {
      setToken(null);
      setUser(null);
      localStorage.clear();
      sessionStorage.clear();
  };


  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        isAuthenticated,
        login,
        register,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
