import axios from "axios"

{/*Auth API Service This service provides functions to interact with the authentication-related endpoints of the backend API.It uses Axios to make HTTP requests and handles user registration by sending data to the appropriate endpoint.*/}

  const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1/auth',
  withCredentials: true,
  });


  {/*Register API Service
  This service handles the registration of new users by sending their data to the backend API.
  It uses Axios to make HTTP POST requests to the registration endpoint. */}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}
 
  {/* Function: register - Sends registration data to the backend API*/}

export async function register({ username, email, password }: RegisterData) {
  try {
    const response = await apiClient.post('/register', {
      username,
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.error("Registration Error:", err);
    throw err; 
  }
}