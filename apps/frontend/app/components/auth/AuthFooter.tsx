import { Link } from "react-router";

interface AuthFooterProps {
  text: string;
  linkText: string;
  linkTo: string;
}

export function AuthFooter({ text, linkText, linkTo }: AuthFooterProps) {
  return (
    <p className="mt-7 text-center text-sm text-slate-500">
      {text}{" "}
      <Link
        to={linkTo}
        className="font-semibold text-indigo-600 transition hover:text-indigo-700"
      >
        {linkText}
      </Link>
    </p>
  );
}
