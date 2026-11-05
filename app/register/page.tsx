"use client";

import { useState, useEffect, Suspense } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { signUp, signIn } from "@/lib/auth-client";
import { validatePassword, validateEmail } from "@/lib/validation";
import toast from "react-hot-toast";
import {
  UserPlus,
  User,
  Mail,
  Lock,
  Image as ImageIcon,
  Eye,
  EyeOff,
  BookOpen,
  Loader2,
  CheckCircle2,
  XCircle,
} from "lucide-react";

function RegisterForm() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get("callbackUrl") || "/";

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [photoURL, setPhotoURL] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [isGoogleLoading, setIsGoogleLoading] = useState(false);
  const [formError, setFormError] = useState<string | null>(null);

  useEffect(() => {
    document.title = "BookNook | Create Account";
  }, []);

  // Live password validation checklist
  const hasMinLength = password.length >= 6;
  const hasUppercase = /[A-Z]/.test(password);
  const hasLowercase = /[a-z]/.test(password);
  const isPasswordValid = hasMinLength && hasUppercase && hasLowercase;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormError(null);

    // 1. Validate name
    if (!name.trim()) {
      const msg = "Please enter your full name.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    // 2. Validate email
    if (!validateEmail(email.trim())) {
      const msg = "Please enter a valid email address.";
      setFormError(msg);
      toast.error(msg);
      return;
    }

    // 3. Strict password validation per assignment rules
    const passwordCheck = validatePassword(password);
    if (!passwordCheck.isValid) {
      setFormError(passwordCheck.error);
      toast.error(passwordCheck.error || "Password does not meet required criteria.");
      return;
    }

    try {
      setIsLoading(true);

      const result = await signUp.email({
        name: name.trim(),
        email: email.trim(),
        password: password,
        image: photoURL.trim() || undefined,
      });

      if (result.error) {
        const errorMsg =
          result.error.message || "Registration failed. An account with this email may already exist.";
        setFormError(errorMsg);
        toast.error(errorMsg);
        setIsLoading(false);
        return;
      }

      toast.success("Account registered successfully! Please log in.");
      // PDF: "If the user registers successfully, then navigate them to their Login page."
      router.push(`/login${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`);
    } catch (err: any) {
      const errorMsg = err?.message || "An unexpected error occurred during registration.";
      setFormError(errorMsg);
      toast.error(errorMsg);
      setIsLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setFormError(null);
    try {
      setIsGoogleLoading(true);
      await signIn.social({
        provider: "google",
        callbackURL: callbackUrl,
      });
    } catch (err: any) {
      const errorMsg = err?.message || "Google authentication failed. Please check credentials.";
      setFormError(errorMsg);
      toast.error(errorMsg);
      setIsGoogleLoading(false);
    }
  };

  return (
    <div className="w-full max-w-md bg-white dark:bg-zinc-900 shadow-xl rounded-2xl border border-zinc-200 dark:border-zinc-800 p-8 sm:p-10 my-8">
      {/* Header */}
      <div className="text-center mb-8">
        <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-emerald-100 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 mb-4">
          <BookOpen className="w-7 h-7" />
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-zinc-900 dark:text-zinc-50">
          Create an Account
        </h1>
        <p className="text-sm text-zinc-600 dark:text-zinc-400 mt-2">
          Join BookNook to borrow and share your favorite books
        </p>
      </div>

      {/* Form Error Banner */}
      {formError && (
        <div className="mb-6 p-3 rounded-lg bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800 text-sm text-red-600 dark:text-red-400">
          {formError}
        </div>
      )}

      {/* Register Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {/* Name Field */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Full Name
          </label>
          <div className="relative">
            <User className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Sarah Connor"
              required
              disabled={isLoading || isGoogleLoading}
              className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-sm"
            />
          </div>
        </div>

        {/* Email Field */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Email Address
          </label>
          <div className="relative">
            <Mail className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="you@example.com"
              required
              disabled={isLoading || isGoogleLoading}
              className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-sm"
            />
          </div>
        </div>

        {/* Photo URL Field */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Photo URL
          </label>
          <div className="relative">
            <ImageIcon className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type="url"
              value={photoURL}
              onChange={(e) => setPhotoURL(e.target.value)}
              placeholder="https://example.com/photo.jpg"
              disabled={isLoading || isGoogleLoading}
              className="w-full pl-11 pr-4 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-sm"
            />
          </div>
        </div>

        {/* Password Field */}
        <div>
          <label className="block text-sm font-medium text-zinc-700 dark:text-zinc-300 mb-1.5">
            Password
          </label>
          <div className="relative">
            <Lock className="w-5 h-5 absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-400" />
            <input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              disabled={isLoading || isGoogleLoading}
              className="w-full pl-11 pr-11 py-2.5 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 text-zinc-900 dark:text-zinc-100 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:border-transparent transition-colors text-sm"
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3.5 top-1/2 -translate-y-1/2 text-zinc-400 hover:text-zinc-600 dark:hover:text-zinc-200"
              aria-label={showPassword ? "Hide password" : "Show password"}
            >
              {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          {/* Password Validation Criteria Checklist */}
          <div className="mt-2.5 p-3 rounded-lg bg-zinc-50 dark:bg-zinc-800/60 border border-zinc-200 dark:border-zinc-700/60 space-y-1 text-xs">
            <div className="font-medium text-zinc-700 dark:text-zinc-300 mb-1">
              Password requirements:
            </div>
            <div className="flex items-center gap-1.5">
              {hasMinLength ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <span className={hasMinLength ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-zinc-500"}>
                At least 6 characters
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {hasUppercase ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <span className={hasUppercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-zinc-500"}>
                At least 1 uppercase letter (A-Z)
              </span>
            </div>
            <div className="flex items-center gap-1.5">
              {hasLowercase ? (
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-500" />
              ) : (
                <XCircle className="w-3.5 h-3.5 text-zinc-400" />
              )}
              <span className={hasLowercase ? "text-emerald-600 dark:text-emerald-400 font-medium" : "text-zinc-500"}>
                At least 1 lowercase letter (a-z)
              </span>
            </div>
          </div>
        </div>

        {/* Submit Button */}
        <button
          type="submit"
          disabled={isLoading || isGoogleLoading || (password.length > 0 && !isPasswordValid)}
          className="w-full flex items-center justify-center gap-2 py-2.5 px-4 rounded-lg bg-emerald-600 hover:bg-emerald-700 active:bg-emerald-800 text-white font-medium text-sm transition-colors shadow-sm disabled:opacity-50 disabled:cursor-not-allowed cursor-pointer pt-3"
        >
          {isLoading ? (
            <>
              <Loader2 className="w-4 h-4 animate-spin" />
              <span>Registering Account...</span>
            </>
          ) : (
            <>
              <UserPlus className="w-4 h-4" />
              <span>Register</span>
            </>
          )}
        </button>
      </form>

      {/* Divider */}
      <div className="flex items-center my-6">
        <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800"></div>
        <span className="px-3 text-xs uppercase tracking-wider text-zinc-400">or</span>
        <div className="flex-1 border-t border-zinc-200 dark:border-zinc-800"></div>
      </div>

      {/* Google Social Login */}
      <button
        type="button"
        onClick={handleGoogleSignIn}
        disabled={isLoading || isGoogleLoading}
        className="w-full flex items-center justify-center gap-3 py-2.5 px-4 rounded-lg border border-zinc-300 dark:border-zinc-700 bg-white dark:bg-zinc-800 hover:bg-zinc-50 dark:hover:bg-zinc-750 text-zinc-700 dark:text-zinc-200 font-medium text-sm transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isGoogleLoading ? (
          <Loader2 className="w-4 h-4 animate-spin text-zinc-500" />
        ) : (
          <svg className="w-4 h-4" viewBox="0 0 24 24">
            <path
              fill="#4285F4"
              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
            />
            <path
              fill="#34A853"
              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
            />
            <path
              fill="#FBBC05"
              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
            />
            <path
              fill="#EA4335"
              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
            />
          </svg>
        )}
        <span>Continue with Google</span>
      </button>

      {/* Link to Login */}
      <p className="text-center text-sm text-zinc-600 dark:text-zinc-400 mt-6">
        Already have an account?{" "}
        <Link
          href={`/login${callbackUrl !== "/" ? `?callbackUrl=${encodeURIComponent(callbackUrl)}` : ""}`}
          className="text-emerald-600 dark:text-emerald-400 font-semibold hover:underline"
        >
          Login here
        </Link>
      </p>
    </div>
  );
}

export default function RegisterPage() {
  return (
    <div className="min-h-screen flex items-center justify-center p-4 bg-zinc-50 dark:bg-zinc-950">
      <Suspense
        fallback={
          <div className="w-full max-w-md p-10 bg-white dark:bg-zinc-900 rounded-2xl shadow-xl flex items-center justify-center">
            <Loader2 className="w-8 h-8 animate-spin text-emerald-600" />
          </div>
        }
      >
        <RegisterForm />
      </Suspense>
    </div>
  );
}

