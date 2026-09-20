/**
 * Auth endpoints — everything under `/otp` and `/user` on the backend.
 *
 * Group requests by domain (auth, courses, admin, ...) in their own file and
 * re-export them from `./index.ts`. Pages should only import from this layer,
 * never call `apiClient` directly.
 */
import { apiClient } from "./client";

/** Ask the backend to email a 6-digit code to `email`. */
export function generateOtp(email: string): Promise<void> {
  return apiClient.post("/otp/generate-otp", { email }).then(() => undefined);
}

/** Fields the backend expects for `/user/signup`. */
export interface SignUpInput {
  name: string;
  email: string;
  password: string;
  otp: string;
}

/** Create the account. The backend only creates the user when `otp` is correct. */
export function signUp(input: SignUpInput): Promise<void> {
  return apiClient.post("/user/signup", input).then(() => undefined);
}

/**
 * Log the user in with email + password. On success the backend stores the
 * session in an httpOnly `sid` cookie (see backend userRoutes `/signin`).
 */
export function signIn(email: string, password: string): Promise<void> {
  return apiClient
    .post("/user/signin", { email, password })
    .then(() => undefined);
}

/**
 * Create an admin account (role "admin"). Same OTP flow as user signup, but
 * the backend stores the account with admin role (see adminAuthRoutes).
 */
export function adminSignUp(input: SignUpInput): Promise<void> {
  return apiClient.post("/admin/auth/signup", input).then(() => undefined);
}

/**
 * Log in as an admin. Rejects with 403 when the account exists but isn't an
 * admin. On success the same `sid` session cookie is set and the caller can
 * navigate to `/admin`.
 */
export function adminSignIn(email: string, password: string): Promise<void> {
  return apiClient
    .post("/admin/auth/signin", { email, password })
    .then(() => undefined);
}

/**
 * End the session: the backend deletes the session row and clears the `sid`
 * cookie (see backend userRoutes `/logout`).
 */
export async function logOut(): Promise<void> {
  await apiClient.post("/user/logout");
}

/** Fields the logged-in user may update via `PATCH /user/me`. */
export interface UpdateProfileInput {
  name?: string;
  email?: string;
  /** Required when `newPassword` is set — verified against the stored hash. */
  currentPassword?: string;
  newPassword?: string;
}

/** Update the logged-in user's profile (name/email/password). */
export async function updateProfile(input: UpdateProfileInput): Promise<void> {
  await apiClient.patch("/user/me", input);
}

/** Roles the backend assigns to users (see packages/database userRoleEnum). */
export type UserRole = "user" | "course_creator" | "admin";

/** Public details of the logged-in user returned by `/user/me`. */
export interface MeResponse {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  createdAt: string;
  updatedAt: string;
}

/**
 * Fetch the current user's details from the protected `/user/me` route.
 *
 * The `sid` session cookie is sent automatically (`withCredentials` on the
 * axios client) — no token needs to be passed. Rejects with HTTP 400/401 when
 * there's no valid session.
 */
export async function getMe(): Promise<MeResponse> {
  const { data } = await apiClient.get<{ userDetails: MeResponse[] }>(
    "/user/me",
  );
  const [user] = data.userDetails;
  if (!user) {
    throw new Error("Could not load your profile. Please log in again.");
  }
  return user;
}
