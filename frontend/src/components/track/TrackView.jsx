import { useMemo } from 'react'

export default function TrackView({ raceState, selectedDriver, onDriverSelect }) {
  // Generate track points for an oval-like circuit
  const trackPoints = useMemo(() => {
    const points = []
    const centerX = 250
    const centerY = 200
    const radiusX = 200
    const radiusY = 150

    for (let i = 0; i <= 100; i++) {
      const angle = (i / 100) * Math.PI * 2 - Math.PI / 2
      const x = centerX + radiusX * Math.cos(angle)
      const y = centerY + radiusY * Math.sin(angle)
      points.push({ x, y, progress: i })
    }
    return points
  }, [])

  // Get position on track for a driver
  const getDriverPosition = (trackPosition) => {
    const normalizedPos = trackPosition % 100
    const angle = (normalizedPos / 100) * Math.PI * 2 - Math.PI / 2
    const centerX = 250
    const centerY = 200
    const radiusX = 200
    const radiusY = 150

    return {
      x: centerX + radiusX * Math.cos(angle),
      y: centerY + radiusY * Math.sin(angle)
    }
  }

  const drivers = raceState?.drivers || []
  const trackName = raceState?.track?.name || 'Circuit'

  return (
    <div className="bg-f1-gray rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-400">TRACK VIEW</h3>
        <span className="text-xs text-gray-500">{trackName}</span>
      </div>

      <div className="bg-f1-black rounded-lg p-4">
        <svg viewBox="0 0 500 400" className="w-full h-auto">
          {/* Track outline */}
          <ellipse
            cx="250"
            cy="200"
            rx="200"
            ry="150"
            fill="none"
            stroke="#38383F"
            strokeWidth="30"
          />

          {/* Track center line */}
          <ellipse
            cx="250"
            cy="200"
            rx="200"
            ry="150"
            fill="none"
            stroke="#4a4a4a"
            strokeWidth="2"
            strokeDasharray="10 5"
          />

          {/* Start/Finish line */}
          <line
            x1="250"
            y1="50"
            x2="250"
            y2="20"
            stroke="#E10600"
            strokeWidth="4"
          />
          <rect x="240" y="15" width="20" height="8" fill="white" />
          <rect x="240" y="15" width="5" height="4" fill="black" />
          <rect x="250" y="15" width="5" height="4" fill="black" />
          <rect x="245" y="19" width="5" height="4" fill="black" />
          <rect x="255" y="19" width="5" height="4" fill="black" />

          {/* DRS Zone indicator */}
          <path
            d="M 350 50 A 200 150 0 0 1 450 200"
            fill="none"
            stroke="#43B02A"
            strokeWidth="4"
            strokeDasharray="5 3"
          />
          <text x="420" y="100" fill="#43B02A" fontSize="10">DRS</text>

          {/* Driver positions */}
          {drivers.map((driver) => {
            const pos = getDriverPosition(driver.trackPosition)
            const isSelected = selectedDriver?.id === driver.id

            return (
              <g key={driver.id} onClick={() => onDriverSelect(driver)} style={{ cursor: 'pointer' }}>
                {/* Driver dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 12 : 8}
                  fill={driver.teamColor}
                  stroke={isSelected ? '#fff' : 'none'}
                  strokeWidth={2}
                  className="transition-all duration-150"
                />

                {/* Driver number */}
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize={isSelected ? 10 : 8}
                  fontWeight="bold"
                >
                  {driver.position}
                </text>

                {/* Selected driver label */}
                {isSelected && (
                  <>
                    <rect
                      x={pos.x + 15}
                      y={pos.y - 10}
                      width="40"
                      height="20"
                      fill={driver.teamColor}
                      rx="3"
                    />
                    <text
                      x={pos.x + 35}
                      y={pos.y + 4}
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {driver.abbreviation}
                    </text>
                  </>
                )}
              </g>
            )
          })}

          {/* Legend */}
          <g transform="translate(10, 360)">
            <text fill="#666" fontSize="10">
              Click on a driver to see telemetry
            </text>
          </g>
        </svg>
      </div>

      {/* Mini stats */}
      {raceState?.status !== 'idle' && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="text-center">
            <div className="text-xs text-gray-500">LEADER</div>
            <div className="font-semibold" style={{ color: drivers[0]?.teamColor }}>
              {drivers.find(d => d.position === 1)?.abbreviation || '-'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">FASTEST LAP</div>
            <div className="font-semibold text-purple-400">
              {drivers.reduce((min, d) =>
                d.bestLapTime && (!min || parseFloat(d.bestLapTime) < parseFloat(min))
                  ? d.bestLapTime : min, null) || '-'}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">PIT STOPS</div>
            <div className="font-semibold">
              {drivers.reduce((sum, d) => sum + (d.pitStops || 0), 0)}
            </div>
          </div>
          <div className="text-center">
            <div className="text-xs text-gray-500">RETIRED</div>
            <div className="font-semibold text-red-500">
              {drivers.filter(d => d.status === 'out').length}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
