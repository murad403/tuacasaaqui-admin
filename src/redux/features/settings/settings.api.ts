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

type PageType =
    | "about_us"
    | "privacy_policy"
    | "terms_conditions"
    | "refund_policy"
    | "cookie_policy"
    | "disclaimer"
    | "shipping_policy"
    | "custom";

type CmsPage = {
    id: number;
    page_type: PageType;
    page_type_display: string;
    title: string;
    slug: string;
    content: string;
    meta_title: string;
    meta_description: string;
    version: number;
    status: string;
    status_display: string;
    is_system_page: boolean;
    published_at: string | null;
    created_at: string;
    updated_at: string;
};

type UpdatePageRequest = {
    pageType: PageType;
    data: {
        content: string;
        meta_title: string;
        meta_description: string;
    };
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
        getPrivacy: builder.query<CmsPage, PageType>({
            query: (page_type) => {
                return {
                    url: `/core/pages/${page_type}`,
                    method: "GET"
                };
            },
            providesTags: ["Profile"]
        }),
        updatePrivacy: builder.mutation<CmsPage, UpdatePageRequest>({
            query: ({ pageType, data }) => {
                return {
                    url: `/core/pages/${pageType}/update/`,
                    method: "PUT",
                    body: data
                };
            },
            invalidatesTags: ["Profile"]
        }),
    })
});


export const { useGetProfileQuery, useUpdateProfileMutation, useChangePasswordMutation, useGetPrivacyQuery, useUpdatePrivacyMutation } = settingsApi;