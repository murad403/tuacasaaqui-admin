"use client";
import Stats from "./dashboard/Stats";
import UserRegistrationTrend from "./dashboard/UserRegistrationTrend";
import MarketStatusBreakdown from "./dashboard/MarketStatusBreakdown";
import FeedbackRatingTrend from "./dashboard/FeedbackRatingTrend";
import PropertyTypeMix from "./dashboard/PropertyTypeMix";
import { useGetProfileQuery } from "@/redux/features/settings/settings.api";

export default function DashboardPage() {
    const { data } = useGetProfileQuery(undefined);
    // console.log(data)
    return (
        <div>
            <div className="mb-6">
                <h1 className="text-2xl font-bold text-title">
                    Dashboard Overview
                </h1>
                <p className="text-sm text-description mt-1">
                    Welcome back, {data?.name || 'User'}. Here&apos;s what&apos;s happening with your
                    location intelligence platform.
                </p>
            </div>

            {/* Stat Cards */}
            <Stats />

            {/* Charts Row 1 */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 mb-6">
                {/* User Registration Trend */}
                <div className="xl:col-span-2">
                    <UserRegistrationTrend />
                </div>

                {/* Market Status Breakdown */}
                <div className="">
                    <MarketStatusBreakdown />
                </div>
            </div>

            {/* Charts Row 2 */}
            <div className="grid grid-cols-1 xl:grid-cols-3 gap-4">
                {/* Feedback Rating Trend */}
                <div className="xl:col-span-2">
                    <FeedbackRatingTrend />
                </div>

                {/* Property Type Mix */}
                <div>
                    <PropertyTypeMix />
                </div>
            </div>
        </div>
    );
}
