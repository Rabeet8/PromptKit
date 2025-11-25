import { auth } from "@/config/firebase";
import { useRouter, useSegments } from "expo-router";
import { signOut as firebaseSignOut, onAuthStateChanged, User } from "firebase/auth";
import React, { createContext, useContext, useEffect, useState } from "react";

interface AuthContextType {
  user: User | null;
  loading: boolean;
  signOut: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType>({
  user: null,
  loading: true,
  signOut: async () => {},
});

export const useAuth = () => useContext(AuthContext);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const segments = useSegments();

  useEffect(() => {
    // Listen to Firebase auth state changes
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      console.log("🔐 Auth state changed:", user ? `Logged in as ${user.email}` : "Not logged in");
      setUser(user);
      setLoading(false);
    });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (loading) return;

    const inAuthGroup = segments[0] === "screens" && segments[1] === "Auth";
    const inResetPassword = segments[0] === "screens" && segments[1] === "ResetPassword";
    const inUserInfo = segments[0] === "screens" && segments[1] === "UserInfo";

    if (!user && !inAuthGroup && !inResetPassword) {
      // Redirect to auth if not logged in
      console.log("🔒 User not authenticated, redirecting to Auth");
      router.replace("/screens/Auth");
    }
    // Don't auto-redirect from Auth screen - let the Auth component handle navigation
    // This allows signup flow to go to UserInfo instead of being forced to Home
  }, [user, loading, segments]);

  const signOut = async () => {
    try {
      await firebaseSignOut(auth);
      console.log("👋 User signed out");
      router.replace("/screens/Auth");
    } catch (error) {
      console.error("❌ Sign out error:", error);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, signOut }}>
      {children}
    </AuthContext.Provider>
  );
}
