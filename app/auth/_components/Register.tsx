"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import {
  Mail,
  Lock,
  User,
  Phone,
  Eye as EyeIcon,
  EyeOff,
  AlertCircle,
} from "lucide-react";
import { useAuth } from '@/context/AuthContext';

interface RegisterProps {
  onSwitchToLogin: () => void;
}

export default function Register({ onSwitchToLogin }: RegisterProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const { register } = useAuth();
  const formik = useFormik({
    initialValues: {
      name: "",
      email: "",
      mobile_number: "",
      password: "",
      confirmPassword: "",
      role: "",
    },
    validationSchema: Yup.object({
      name: Yup.string()
        .max(50, "Must be 50 characters or less")
        .required("Required"),
      email: Yup.string().email("Invalid email address").required("Required"),
      mobile_number: Yup.string()
        .matches(/^[0-9]+$/, "Must be only digits")
        .min(10, "Must be at least 10 digits")
        .required("Required"),
      role: Yup.string().required("Required"),
      password: Yup.string()
        .min(8, "Must be at least 8 characters")
        .required("Required"),
      confirmPassword: Yup.string()
        .oneOf([Yup.ref("password"), undefined], "Passwords must match")
        .required("Required"),
    }),
    onSubmit: async (values) => {
      setServerError(null);
      try {
        await register(values);
      } catch (error: any) {
        if (error.response && error.response.data && error.response.data.error) {
          setServerError(error.response.data.error);
        } else {
          setServerError('An unexpected error occurred. Please try again.');
        }
      }
    },
  });

  return (
    <div className="w-full max-w-md space-y-8">
      <div className="text-center lg:text-left">
        <h1 className="text-3xl lg:text-4xl font-bold text-textPrimary font-clash-display">
          Create Account
        </h1>
        <p className="mt-2 text-textSecondary">
          Join us today and find your perfect boarding place.
        </p>
      </div>

      <form onSubmit={formik.handleSubmit} className="mt-8 space-y-5">
        {serverError && (
          <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm">
            <AlertCircle className="h-5 w-5 flex-shrink-0" />
            {serverError}
          </div>
        )}
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1.5">
              Full Name
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textSecondary group-focus-within:text-primary transition-colors">
                <User className="h-5 w-5" />
              </div>
              <input
                type="text"
                {...formik.getFieldProps("name")}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-backgroundSecondary text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${formik.touched.name && formik.errors.name
                  ? "border-red-500"
                  : "border-borderPrimary"
                  }`}
                placeholder="John Doe"
              />
            </div>
            {formik.touched.name && formik.errors.name ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.name}
              </div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1.5">
              Email
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textSecondary group-focus-within:text-primary transition-colors">
                <Mail className="h-5 w-5" />
              </div>
              <input
                type="email"
                {...formik.getFieldProps("email")}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-backgroundSecondary text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${formik.touched.email && formik.errors.email
                  ? "border-red-500"
                  : "border-borderPrimary"
                  }`}
                placeholder="you@example.com"
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.email}
              </div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1.5">
              Mobile Number
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textSecondary group-focus-within:text-primary transition-colors">
                <Phone className="h-5 w-5" />
              </div>
              <input
                type="text"
                {...formik.getFieldProps("mobile_number")}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-backgroundSecondary text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${formik.touched.mobile_number && formik.errors.mobile_number
                  ? "border-red-500"
                  : "border-borderPrimary"
                  }`}
                placeholder="+1234567890"
              />
            </div>
            {formik.touched.mobile_number && formik.errors.mobile_number ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.mobile_number}
              </div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-textSecondary mb-1.5">
              Role (Student/Owner)
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textSecondary group-focus-within:text-primary transition-colors">
                <User className="h-5 w-5" />
              </div>
              <select
                {...formik.getFieldProps("role")}
                className={`block w-full pl-10 pr-3 py-3 border rounded-xl bg-backgroundSecondary text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all appearance-none ${formik.touched.role && formik.errors.role
                  ? "border-red-500"
                  : "border-borderPrimary"
                  }`}
              >
                <option value="" disabled>Select Role</option>
                <option value="Student">Student</option>
                <option value="Owner">Owner</option>
              </select>
            </div>
            {formik.touched.role && formik.errors.role ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.role}
              </div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-1.5">
              Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-slate-400 group-focus-within:text-primary transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("password")}
                className={`block w-full pl-10 pr-12 py-3 border rounded-xl bg-backgroundSecondary text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${formik.touched.password && formik.errors.password
                  ? "border-red-500"
                  : "border-borderPrimary"
                  }`}
                placeholder="••••••••"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 pr-3 flex items-center text-textSecondary hover:text-textPrimary transition-colors"
                tabIndex={-1}
              >
                {showPassword ? (
                  <EyeOff className="h-5 w-5" />
                ) : (
                  <EyeIcon className="h-5 w-5" />
                )}
              </button>
            </div>
            {formik.touched.password && formik.errors.password ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.password}
              </div>
            ) : null}
          </div>

          <div>
            <label className="block text-sm font-medium text-textPrimary mb-1.5">
              Confirm Password
            </label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-textSecondary group-focus-within:text-primary transition-colors">
                <Lock className="h-5 w-5" />
              </div>
              <input
                type={showPassword ? "text" : "password"}
                {...formik.getFieldProps("confirmPassword")}
                className={`block w-full pl-10 pr-12 py-3 border rounded-xl bg-backgroundSecondary text-textPrimary placeholder-textSecondary focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary transition-all ${formik.touched.confirmPassword &&
                  formik.errors.confirmPassword
                  ? "border-red-500"
                  : "border-borderPrimary"
                  }`}
                placeholder="••••••••"
              />
            </div>
            {formik.touched.confirmPassword && formik.errors.confirmPassword ? (
              <div className="text-red-500 text-xs mt-1">
                {formik.errors.confirmPassword}
              </div>
            ) : null}
          </div>
        </div>

        <button
          type="submit"
          disabled={formik.isSubmitting}
          className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {formik.isSubmitting ? "Creating Account..." : "Register"}
        </button>

        <div className="text-center mt-4">
          <button
            type="button"
            onClick={onSwitchToLogin}
            className="text-sm font-medium text-primary hover:text-primary/80 transition-colors"
          >
            Already have an account? Sign in
          </button>
        </div>
      </form>
    </div>
  );
}

