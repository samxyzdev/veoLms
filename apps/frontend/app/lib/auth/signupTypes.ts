export type SignupFormState = {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  otp: string;
  terms: boolean;
};

export type SignupTouchedState = {
  name: boolean;
  email: boolean;
  password: boolean;
  confirmPassword: boolean;
};

export type SignupValidationErrors = {
  name?: string;
  email?: string;
  password?: string;
  confirmPassword?: string;
};

export type SignupActionData = {
  fieldErrors?: {
    name?: string[];
    email?: string[];
    password?: string[];
    confirmPassword?: string[];
  };

  formErrors?: string[];
};

export type SignupConfig = {
  endpoint: string;
  redirectTo: string;

  title: string;
  description: string;

  submitText: string;
  submittingText: string;

  footerText: string;
  footerLinkText: string;
  footerLinkTo: string;
};
