import { useNavigate , Link} from "react-router-dom";
import "../auth.from.scss"

 {/* Register Form */ }

const Register = () => {

  const navigate = useNavigate();

   const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
  };

  return (
    <>
    {/* Main Content */}
    <main> 
     <div className="form-container">
      <h1>Register</h1>
      {/* Form handling logic */}
      <form onSubmit={handleSubmit}>

         {/* Username Input Field */}
        <div className="input-group">
          <label htmlFor="username">Username</label>
          <input type="text" id="username" name="username" placeholder="Enter your username" />
        </div>

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
        <button type="submit" className="button primary-button">Register</button>
      </form>

        {/* Link to Login Page */}

        <p>Already have an account? <Link to="/login">Login</Link></p>

     </div>
    </main>
    </>
  )
}

export default Register
