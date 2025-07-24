import { createContext, useContext, useState, useEffect } from "react";

// 1. إنشاء السياق
const AuthContext = createContext();

// 2. مزود السياق
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null); // { id, name, type: "admin" | "donor" | ... }
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setLoading(false);
  }, []);

  const login = (userData) => {
    setUser(userData);
    localStorage.setItem("user", JSON.stringify(userData));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, logout, isAuthenticated: !!user, loading }}
    >
      {children}
    </AuthContext.Provider>
  );
};

// 3. هُوك مخصص لسهولة الاستخدام
export const useAuth = () => useContext(AuthContext);
