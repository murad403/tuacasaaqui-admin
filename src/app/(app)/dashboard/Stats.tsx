import { FileText, GitCompareArrows, MapPin, TrendingUp, Users } from "lucide-react";

const stats = [
    {
        label: "Total Users",
        value: "24,586",
        change: "+12.5%",
        icon: Users,
        color: "bg-[#1b3a5c]",
    },
    {
        label: "Area Searches",
        value: "156,234",
        change: "+8.3%",
        icon: MapPin,
        color: "bg-emerald-500",
    },
    {
        label: "Published Articles",
        value: "128",
        change: "+4",
        icon: FileText,
        color: "bg-blue-600",
    },
    {
        label: "Compared Zones",
        value: "3,456",
        change: "+6.7%",
        icon: GitCompareArrows,
        color: "bg-cyan-500",
    },
];


const Stats = () => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        {stats.map((stat) => (
          <div
            key={stat.label}
            className="bg-white rounded-xl border border-gray-200 p-4 sm:p-5"
          >
            <div className="flex items-start justify-between mb-3">
              <div
                className={`${stat.color} text-white p-2.5 rounded-full`}
              >
                <stat.icon className="size-5" />
              </div>
              <span className="flex items-center gap-1 text-xs font-semibold text-emerald-500">
                <TrendingUp className="size-3" />
                {stat.change}
              </span>
            </div>
            <p className="text-2xl font-semibold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>
  )
}

export default Stats
