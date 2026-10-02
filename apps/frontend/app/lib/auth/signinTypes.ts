export type SigninFormState = {
  email: string;
  password: string;
  rememberMe: boolean;
};

export type SigninTouchedState = {
  email: boolean;
  password: boolean;
};

export type SigninValidationErrors = {
  email?: string;
  password?: string;
};

export type SigninActionData = {
  fieldErrors?: {
    email?: string[];
    password?: string[];
  };

  formErrors?: string[];
};

export type SigninConfig = {
  endpoint: string;
  redirectTo: string;
  includeRememberMe?: boolean;
};
