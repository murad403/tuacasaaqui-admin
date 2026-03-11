const savedNeighborhoods = [
    { name: "Park Slope", count: 1245, pct: 100 },
    { name: "Greenwich Village", count: 1123, pct: 90 },
    { name: "Astoria", count: 987, pct: 79 },
    { name: "Long Island City", count: 876, pct: 70 },
    { name: "Carroll Gardens", count: 765, pct: 61 },
];


const MostSavedNeighborhoods = () => {
    return (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
            <h2 className="text-lg font-medium text-title mb-5">
                Most Saved Neighborhoods
            </h2>
            <div className="space-y-4">
                {savedNeighborhoods.map((n) => (
                    <div key={n.name} className="flex items-center gap-4">
                        <span className="text-base text-title w-36 shrink-0">
                            {n.name}
                        </span>
                        <div className="flex-1 h-3 bg-gray-100 rounded-full overflow-hidden">
                            <div
                                className="h-full bg-[#14B8A6] rounded-full"
                                style={{ width: `${n.pct}%` }}
                            />
                        </div>
                        <span className="text-sm text-description w-12 text-right">
                            {n.count}
                        </span>
                    </div>
                ))}
            </div>
        </div>
    )
}

export default MostSavedNeighborhoods
