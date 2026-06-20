import { useContext, useState } from "react";
import axios from "axios"; 
import { AuthContext } from "../context";
import { Login, Logout, Register } from "../services";

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }

  const { user, setuser, loading, setloading,rateLimitTimer,setRateLimitTimer } = context;
  const [error, setError] = useState<string | null>(null);

const getErrorMessage = (err: unknown): string => {
  if (axios.isAxiosError(err)) {
    return err.response?.data?.message || "Something went wrong";
  }
  if (err instanceof Error) {  
    return err.message
  }
  return "An unexpected error occurred";
};

  const handleLogin = async ({ email, password }: { email: string, password: string }) => {
  setloading(true);
  setError(null);
  try {
    const data = await Login({ email, password });
    setuser(data.user);
    return true; 
  } catch (err) {
    setError(getErrorMessage(err));
    return false; 
  } finally {
    setloading(false);
  }
};

  const handleRegister = async ({ username, email, password }: { username: string, email: string, password: string }) => {
    setloading(true);
    setError(null);
    try {
      const data = await Register({ username, email, password });
      setuser(data.user);
      return true
    } catch (err) {
      setError(getErrorMessage(err));
      return false 
    } finally {
      setloading(false);
    }
  };

  const handleLogout = async () => {
    setloading(true);
    try {
      await Logout();
      setuser(null);
      setError(null);
    } catch (err) {
      setError(getErrorMessage(err));
    } finally {
      setloading(false);
    }
  };

  
  return { user, loading, handleLogin, handleRegister, handleLogout, error,rateLimitTimer,setRateLimitTimer};
};