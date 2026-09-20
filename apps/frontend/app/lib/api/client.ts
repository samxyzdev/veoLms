/**
 * Shared Axios client for every request to the Express backend.
 *
 * All endpoint modules in this folder go through `apiClient`, so the base URL
 * and error handling live in ONE place.
 *
 * Auth is session based — the backend sets an httpOnly signed `sid` cookie on
 * sign-in (see apps/backend userRoutes). So `withCredentials` is enabled to
 * send/receive that cookie cross-origin, and the backend CORS must allow
 * credentials (it does — see apps/backend index.ts). Do NOT attach tokens
 * from localStorage here.
 */
import axios from "axios";
import type { AxiosError } from "axios";

/** Address of the backend server. Override with VITE_API_BASE_URL in .env. */
const API_BASE_URL =
  import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3000/api/v1";

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15_000,
  withCredentials: true, // session cookie (`sid`) is set/read by the backend
  headers: {
    "Content-Type": "application/json",
  },
});

/** Shape of error bodies returned by the backend. */
interface ApiErrorBody {
  message?: string;
  error?: string;
}

/**
 * Normalize every failed request into an Error whose message is safe to show
 * in the UI (e.g. "Invalid or expired OTP..."). Callers just catch it like a
 * regular Error — no need to inspect axios internals.
 */
apiClient.interceptors.response.use(
  (response) => response,
  (error: AxiosError<ApiErrorBody>) => {
    const serverMessage = error.response?.data?.message;
    const serverError = error.response?.data?.error;

    const fallback = error.response
      ? "Something went wrong. Please try again."
      : error.code === "ECONNABORTED"
        ? "The request timed out. Please try again."
        : "Could not reach the server. Please check your connection.";

    const normalized = new Error(
      typeof serverMessage === "string"
        ? serverMessage
        : typeof serverError === "string"
          ? serverError
          : fallback,
    );
    // Expose the HTTP status so callers can react to auth failures (401/400)
    // without parsing message strings.
    Object.assign(normalized, { status: error.response?.status });
    return Promise.reject(normalized);
  },
);
