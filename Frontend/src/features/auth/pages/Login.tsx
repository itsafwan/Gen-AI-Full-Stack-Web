import { Link, useNavigate } from "react-router-dom";
import "../auth.from.scss"
import "../auth.ratelimite.scss"
import { useAuth } from "../hooks/use.auth";
import { useState } from "react";


{/* Login Form */}

const Login = () => {
  const { loading, handleLogin, error,rateLimitTimer } = useAuth(); 
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    const success = await handleLogin({ email, password });

  if (success) {
    navigate("/"); 
  }
  };

   if (rateLimitTimer && rateLimitTimer > 0) {
    return (
      <main className="rate-limit-screen">
        <div className="rate-limit-box">
          <h1>Too Many Requests</h1>
          <h2>{Math.ceil(rateLimitTimer / 1000)}</h2>
          <p>Please wait...</p>
        </div>
      </main>
    );
  }

  return (
    <main> 
      <div className="form-container">
        <h1>Login</h1>
        
        
        {error && <p style={{ color: "red" }}>{error}</p>}
        

        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="email">Email</label>
            <input 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              type="email" id="email" required 
            />
          </div>

          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              type="password" id="password" required 
            />
          </div>
          
          <button type="submit" className="button primary-button" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p>Don't have an account? <Link to="/register">Register</Link></p>
      </div>
    </main>
  );
};
export default Login
