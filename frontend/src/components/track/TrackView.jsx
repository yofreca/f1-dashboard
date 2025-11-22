import { useMemo } from 'react'
import { getTrackShape } from '../../data/trackShapes'

export default function TrackView({ raceState, selectedDriver, onDriverSelect }) {
  const trackId = raceState?.trackId || raceState?.track?.id
  const trackShape = useMemo(() => getTrackShape(trackId), [trackId])

  const drivers = raceState?.drivers || []
  const trackName = raceState?.track?.name || 'Circuit'

  // Get position on track for a driver using the track shape
  const getDriverPosition = (trackPosition) => {
    return trackShape.getPosition(trackPosition)
  }

  // Find start/finish position (at progress = 0)
  const startFinish = trackShape.getPosition(0)

  return (
    <div className="bg-f1-gray rounded-lg p-4">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-400">TRACK VIEW</h3>
        <div className="text-right">
          <span className="text-xs text-gray-500 block">{trackName}</span>
          <span className="text-xs text-gray-600">{trackShape.name}</span>
        </div>
      </div>

      <div className="bg-f1-black rounded-lg p-4">
        <svg viewBox={trackShape.viewBox} className="w-full h-auto">
          {/* Track surface */}
          {trackShape.path ? (
            <>
              {/* Custom track path */}
              <path
                d={trackShape.path}
                fill="none"
                stroke="#38383F"
                strokeWidth="28"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
              {/* Center line */}
              <path
                d={trackShape.path}
                fill="none"
                stroke="#4a4a4a"
                strokeWidth="2"
                strokeDasharray="10 5"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </>
          ) : (
            <>
              {/* Default ellipse track */}
              <ellipse
                cx="250"
                cy="200"
                rx="200"
                ry="150"
                fill="none"
                stroke="#38383F"
                strokeWidth="28"
              />
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
            </>
          )}

          {/* Start/Finish line */}
          <g transform={`translate(${startFinish.x}, ${startFinish.y})`}>
            <line
              x1="0"
              y1="-20"
              x2="0"
              y2="20"
              stroke="#E10600"
              strokeWidth="4"
            />
            {/* Checkered flag pattern */}
            <rect x="-8" y="-25" width="16" height="8" fill="white" />
            <rect x="-8" y="-25" width="4" height="4" fill="black" />
            <rect x="0" y="-25" width="4" height="4" fill="black" />
            <rect x="-4" y="-21" width="4" height="4" fill="black" />
            <rect x="4" y="-21" width="4" height="4" fill="black" />
          </g>

          {/* Sector markers */}
          {[33, 66].map((progress, i) => {
            const pos = trackShape.getPosition(progress)
            return (
              <g key={i} transform={`translate(${pos.x}, ${pos.y})`}>
                <circle r="4" fill={i === 0 ? '#FFD700' : '#00BFFF'} />
                <text
                  y="-10"
                  textAnchor="middle"
                  fill={i === 0 ? '#FFD700' : '#00BFFF'}
                  fontSize="8"
                >
                  S{i + 2}
                </text>
              </g>
            )
          })}

          {/* DRS Zones */}
          {[15, 55].map((start, i) => {
            const startPos = trackShape.getPosition(start)
            const endPos = trackShape.getPosition(start + 10)
            return (
              <g key={`drs-${i}`}>
                <line
                  x1={startPos.x}
                  y1={startPos.y}
                  x2={endPos.x}
                  y2={endPos.y}
                  stroke="#43B02A"
                  strokeWidth="6"
                  strokeDasharray="5 3"
                  opacity="0.7"
                />
                <text
                  x={(startPos.x + endPos.x) / 2}
                  y={(startPos.y + endPos.y) / 2 - 12}
                  textAnchor="middle"
                  fill="#43B02A"
                  fontSize="8"
                >
                  DRS
                </text>
              </g>
            )
          })}

          {/* Driver positions */}
          {drivers.map((driver) => {
            const pos = getDriverPosition(driver.trackPosition)
            const isSelected = selectedDriver?.id === driver.id

            return (
              <g key={driver.id} onClick={() => onDriverSelect(driver)} style={{ cursor: 'pointer' }}>
                {/* Glow effect for selected */}
                {isSelected && (
                  <circle
                    cx={pos.x}
                    cy={pos.y}
                    r={16}
                    fill="none"
                    stroke={driver.teamColor}
                    strokeWidth="2"
                    opacity="0.5"
                    className="animate-pulse"
                  />
                )}

                {/* Driver dot */}
                <circle
                  cx={pos.x}
                  cy={pos.y}
                  r={isSelected ? 12 : 8}
                  fill={driver.teamColor}
                  stroke={isSelected ? '#fff' : '#000'}
                  strokeWidth={isSelected ? 2 : 1}
                  className="transition-all duration-100"
                />

                {/* Driver position number */}
                <text
                  x={pos.x}
                  y={pos.y + 4}
                  textAnchor="middle"
                  fill="white"
                  fontSize={isSelected ? 10 : 7}
                  fontWeight="bold"
                >
                  {driver.position}
                </text>

                {/* Selected driver label */}
                {isSelected && (
                  <g>
                    <rect
                      x={pos.x + 15}
                      y={pos.y - 12}
                      width="45"
                      height="24"
                      fill={driver.teamColor}
                      rx="4"
                      stroke="#fff"
                      strokeWidth="1"
                    />
                    <text
                      x={pos.x + 37}
                      y={pos.y}
                      textAnchor="middle"
                      fill="white"
                      fontSize="10"
                      fontWeight="bold"
                    >
                      {driver.abbreviation}
                    </text>
                    <text
                      x={pos.x + 37}
                      y={pos.y + 9}
                      textAnchor="middle"
                      fill="rgba(255,255,255,0.7)"
                      fontSize="7"
                    >
                      {driver.speed} km/h
                    </text>
                  </g>
                )}
              </g>
            )
          })}

          {/* Legend */}
          <g transform="translate(10, 380)">
            <text fill="#666" fontSize="9">
              Click driver for telemetry | S2/S3 = Sectors | Green = DRS zones
            </text>
          </g>
        </svg>
      </div>

      {/* Mini stats */}
      {raceState?.status !== 'idle' && (
        <div className="grid grid-cols-4 gap-2 mt-4">
          <div className="text-center">
            <div className="text-xs text-gray-500">LEADER</div>
            <div className="font-semibold" style={{ color: drivers.find(d => d.position === 1)?.teamColor }}>
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
