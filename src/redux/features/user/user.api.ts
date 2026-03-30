import baseApi1 from "@/redux/api/baseApi1";

export interface ManagedUser {
    id: number;
    email: string;
    name: string;
    image: string | null;
    is_verified: boolean;
    date_joined: string;
}

export type UserStatsResponse = Record<string, number>;

const userApi = baseApi1.injectEndpoints({
    endpoints: (builder) => ({
        getUser: builder.query<ManagedUser[], void>({
            query: () => {
                return {
                    url: "/users/manage/",
                    method: "GET",
                };
            },
            providesTags: ["user"]
        }),
        userStats: builder.query<UserStatsResponse, void>({
            query: () => {
                return {
                    url: "/users/manage/stats/",
                    method: "GET",
                };
            },
            providesTags: ["user"]
        }),
        deleteUser: builder.mutation<void, number>({
            query: (id) => {
                return {
                    url: `/users/manage/${id}/delete/`,
                    method: "DELETE",
                };
            },
            invalidatesTags: ["user"]
        }),
    })
});


export const {useDeleteUserMutation, useUserStatsQuery, useGetUserQuery} = userApi;