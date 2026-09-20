import { AppleIcon, GithubIcon, GoogleIcon } from "../landing/icons";

const providers = [
  { label: "Google", icon: <GoogleIcon className="size-4" /> },
  { label: "Apple", icon: <AppleIcon className="size-4" /> },
  { label: "GitHub", icon: <GithubIcon className="size-4" /> },
];

/**
 * "Or continue with" divider plus social provider buttons.
 * Buttons are placeholders — wire them to a real OAuth flow when available.
 */
export function SocialButtons() {
  return (
    <>
      <div className="my-6 flex items-center gap-4">
        <span className="h-px flex-1 bg-line" />
        <span className="text-xs text-gray-500">or continue with</span>
        <span className="h-px flex-1 bg-line" />
      </div>

      <div className="grid grid-cols-3 gap-3">
        {providers.map((provider) => (
          <button
            key={provider.label}
            type="button"
            aria-label={`Continue with ${provider.label}`}
            className="flex items-center justify-center gap-2 rounded-full border border-line bg-surface px-4 py-2.5 text-sm font-medium text-gray-300 transition hover:border-brand/60 hover:text-white"
          >
            {provider.icon}
          </button>
        ))}
      </div>
    </>
  );
}