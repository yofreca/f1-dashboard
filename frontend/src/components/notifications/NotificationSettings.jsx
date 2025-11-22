import { useState } from 'react'
import { useNotifications } from '../../context/NotificationContext'

export default function NotificationSettings() {
  const { settings, updateSettings, clearAll } = useNotifications()
  const [isOpen, setIsOpen] = useState(false)

  const toggleSetting = (key) => {
    updateSettings({ [key]: !settings[key] })
  }

  return (
    <div className="relative">
      {/* Toggle Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className={`p-2 rounded-lg transition-colors ${
          settings.enabled
            ? 'bg-f1-red text-white'
            : 'bg-gray-700 text-gray-400'
        }`}
        title="Configuración de notificaciones"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          className="h-5 w-5"
          viewBox="0 0 20 20"
          fill="currentColor"
        >
          <path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z" />
        </svg>
      </button>

      {/* Settings Panel */}
      {isOpen && (
        <div className="absolute right-0 top-12 w-72 bg-f1-gray rounded-lg shadow-xl border border-gray-700 z-50">
          <div className="p-4">
            <div className="flex justify-between items-center mb-4">
              <h3 className="font-semibold text-white">Notificaciones</h3>
              <button
                onClick={() => setIsOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                ✕
              </button>
            </div>

            {/* Master Toggle */}
            <div className="flex items-center justify-between py-2 border-b border-gray-700">
              <span className="text-sm">Activar notificaciones</span>
              <button
                onClick={() => toggleSetting('enabled')}
                className={`w-12 h-6 rounded-full transition-colors ${
                  settings.enabled ? 'bg-f1-red' : 'bg-gray-600'
                }`}
              >
                <div
                  className={`w-5 h-5 rounded-full bg-white shadow transform transition-transform ${
                    settings.enabled ? 'translate-x-6' : 'translate-x-0.5'
                  }`}
                />
              </button>
            </div>

            {/* Individual Settings */}
            <div className="space-y-3 mt-4">
              <SettingToggle
                label="🏎️ Adelantamientos"
                enabled={settings.showOvertakes}
                onToggle={() => toggleSetting('showOvertakes')}
                disabled={!settings.enabled}
              />
              <SettingToggle
                label="🔧 Pit Stops"
                enabled={settings.showPitStops}
                onToggle={() => toggleSetting('showPitStops')}
                disabled={!settings.enabled}
              />
              <SettingToggle
                label="⚡ Vuelta Rápida"
                enabled={settings.showFastestLap}
                onToggle={() => toggleSetting('showFastestLap')}
                disabled={!settings.enabled}
              />
              <SettingToggle
                label="🌤️ Cambio de Clima"
                enabled={settings.showWeather}
                onToggle={() => toggleSetting('showWeather')}
                disabled={!settings.enabled}
              />
              <SettingToggle
                label="🔄 Vueltas Completadas"
                enabled={settings.showLapCompleted}
                onToggle={() => toggleSetting('showLapCompleted')}
                disabled={!settings.enabled}
              />
            </div>

            {/* Clear Button */}
            <button
              onClick={clearAll}
              className="w-full mt-4 py-2 text-sm bg-gray-700 hover:bg-gray-600 rounded text-gray-300 transition-colors"
            >
              Limpiar todas
            </button>
          </div>
        </div>
      )}
    </div>
  )
}

function SettingToggle({ label, enabled, onToggle, disabled }) {
  return (
    <div className={`flex items-center justify-between ${disabled ? 'opacity-50' : ''}`}>
      <span className="text-sm text-gray-300">{label}</span>
      <button
        onClick={onToggle}
        disabled={disabled}
        className={`w-10 h-5 rounded-full transition-colors ${
          enabled ? 'bg-green-600' : 'bg-gray-600'
        }`}
      >
        <div
          className={`w-4 h-4 rounded-full bg-white shadow transform transition-transform ${
            enabled ? 'translate-x-5' : 'translate-x-0.5'
          }`}
        />
      </button>
    </div>
  )
}
