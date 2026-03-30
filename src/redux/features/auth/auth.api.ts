import baseApi1 from "@/redux/api/baseApi1";

type SignInRequest = {
    email: string;
    password: string;
};

type SignInResponse = {
    message: string;
    refresh: string;
    access: string;
    data: {
        id: number;
        email: string;
        name: string;
        image: string | null;
        is_verified: boolean;
        date_joined: string;
    };
};

type SendOtpRequest = {
    email: string;
    reason: "reset";
};

type SendOtpResponse = {
    message: string;
    otp_preview?: string;
};

type VerifyOtpRequest = {
    email: string;
    code: string;
    reason: "reset";
};

type VerifyOtpResponse = {
    message: string;
};

type ResetPasswordRequest = {
    email: string;
    new_password: string;
};

type ResetPasswordResponse = {
    message: string;
};

const authApi = baseApi1.injectEndpoints({
    endpoints: (builder) => ({
        signIn: builder.mutation<SignInResponse, SignInRequest>({
            query: (data) => {
                return {
                    url: "/users/signin/",
                    method: "POST",
                    body: data
                };
            }
        }),
        sendOtp: builder.mutation<SendOtpResponse, SendOtpRequest>({
            query: (data) => {
                return {
                    url: "/users/send-otp/",
                    method: "POST",
                    body: data
                };
            }
        }),
        verifyOtp: builder.mutation<VerifyOtpResponse, VerifyOtpRequest>({
            query: (data) => {
                return {
                    url: "/users/verify-otp/",
                    method: "POST",
                    body: data
                };
            }
        }),
        resetPassword: builder.mutation<ResetPasswordResponse, ResetPasswordRequest>({
            query: (data) => {
                return {
                    url: "/users/reset-password/",
                    method: "POST",
                    body: data
                };
            }
        }),

    })
});


export const { useSignInMutation, useSendOtpMutation, useVerifyOtpMutation, useResetPasswordMutation } = authApi;