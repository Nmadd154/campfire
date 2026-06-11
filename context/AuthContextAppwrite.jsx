import { createContext, useContext, useEffect, useState } from "react";
import { authService } from "../services";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  // Check if user is already logged in on app start
  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    try {
      const currentUser = await authService.getCurrentUser();
      if (currentUser) {
        // Get full user profile from database
        const userProfile = await authService.getUserProfile(currentUser.$id);
        setUser({
          id: currentUser.$id,
          email: currentUser.email,
          name: currentUser.name,
          avatar: userProfile?.avatar,
          bio: userProfile?.bio,
        });
        setIsAuthenticated(true);
      }
    } catch (error) {
      console.log("No user logged in", error);
    } finally {
      setIsLoading(false);
    }
  };

  const login = async (email, password) => {
    try {
      // Delete any existing session first
      try {
        await authService.logout();
      } catch (e) {
        // Ignore errors if no session exists
      }

      await authService.login(email, password);
      const currentUser = await authService.getCurrentUser();
      const userProfile = await authService.getUserProfile(currentUser.$id);

      setUser({
        id: currentUser.$id,
        email: currentUser.email,
        name: currentUser.name,
        avatar: userProfile?.avatar,
        bio: userProfile?.bio,
      });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Login error:", error);
      return { success: false, error: error.message };
    }
  };

  const register = async (email, password, name) => {
    try {
      const newUser = await authService.register(email, password, name);

      // Create user profile in database
      await authService.createUserProfile(newUser.$id, name, email);

      // User is automatically logged in after registration
      const currentUser = await authService.getCurrentUser();
      const userProfile = await authService.getUserProfile(currentUser.$id);

      setUser({
        id: currentUser.$id,
        email: currentUser.email,
        name: currentUser.name,
        avatar: userProfile?.avatar,
        bio: userProfile?.bio,
      });
      setIsAuthenticated(true);
      return { success: true };
    } catch (error) {
      console.error("Register error:", error);
      return { success: false, error: error.message };
    }
  };

  const logout = async () => {
    try {
      await authService.logout();
    } catch (error) {
      // Ignore error if no session exists
      console.log("Logout session error (ignored):", error);
    }
    // Always clear local state regardless of API result
    setUser(null);
    setIsAuthenticated(false);
    return { success: true };
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated,
        isLoading,
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
