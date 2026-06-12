import { Link } from "react-router-dom";
import "../auth.from.scss"


{/* Login Form */}

const Login = () => {

 const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
};

  

  return (
    <>
    {/* Main Content */}
    <main> 
     <div className="form-container">
      <h1>Login</h1>
      {/* Form handling logic */}
      <form onSubmit={handleSubmit}>

        {/* Email Input Field */}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" placeholder="Enter your email" />
        </div>

        {/* Password Input Field */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" placeholder="Enter your password" />
        </div>
        
        {/* Submit Button */}
        <button type="submit" className="button primary-button">Login</button>
      </form>

          {/* Link to Register Page */}

        <p>Don't have an account? <Link to="/register">Register</Link></p>
     </div>
    </main>
    </>
  )
}

export default Login
