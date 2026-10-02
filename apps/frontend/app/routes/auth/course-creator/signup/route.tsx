import type { Route } from "./+types/route";

import { SignUpForm } from "~/components/auth/SignUpForm";
import { handleSignup } from "~/lib/auth/signupAction";
import type { SignupActionData } from "~/lib/auth/signupTypes";

export async function clientAction({ request }: Route.ClientActionArgs) {
  return handleSignup(request, {
    endpoint: "/course-creator/auth/signup",
    redirectTo: "/course-creator/signin",

    title: "Become a course creator",
    description: "Create your account and start sharing your knowledge.",

    submitText: "Create creator account",
    submittingText: "Creating account...",

    footerText: "Already have a creator account?",
    footerLinkText: "Sign in",
    footerLinkTo: "/course-creator/signin",
  });
}

export default function CourseCreatorSignup({
  actionData,
}: Route.ComponentProps & {
  actionData?: SignupActionData;
}) {
  return (
    <SignUpForm
      title="Become a course creator"
      description="Create your account and start sharing your knowledge."
      actionData={actionData}
      submitText="Create creator account"
      submittingText="Creating account..."
      footerText="Already have a creator account?"
      footerLinkText="Sign in"
      footerLinkTo="/course-creator/signin"
    />
  );
}
