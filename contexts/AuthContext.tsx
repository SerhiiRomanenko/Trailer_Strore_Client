import React, {
  createContext,
  useState,
  useContext,
  useEffect,
  ReactNode,
  useCallback,
} from "react";
import { User } from "../types";

const API_BASE_URL = "http://localhost:5001/api";

interface ProfileUpdateData {
  name?: string;
  email?: string;
  avatar?: string;
}

interface AuthContextType {
  currentUser: User | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, password: string) => Promise<boolean>;
  logout: () => void;
  updateMyProfile: (
    data: ProfileUpdateData
  ) => Promise<{ success: boolean; message: string }>;
  changePassword: (
    oldPassword: string,
    newPassword: string
  ) => Promise<{ success: boolean; message: string }>;
  forgotPassword: (
    email: string
  ) => Promise<{ success: boolean; message: string }>;
  loading: boolean;
  users: User[];
  updateUser: (userId: string, data: Partial<User>) => Promise<boolean>;
  deleteUser: (userId: string) => Promise<boolean>;
  fetchUsers: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({
  children,
}) => {
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(() =>
    localStorage.getItem("authToken")
  );
  const [loading, setLoading] = useState<boolean>(true);
  const [users, setUsers] = useState<User[]>([]);

  const fetchCurrentUser = useCallback(async (authToken: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${authToken}` },
      });
      if (response.ok) {
        const user = await response.json();
        setCurrentUser(user);
      } else {
        logout();
      }
    } catch (error) {
      console.error("Failed to fetch current user", error);
      logout();
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    const authToken = localStorage.getItem("authToken");
    if (authToken) {
      setToken(authToken);
      fetchCurrentUser(authToken);
    } else {
      setLoading(false);
    }
  }, [fetchCurrentUser]);

  const handleAuthResponse = (data: { token: string; user: User }) => {
    setToken(data.token);
    setCurrentUser(data.user);
    localStorage.setItem("authToken", data.token);
  };

  const register = async (
    name: string,
    email: string,
    password: string
  ): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        handleAuthResponse(data);
        return true;
      } else {
        const error = await response.json();
        alert(`Registration failed: ${error.message}`);
        return false;
      }
    } catch (error) {
      alert("Registration request failed.");
      return false;
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      if (response.ok) {
        const data = await response.json();
        handleAuthResponse(data);
        return true;
      } else {
        const error = await response.json();
        alert(`Login failed: ${error.message}`);
        return false;
      }
    } catch (error) {
      alert("Login request failed.");
      return false;
    }
  };

  const logout = () => {
    setCurrentUser(null);
    setToken(null);
    localStorage.removeItem("authToken");
  };

  const updateMyProfile = async (data: ProfileUpdateData) => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me/profile`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      const result = await response.json();
      if (response.ok) {
        handleAuthResponse(result); // The backend sends back a new token and user object
        return { success: true, message: result.message };
      }
      return {
        success: false,
        message: result.message || "Failed to update profile.",
      };
    } catch (error) {
      return { success: false, message: "Profile update request failed." };
    }
  };

  const changePassword = async (oldPassword: string, newPassword: string) => {
    if (!token) return { success: false, message: "Not authenticated" };
    try {
      const response = await fetch(`${API_BASE_URL}/auth/me/password`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ oldPassword, newPassword }),
      });
      const result = await response.json();
      return { success: response.ok, message: result.message };
    } catch (error) {
      return { success: false, message: "Password change request failed." };
    }
  };

  const forgotPassword = async (email: string) => {
    try {
      const response = await fetch(`${API_BASE_URL}/auth/forgot-password`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const result = await response.json();
      return { success: response.ok, message: result.message };
    } catch (error) {
      return { success: false, message: "Forgot password request failed." };
    }
  };

  const fetchUsers = async () => {
    if (!token) return;
    try {
      const response = await fetch(`${API_BASE_URL}/users`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        const data = await response.json();
        setUsers(data);
      }
    } catch (error) {
      console.error("Failed to fetch users", error);
    }
  };

  const updateUser = async (
    userId: string,
    data: Partial<User>
  ): Promise<boolean> => {
    if (!token) return false;
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(data),
      });
      if (response.ok) {
        await fetchUsers();
        if (currentUser?.id === userId) {
          await fetchCurrentUser(token);
        }
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to update user", error);
      return false;
    }
  };

  const deleteUser = async (userId: string): Promise<boolean> => {
    if (!token || currentUser?.id === userId) return false;
    try {
      const response = await fetch(`${API_BASE_URL}/users/${userId}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      if (response.ok) {
        await fetchUsers();
        return true;
      }
      return false;
    } catch (error) {
      console.error("Failed to delete user", error);
      return false;
    }
  };

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        token,
        login,
        register,
        logout,
        updateMyProfile,
        changePassword,
        forgotPassword,
        loading,
        users,
        updateUser,
        deleteUser,
        fetchUsers,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
};
