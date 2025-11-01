// src/api.js

const API_URL = "https://mini-auth-z53w.onrender.com";

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
export const loginUser = async (credentials) => {
  const res = await fetch(`${API_BASE}/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(credentials),
  });

  if (!res.ok) {
    const errorText = await res.text();
    throw new Error(`Login failed: ${errorText}`);
  }

  const data = await res.json();

  // ✅ Store both tokens in localStorage
  localStorage.setItem("accessToken", data.accessToken);
  localStorage.setItem("refreshToken", data.refreshToken);

  return data;
};
// Refresh
export const refreshAccessToken = (token) =>
  fetchJSON(`${API_URL}/api/auth/refresh`, {
    method: "POST",
    body: JSON.stringify({ token }),
  });

// Logout
export const logoutUser = async (refreshToken) => {
  const API_BASE = "https://mini-auth-z53w.onrender.com/api/auth";

  const res = await fetch(`${API_BASE}/logout`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ token: refreshToken }),
  });

  if (!res.ok) {
    const errorText = await res.text();
    console.error("Logout failed:", errorText);
    throw new Error(errorText);
  }

  return res.json();
};

