import {  useEffect, useState } from "react";
import { AuthContext, type User } from "./auth.context";
import { Getme, setupInterceptors } from "../services";
import { setAccessToken } from "../services/authStore";
export const AuthProvider = ({ children }: { children: React.ReactNode }) =>{
  const [user,setuser] = useState<User | null>(null);
  const [loading,setloading] = useState(true);
  const [rateLimitTimer, setRateLimitTimer] = useState<number | null>(null);

   useEffect(() => {
   const getAndSetUser = async () => {
    try {
      const data = await Getme(); 
      setuser(data.user);
      if (data.accessToken) {
        setAccessToken(data.accessToken);
      }
    } catch (err) {
      console.error(err);
      setuser(null);
    } finally {
      setloading(false);
    }
  };
  getAndSetUser();
  setupInterceptors(setRateLimitTimer);
}, []);

  useEffect(() => {
  if (rateLimitTimer === null) return;

  const interval = setInterval(() => {
    setRateLimitTimer((prev) => {
      if (prev === null || prev <= 1000) {
        return null;
      }

      return prev - 1000;
    });
  }, 1000);

  return () => clearInterval(interval);
}, [rateLimitTimer]);

  


  return(
    <AuthContext.Provider value={{user,setuser,loading,setloading,rateLimitTimer,setRateLimitTimer}}>
      {children}
    </AuthContext.Provider>
  )

}