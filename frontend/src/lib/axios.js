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

// Module-level request interceptor — registered once at import time, always active
axiosInstance.interceptors.request.use(async (config) => {
  if (_clerkGetToken) {
    try {
      // Race with 2500ms timeout so Clerk JWT token loads reliably for requests
      const token = await Promise.race([
        _clerkGetToken(),
        new Promise((_, reject) => setTimeout(() => reject(new Error("Clerk timeout")), 2500))
      ]);
      if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
      }
    } catch {
      // Not a Clerk session, let cookie auth handle it immediately
    }
  }
  return config;
});

// Response interceptor: automatically refresh expired Clerk tokens and retry failed requests
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
    if (
      error.response?.status === 401 &&
      _clerkGetToken &&
      originalRequest &&
      !originalRequest._retry
    ) {
      originalRequest._retry = true;
      try {
        // Fetch fresh token skipping local cache
        const freshToken = await _clerkGetToken({ skipCache: true });
        if (freshToken) {
          originalRequest.headers["Authorization"] = `Bearer ${freshToken}`;
          return axiosInstance(originalRequest);
        }
      } catch (refreshErr) {
        console.warn("Could not refresh Clerk token:", refreshErr);
      }
    }
    return Promise.reject(error);
  }
);
