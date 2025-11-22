import { useState, useEffect } from 'react'
import TrackView from '../components/track/TrackView'
import DriversPanel from '../components/drivers/DriversPanel'
import StatsPanel from '../components/stats/StatsPanel'
import RaceControls from '../components/controls/RaceControls'
import TelemetryHUD from '../components/telemetry/TelemetryHUD'
import { api } from '../services/api'

export default function Dashboard({ socket, raceState, connected }) {
  const [tracks, setTracks] = useState([])
  const [selectedDriver, setSelectedDriver] = useState(null)
  const [selectedTrack, setSelectedTrack] = useState(null)

  useEffect(() => {
    api.getTracks().then(setTracks).catch(console.error)
  }, [])

  const handleDriverSelect = (driver) => {
    setSelectedDriver(driver)
    if (socket && driver) {
      socket.emit('telemetry:select', driver.id)
    }
  }

  return (
    <div className="p-4 grid grid-cols-12 gap-4 min-h-[calc(100vh-80px)]">
      {/* Left Panel - Race Controls & Track */}
      <div className="col-span-12 lg:col-span-3 space-y-4">
        <RaceControls
          socket={socket}
          raceState={raceState}
          tracks={tracks}
          selectedTrack={selectedTrack}
          setSelectedTrack={setSelectedTrack}
        />

        {/* Race Info */}
        {raceState?.status !== 'idle' && (
          <div className="bg-f1-gray rounded-lg p-4">
            <h3 className="text-sm font-semibold text-gray-400 mb-3">RACE INFO</h3>
            <div className="grid grid-cols-2 gap-3">
              <div className="bg-f1-black rounded p-3">
                <div className="text-xs text-gray-500">LAP</div>
                <div className="text-2xl font-bold">
                  {raceState?.currentLap || 0}/{raceState?.totalLaps || 0}
                </div>
              </div>
              <div className="bg-f1-black rounded p-3">
                <div className="text-xs text-gray-500">WEATHER</div>
                <div className="text-lg font-semibold capitalize flex items-center gap-2">
                  {raceState?.weather === 'dry' && '☀️'}
                  {raceState?.weather === 'wet' && '🌧️'}
                  {raceState?.weather === 'mixed' && '⛅'}
                  {raceState?.weather || 'dry'}
                </div>
              </div>
              <div className="bg-f1-black rounded p-3">
                <div className="text-xs text-gray-500">SPEED</div>
                <div className="text-lg font-semibold">{raceState?.speed || 1}x</div>
              </div>
              <div className="bg-f1-black rounded p-3">
                <div className="text-xs text-gray-500">DRIVERS</div>
                <div className="text-lg font-semibold">{raceState?.drivers?.length || 0}</div>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* Center Panel - Track Visualization */}
      <div className="col-span-12 lg:col-span-6 space-y-4">
        <TrackView
          raceState={raceState}
          selectedDriver={selectedDriver}
          onDriverSelect={handleDriverSelect}
        />

        {selectedDriver && (
          <TelemetryHUD
            socket={socket}
            driver={selectedDriver}
            raceState={raceState}
          />
        )}
      </div>

      {/* Right Panel - Drivers & Stats */}
      <div className="col-span-12 lg:col-span-3 space-y-4">
        <DriversPanel
          drivers={raceState?.drivers || []}
          selectedDriver={selectedDriver}
          onDriverSelect={handleDriverSelect}
        />

        {raceState?.drivers?.length > 0 && (
          <StatsPanel raceState={raceState} />
        )}
      </div>
    </div>
  )
}
