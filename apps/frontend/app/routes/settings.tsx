import { useEffect, useState } from "react";
import type { FormEvent } from "react";
import type { Route } from "./+types/settings";
import { AuthField } from "../components/auth/AuthField";
import { DashboardLayout } from "../components/dashboard/DashboardLayout";
import {
  LockIcon,
  MailIcon,
  UserIcon,
} from "../components/landing/icons";
import { updateProfile } from "../lib/api";
import { useMe } from "../lib/useMe";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Settings — Learnova" },
    {
      name: "description",
      content: "Update your Learnova profile details.",
    },
  ];
}

export default function Settings() {
  const { user, reload, isLoading } = useMe();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [isSaving, setIsSaving] = useState(false);
  const [notice, setNotice] = useState<{ type: "success" | "error"; text: string } | null>(null);

  // Prefill the form once the user is loaded.
  useEffect(() => {
    if (user) {
      setName(user.name);
      setEmail(user.email);
    }
  }, [user]);

  // Wait for the session check — useMe redirects to /login when there's no
  // valid session, so don't render the page before that.
  if (isLoading) return null;

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (isSaving) return;

    setIsSaving(true);
    setNotice(null);
    try {
      await updateProfile({
        name: name.trim(),
        email: email.trim(),
        // Only send password fields when the user actually wants a new one.
        ...(newPassword.trim()
          ? { currentPassword: currentPassword, newPassword: newPassword }
          : {}),
      });
      setCurrentPassword("");
      setNewPassword("");
      reload(); // refresh name/email in the sidebar + heading
      setNotice({ type: "success", text: "Profile updated successfully." });
    } catch (error) {
      setNotice({
        type: "error",
        text: error instanceof Error ? error.message : "Could not update your profile.",
      });
    } finally {
      setIsSaving(false);
    }
  }

  return (
    <DashboardLayout user={user}>
      {/* Heading row */}
      <div>
        <h1 className="text-2xl font-bold text-white lg:text-3xl">Settings</h1>
        <p className="mt-1 text-sm text-gray-500">
          Manage your name, email and password.
        </p>
      </div>

      {/* Notice banner */}
      {notice && (
        <p
          className={`mt-5 rounded-lg border px-4 py-3 text-sm ${
            notice.type === "success"
              ? "border-emerald-500/40 bg-emerald-500/10 text-emerald-400"
              : "border-red-500/40 bg-red-500/10 text-red-400"
          }`}
        >
          {notice.text}
        </p>
      )}

      <form onSubmit={handleSubmit} className="mt-6 max-w-xl space-y-4">
        {/* Profile card */}
        <div className="rounded-xl border border-line bg-surface p-5">
          <h3 className="text-sm font-semibold text-white">Profile</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            This is how you appear on Learnova.
          </p>

          <div className="mt-4 space-y-4">
            <AuthField
              label="Full name"
              icon={<UserIcon className="size-4" />}
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="Your name"
              autoComplete="name"
              minLength={3}
              required
            />
            <AuthField
              label="Email address"
              icon={<MailIcon className="size-4" />}
              type="email"
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              placeholder="you@example.com"
              autoComplete="email"
              required
            />
          </div>
        </div>

        {/* Password card */}
        <div className="rounded-xl border border-line bg-surface p-5">
          <h3 className="text-sm font-semibold text-white">Change password</h3>
          <p className="mt-0.5 text-xs text-gray-500">
            Leave these blank to keep your current password.
          </p>

          <div className="mt-4 space-y-4">
            <AuthField
              label="Current password"
              icon={<LockIcon className="size-4" />}
              type="password"
              value={currentPassword}
              onChange={(event) => setCurrentPassword(event.target.value)}
              placeholder="Your current password"
              autoComplete="current-password"
              minLength={8}
            />
            <AuthField
              label="New password"
              icon={<LockIcon className="size-4" />}
              type="password"
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="At least 8 characters"
              autoComplete="new-password"
              minLength={8}
              hint="Password must be at least 8 characters."
            />
          </div>
        </div>

        <button
          type="submit"
          disabled={
            isSaving ||
            !name.trim() ||
            !email.trim() ||
            (newPassword.trim().length > 0 && newPassword.trim().length < 8)
          }
          className="rounded-full bg-brand px-6 py-3 text-sm font-semibold text-white transition hover:bg-brand-hover disabled:cursor-not-allowed disabled:opacity-50 disabled:hover:bg-brand"
        >
          {isSaving ? "Saving…" : "Save changes"}
        </button>
      </form>
    </DashboardLayout>
  );
}