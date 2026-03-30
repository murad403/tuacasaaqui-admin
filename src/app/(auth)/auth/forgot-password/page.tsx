"use client";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import {
  forgotPasswordSchema,
  type ForgotPasswordFormData,
} from "@/validation/auth.validation";
import AuthCard from "@/components/shared/AuthCard";
import { ArrowLeft } from "lucide-react";
import { useSendOtpMutation } from "@/redux/features/auth/auth.api";
import { toast } from "react-toastify";

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [sendOtp, { isLoading }] = useSendOtpMutation();
  const { register, handleSubmit, formState: { errors, isSubmitting }} = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = async (data: ForgotPasswordFormData) => {
    try {
      const response = await sendOtp({ email: data.email, reason: "reset" }).unwrap();
      toast.success(response.message || "OTP sent for reset.");
      router.push(`/auth/verify-otp?email=${encodeURIComponent(data.email)}`);
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: string; detail?: string } }).data === "object"
          ? (error as { data?: { message?: string; detail?: string } }).data?.message ||
            (error as { data?: { message?: string; detail?: string } }).data?.detail ||
            "Failed to send OTP."
          : "Failed to send OTP.";

      toast.error(message);
    }
  };

  return (
    <AuthCard>
      <div className="flex items-center gap-2 mb-4">
        <Link href="/auth/sign-in" className="text-gray-900 hover:text-gray-600">
          <ArrowLeft />
        </Link>
        <h2 className="text-lg font-bold text-gray-900">Verify Email</h2>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div>
          <label className="block text-base font-semibold text-gray-900 mb-1.5">
            Email
          </label>
          <input
            type="email"
            placeholder="Enter your email"
            {...register("email")}
            className="w-full px-4 py-3 border border-gray-300 rounded-lg text-sm placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-[#1b3a5c]/30 focus:border-[#1b3a5c] transition"
          />
          {errors.email && (
            <p className="text-red-500 text-xs mt-1">{errors.email.message}</p>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isLoading}
          className="w-full py-3.5 bg-linear-to-b from-[#2c4f6e] to-[#0f2336] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting || isLoading ? "Verifying..." : "Verify"}
        </button>
      </form>
    </AuthCard>
  );
}
