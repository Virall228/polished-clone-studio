// Form related types for WAY Esports

export interface FormField {
  name: string;
  label: string;
  type: 'text' | 'email' | 'password' | 'number' | 'select' | 'textarea' | 'checkbox' | 'file';
  placeholder?: string;
  required?: boolean;
  validation?: ValidationRule[];
  options?: SelectOption[]; // for select fields
}

export interface SelectOption {
  value: string | number;
  label: string;
  disabled?: boolean;
}

export interface ValidationRule {
  type: 'required' | 'email' | 'minLength' | 'maxLength' | 'pattern' | 'custom';
  value?: any;
  message: string;
}

export interface FormErrors {
  [fieldName: string]: string[];
}

export interface FormState {
  values: Record<string, any>;
  errors: FormErrors;
  touched: Record<string, boolean>;
  isSubmitting: boolean;
  isValid: boolean;
}

// Specific form types
export interface LoginFormData {
  username: string;
  password: string;
  rememberMe?: boolean;
}

export interface RegisterFormData {
  username: string;
  email: string;
  password: string;
  confirmPassword: string;
  firstName?: string;
  lastName?: string;
}

export interface TeamCreateFormData {
  name: string;
  tag: string;
  game: string;
  description?: string;
  logo?: File;
}

export interface TournamentCreateFormData {
  name: string;
  description: string;
  game: string;
  format: string;
  prizePool: number;
  maxParticipants: number;
  startDate: string;
  registrationDeadline: string;
  rules: string;
}

export interface ProfileUpdateFormData {
  firstName?: string;
  lastName?: string;
  email?: string;
  bio?: string;
  avatar?: File;
}

export interface NewsCreateFormData {
  title: string;
  content: string;
  excerpt: string;
  category: string;
  tags: string[];
  coverImage?: File;
  publishedAt?: string;
}