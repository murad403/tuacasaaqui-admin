"use client";
import React, { useRef, useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { verifyOtpSchema, type VerifyOtpFormData } from "@/validation/auth.validation";
import AuthCard from "@/components/auth/AuthCard";
import { ArrowLeft } from "lucide-react";

export default function VerifyOtpPage() {
  const router = useRouter();
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);
  const [countdown, setCountdown] = useState(0);
  const timerRef = useRef<ReturnType<typeof setInterval> | null>(null);

  const { control, handleSubmit, setValue, getValues, formState: { errors, isSubmitting } } = useForm<VerifyOtpFormData>({
    resolver: zodResolver(verifyOtpSchema),
    defaultValues: { otp: "" },
  });

  const handleOtpChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return;

    const currentOtp = getValues("otp").split("");
    while (currentOtp.length < 5) currentOtp.push("");
    currentOtp[index] = value.slice(-1);
    setValue("otp", currentOtp.join(""), { shouldValidate: true });

    if (value && index < 4) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>
  ) => {
    if (e.key === "Backspace" && !getValues("otp")[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, 5);
    if (pastedData) {
      setValue("otp", pastedData.padEnd(5, ""), { shouldValidate: true });
      const focusIndex = Math.min(pastedData.length, 4);
      inputRefs.current[focusIndex]?.focus();
    }
  };

  const onSubmit = async (data: VerifyOtpFormData) => {
    console.log("OTP:", data.otp);
    router.push("/auth/reset-password");
  };

  const handleResend = () => {
    console.log("Resend OTP");
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

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <Controller
          name="otp"
          control={control}
          render={({ field }) => (
            <div className="flex gap-3 justify-between" onPaste={handlePaste}>
              {Array.from({ length: 5 }).map((_, i) => (
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
        {errors.otp && (
          <p className="text-red-500 text-xs text-center">{errors.otp.message}</p>
        )}

        <div className="flex items-center justify-between text-sm">
          <span className="text-gray-400">Didn&apos;t receive the code?</span>
          {countdown > 0 ? (
            <span className="font-semibold text-gray-400">
              Resend in {countdown}s
            </span>
          ) : (
            <button
              type="button"
              onClick={handleResend}
              className="font-semibold text-gray-900 hover:underline cursor-pointer"
            >
              Resend
            </button>
          )}
        </div>

        <button
          type="submit"
          disabled={isSubmitting}
          className="w-full py-3.5 bg-linear-to-b from-[#2c4f6e] to-[#0f2336] text-white rounded-lg font-semibold text-sm hover:opacity-90 transition disabled:opacity-60 cursor-pointer"
        >
          {isSubmitting ? "Confirming..." : "Confirm"}
        </button>
      </form>
    </AuthCard>
  );
}
