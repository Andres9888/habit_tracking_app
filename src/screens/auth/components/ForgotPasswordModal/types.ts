export interface ForgotPasswordModalProps {
  /** Modal visibility */
  visible: boolean;
  /** On close callback */
  onClose: () => void;
}

export interface PasswordResetFormProps {
  email: string;
  error: string | null;
  isLoading: boolean;
  onEmailChange: (email: string) => void;
  onSubmit: () => void;
  onCancel: () => void;
}

export interface PasswordResetSuccessProps {
  onClose: () => void;
}
