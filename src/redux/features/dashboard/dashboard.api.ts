import baseApi1 from "@/redux/api/baseApi1";
import baseApi2 from "@/redux/api/baseApi2";

export type DashboardStats1Response = {
    total: number;
};

export type DashboardStats2Response = {
    total_properties: number;
    total_news: number;
    total_guides: number;
    avg_feedback_rating: number;
};

export type UserRegistrationTrendItem = {
    day: string;
    count: number;
};

export type MarketStatusItem = {
    market_status: string;
    count: number;
    percentage: number;
};

export type FeedbackRatingTrendItem = {
    month: string;
    avg_rating: number;
    count: number;
};

const dashboardApi1 = baseApi1.injectEndpoints({
    endpoints: (builder) =>({
        dashboardStats1: builder.query<DashboardStats1Response, void>({
            query: () =>{
                return {
                    url: "/analytics/users/summary/",
                    method: "GET"
                }
            }
        }),
        userRegistrationTrend: builder.query<UserRegistrationTrendItem[], void>({
            query: () =>{
                return {
                    url: "/analytics/users/registration-trend/",
                    method: "GET"
                }
            }
        }),
    })
})

export const { useDashboardStats1Query, useUserRegistrationTrendQuery } = dashboardApi1;



const dashboardApi2 = baseApi2.injectEndpoints({
    endpoints: (builder) =>({
        dashboardStats2: builder.query<DashboardStats2Response, void>({
            query: () =>{
                return {
                    url: "/analytics/summary/",
                    method: "GET"
                }
            }
        }),
        marketStatus: builder.query<MarketStatusItem[], void>({
            query: () =>{
                return {
                    url: "/analytics/properties/market-status/",
                    method: "GET"
                }
            }
        }),
        feedbackRatingTrend: builder.query<FeedbackRatingTrendItem[], void>({
            query: () =>{
                return {
                    url: "/analytics/feedback/rating-trend/",
                    method: "GET"
                }
            }
        }),
    })
})

export const { useDashboardStats2Query, useMarketStatusQuery, useFeedbackRatingTrendQuery } = dashboardApi2;