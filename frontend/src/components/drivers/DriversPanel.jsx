export default function DriversPanel({ drivers, selectedDriver, onDriverSelect }) {
  if (!drivers || drivers.length === 0) {
    return (
      <div className="bg-f1-gray rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">STANDINGS</h3>
        <p className="text-gray-500 text-sm">Start a race to see standings</p>
      </div>
    )
  }

  const sortedDrivers = [...drivers].sort((a, b) => a.position - b.position)

  return (
    <div className="bg-f1-gray rounded-lg p-4 max-h-[500px] overflow-y-auto">
      <h3 className="text-sm font-semibold text-gray-400 mb-3">STANDINGS</h3>

      <div className="space-y-1">
        {sortedDrivers.map((driver, index) => (
          <div
            key={driver.id}
            onClick={() => onDriverSelect(driver)}
            className={`flex items-center gap-2 p-2 rounded cursor-pointer transition-all ${
              selectedDriver?.id === driver.id
                ? 'bg-f1-red/20 border border-f1-red'
                : 'bg-f1-black hover:bg-gray-800'
            }`}
          >
            {/* Position */}
            <div className={`w-6 h-6 rounded flex items-center justify-center text-xs font-bold ${
              index === 0 ? 'bg-yellow-500 text-black' :
              index === 1 ? 'bg-gray-400 text-black' :
              index === 2 ? 'bg-amber-700 text-white' :
              'bg-gray-700 text-white'
            }`}>
              {driver.position}
            </div>

            {/* Team Color Bar */}
            <div
              className="w-1 h-8 rounded"
              style={{ backgroundColor: driver.teamColor }}
            />

            {/* Driver Info */}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <span className="font-semibold text-sm truncate">{driver.abbreviation}</span>
                <span className="text-xs text-gray-500">#{driver.number}</span>
              </div>
              <div className="text-xs text-gray-400 truncate">{driver.team}</div>
            </div>

            {/* Tire */}
            <div className={`w-4 h-4 rounded-full tire-${driver.tireCompound}`} title={driver.tireCompound} />

            {/* Gap */}
            <div className="text-right">
              {index === 0 ? (
                <span className="text-xs text-green-500 font-mono">LEADER</span>
              ) : (
                <span className="text-xs text-gray-400 font-mono">
                  +{driver.gapToLeader}s
                </span>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
