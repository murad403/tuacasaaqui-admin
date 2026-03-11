import Stats from "./dashboard/Stats";
import MostViewedAreas from "./dashboard/MostViewedAreas";
import SearchActivity from "./dashboard/SearchActivity";
import MostSavedNeighborhoods from "./dashboard/MostSavedNeighborhoods";


export default function DashboardPage() {
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
            <Stats />

            {/* Charts Row */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 mb-6">
                {/* Search Activity */}
                <SearchActivity/>

                {/* Most Viewed Areas */}
                <MostViewedAreas/>
            </div>

            {/* Most Saved Neighborhoods */}
            <MostSavedNeighborhoods/>
        </div>
    );
}
