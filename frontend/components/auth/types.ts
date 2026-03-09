export interface RegisterFormData {
  email: string;
  username: string;
  password: string;
  confirmPassword: string;
}

export interface RegisterDialogCardProps {
  onSuccess?: () => void;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface LoginDialogCardProps {
  onSuccess?: () => void;
}
