import type { ReactNode } from "react";
import { Footer } from "../landing/Footer";
import { Header } from "../landing/Header";

/**
 * Shared layout for the authentication pages (login / signup).
 * Keeps both routes consistent with the landing page branding.
 */
export function AuthLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-screen flex-col bg-base">
      <Header />
      <main className="flex flex-1 items-start justify-center px-6 py-16 lg:py-20">
        <div className="w-full max-w-md">{children}</div>
      </main>
      <Footer />
    </div>
  );
}