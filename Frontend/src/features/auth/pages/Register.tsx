import { useNavigate , Link} from "react-router-dom";
import "../auth.from.scss"
import { useState } from "react";
import { useAuth } from "../hooks/use.auth";

 {/* Register Form */ }

const Register = () => {

  const { loading, handleRegister } = useAuth();
  const navigate = useNavigate();
  const [username, setusername] = useState("")
  const [email, setemail] = useState("")
  const [password, setpassword] = useState("")

   const handleSubmit = async (e: React.SubmitEvent<HTMLFormElement>) => {
  e.preventDefault();
  await handleRegister ({username,email,password})
  navigate('/')
  };

  if(loading){
    return <main><h1>Loading....</h1></main>
  }

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
          <input onChange={(e)=>{setusername(e.target.value)}} type="text" id="username" name="username" placeholder="Enter your username" />
        </div>

        {/* Email Input Field */}
        <div className="input-group">
          <label htmlFor="email">Email</label>
          <input onChange={(e)=>{setemail(e.target.value)}} type="email" id="email" name="email" placeholder="Enter your email" />
        </div>

        {/* Password Input Field */}
        <div className="input-group">
          <label htmlFor="password">Password</label>
          <input onChange={(e)=>{setpassword(e.target.value)}} type="password" id="password" name="password" placeholder="Enter your password" />
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
