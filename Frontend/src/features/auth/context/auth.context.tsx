import { createContext  } from "react";


export interface User {
  id: string;
  username: string;
  email: string;
}

interface AuthContextType {
  user: User | null; 
  setuser: React.Dispatch<React.SetStateAction<User | null>>;
  loading: boolean;
  setloading: React.Dispatch<React.SetStateAction<boolean>>;
  rateLimitTimer: number | null;
  setRateLimitTimer: React.Dispatch<React.SetStateAction<number | null>>;
}

export const AuthContext = createContext<AuthContextType | undefined>(undefined);


