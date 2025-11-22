import { useState, useEffect } from 'react'

export default function TelemetryHUD({ socket, driver, raceState }) {
  const [telemetry, setTelemetry] = useState(null)

  useEffect(() => {
    if (!socket || !driver) return

    const handleTelemetry = (data) => {
      if (data.driverId === driver.id) {
        setTelemetry(data)
      }
    }

    socket.on('telemetry:update', handleTelemetry)

    return () => {
      socket.off('telemetry:update', handleTelemetry)
    }
  }, [socket, driver])

  // Get current driver data from race state
  const currentDriver = raceState?.drivers?.find(d => d.id === driver?.id) || driver

  if (!currentDriver) return null

  const speed = currentDriver.speed || telemetry?.speed || 0
  const maxSpeed = 350
  const speedPercent = (speed / maxSpeed) * 100

  return (
    <div className="bg-f1-gray rounded-lg p-4">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-3">
          <div
            className="w-2 h-10 rounded"
            style={{ backgroundColor: currentDriver.teamColor }}
          />
          <div>
            <h3 className="font-bold text-lg">{currentDriver.name || currentDriver.abbreviation}</h3>
            <p className="text-sm text-gray-400">{currentDriver.team} #{currentDriver.number}</p>
          </div>
        </div>
        <div className="text-right">
          <div className="text-3xl font-bold">P{currentDriver.position}</div>
          <div className="text-xs text-gray-500">LAP {currentDriver.lap}</div>
        </div>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {/* Speed */}
        <div className="col-span-2 bg-f1-black rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">SPEED</div>
          <div className="flex items-end gap-2">
            <span className="text-4xl font-bold">{Math.round(speed)}</span>
            <span className="text-gray-500 mb-1">km/h</span>
          </div>
          <div className="mt-2 h-2 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-green-500 via-yellow-500 to-red-500 transition-all"
              style={{ width: `${speedPercent}%` }}
            />
          </div>
        </div>

        {/* Gear & RPM */}
        <div className="bg-f1-black rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">GEAR</div>
          <div className="text-4xl font-bold text-center">
            {telemetry?.gear || Math.ceil(speed / 45) || 1}
          </div>
        </div>

        {/* DRS */}
        <div className="bg-f1-black rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">DRS</div>
          <div className={`text-2xl font-bold text-center ${
            currentDriver.drs || telemetry?.drs ? 'text-green-500' : 'text-gray-600'
          }`}>
            {currentDriver.drs || telemetry?.drs ? 'OPEN' : 'OFF'}
          </div>
        </div>

        {/* Tire Info */}
        <div className="bg-f1-black rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">TIRE</div>
          <div className="flex items-center gap-2">
            <div className={`w-6 h-6 rounded-full tire-${currentDriver.tireCompound}`} />
            <span className="capitalize text-sm">{currentDriver.tireCompound}</span>
          </div>
          <div className="mt-2 text-xs text-gray-400">
            Wear: {currentDriver.tireWear}%
          </div>
        </div>

        {/* Lap Times */}
        <div className="bg-f1-black rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">LAST LAP</div>
          <div className="text-lg font-mono">
            {currentDriver.lastLapTime ? `${currentDriver.lastLapTime}s` : '--.---'}
          </div>
        </div>

        {/* Best Lap */}
        <div className="bg-f1-black rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">BEST LAP</div>
          <div className="text-lg font-mono text-purple-400">
            {currentDriver.bestLapTime ? `${currentDriver.bestLapTime}s` : '--.---'}
          </div>
        </div>

        {/* Gap */}
        <div className="bg-f1-black rounded-lg p-4">
          <div className="text-xs text-gray-500 mb-1">GAP TO LEADER</div>
          <div className="text-lg font-mono">
            {currentDriver.position === 1 ? (
              <span className="text-green-500">LEADER</span>
            ) : (
              <span className="text-yellow-500">+{currentDriver.gapToLeader}s</span>
            )}
          </div>
        </div>
      </div>

      {/* Throttle/Brake bars */}
      <div className="grid grid-cols-2 gap-4 mt-4">
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>THROTTLE</span>
            <span>{Math.round((telemetry?.throttle || 0.7) * 100)}%</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-green-500 transition-all"
              style={{ width: `${(telemetry?.throttle || 0.7) * 100}%` }}
            />
          </div>
        </div>
        <div>
          <div className="flex justify-between text-xs text-gray-500 mb-1">
            <span>BRAKE</span>
            <span>{Math.round((telemetry?.brake || 0) * 100)}%</span>
          </div>
          <div className="h-3 bg-gray-700 rounded-full overflow-hidden">
            <div
              className="h-full bg-red-500 transition-all"
              style={{ width: `${(telemetry?.brake || 0) * 100}%` }}
            />
          </div>
        </div>
      </div>
    </div>
  )
}
