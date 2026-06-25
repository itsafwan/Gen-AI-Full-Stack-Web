import axios from "axios";

const apiClient = axios.create({
  baseURL:"/api/v1/interview",
  withCredentials:true
})