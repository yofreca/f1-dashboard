import { useState } from 'react'

export default function RaceControls({ socket, raceState, tracks, selectedTrack, setSelectedTrack }) {
  const [speed, setSpeed] = useState(1)

  const handleStart = () => {
    if (socket) {
      socket.emit('race:start', { trackId: selectedTrack })
    }
  }

  const handlePause = () => {
    if (socket) {
      socket.emit('race:pause')
    }
  }

  const handleResume = () => {
    if (socket) {
      socket.emit('race:resume')
    }
  }

  const handleStop = () => {
    if (socket) {
      socket.emit('race:stop')
    }
  }

  const handleReset = () => {
    if (socket) {
      socket.emit('race:reset')
    }
  }

  const handleSpeedChange = (newSpeed) => {
    setSpeed(newSpeed)
    if (socket) {
      socket.emit('race:speed', newSpeed)
    }
  }

  const handleWeatherChange = (weather) => {
    if (socket) {
      socket.emit('race:weather', weather)
    }
  }

  const isIdle = !raceState?.status || raceState?.status === 'idle'
  const isRunning = raceState?.status === 'running'
  const isPaused = raceState?.status === 'paused'
  const isFinished = raceState?.status === 'finished'

  return (
    <div className="bg-f1-gray rounded-lg p-4">
      <h3 className="text-sm font-semibold text-gray-400 mb-4">RACE CONTROL</h3>

      {/* Track Selection */}
      {isIdle && (
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-2">SELECT TRACK</label>
          <select
            value={selectedTrack || ''}
            onChange={(e) => setSelectedTrack(e.target.value ? Number(e.target.value) : null)}
            className="w-full bg-f1-black border border-gray-700 rounded px-3 py-2 text-sm focus:border-f1-red focus:outline-none"
          >
            <option value="">Random Track</option>
            {tracks.map(track => (
              <option key={track.id} value={track.id}>
                {track.name} ({track.country})
              </option>
            ))}
          </select>
        </div>
      )}

      {/* Main Controls */}
      <div className="grid grid-cols-2 gap-2 mb-4">
        {isIdle && (
          <button
            onClick={handleStart}
            className="col-span-2 bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded transition-colors"
          >
            ▶ START RACE
          </button>
        )}

        {isRunning && (
          <>
            <button
              onClick={handlePause}
              className="bg-yellow-600 hover:bg-yellow-700 text-white font-semibold py-2 rounded transition-colors"
            >
              ⏸ PAUSE
            </button>
            <button
              onClick={handleStop}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition-colors"
            >
              ⏹ STOP
            </button>
          </>
        )}

        {isPaused && (
          <>
            <button
              onClick={handleResume}
              className="bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded transition-colors"
            >
              ▶ RESUME
            </button>
            <button
              onClick={handleStop}
              className="bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded transition-colors"
            >
              ⏹ STOP
            </button>
          </>
        )}

        {(isFinished || (!isIdle && !isRunning && !isPaused)) && (
          <button
            onClick={handleReset}
            className="col-span-2 bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 rounded transition-colors"
          >
            ↺ NEW RACE
          </button>
        )}
      </div>

      {/* Speed Control */}
      {!isIdle && (
        <div className="mb-4">
          <label className="block text-xs text-gray-500 mb-2">SIMULATION SPEED</label>
          <div className="flex gap-2">
            {[0.5, 1, 2, 4].map(s => (
              <button
                key={s}
                onClick={() => handleSpeedChange(s)}
                className={`flex-1 py-2 rounded text-sm font-semibold transition-colors ${
                  (raceState?.speed || 1) === s
                    ? 'bg-f1-red text-white'
                    : 'bg-f1-black text-gray-400 hover:bg-gray-700'
                }`}
              >
                {s}x
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Weather Control */}
      {!isIdle && (
        <div>
          <label className="block text-xs text-gray-500 mb-2">WEATHER</label>
          <div className="flex gap-2">
            {[
              { value: 'dry', icon: '☀️', label: 'Dry' },
              { value: 'mixed', icon: '⛅', label: 'Mixed' },
              { value: 'wet', icon: '🌧️', label: 'Wet' }
            ].map(w => (
              <button
                key={w.value}
                onClick={() => handleWeatherChange(w.value)}
                className={`flex-1 py-2 rounded text-sm transition-colors ${
                  raceState?.weather === w.value
                    ? 'bg-f1-red text-white'
                    : 'bg-f1-black text-gray-400 hover:bg-gray-700'
                }`}
              >
                {w.icon}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
