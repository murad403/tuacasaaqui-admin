"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, type VerifyOtpFormData } from "@/validation/auth.validation";
import AuthCard from "@/components/shared/AuthCard";
import { ArrowLeft } from "lucide-react";
import { useSendOtpMutation, useVerifyOtpMutation } from "@/redux/features/auth/auth.api";
import { toast } from "react-toastify";

export default function VerifyOtpPage() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const email = searchParams.get("email") || "";
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const [verifyOtp, { isLoading: isVerifying }] = useVerifyOtpMutation();
  const [sendOtp, { isLoading: isResending }] = useSendOtpMutation();

  const { control, handleSubmit, setValue, getValues, formState: { errors, isSubmitting } } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { code: "" },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const currentOtp = getValues("code").split("");
    while (currentOtp.length < 6) currentOtp.push("");
    currentOtp[index] = value.slice(-1);
    setValue("code", currentOtp.join(""), { shouldValidate: true });

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !getValues("code")[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 6);
    if (pastedData) {
      setValue("code", pastedData.padEnd(6, ""), { shouldValidate: true });
      const focusIndex = Math.min(pastedData.length, 5);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const onSubmit = async (data: VerifyOtpFormData) => {
    if (!email) {
      toast.error("Email not found. Please verify email again.");
      router.push("/auth/forgot-password");
      return;
    }

    try {
      const response = await verifyOtp({
        email,
        code: data.code,
        reason: "reset",
      }).unwrap();

      toast.success(response.message || "OTP verified successfully.");
      router.push(`/auth/reset-password?email=${encodeURIComponent(email)}`);
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: string; detail?: string } }).data === "object"
          ? (error as { data?: { message?: string; detail?: string } }).data?.message ||
            (error as { data?: { message?: string; detail?: string } }).data?.detail ||
            "OTP verification failed."
          : "OTP verification failed.";

      toast.error(message);
    }
  };

  const handleResend = async () => {
    if (!email) {
      toast.error("Email not found. Please verify email again.");
      router.push("/auth/forgot-password");
      return;
    }

    try {
      const response = await sendOtp({ email, reason: "reset" }).unwrap();
      toast.success(response.message || "OTP sent for reset.");
    } catch (error: unknown) {
      const message =
        typeof error === "object" &&
        error !== null &&
        "data" in error &&
        typeof (error as { data?: { message?: string; detail?: string } }).data === "object"
          ? (error as { data?: { message?: string; detail?: string } }).data?.message ||
            (error as { data?: { message?: string; detail?: string } }).data?.detail ||
            "Failed to resend OTP."
          : "Failed to resend OTP.";

      toast.error(message);
      return;
    }

    setCountdown(60);
    if (timerRef.current) clearInterval(timerRef.current);
    timerRef.current = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timerRef.current!);
          timerRef.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
  };

  useEffect(() => {
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, []);

  return (
    <AuthCard>
      <div className="flex items-center gap-2 mb-2">
        <Link
          href="/auth/forgot-password"
          className="text-gray-900 hover:text-gray-600"
        >
          <ArrowLeft />
        </Link>
        <h2 className="text-lg font-bold text-gray-900">Verify OTP</h2>
      </div>

      <p className="text-sm text-gray-400 mb-6">
        An OTP has been sent to your email, please enter it below to verify your
        identity.
      </p>

      {email && <p className="text-sm text-gray-500 mb-6">Email: {email}</p>}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="code"
          control={control}
          render={({ field }) => (
            <div className="flex gap-3 justify-between" onPaste={handlePaste}>
              {Array.from({ length: 6 }).map((_, i) => (
                <input
                  key={i}
                  ref={(el) => {
                    inputRefs.current[i] = el;
                  }}
                  type="text"
                  inputMode="numeric"
                  maxLength={1}
                  value={field.value[i] || ""}
                  onChange={(e) => handleOtpChange(i, e.target.value)}
                  onKeyDown={(e) => handleKeyDown(i, e)}
                  className="w-12 h-12 sm:w-15 sm:h-15 text-center text-lg font-semibold border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-[#1b3a5c]/30 focus:border-[#1b3a5c] transition"
                />
              ))}
            </div>
          )}
        />
        {errors.code && (
          <p className="text-red-500 text-xs text-center">{errors.code.message}</p>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Didn&apos;t receive the code?</span>
          {countdown > 0 ? (
            <span className="font-medium text-heading">
              Resend in {countdown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              disabled={isResending}
              className="font-semibold text-gray-900 hover:underline cursor-pointer"
            >
              {isResending ? "Sending..." : "Resend"}
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting || isVerifying}
          className="w-full py-3.5 bg-linear-to-b from-[#2c4f6e] to-[#0f2336] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting || isVerifying ? "Confirming..." : "Confirm"}
        </button>
      </form>
    </AuthCard>
  );
}
