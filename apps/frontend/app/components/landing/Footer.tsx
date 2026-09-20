import type { FormEvent, ReactNode } from "react";
import {
  FacebookIcon,
  GraduationCapIcon,
  InstagramIcon,
  XLogoIcon,
  YoutubeIcon,
} from "./icons";

const socials: { label: string; href: string; icon: ReactNode }[] = [
  { label: "X (Twitter)", href: "#", icon: <XLogoIcon className="size-4" /> },
  { label: "Facebook", href: "#", icon: <FacebookIcon className="size-4" /> },
  { label: "YouTube", href: "#", icon: <YoutubeIcon className="size-4" /> },
  { label: "Instagram", href: "#", icon: <InstagramIcon className="size-4" /> },
];

export function Footer() {
  function handleSubscribe(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
  }

  return (
    <footer className="border-t border-line">
      <div className="mx-auto max-w-7xl px-6 py-14">
        <div className="flex flex-col items-center gap-8 text-center">
          <a href="#" className="flex items-center gap-2.5">
            <span className="flex size-9 items-center justify-center rounded-lg bg-brand-ink">
              <GraduationCapIcon className="size-5 text-brand-light" />
            </span>
            <span className="text-lg font-bold text-white">Learnova</span>
          </a>

          <div className="flex items-center gap-3">
            {socials.map((social) => (
              <a
                key={social.label}
                href={social.href}
                aria-label={social.label}
                className="flex size-9 items-center justify-center rounded-full border border-line text-gray-400 transition hover:border-brand/60 hover:text-white"
              >
                {social.icon}
              </a>
            ))}
          </div>

          <div className="w-full max-w-md">
            <p className="text-sm font-medium text-gray-300">
              Subscribe to our newsletter
            </p>
            <form
              onSubmit={handleSubscribe}
              className="mt-4 flex flex-col gap-3 sm:flex-row"
            >
              <input
                type="email"
                required
                placeholder="Enter your email"
                className="flex-1 rounded-full border border-line bg-surface px-5 py-2.5 text-sm text-white outline-none transition placeholder:text-gray-500 focus:border-brand"
              />
              <button
                type="submit"
                className="rounded-full bg-brand px-6 py-2.5 text-sm font-semibold text-white transition hover:bg-brand-hover"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        <div className="mt-12 border-t border-line pt-6 text-center text-xs text-gray-500">
          © {new Date().getFullYear()} Learnova. All rights reserved.
        </div>
      </div>
    </footer>
  );
}