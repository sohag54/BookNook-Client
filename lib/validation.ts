/**
 * Password validation rules required by the assignment:
 * - Must have an Uppercase letter
 * - Must have a Lowercase letter
 * - Length must be at least 6 characters
 */
export function validatePassword(password: string): {
  isValid: boolean;
  error: string | null;
} {
  if (!password || password.length < 6) {
    return {
      isValid: false,
      error: "Password must be at least 6 characters long.",
    };
  }
  if (!/[A-Z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one uppercase letter (A-Z).",
    };
  }
  if (!/[a-z]/.test(password)) {
    return {
      isValid: false,
      error: "Password must contain at least one lowercase letter (a-z).",
    };
  }
  return { isValid: true, error: null };
}

/**
 * Basic email format validation
 */
export function validateEmail(email: string): boolean {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

