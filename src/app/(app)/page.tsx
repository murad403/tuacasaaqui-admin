import {
  Users,
  MapPin,
  FileText,
  GitCompareArrows,
  TrendingUp,
  Copy,
} from "lucide-react";

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

const searchActivityData = [
  { month: "Oct", value: 12500 },
  { month: "Nov", value: 13000 },
  { month: "Dec", value: 11000 },
  { month: "Jan", value: 13500 },
  { month: "Feb", value: 14500 },
  { month: "Mar", value: 16000 },
];

const mostViewedAreas = [
  { rank: 1, name: "Downtown Brooklyn", views: "4,234 views", saves: 892 },
  { rank: 2, name: "Chelsea Manhattan", views: "3,892 views", saves: 756 },
  { rank: 3, name: "Williamsburg", views: "3,654 views", saves: 721 },
  { rank: 4, name: "Upper West Side", views: "3,421 views", saves: 687 },
  { rank: 5, name: "SoHo", views: "3,156 views", saves: 634 },
];

const savedNeighborhoods = [
  { name: "Park Slope", count: 1245, pct: 100 },
  { name: "Greenwich Village", count: 1123, pct: 90 },
  { name: "Astoria", count: 987, pct: 79 },
  { name: "Long Island City", count: 876, pct: 70 },
  { name: "Carroll Gardens", count: 765, pct: 61 },
];

const rankColors = [
  "bg-blue-600",
  "bg-blue-500",
  "bg-blue-400",
  "bg-blue-300",
  "bg-blue-200",
];

export default function DashboardPage() {
  const maxVal = Math.max(...searchActivityData.map((d) => d.value));
  const chartHeight = 200;
  const points = searchActivityData
    .map((d, i) => {
      const x = (i / (searchActivityData.length - 1)) * 100;
      const y = chartHeight - (d.value / maxVal) * chartHeight;
      return `${x},${y}`;
    })
    .join(" ");

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">
          Dashboard Overview
        </h1>
        <p className="text-sm text-gray-500 mt-1">
          Welcome back, Fernando. Here&apos;s what&apos;s happening with your
          location intelligence platform.
        </p>
      </div>

      {/* Stat Cards */}
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
            <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
            <p className="text-sm text-gray-500">{stat.label}</p>
          </div>
        ))}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
        {/* Search Activity */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Search Activity
          </h2>
          <div className="relative">
            {/* Y axis labels */}
            <div className="flex flex-col justify-between h-[200px] text-xs text-gray-400 pr-2 absolute left-0 top-0">
              <span>18000</span>
              <span>13500</span>
              <span>9000</span>
              <span>4500</span>
              <span>0</span>
            </div>
            {/* Chart area */}
            <div className="ml-12">
              <svg
                viewBox={`0 0 100 ${chartHeight}`}
                className="w-full h-[200px]"
                preserveAspectRatio="none"
              >
                {/* Grid lines */}
                {[0, 0.25, 0.5, 0.75, 1].map((p) => (
                  <line
                    key={p}
                    x1="0"
                    y1={p * chartHeight}
                    x2="100"
                    y2={p * chartHeight}
                    stroke="#f0f0f0"
                    strokeWidth="0.5"
                  />
                ))}
                {/* Line */}
                <polyline
                  fill="none"
                  stroke="#1b3a5c"
                  strokeWidth="1.5"
                  points={points}
                  vectorEffect="non-scaling-stroke"
                />
                {/* Dots */}
                {searchActivityData.map((d, i) => {
                  const x = (i / (searchActivityData.length - 1)) * 100;
                  const y = chartHeight - (d.value / maxVal) * chartHeight;
                  return (
                    <circle
                      key={i}
                      cx={x}
                      cy={y}
                      r="2"
                      fill="#1b3a5c"
                      vectorEffect="non-scaling-stroke"
                    />
                  );
                })}
              </svg>
              {/* X axis labels */}
              <div className="flex justify-between text-xs text-gray-400 mt-2">
                {searchActivityData.map((d) => (
                  <span key={d.month}>{d.month}</span>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Most Viewed Areas */}
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h2 className="text-lg font-bold text-gray-900 mb-4">
            Most Viewed Areas
          </h2>
          <div className="space-y-4">
            {mostViewedAreas.map((area) => (
              <div
                key={area.rank}
                className="flex items-center justify-between"
              >
                <div className="flex items-center gap-3">
                  <span
                    className={`size-7 rounded-full flex items-center justify-center text-xs font-bold text-white ${rankColors[area.rank - 1]}`}
                  >
                    {area.rank}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      {area.name}
                    </p>
                    <p className="text-xs text-gray-400">{area.views}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 text-sm text-gray-500">
                  <Copy className="size-4" />
                  {area.saves}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Most Saved Neighborhoods */}
      <div className="bg-white rounded-xl border border-gray-200 p-5 max-w-xl">
        <h2 className="text-lg font-bold text-gray-900 mb-4">
          Most Saved Neighborhoods
        </h2>
        <div className="space-y-4">
          {savedNeighborhoods.map((n) => (
            <div key={n.name} className="flex items-center gap-4">
              <span className="text-sm text-gray-700 w-36 shrink-0">
                {n.name}
              </span>
              <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-[#1b8a7a] rounded-full"
                  style={{ width: `${n.pct}%` }}
                />
              </div>
              <span className="text-sm font-semibold text-gray-700 w-12 text-right">
                {n.count}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
