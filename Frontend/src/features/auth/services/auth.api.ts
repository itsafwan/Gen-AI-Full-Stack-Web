import axios from "axios"

{/*Auth API Service This service provides functions to interact with the authentication-related endpoints of the backend API.It uses Axios to make HTTP requests and handles user registration by sending data to the appropriate endpoint.*/}

  const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1/auth',
  withCredentials: true,
  });


  {/*Register API Service
  This service handles the registration of new users by sending their data to the backend API.
  It uses Axios to make HTTP POST requests to the registration endpoint. */}

interface ApiData {
  username: string;
  email: string;
  password: string;
}
 
  {/* Function: register - Sends registration data to the backend API*/}

export async function register({ username, email, password }: ApiData) {
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

{/* Function: login - Sends login data to the backend API*/}

export async function login({ email, password }: ApiData) {
  try {
    const response = await apiClient.post('/login', {
      email,
      password,
    });
    return response.data;
  } catch (err) {
    console.error("Login Error:", err);
    throw err;
  }
}

{/* Function: logout - Sends logout request to the backend API*/}

export async function logout() {
  try {
    const response = await apiClient.post('/logout');
    return response.data;
  } catch (err) {
    console.error("Logout Error:", err);
    throw err;
  }
}

{/* Function: getMe - Retrieves current user information */}

export async function getMe() {
  try {
    const response = await apiClient.get('/get-user');
    return response.data;
  } catch (err) {
    console.error("Get User Error:", err);
    throw err;
  } 
}