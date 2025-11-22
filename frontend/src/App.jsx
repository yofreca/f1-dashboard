import { useState, useEffect } from 'react'
import { useSocket } from './hooks/useSocket'
import Dashboard from './pages/Dashboard'

function App() {
  const { socket, connected, raceState } = useSocket()
  const [error, setError] = useState(null)

  if (error) {
    return (
      <div className="min-h-screen bg-f1-black flex items-center justify-center">
        <div className="text-red-500 text-xl">{error}</div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-f1-black text-white">
      {/* Header */}
      <header className="bg-f1-gray border-b border-f1-red/30 px-6 py-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <h1 className="text-2xl font-bold text-white">
              <span className="text-f1-red">F1</span> Dashboard
            </h1>
            {raceState?.track && (
              <span className="text-gray-400 text-sm">
                {raceState.track.name} - {raceState.track.country}
              </span>
            )}
          </div>
          <div className="flex items-center gap-4">
            <div className={`flex items-center gap-2 ${connected ? 'text-green-500' : 'text-red-500'}`}>
              <div className={`w-2 h-2 rounded-full ${connected ? 'bg-green-500 pulse-red' : 'bg-red-500'}`}></div>
              <span className="text-sm">{connected ? 'Live' : 'Disconnected'}</span>
            </div>
            {raceState?.status && (
              <span className={`px-3 py-1 rounded text-sm font-semibold uppercase ${
                raceState.status === 'running' ? 'bg-green-600' :
                raceState.status === 'paused' ? 'bg-yellow-600' :
                raceState.status === 'finished' ? 'bg-blue-600' :
                'bg-gray-600'
              }`}>
                {raceState.status}
              </span>
            )}
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main>
        <Dashboard socket={socket} raceState={raceState} connected={connected} />
      </main>
    </div>
  )
}

export default App
