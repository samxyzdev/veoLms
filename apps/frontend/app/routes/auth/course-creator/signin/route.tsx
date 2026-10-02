import type { Route } from "./+types/route";

import { SignInForm } from "~/components/auth/SignInForm";
import { handleSignin } from "~/lib/auth/signinAction";
import type { SigninActionData } from "~/lib/auth/signinTypes";

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handleSignin(request, {
    endpoint: "/course-creator/auth/signin",
    redirectTo: "/course-creator",
    includeRememberMe: true,
  });
}

export default function CourseCreatorSignin({
  actionData,
}: Route.ComponentProps & {
  actionData?: SigninActionData;
}) {
  return (
    <SignInForm
      title="Welcome back, Creator"
      description="Sign in to manage your courses and continue teaching."
      actionData={actionData}
      footerText="Don't have a creator account?"
      footerLinkText="Create creator account"
      footerLinkTo="/course-creator/signup"
      forgotPasswordTo="/course-creator/forgot-password"
      showRememberMe={true}
    />
  );
}
