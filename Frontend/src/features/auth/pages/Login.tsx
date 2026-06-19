import { Link, useNavigate } from "react-router-dom";
import "../auth.from.scss"
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

  return (
    <main> 
      <div className="form-container">
        <h1>Login</h1>
        
        
        {error && <p style={{ color: "red" }}>{error}</p>}
        
        {rateLimitTimer && (
        <p style={{ color: "orange" }}>
         Try again in {Math.ceil(rateLimitTimer / 1000)} seconds
        </p>
          )}

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
