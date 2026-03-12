import z from "zod";

export const signInSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
  password: z.string().min(1, 'Password is required'),
});

export const forgotPasswordSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Invalid email address'),
});

export const verifyOtpSchema = z.object({
  otp: z.string().length(5, 'Please enter all 5 digits'),
});

export const resetPasswordSchema = z.object({
    newPassword: z
      .string()
      .min(8, 'Password must be at least 8 characters')
      .max(10, 'Password must be at most 10 characters'),
    confirmPassword: z.string().min(1, 'Please confirm your password'),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z.object({
  current_password: z.string().min(1, 'Current password is required'),
  new_password: z
    .string()
    .min(6, 'New password must be at least 6 characters'),
    confirm_new_password: z.string().min(1, 'Please confirm your new password'),
}).refine((data) => data.new_password === data.confirm_new_password, {
  message: 'New passwords do not match',
  path: ['confirm_new_password'],
});

export type SignInFormData = z.infer<typeof signInSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type VerifyOtpFormData = z.infer<typeof verifyOtpSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;