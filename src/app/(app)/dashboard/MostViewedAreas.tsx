import { Bookmark } from "lucide-react";

const mostViewedAreas = [
    { rank: 1, name: "Downtown Brooklyn", views: "4,234 views", saves: 892 },
    { rank: 2, name: "Chelsea Manhattan", views: "3,892 views", saves: 756 },
    { rank: 3, name: "Williamsburg", views: "3,654 views", saves: 721 },
    { rank: 4, name: "Upper West Side", views: "3,421 views", saves: 687 },
    { rank: 5, name: "SoHo", views: "3,156 views", saves: 634 },
];


const MostViewedAreas = () => {
  return (
    <div className="bg-white rounded-xl border border-gray-200 p-5 h-full">
      <h2 className="text-lg font-medium text-title mb-5">
        Most Viewed Areas
      </h2>
      <div className="space-y-5">
        {mostViewedAreas.map((area) => (
          <div key={area.rank} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <span
                className={`size-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 bg-blue-100 text-button-start`}
              >
                {area.rank}
              </span>
              <div>
                <p className="text-base font-medium text-gray-900">{area.name}</p>
                <p className="text-sm text-description">{area.views}</p>
              </div>
            </div>
            <div className="flex items-center gap-1.5 text-sm text-description">
              <Bookmark className="size-4" />
              {area.saves}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default MostViewedAreas;
