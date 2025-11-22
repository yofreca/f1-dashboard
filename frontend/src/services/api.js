const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:4000/api'

async function fetchAPI(endpoint) {
  const response = await fetch(`${API_URL}${endpoint}`)
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  return response.json()
}

async function postAPI(endpoint, data = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(data)
  })
  if (!response.ok) {
    throw new Error(`API Error: ${response.status}`)
  }
  return response.json()
}

export const api = {
  // Drivers
  getDrivers: () => fetchAPI('/drivers'),
  getDriver: (id) => fetchAPI(`/drivers/${id}`),

  // Teams
  getTeams: () => fetchAPI('/teams'),
  getTeam: (id) => fetchAPI(`/teams/${id}`),

  // Tracks
  getTracks: () => fetchAPI('/tracks'),
  getTrack: (id) => fetchAPI(`/tracks/${id}`),
  getRandomTrack: () => fetchAPI('/tracks/random'),

  // Race
  getRaceState: () => fetchAPI('/race/state'),
  startRace: (trackId) => postAPI('/race/start', { trackId }),
  pauseRace: () => postAPI('/race/pause'),
  resumeRace: () => postAPI('/race/resume'),
  stopRace: () => postAPI('/race/stop'),
  resetRace: () => postAPI('/race/reset'),
  setWeather: (weather) => postAPI('/race/weather', { weather }),
  setSpeed: (speed) => postAPI('/race/speed', { speed })
}
