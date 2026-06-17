import {  useEffect, useState } from "react";
import { AuthContext, type User } from "./auth.context";
import { Getme } from "../services";
import { setAccessToken } from "../services/authStore";
export const AuthProvider = ({ children }: { children: React.ReactNode }) =>{
  const [user,setuser] = useState<User | null>(null);
  const [loading,setloading] = useState(true);

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
}, []);

  return(
    <AuthContext.Provider value={{user,setuser,loading,setloading}}>
      {children}
    </AuthContext.Provider>
  )

}