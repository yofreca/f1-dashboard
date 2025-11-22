import { useNotifications } from '../../context/NotificationContext'

// Formatear mensaje según tipo de notificación
function formatMessage(type, data) {
  switch (type) {
    case 'overtake':
      return (
        <div>
          <span className="font-bold" style={{ color: data.teamColor }}>
            {data.driverName}
          </span>
          <span className="text-gray-300"> sube a </span>
          <span className="text-white font-bold">P{data.newPosition}</span>
        </div>
      )

    case 'pit_stop':
      return (
        <div>
          <span className="font-bold" style={{ color: data.teamColor }}>
            {data.driverName}
          </span>
          <span className="text-gray-300"> entra a boxes</span>
          <span className="text-xs text-gray-400 ml-2">
            (Parada #{data.pitStops})
          </span>
        </div>
      )

    case 'fastest_lap':
      return (
        <div>
          <span className="font-bold" style={{ color: data.teamColor }}>
            {data.driverName}
          </span>
          <span className="text-gray-300"> marca </span>
          <span className="text-purple-400 font-mono font-bold">
            {data.lapTime}
          </span>
        </div>
      )

    case 'race_start':
      return (
        <div>
          <span className="text-gray-300">Carrera en </span>
          <span className="text-white font-bold">{data.trackName}</span>
          <span className="text-gray-400 text-xs ml-2">
            {data.totalLaps} vueltas
          </span>
        </div>
      )

    case 'race_finished':
      return (
        <div>
          <span className="text-yellow-400 font-bold">{data.winner}</span>
          <span className="text-gray-300"> gana la carrera!</span>
        </div>
      )

    case 'weather_change':
      return (
        <div className="flex items-center gap-2">
          <span className="text-gray-300">Clima cambia a </span>
          <span className="text-white font-bold capitalize">
            {data.weather === 'dry' && '☀️ Seco'}
            {data.weather === 'wet' && '🌧️ Lluvia'}
            {data.weather === 'mixed' && '⛅ Mixto'}
          </span>
        </div>
      )

    case 'lap_completed':
      return (
        <div>
          <span className="font-bold" style={{ color: data.teamColor }}>
            {data.driverName}
          </span>
          <span className="text-gray-300"> completa vuelta </span>
          <span className="text-white">{data.lap}</span>
          <span className="text-gray-400 font-mono text-xs ml-2">
            {data.lapTime}
          </span>
        </div>
      )

    default:
      return <span>{JSON.stringify(data)}</span>
  }
}

export default function NotificationToast() {
  const { notifications, removeNotification, settings } = useNotifications()

  if (!settings.enabled || notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-20 right-4 z-50 flex flex-col gap-2 max-w-sm">
      {notifications.map((notification, index) => (
        <div
          key={notification.id}
          className={`
            ${notification.config.color}
            ${notification.config.borderColor}
            border-l-4 rounded-r-lg shadow-lg
            transform transition-all duration-300 ease-out
            animate-slide-in
          `}
          style={{
            animationDelay: `${index * 50}ms`,
            opacity: 1 - (index * 0.15)
          }}
        >
          <div className="px-4 py-3">
            {/* Header */}
            <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                <span className="text-lg">{notification.config.icon}</span>
                <span className="text-xs font-bold text-white/80 tracking-wider">
                  {notification.config.title}
                </span>
              </div>
              <button
                onClick={() => removeNotification(notification.id)}
                className="text-white/50 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            {/* Message */}
            <div className="text-sm">
              {formatMessage(notification.type, notification.data)}
            </div>

            {/* Timestamp */}
            <div className="text-xs text-white/40 mt-1">
              {notification.timestamp.toLocaleTimeString()}
            </div>
          </div>

          {/* Progress bar */}
          <div className="h-1 bg-black/20">
            <div
              className="h-full bg-white/30 animate-shrink"
              style={{ animationDuration: `${settings.duration}ms` }}
            />
          </div>
        </div>
      ))}
    </div>
  )
}
