import { redirect } from "react-router";

import type { Route } from "./+types/route";

import { SignInForm } from "~/components/auth/SignInForm";
import { handleSignin } from "~/lib/auth/signinAction";
import type { SigninActionData } from "~/lib/auth/signinTypes";

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handleSignin(request, {
    endpoint: "/student/signin",
    redirectTo: "/dashboard",
    includeRememberMe: false,
  });
}

export default function StudentSignin({
  actionData,
}: Route.ComponentProps & {
  actionData?: SigninActionData;
}) {
  return (
    <SignInForm
      title="Welcome back"
      description="Sign in to continue your learning journey."
      actionData={actionData}
      footerText="Don't have an account?"
      footerLinkText="Create account"
      footerLinkTo="/signup"
      forgotPasswordTo="/forgot-password"
      showRememberMe={false}
    />
  );
}
