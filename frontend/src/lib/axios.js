import axios from "axios";

const BASE_URL =
  import.meta.env.MODE === "development"
    ? "http://localhost:5001/api"
    : "/api";

export const axiosInstance = axios.create({
  baseURL: BASE_URL,
  withCredentials: true,
});

// Mutable ref to Clerk's getToken — set synchronously during render by AxiosClerkInterceptor
let _clerkGetToken = null;
export const setClerkGetToken = (fn) => { _clerkGetToken = fn; };

// Module-level interceptor — registered once at import time, always active
axiosInstance.interceptors.request.use(async (config) => {
  if (_clerkGetToken) {
    try {
      const token = await _clerkGetToken();
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch {
      // Not a Clerk session, let cookie auth handle it
    }
  }
  return config;
});

