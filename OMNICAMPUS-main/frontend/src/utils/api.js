import { apiFetch } from "../utils/api";

// Then inside your submit function:
const response = await apiFetch("/api/auth/student-login", {
  method: "POST",
  body: JSON.stringify(payload)
});