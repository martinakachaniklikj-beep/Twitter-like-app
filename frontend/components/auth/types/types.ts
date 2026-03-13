export interface RegisterFormData {
  email: string;
  username: string;
  phone: string;
  password: string;
  confirmPassword: string;
  birthDate: string;
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

export const countryCodes = [
  { name: 'USA', code: '1' },
  { name: 'UK', code: '44' },
  { name: 'DE', code: '49' },
  { name: 'FR', code: '33' },
  { name: 'MK', code: '389' },
];
