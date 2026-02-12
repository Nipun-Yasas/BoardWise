"use client";

import { useState } from "react";
import { useFormik } from "formik";
import * as Yup from "yup";
import { Mail, AlertCircle, ArrowLeft, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export default function ForgotPassword() {
  const [serverError, setServerError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);

  const formik = useFormik({
    initialValues: {
      email: "",
    },
    validationSchema: Yup.object({
      email: Yup.string().email("Invalid email address").required("Required"),
    }),
    onSubmit: async (values) => {
      setServerError(null);
      setSuccessMessage(null);
      try {
        const res = await fetch("/api/auth/forgot-password", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(values),
        });

        const data = await res.json();

        if (!res.ok) {
          throw new Error(data.error || "Something went wrong");
        }

        setSuccessMessage("If an account exists with this email, you will receive a password reset link.");
        formik.resetForm();
      } catch (error: any) {
        setServerError(error.message || "An unexpected error occurred. Please try again.");
      }
    },
  });

  return (
    <div className="min-h-screen flex items-center justify-center bg-background px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center lg:text-left">
          <Link
            href="/auth"
            className="inline-flex items-center text-sm text-textSecondary hover:text-primary transition-colors mb-6"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to login
          </Link>
          <h1 className="text-3xl lg:text-4xl font-bold text-textPrimary font-clash-display">
            Forgot password?
          </h1>
          <p className="mt-2 text-textSecondary">
            No worries, we'll send you reset instructions.
          </p>
        </div>

        <form onSubmit={formik.handleSubmit} className="mt-8 space-y-6">
          {serverError && (
            <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center gap-3 text-red-500 text-sm">
              <AlertCircle className="h-5 w-5 flex-shrink-0" />
              {serverError}
            </div>
          )}

          {successMessage && (
            <div className="p-3 rounded-xl bg-green-500/10 border border-green-500/20 flex items-center gap-3 text-green-500 text-sm">
              <CheckCircle2 className="h-5 w-5 flex-shrink-0" />
              {successMessage}
            </div>
          )}

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
                placeholder="Enter your email"
              />
            </div>
            {formik.touched.email && formik.errors.email ? (
              <div className="text-red-500 text-xs mt-1">{formik.errors.email}</div>
            ) : null}
          </div>

          <button
            type="submit"
            disabled={formik.isSubmitting}
            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-xl text-sm font-semibold text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-all shadow-lg shadow-primary/20 hover:scale-[1.02] active:scale-[0.98] disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {formik.isSubmitting ? "Sending link..." : "Reset password"}
          </button>
        </form>
      </div>
    </div>
  );
}