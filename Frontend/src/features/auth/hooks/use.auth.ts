import { useContext } from "react";
import { AuthContext } from "../context";
import { Login } from "../services";


export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setuser, loading, setloading } = context;

  const handleLogin = async ({ email, password }: { email: string, password: string }) => {
  setloading(true);
  try {
    const data = await Login({ email, password });
    setuser(data.user); 
  } catch (error) {
    console.error("Login Error:", error);
  } finally {
    setloading(false); 
  }
};

  return { user, loading, handleLogin };
};