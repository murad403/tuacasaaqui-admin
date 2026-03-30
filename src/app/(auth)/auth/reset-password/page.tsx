"use client";
import React, { useState } from "react";
import Link from "next/link";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { resetPasswordSchema, type ResetPasswordFormData, } from "@/validation/auth.validation";
import AuthCard from "@/components/shared/AuthCard";
import { useRouter, useSearchParams } from "next/navigation";
import { ArrowLeft, Eye, EyeOff } from "lucide-react";
import { useResetPasswordMutation } from "@/redux/features/auth/auth.api";
import { toast } from "react-toastify";

export default function ResetPasswordPage() {
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const [resetPassword, { isLoading }] = useResetPasswordMutation();
  const [passwordServerErrors, setPasswordServerErrors] = useState<string[]>([]);

  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm<ResetPasswordFormData>({
    resolver: zodResolver(resetPasswordSchema),
  });

  const onSubmit = async (data: ResetPasswordFormData) => {
    if (!email) {
      toast.error("Email not found. Please restart reset flow.");
      router.push("/auth/forgot-password");
      return;
    }

    setPasswordServerErrors([]);
    try {
      const response = await resetPassword({
        email,
        new_password: data.newPassword,
      }).unwrap();

      toast.success(response.message || "Password reset successful.");
      router.push("/auth/sign-in");
    } catch (error: unknown) {
      const newPasswordErrors =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        Array.isArray((error as { data?: { new_password?: string[] } }).data?.new_password)
          ? (error as { data: { new_password: string[] } }).data.new_password
          : [];

      if (newPasswordErrors.length > 0) {
        setPasswordServerErrors(newPasswordErrors);
        toast.error(newPasswordErrors[0]);
        return;
      }

      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: string; detail?: string } }).data === "object"
          ? (error as { data?: { message?: string; detail?: string } }).data?.message ||
            (error as { data?: { message?: string; detail?: string } }).data?.detail ||
            "Reset password failed."
          : "Reset password failed.";

      toast.error(message);
    }
  };

  return (
    <AuthCard>
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/auth/verify-otp"
          className="text-gray-900 hover:text-gray-600"
        >
          <ArrowLeft />
        </Link>
        <h2 className="text-lg font-bold text-gray-900">Change Password</h2>
      </div>

      <p className="text-sm text-gray-400 mb-6">
        Your password must be at least 8 characters long.
      </p>

      {email && <p className="text-sm text-gray-500 mb-6">Email: {email}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
            New Password
          </label>
          <div className="relative">
            <input
              type={showNewPassword ? "text" : "password"}
              placeholder="Set new password"
              {...register("newPassword")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b3a5c]/30 focus:border-[#1b3a5c] transition pr-11"
            />
            <button
              type="button"
              onClick={() => setShowNewPassword(!showNewPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showNewPassword ? <Eye size={17}/> : <EyeOff size={17}/>}
            </button>
          </div>
          {errors.newPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.newPassword.message}
            </p>
          )}
          {passwordServerErrors.length > 0 && (
            <div className="text-red-500 text-xs mt-2 space-y-1">
              {passwordServerErrors.map((item) => (
                <p key={item}>{item}</p>
              ))}
            </div>
          )}
        </div>

        <div>
          <label className="block text-sm font-semibold text-gray-900 mb-1.5">
            Confirm new password
          </label>
          <div className="relative">
            <input
              type={showConfirmPassword ? "text" : "password"}
              placeholder="Re-enter new password"
              {...register("confirmPassword")}
              className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b3a5c]/30 focus:border-[#1b3a5c] transition pr-11"
            />
            <button
              type="button"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
            >
              {showConfirmPassword ? <Eye /> : <EyeOff />}
            </button>
          </div>
          {errors.confirmPassword && (
            <p className="text-red-500 text-xs mt-1">
              {errors.confirmPassword.message}
            </p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full py-3.5 bg-linear-to-b from-[#2c4f6e] to-[#0f2336] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting || isLoading ? "Saving..." : "Save"}
        </button>
      </form>
    </AuthCard>
  );
}
