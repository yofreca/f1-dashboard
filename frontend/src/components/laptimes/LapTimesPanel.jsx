import { useState, useMemo } from 'react'
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  ReferenceLine
} from 'recharts'

// Colores para compuestos de neumáticos
const tireColors = {
  soft: '#FF3333',
  medium: '#FFD700',
  hard: '#FFFFFF',
  intermediate: '#43B02A',
  wet: '#00BFFF'
}

export default function LapTimesPanel({ raceState, selectedDriver, onDriverSelect }) {
  const [viewMode, setViewMode] = useState('chart') // 'chart' | 'table'
  const [compareDrivers, setCompareDrivers] = useState([])

  const drivers = raceState?.drivers || []

  // Calcular datos para el gráfico
  const chartData = useMemo(() => {
    if (!drivers.length) return []

    // Encontrar el máximo de vueltas
    const maxLaps = Math.max(...drivers.map(d => d.lapTimes?.length || 0))
    if (maxLaps === 0) return []

    // Crear datos por vuelta
    const data = []
    for (let lap = 1; lap <= maxLaps; lap++) {
      const lapData = { lap }

      // Agregar tiempo de cada piloto seleccionado
      const driversToShow = compareDrivers.length > 0
        ? drivers.filter(d => compareDrivers.includes(d.id))
        : selectedDriver
          ? [selectedDriver]
          : drivers.slice(0, 5) // Top 5 por defecto

      driversToShow.forEach(driver => {
        const lapTime = driver.lapTimes?.find(lt => lt.lap === lap)
        if (lapTime) {
          lapData[driver.abbreviation] = parseFloat(lapTime.time.toFixed(3))
          lapData[`${driver.abbreviation}_compound`] = lapTime.compound
        }
      })

      data.push(lapData)
    }

    return data
  }, [drivers, selectedDriver, compareDrivers])

  // Obtener la vuelta más rápida de toda la carrera
  const fastestLap = useMemo(() => {
    let fastest = null
    drivers.forEach(driver => {
      driver.lapTimes?.forEach(lt => {
        if (!fastest || lt.time < fastest.time) {
          fastest = { ...lt, driver: driver.abbreviation, teamColor: driver.teamColor }
        }
      })
    })
    return fastest
  }, [drivers])

  // Drivers para mostrar en el gráfico
  const driversToShow = useMemo(() => {
    if (compareDrivers.length > 0) {
      return drivers.filter(d => compareDrivers.includes(d.id))
    }
    if (selectedDriver) {
      return [drivers.find(d => d.id === selectedDriver.id)].filter(Boolean)
    }
    return drivers.slice(0, 5)
  }, [drivers, selectedDriver, compareDrivers])

  // Toggle driver para comparación
  const toggleCompareDriver = (driverId) => {
    setCompareDrivers(prev =>
      prev.includes(driverId)
        ? prev.filter(id => id !== driverId)
        : prev.length < 5
          ? [...prev, driverId]
          : prev
    )
  }

  // Formatear tiempo (segundos a mm:ss.sss)
  const formatTime = (seconds) => {
    if (!seconds) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = (seconds % 60).toFixed(3)
    return `${mins}:${secs.padStart(6, '0')}`
  }

  // Custom tooltip para el gráfico
  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="bg-f1-gray p-3 rounded border border-gray-700">
          <p className="text-sm font-semibold mb-2">Vuelta {label}</p>
          {payload.map((entry, index) => (
            <div key={index} className="flex items-center gap-2 text-sm">
              <div
                className="w-3 h-3 rounded-full"
                style={{ backgroundColor: entry.color }}
              />
              <span>{entry.name}:</span>
              <span className="font-mono">{formatTime(entry.value)}</span>
            </div>
          ))}
        </div>
      )
    }
    return null
  }

  if (raceState?.status === 'idle') {
    return (
      <div className="bg-f1-gray rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-400 mb-3">LAP TIMES</h3>
        <div className="text-center text-gray-500 py-8">
          Inicia una carrera para ver los tiempos por vuelta
        </div>
      </div>
    )
  }

  return (
    <div className="bg-f1-gray rounded-lg p-4">
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-sm font-semibold text-gray-400">LAP TIMES</h3>
        <div className="flex gap-2">
          <button
            onClick={() => setViewMode('chart')}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === 'chart' ? 'bg-f1-red text-white' : 'bg-f1-black text-gray-400'
            }`}
          >
            Gráfico
          </button>
          <button
            onClick={() => setViewMode('table')}
            className={`px-3 py-1 text-xs rounded ${
              viewMode === 'table' ? 'bg-f1-red text-white' : 'bg-f1-black text-gray-400'
            }`}
          >
            Tabla
          </button>
        </div>
      </div>

      {/* Fastest Lap Banner */}
      {fastestLap && (
        <div className="bg-purple-900/30 border border-purple-500 rounded p-2 mb-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <span className="text-purple-400 text-xs">FASTEST LAP</span>
            <span className="font-bold" style={{ color: fastestLap.teamColor }}>
              {fastestLap.driver}
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-400">Lap {fastestLap.lap}</span>
            <span className="font-mono text-purple-400">{formatTime(fastestLap.time)}</span>
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: tireColors[fastestLap.compound] }}
              title={fastestLap.compound}
            />
          </div>
        </div>
      )}

      {/* Driver Selection */}
      <div className="mb-4">
        <div className="text-xs text-gray-500 mb-2">
          Selecciona hasta 5 pilotos para comparar:
        </div>
        <div className="flex flex-wrap gap-1">
          {drivers.slice(0, 10).map(driver => (
            <button
              key={driver.id}
              onClick={() => toggleCompareDriver(driver.id)}
              className={`px-2 py-1 text-xs rounded transition-colors ${
                compareDrivers.includes(driver.id)
                  ? 'ring-2 ring-white'
                  : 'opacity-70 hover:opacity-100'
              }`}
              style={{
                backgroundColor: driver.teamColor,
                color: '#fff'
              }}
            >
              {driver.abbreviation}
            </button>
          ))}
          {compareDrivers.length > 0 && (
            <button
              onClick={() => setCompareDrivers([])}
              className="px-2 py-1 text-xs rounded bg-gray-700 text-gray-300 hover:bg-gray-600"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Chart View */}
      {viewMode === 'chart' && chartData.length > 0 && (
        <div className="bg-f1-black rounded-lg p-2" style={{ height: 250 }}>
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#333" />
              <XAxis
                dataKey="lap"
                stroke="#666"
                tick={{ fill: '#999', fontSize: 10 }}
                label={{ value: 'Vuelta', position: 'bottom', fill: '#666', fontSize: 10 }}
              />
              <YAxis
                stroke="#666"
                tick={{ fill: '#999', fontSize: 10 }}
                tickFormatter={(value) => `${Math.floor(value / 60)}:${(value % 60).toFixed(0).padStart(2, '0')}`}
                domain={['auto', 'auto']}
              />
              <Tooltip content={<CustomTooltip />} />
              <Legend
                wrapperStyle={{ fontSize: '10px' }}
                formatter={(value) => <span style={{ color: '#fff' }}>{value}</span>}
              />
              {fastestLap && (
                <ReferenceLine
                  y={fastestLap.time}
                  stroke="#9333ea"
                  strokeDasharray="5 5"
                  label={{ value: 'FL', fill: '#9333ea', fontSize: 10 }}
                />
              )}
              {driversToShow.map(driver => (
                <Line
                  key={driver.id}
                  type="monotone"
                  dataKey={driver.abbreviation}
                  stroke={driver.teamColor}
                  strokeWidth={2}
                  dot={{ fill: driver.teamColor, strokeWidth: 0, r: 3 }}
                  activeDot={{ r: 5, strokeWidth: 2, stroke: '#fff' }}
                  connectNulls
                />
              ))}
            </LineChart>
          </ResponsiveContainer>
        </div>
      )}

      {/* Table View */}
      {viewMode === 'table' && (
        <div className="bg-f1-black rounded-lg overflow-hidden max-h-64 overflow-y-auto">
          <table className="w-full text-xs">
            <thead className="bg-f1-gray sticky top-0">
              <tr>
                <th className="px-2 py-2 text-left text-gray-400">Piloto</th>
                <th className="px-2 py-2 text-center text-gray-400">Vuelta</th>
                <th className="px-2 py-2 text-right text-gray-400">Tiempo</th>
                <th className="px-2 py-2 text-center text-gray-400">Neumático</th>
                <th className="px-2 py-2 text-right text-gray-400">vs Mejor</th>
              </tr>
            </thead>
            <tbody>
              {drivers
                .filter(d => d.lapTimes?.length > 0)
                .flatMap(driver =>
                  driver.lapTimes.map((lt, idx) => ({
                    ...lt,
                    driver,
                    isBest: lt.time === driver.bestLapTime,
                    isFastest: fastestLap && lt.time === fastestLap.time
                  }))
                )
                .sort((a, b) => b.lap - a.lap || a.time - b.time)
                .slice(0, 50)
                .map((lt, idx) => (
                  <tr
                    key={`${lt.driver.id}-${lt.lap}`}
                    className={`border-t border-gray-800 ${
                      lt.isFastest ? 'bg-purple-900/30' : ''
                    } hover:bg-gray-800 cursor-pointer`}
                    onClick={() => onDriverSelect(lt.driver)}
                  >
                    <td className="px-2 py-1">
                      <span
                        className="font-semibold"
                        style={{ color: lt.driver.teamColor }}
                      >
                        {lt.driver.abbreviation}
                      </span>
                    </td>
                    <td className="px-2 py-1 text-center text-gray-400">
                      {lt.lap}
                    </td>
                    <td className={`px-2 py-1 text-right font-mono ${
                      lt.isFastest ? 'text-purple-400' : lt.isBest ? 'text-green-400' : ''
                    }`}>
                      {formatTime(lt.time)}
                    </td>
                    <td className="px-2 py-1 text-center">
                      <div
                        className="w-4 h-4 rounded-full mx-auto"
                        style={{ backgroundColor: tireColors[lt.compound] }}
                        title={lt.compound}
                      />
                    </td>
                    <td className={`px-2 py-1 text-right font-mono ${
                      lt.isFastest ? 'text-purple-400' : 'text-red-400'
                    }`}>
                      {lt.isFastest ? '-' : `+${(lt.time - fastestLap?.time || 0).toFixed(3)}`}
                    </td>
                  </tr>
                ))}
            </tbody>
          </table>
        </div>
      )}

      {/* No data message */}
      {chartData.length === 0 && (
        <div className="text-center text-gray-500 py-8">
          Esperando tiempos por vuelta...
        </div>
      )}

      {/* Legend for tire compounds */}
      <div className="mt-3 flex items-center justify-center gap-4 text-xs text-gray-500">
        {Object.entries(tireColors).slice(0, 3).map(([compound, color]) => (
          <div key={compound} className="flex items-center gap-1">
            <div
              className="w-3 h-3 rounded-full"
              style={{ backgroundColor: color }}
            />
            <span className="capitalize">{compound}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
