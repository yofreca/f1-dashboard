import { useEffect, useState, useCallback } from 'react'
import { io } from 'socket.io-client'

const SOCKET_URL = import.meta.env.VITE_SOCKET_URL || 'http://localhost:4000'

export function useSocket() {
  const [socket, setSocket] = useState(null)
  const [connected, setConnected] = useState(false)
  const [raceState, setRaceState] = useState(null)

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
    })

    newSocket.on('race:finished', (data) => {
      console.log('Race finished:', data)
    })

    setSocket(newSocket)

    return () => {
      newSocket.close()
    }
  }, [])

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
