import { createContext, useContext, useState, useEffect } from "react";
import socket from "../socket";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {

  const getStoredUser = () => {
    try {
      const storedUser = localStorage.getItem("user");
      return storedUser ? JSON.parse(storedUser) : null;
    } catch (error) {
      console.error("Failed to parse stored user:", error);
      return null;
    }
  };

  const [user, setUser] = useState(getStoredUser());

  useEffect(() => {
    if (user?._id) {
      socket.connect();
      socket.emit("join", user._id);
    }
  }, [user]);

  const login = (data) => {

    const userData = {
      _id: data._id,
      name: data.name,
      email: data.email,
      role: data.role,
      department: data.department,
      designation: data.designation,
      token: data.token
    };

    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem("user");
    setUser(null);
    socket.disconnect();
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);