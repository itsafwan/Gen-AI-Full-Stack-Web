import axios from "axios"

{/*Interface for registration data & login data */}

interface RegisterData {
  username: string;
  email: string;
  password: string;
}

interface LoginData {
  email: string;
  password: string;
}

{/*Auth API Service This service provides functions to interact with the authentication-related endpoints of the backend API.It uses Axios to make HTTP requests and handles user registration by sending data to the appropriate endpoint.*/}

  const apiClient = axios.create({
  baseURL: 'http://localhost:8000/api/v1/auth',
  withCredentials: true,
  });


 
  {/* Function: register - Sends registration data to the backend API*/}

export async function Register({ username, email, password }: RegisterData) {
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

export async function Login({ email, password }: LoginData) {
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

export async function Logout() {
  try {
    const response = await apiClient.post('/logout');
    return response.data;
  } catch (err) {
    console.error("Logout Error:", err);
    throw err;
  }
}

{/* Function: getMe - Retrieves current user information */}

export async function Getme() {
  try {
    const response = await apiClient.get('/get-user');
    return response.data;
  } catch (err) {
    console.error("Get User Error:", err);
    throw err;
  } 
}