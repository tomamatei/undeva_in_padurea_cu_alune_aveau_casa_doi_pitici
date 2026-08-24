import * as SecureStore from "expo-secure-store";
import { createContext, useContext, useEffect, useState } from "react";

type AuthContextType = {
  userToken: string | null;
  loading: boolean;
  signIn: (token: string) => Promise<void>;
  signOut: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({
    children,
}: {
  children: React.ReactNode;
}) {
  const [userToken, setUserToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadToken();
  }, []);

  async function loadToken() {
    const token = await SecureStore.getItemAsync("token");
    setUserToken(token);
    setLoading(false);
  }

  async function signIn(token: string) {
    await SecureStore.setItemAsync("token", token);
    setUserToken(token);
  }

  async function signOut() {
    await SecureStore.deleteItemAsync("token");
    setUserToken(null);
  }

  return (
    <AuthContext.Provider
      value={{
        userToken,
        loading,
        signIn,
        signOut,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used inside AuthProvider");
  }

  return context;
}