import baseApi1 from "@/redux/api/baseApi1";

type Profile = {
    id: number;
    email: string;
    name: string;
    image: string | null;
    is_verified: boolean;
    date_joined: string;
};

type UpdateProfileResponse = {
    message?: string;
    data?: Profile;
};

type ChangePasswordRequest = {
    old_password: string;
    new_password: string;
};

type ChangePasswordResponse = {
    message: string;
};

const settingsApi = baseApi1.injectEndpoints({
    endpoints: (builder) => ({
        getProfile: builder.query<Profile, void>({
            query: () => {
                return {
                    url: "/users/me/",
                    method: "GET"
                };
            },
            providesTags: ["Profile"]
        }),
        updateProfile: builder.mutation<UpdateProfileResponse, FormData>({
            query: (data) => {
                return {
                    url: "/users/me/update/",
                    method: "PATCH",
                    body: data
                };
            },
            invalidatesTags: ["Profile"]
        }),
        changePassword: builder.mutation<ChangePasswordResponse, ChangePasswordRequest>({
            query: (data) => {
                return {
                    url: "/users/change-password/",
                    method: "POST",
                    body: data
                };
            },
            invalidatesTags: ["Profile"]
        }),

    })
});


export const { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation } = settingsApi;