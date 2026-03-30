import baseApi2 from "@/redux/api/baseApi2";

export type FeedbackCategory = "bug_report" | "feature_request" | "data_issue" | "ux_feedback" | "other";

export interface FeedbackItem {
    id: number;
    user_id: string;
    rating: number;
    category: FeedbackCategory;
    message: string;
    created_at: string;
    is_resolved: boolean;
}

export interface FeedbackStats {
    total_feedback: number;
    pending: number;
    resolved: number;
    average_rating: number;
}

export interface GetFeedbackParams {
    rating?: number;
    category?: FeedbackCategory;
    status?: "pending" | "resolved";
}

const feedbackApi = baseApi2.injectEndpoints({
    endpoints: (builder) => ({
        getFeedback: builder.query<FeedbackItem[], GetFeedbackParams | undefined>({
            query: (params) => {
                return {
                    url: "/contents/feedbacks/",
                    method: "GET",
                    params
                };
            },
            providesTags: ["feedback"]
        }),
        feedbackResolve: builder.mutation<void, number>({
            query: (id) => {
                return {
                    url: `/contents/feedbacks/${id}/resolve/`,
                    method: "PATCH"
                };
            },
            invalidatesTags: ["feedback"]
        }),

        feedbackDelete: builder.mutation<void, number>({
            query: (id) => {
                return {
                    url: `/contents/feedbacks/${id}/delete/`,
                    method: "DELETE"
                };
            },
            invalidatesTags: ["feedback"]
        }),
        feedbackStats: builder.query<FeedbackStats, void>({
            query: () => {
                return {
                    url: `/contents/feedbacks/stats/`,
                    method: "GET"
                };
            },
            providesTags: ["feedback"]
        }),
    })
});


export const {useFeedbackDeleteMutation, useFeedbackResolveMutation, useGetFeedbackQuery, useFeedbackStatsQuery} = feedbackApi;