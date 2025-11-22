import { createContext, useContext, useState, useCallback } from 'react'

const NotificationContext = createContext(null)

// Tipos de notificación y sus estilos
const notificationTypes = {
  overtake: {
    icon: '🏎️',
    color: 'bg-blue-600',
    borderColor: 'border-blue-400',
    title: 'ADELANTAMIENTO'
  },
  pit_stop: {
    icon: '🔧',
    color: 'bg-orange-600',
    borderColor: 'border-orange-400',
    title: 'PIT STOP'
  },
  fastest_lap: {
    icon: '⚡',
    color: 'bg-purple-600',
    borderColor: 'border-purple-400',
    title: 'VUELTA RÁPIDA'
  },
  race_start: {
    icon: '🏁',
    color: 'bg-green-600',
    borderColor: 'border-green-400',
    title: 'CARRERA INICIADA'
  },
  race_finished: {
    icon: '🏆',
    color: 'bg-yellow-600',
    borderColor: 'border-yellow-400',
    title: 'CARRERA FINALIZADA'
  },
  weather_change: {
    icon: '🌤️',
    color: 'bg-cyan-600',
    borderColor: 'border-cyan-400',
    title: 'CAMBIO DE CLIMA'
  },
  lap_completed: {
    icon: '🔄',
    color: 'bg-gray-600',
    borderColor: 'border-gray-400',
    title: 'VUELTA COMPLETADA'
  },
  incident: {
    icon: '⚠️',
    color: 'bg-red-600',
    borderColor: 'border-red-400',
    title: 'INCIDENTE'
  }
}

export function NotificationProvider({ children }) {
  const [notifications, setNotifications] = useState([])
  const [settings, setSettings] = useState({
    enabled: true,
    showOvertakes: true,
    showPitStops: true,
    showFastestLap: true,
    showWeather: true,
    showLapCompleted: false, // Por defecto desactivado (muy frecuente)
    maxNotifications: 5,
    duration: 4000 // ms
  })

  const addNotification = useCallback((type, data) => {
    if (!settings.enabled) return

    // Filtrar según configuración
    if (type === 'overtake' && !settings.showOvertakes) return
    if (type === 'pit_stop' && !settings.showPitStops) return
    if (type === 'fastest_lap' && !settings.showFastestLap) return
    if (type === 'weather_change' && !settings.showWeather) return
    if (type === 'lap_completed' && !settings.showLapCompleted) return

    const notification = {
      id: Date.now() + Math.random(),
      type,
      data,
      config: notificationTypes[type] || notificationTypes.incident,
      timestamp: new Date()
    }

    setNotifications(prev => {
      const updated = [notification, ...prev]
      // Limitar número de notificaciones
      return updated.slice(0, settings.maxNotifications)
    })

    // Auto-remove después de duration
    setTimeout(() => {
      removeNotification(notification.id)
    }, settings.duration)
  }, [settings])

  const removeNotification = useCallback((id) => {
    setNotifications(prev => prev.filter(n => n.id !== id))
  }, [])

  const clearAll = useCallback(() => {
    setNotifications([])
  }, [])

  const updateSettings = useCallback((newSettings) => {
    setSettings(prev => ({ ...prev, ...newSettings }))
  }, [])

  return (
    <NotificationContext.Provider value={{
      notifications,
      settings,
      addNotification,
      removeNotification,
      clearAll,
      updateSettings
    }}>
      {children}
    </NotificationContext.Provider>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (!context) {
    throw new Error('useNotifications must be used within NotificationProvider')
  }
  return context
}

export { notificationTypes }
