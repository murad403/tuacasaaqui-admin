"use client"

import { Loader2 } from "lucide-react";
import { useGetUserQuery, useUserStatsQuery } from "@/redux/features/user/user.api";


const Stats = () => {
    const { data: statsData, isLoading: statsLoading } = useUserStatsQuery();
    const { data: users = [], isLoading: usersLoading } = useGetUserQuery();

    const readStat = (keys: string[], fallback: number) => {
        if (!statsData) return fallback;

        for (const key of keys) {
            const value = statsData[key];
            if (typeof value === "number") {
                return value;
            }
        }

        return fallback;
    };

    const totalUsers = readStat(["total_users", "total", "total_user"], users.length);
    const verifiedUsers = readStat(
        ["verified_users", "active_users", "verified", "active"],
        users.filter((user) => user.is_verified).length
    );
    const pendingUsers = readStat(
        ["pending_users", "unverified_users", "guest_users", "pending", "guest"],
        Math.max(totalUsers - verifiedUsers, 0)
    );

    const currentMonth = new Date().getMonth();
    const currentYear = new Date().getFullYear();
    const thisMonthUsers = readStat(
        ["new_users_this_month", "this_month_users", "new_users"],
        users.filter((user) => {
            const joinedDate = new Date(user.date_joined);
            return joinedDate.getMonth() === currentMonth && joinedDate.getFullYear() === currentYear;
        }).length
    );

    const cards = [
        {
            label: "Total Users",
            value: totalUsers,
            color: "text-green-500",
        },
        {
            label: "Verified Users",
            value: verifiedUsers,
            color: "text-emerald-500",
        },
        {
            label: "Pending Users",
            value: pendingUsers,
            color: "text-blue-500",
        },
        {
            label: "Joined This Month",
            value: thisMonthUsers,
            color: "text-cyan-500",
        },
    ];

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
            {cards.map((stat) => (
                <div
                    key={stat.label}
                    className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5"
                >
                    <p className="text-sm text-description">{stat.label}</p>
                    {(statsLoading || usersLoading) ? (
                        <div className="mt-1 inline-flex items-center gap-2 text-description text-sm">
                            <Loader2 className="size-4 animate-spin" />
                            Loading...
                        </div>
                    ) : (
                        <p className={`text-2xl font-medium ${stat.color}`}>{stat.value}</p>
                    )}
                </div>
            ))}
        </div>
    )
}

export default Stats
