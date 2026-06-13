import { useState } from "react";
import { AuthContext } from "./auth.context";

export const AuthProvider = ({ children }: { children: React.ReactNode }) =>{
  const [user,setuser] = useState(null);
  const [loading,setloading] = useState(false);


  return(
    <AuthContext.Provider value={{user,setuser,loading,setloading}}>
      {children}
    </AuthContext.Provider>
  )

}