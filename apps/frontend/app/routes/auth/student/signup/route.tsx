import type { Route } from "./+types/route";

import { SignUpForm } from "~/components/auth/SignUpForm";
import { handleSignup } from "~/lib/auth/signupAction";
import type { SignupActionData } from "~/lib/auth/signupTypes";

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handleSignup(request, {
    endpoint: "/student/signup",
    redirectTo: "/signin",

    title: "Create your account",
    description: "Start learning and build skills that matter.",

    submitText: "Create account",
    submittingText: "Creating account...",

    footerText: "Already have an account?",
    footerLinkText: "Sign in",
    footerLinkTo: "/signin",
  });
}

export default function StudentSignup({
  actionData,
}: Route.ComponentProps & {
  actionData?: SignupActionData;
}) {
  return (
    <SignUpForm
      title="Create your account"
      description="Start learning and build skills that matter."
      actionData={actionData}
      submitText="Create account"
      submittingText="Creating account..."
      footerText="Already have an account?"
      footerLinkText="Sign in"
      footerLinkTo="/signin"
    />
  );
}
