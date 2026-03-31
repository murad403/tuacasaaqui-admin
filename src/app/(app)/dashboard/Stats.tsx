import { BookOpen, Building2, FileText, GitCompareArrows, MapPin, Star, TrendingUp, Users } from "lucide-react";

const stats = [
    {
        label: "Total Users",
        value: "24,586",
        change: "+12.5%",
        icon: Users,
        color: "bg-[#EFF6FF]",
    },
    {
        label: "Total Properties",
        value: "156,234",
        change: "+8.3%",
        icon: Building2,
        color: "bg-[#F0FDFA]",
    },
    {
        label: "Total News",
        value: "128",
        change: "+4",
        icon: FileText,
        color: "bg-[#FFF7ED]",
    },
    {
        label: "Total Guides",
        value: "3,456",
        change: "+6.7%",
        icon: BookOpen ,
        color: "bg-[#FAF5FF]",
    },
    {
        label: "Avg Rating",
        value: "4.2",
        change: "+0.3",
        icon: Star,
        color: "bg-[#FEFCE8]",
    }
];


const Stats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-5 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`${stat.color} text-amber-300 p-2.5 rounded-lg`}
              >
                <stat.icon className="size-5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                <TrendingUp className="size-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-medium text-title">{stat.value}</p>
            <p className="text-sm text-description">{stat.label}</p>
          </div>
        ))}
      </div>
  )
}

export default Stats
