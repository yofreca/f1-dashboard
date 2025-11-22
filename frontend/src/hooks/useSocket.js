import { useEffect, useState, useCallback, useRef } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'

export function useSocket(onNotification) {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [raceState, setRaceState] = useState(null)
  const fastestLapRef = useRef(null)

  useEffect(() => {
    const newSocket = io(SOCKET_URL, {
      transports: ['websocket', 'polling'],
      reconnection: true,
      reconnectionAttempts: 5,
      reconnectionDelay: 1000
    })

    newSocket.on('connect', () => {
      console.log('Connected to server')
      setConnected(true)
    })

    newSocket.on('disconnect', () => {
      console.log('Disconnected from server')
      setConnected(false)
    })

    newSocket.on('race:state', (state) => {
      setRaceState(state)
    })

    newSocket.on('race:update', (state) => {
      setRaceState(state)
    })

    newSocket.on('race:started', (state) => {
      setRaceState(state)
      // Notificar inicio de carrera
      onNotification?.('race_start', {
        trackName: state.track?.name,
        totalLaps: state.totalLaps
      })
      // Reset fastest lap tracker
      fastestLapRef.current = null
    })

    newSocket.on('race:paused', (state) => {
      setRaceState(state)
    })

    newSocket.on('race:resumed', (state) => {
      setRaceState(state)
    })

    newSocket.on('race:stopped', (state) => {
      setRaceState(state)
    })

    newSocket.on('race:reset', (state) => {
      setRaceState(state)
      fastestLapRef.current = null
    })

    newSocket.on('race:finished', (data) => {
      console.log('Race finished:', data)
      const winner = data.results?.[0]
      onNotification?.('race_finished', {
        winner: winner?.driverName || 'Unknown'
      })
    })

    // Eventos específicos para notificaciones
    newSocket.on('race:overtake', (data) => {
      onNotification?.('overtake', data)
    })

    newSocket.on('race:pit_stop', (data) => {
      onNotification?.('pit_stop', data)
    })

    newSocket.on('race:lap_completed', (data) => {
      // Verificar si es nueva vuelta más rápida (con mejora significativa > 0.5s)
      const lapTime = parseFloat(data.lapTime)
      if (!fastestLapRef.current || lapTime < fastestLapRef.current - 0.5) {
        fastestLapRef.current = lapTime
        onNotification?.('fastest_lap', {
          driverName: data.driverName,
          teamColor: data.teamColor,
          lapTime: formatLapTime(lapTime),
          lap: data.lap
        })
      } else if (lapTime < fastestLapRef.current) {
        // Actualizar referencia sin notificar si la mejora es pequeña
        fastestLapRef.current = lapTime
      }
      // Notificación de vuelta completada desactivada por defecto
    })

    newSocket.on('race:weather_changed', (data) => {
      onNotification?.('weather_change', data)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [onNotification])

  // Formatear tiempo de vuelta
  function formatLapTime(seconds) {
    if (!seconds) return '-'
    const mins = Math.floor(seconds / 60)
    const secs = (seconds % 60).toFixed(3)
    return `${mins}:${secs.padStart(6, '0')}`
  }

  const startRace = useCallback((trackId) => {
    if (socket) {
      socket.emit('race:start', { trackId })
    }
  }, [socket])

  const pauseRace = useCallback(() => {
    if (socket) {
      socket.emit('race:pause')
    }
  }, [socket])

  const resumeRace = useCallback(() => {
    if (socket) {
      socket.emit('race:resume')
    }
  }, [socket])

  const stopRace = useCallback(() => {
    if (socket) {
      socket.emit('race:stop')
    }
  }, [socket])

  const resetRace = useCallback(() => {
    if (socket) {
      socket.emit('race:reset')
    }
  }, [socket])

  const setSpeed = useCallback((speed) => {
    if (socket) {
      socket.emit('race:speed', speed)
    }
  }, [socket])

  const setWeather = useCallback((weather) => {
    if (socket) {
      socket.emit('race:weather', weather)
    }
  }, [socket])

  return {
    socket,
    connected,
    raceState,
    startRace,
    pauseRace,
    resumeRace,
    stopRace,
    resetRace,
    setSpeed,
    setWeather
  }
}
