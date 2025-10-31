// src/api.js

const API_URL = process.env.REACT_APP_API_URL || "http://localhost:5000";

// Universal fetch helper
async function fetchJSON(url, options = {}) {
  const res = await fetch(url, {
    credentials: "include",
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(options.headers || {}),
    },
  });

  // Handle 401 errors with refresh token logic
  if (res.status === 401) {
    const refreshToken = localStorage.getItem("refreshToken");
    if (refreshToken) {
      const refreshRes = await fetch(`${API_URL}/api/auth/refresh`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: refreshToken }),
      });

      if (refreshRes.ok) {
        const refreshData = await refreshRes.json();
        localStorage.setItem("accessToken", refreshData.accessToken);

        // Retry the original request with new token
        const retryRes = await fetch(url, {
          ...options,
          headers: {
            ...(options.headers || {}),
            Authorization: `Bearer ${refreshData.accessToken}`,
            "Content-Type": "application/json",
          },
        });

        return retryRes.json();
      } else {
        // Refresh token invalid → clear tokens
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");
        return { error: "Session expired, please log in again" };
      }
    }
  }

  // Return JSON normally
  try {
    const data = await res.json();
    return data;
  } catch {
    return { error: "Invalid server response" };
  }
}

// ========== API ENDPOINTS ==========

// Register
export const registerUser = (userData) =>
  fetchJSON(`${API_URL}/api/auth/register`, {
    method: "POST",
    body: JSON.stringify(userData),
  });

// Login
export const loginUser = (userData) =>
  fetchJSON(`${API_URL}/api/auth/login`, {
    method: "POST",
    body: JSON.stringify(userData),
  });

// Refresh
export const refreshAccessToken = (token) =>
  fetchJSON(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    body: JSON.stringify({ token }),
  });

// Logout
export const logoutUser = (token) =>
  fetchJSON(`${API_URL}/api/auth/logout`, {
    method: "POST",
    body: JSON.stringify({ token }),
  });
