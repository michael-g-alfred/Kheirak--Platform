import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged } from "firebase/auth";
import { auth, db } from "../../Firebase/Firebase";
import { doc, getDoc } from "firebase/firestore";
import { monitorAuthState } from "../../Firebase/auth";
import { doSignOut } from "../../Firebase/auth";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(null);
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);

  const isAuthenticated = !!currentUser;
  const role = userData?.role || "guest";
  const username = userData?.username || "guest";

  const logout = async () => {
    try {
      await doSignOut();
      setCurrentUser(null);
      setUserData(null);
    } catch (error) {
      console.error("Error during logout:", error);
    }
  };

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      setCurrentUser(user);

      if (user) {
        try {
          const userDoc = await getDoc(doc(db, "users", user.uid));
          if (userDoc.exists()) {
            setUserData(userDoc.data());
          }
        } catch (err) {
          console.error("Error fetching user data", err);
        }
      } else {
        setUserData(null);
      }

      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  useEffect(() => {
    const unsubscribe = monitorAuthState((user) => {
      setUser(user);
    });
    return () => unsubscribe();
  }, []);

  return (
    <AuthContext.Provider
      value={{
        currentUser,
        userData,
        isAuthenticated,
        role,
        logout,
        loading,
        username,
      }}>
      {!loading && children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
