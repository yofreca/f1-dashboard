import { useMemo } from 'react'
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, Cell } from 'recharts'

export default function StatsPanel({ raceState }) {
  const drivers = raceState?.drivers || []

  // Speed comparison data
  const speedData = useMemo(() => {
    return drivers
      .slice(0, 10)
      .map(d => ({
        name: d.abbreviation,
        speed: d.speed,
        color: d.teamColor
      }))
      .sort((a, b) => b.speed - a.speed)
  }, [drivers])

  // Tire wear comparison
  const tireData = useMemo(() => {
    return drivers
      .slice(0, 10)
      .map(d => ({
        name: d.abbreviation,
        wear: d.tireWear,
        color: d.teamColor
      }))
      .sort((a, b) => b.wear - a.wear)
  }, [drivers])

  // Stats summary
  const stats = useMemo(() => {
    if (drivers.length === 0) return null

    const leader = drivers.find(d => d.position === 1)
    const fastestLap = drivers.reduce((min, d) => {
      if (!d.bestLapTime) return min
      if (!min || parseFloat(d.bestLapTime) < parseFloat(min.time)) {
        return { driver: d, time: d.bestLapTime }
      }
      return min
    }, null)

    const avgSpeed = Math.round(
      drivers.reduce((sum, d) => sum + d.speed, 0) / drivers.length
    )

    const totalPitStops = drivers.reduce((sum, d) => sum + (d.pitStops || 0), 0)

    return { leader, fastestLap, avgSpeed, totalPitStops }
  }, [drivers])

  if (!stats) {
    return (
      <div className="bg-f1-gray rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">STATISTICS</h3>
        <p className="text-gray-500 text-sm">No data available</p>
      </div>
    )
  }

  return (
    <div className="bg-f1-gray rounded-lg p-4 space-y-4">
      <h3 className="text-sm font-semibold text-gray-400">STATISTICS</h3>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 gap-2">
        <div className="bg-f1-black rounded p-3">
          <div className="text-xs text-gray-500">LEADER</div>
          <div className="font-bold" style={{ color: stats.leader?.teamColor }}>
            {stats.leader?.abbreviation}
          </div>
        </div>
        <div className="bg-f1-black rounded p-3">
          <div className="text-xs text-gray-500">AVG SPEED</div>
          <div className="font-bold">{stats.avgSpeed} km/h</div>
        </div>
        <div className="bg-f1-black rounded p-3">
          <div className="text-xs text-gray-500">FASTEST LAP</div>
          <div className="font-bold text-purple-400">
            {stats.fastestLap?.time || '--.---'}
          </div>
          <div className="text-xs text-gray-500">
            {stats.fastestLap?.driver?.abbreviation}
          </div>
        </div>
        <div className="bg-f1-black rounded p-3">
          <div className="text-xs text-gray-500">PIT STOPS</div>
          <div className="font-bold">{stats.totalPitStops}</div>
        </div>
      </div>

      {/* Speed Chart */}
      <div>
        <div className="text-xs text-gray-500 mb-2">TOP SPEEDS</div>
        <div className="h-32 bg-f1-black rounded p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={speedData} layout="vertical">
              <XAxis type="number" hide domain={[0, 350]} />
              <YAxis type="category" dataKey="name" width={35} tick={{ fill: '#888', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#15151E', border: 'none' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value) => [`${value} km/h`, 'Speed']}
              />
              <Bar dataKey="speed" radius={[0, 4, 4, 0]}>
                {speedData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* Tire Wear Chart */}
      <div>
        <div className="text-xs text-gray-500 mb-2">TIRE WEAR</div>
        <div className="h-32 bg-f1-black rounded p-2">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={tireData} layout="vertical">
              <XAxis type="number" hide domain={[0, 100]} />
              <YAxis type="category" dataKey="name" width={35} tick={{ fill: '#888', fontSize: 10 }} />
              <Tooltip
                contentStyle={{ backgroundColor: '#15151E', border: 'none' }}
                labelStyle={{ color: '#fff' }}
                formatter={(value) => [`${value}%`, 'Wear']}
              />
              <Bar dataKey="wear" radius={[0, 4, 4, 0]}>
                {tireData.map((entry, index) => (
                  <Cell
                    key={`cell-${index}`}
                    fill={entry.wear > 70 ? '#E10600' : entry.wear > 40 ? '#FFD700' : '#43B02A'}
                  />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>
    </div>
  )
}
