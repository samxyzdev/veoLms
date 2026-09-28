import {
  ArrowRight,
  FaceAngry,
  Cat,
  Camera,
  Search,
  Mail,
  Bird,
} from "lucide-react";
import { Link } from "react-router";

const footerLinks = [
  {
    title: "Platform",
    links: [
      { label: "Explore Courses", href: "/explore-courses" },
      { label: "My Learning", href: "/my-learning" },
      { label: "Certificates", href: "/certificates" },
      { label: "Pricing", href: "#pricing" },
    ],
  },
  {
    title: "Resources",
    links: [
      { label: "Help Center", href: "#" },
      { label: "Community", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Contact", href: "#" },
    ],
  },
  {
    title: "Company",
    links: [
      { label: "About", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Privacy", href: "#" },
      { label: "Terms", href: "#" },
    ],
  },
];

export function Footer() {
  return (
    <footer className="border-t border-slate-200 bg-white">
      {/* CTA */}
      <div className="border-b border-slate-200 bg-indigo-600">
        <div className="mx-auto flex max-w-7xl flex-col gap-6 px-6 py-12 md:flex-row md:items-center md:justify-between md:px-10">
          <div>
            <h2 className="text-2xl font-extrabold text-white">
              Ready to start learning?
            </h2>

            <p className="mt-2 text-sm text-indigo-100">
              Build your next skill with Learnly.
            </p>
          </div>

          <Link
            to="/signup"
            className="inline-flex h-11 items-center justify-center gap-2 rounded-xl bg-white px-5 text-sm font-bold text-indigo-600 transition hover:bg-indigo-50"
          >
            Get started
            <ArrowRight size={16} />
          </Link>
        </div>
      </div>

      {/* Footer */}
      <div className="mx-auto max-w-7xl px-6 py-14 md:px-10">
        <div className="grid gap-12 lg:grid-cols-[1.5fr_1fr_1fr_1fr]">
          {/* Brand */}
          <div>
            <Link to="/" className="flex items-center gap-2">
              <span className="flex h-9 w-9 items-center justify-center rounded-xl bg-indigo-600 text-sm font-extrabold text-white">
                L
              </span>

              <span className="text-xl font-extrabold tracking-tight text-slate-950">
                Learnly
              </span>
            </Link>

            <p className="mt-4 max-w-sm text-sm leading-6 text-slate-500">
              A modern learning platform built to help people learn practical
              skills and keep making progress.
            </p>

            <div className="mt-5 flex items-center gap-2">
              {[Bird, Camera, FaceAngry, Link, Mail].map((Icon, index) => (
                <a
                  key={index}
                  href="#"
                  className="flex h-9 w-9 items-center justify-center rounded-lg border border-slate-200 text-slate-500 transition hover:border-indigo-200 hover:bg-indigo-50 hover:text-indigo-600"
                >
                  <Icon size={16} />
                </a>
              ))}
            </div>
          </div>

          {/* Links */}
          {footerLinks.map((section) => (
            <div key={section.title}>
              <h3 className="text-sm font-bold text-slate-950">
                {section.title}
              </h3>

              <div className="mt-5 space-y-3">
                {section.links.map((link) => (
                  <Link
                    key={link.label}
                    to={link.href}
                    className="block text-sm text-slate-500 transition hover:text-indigo-600"
                  >
                    {link.label}
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </div>

        {/* Newsletter */}
        <div className="mt-14 rounded-2xl bg-slate-50 p-5 sm:flex sm:items-center sm:justify-between">
          <div>
            <div className="flex items-center gap-2">
              <Mail size={17} className="text-indigo-600" />

              <h3 className="text-sm font-bold text-slate-900">
                Get learning updates
              </h3>
            </div>

            <p className="mt-1 text-xs text-slate-400">
              New courses and useful learning resources, occasionally.
            </p>
          </div>

          <div className="mt-4 flex max-w-md gap-2 sm:mt-0">
            <input
              type="email"
              placeholder="Your email"
              className="h-10 min-w-0 flex-1 rounded-lg border border-slate-200 bg-white px-3 text-sm outline-none focus:border-indigo-400"
            />

            <button className="h-10 rounded-lg bg-indigo-600 px-4 text-xs font-bold text-white hover:bg-indigo-700">
              Subscribe
            </button>
          </div>
        </div>

        {/* Bottom */}
        <div className="mt-10 flex flex-col gap-3 border-t border-slate-100 pt-6 text-xs text-slate-400 sm:flex-row sm:items-center sm:justify-between">
          <p>© 2026 Learnly. All rights reserved.</p>

          <p>Learn. Build. Grow.</p>
        </div>
      </div>
    </footer>
  );
}
