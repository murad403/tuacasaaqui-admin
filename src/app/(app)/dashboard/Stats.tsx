"use client";
import { useDashboardStats1Query, useDashboardStats2Query } from "@/redux/features/dashboard/dashboard.api";
import { BookOpen, Building2, FileText, Star, TrendingUp, Users } from "lucide-react";


const Stats = () => {
  const { data: dashboardStats1 } = useDashboardStats1Query();
  const { data: dashboardStats2 } = useDashboardStats2Query();

  const stats = [
    {
      label: "Total Users",
      value: (dashboardStats1?.total ?? 0).toLocaleString(),
      change: "",
      icon: Users,
      color: "bg-[#EFF6FF] text-[#2B7FFF]",
    },
    {
      label: "Total Properties",
      value: (dashboardStats2?.total_properties ?? 0).toLocaleString(),
      change: "",
      icon: Building2,
      color: "bg-[#F0FDFA] text-[#00BBA7]",
    },
    {
      label: "Total News",
      value: (dashboardStats2?.total_news ?? 0).toLocaleString(),
      change: "",
      icon: FileText,
      color: "bg-[#FFF7ED] text-[#FF6900]",
    },
    {
      label: "Total Guides",
      value: (dashboardStats2?.total_guides ?? 0).toLocaleString(),
      change: "",
      icon: BookOpen,
      color: "bg-[#FAF5FF] text-[#AD46FF]",
    },
    {
      label: "Avg Rating",
      value: (dashboardStats2?.avg_feedback_rating ?? 0).toFixed(2),
      change: "",
      icon: Star,
      color: "bg-[#FEFCE8] text-[#FDC700]",
    },
  ];

  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4 mb-6">
      {stats.map((stat) => (
        <div
          key={stat.label}
          className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5"
        >
          <div className="flex items-start justify-between mb-3">
            <div
              className={`${stat.color} p-2.5 rounded-lg`}
            >
              <stat.icon className="size-5" />
            </div>
            {stat.change ? (
              <span className="flex items-center gap-1 text-xs font-semibold">
                <TrendingUp className="size-3" />
                {stat.change}
              </span>
            ) : null}
          </div>
          <p className="text-2xl font-medium text-title">{stat.value}</p>
          <p className="text-sm text-description">{stat.label}</p>
        </div>
      ))}
    </div>
  )
}

export default Stats
