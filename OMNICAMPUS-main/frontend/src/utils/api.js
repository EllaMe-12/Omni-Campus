const API_BASE_URL = (
  import.meta.env.VITE_API_URL ||
  "https://omni-campus-backend-e09d.onrender.com"
).trim().replace(/\/+$/, "");

export async function apiFetch(endpoint, options = {}) {
  const normalizedEndpoint = endpoint.startsWith("/")
    ? endpoint
    : `/${endpoint}`;

  const response = await fetch(`${API_BASE_URL}${normalizedEndpoint}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
    },
  });

  return response;
}