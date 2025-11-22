import { getDb } from './db.js';

async function seed() {
    console.log('Insertando datos de F1 2024...');

    const db = await getDb();

    // Equipos F1 2024
    const teams = [
        { name: 'Red Bull', full_name: 'Oracle Red Bull Racing', color: '#3671C6', secondary_color: '#FFD700', country: 'Austria' },
        { name: 'Ferrari', full_name: 'Scuderia Ferrari', color: '#E8002D', secondary_color: '#FFEB00', country: 'Italy' },
        { name: 'Mercedes', full_name: 'Mercedes-AMG Petronas F1 Team', color: '#27F4D2', secondary_color: '#000000', country: 'Germany' },
        { name: 'McLaren', full_name: 'McLaren F1 Team', color: '#FF8000', secondary_color: '#47C7FC', country: 'United Kingdom' },
        { name: 'Aston Martin', full_name: 'Aston Martin Aramco F1 Team', color: '#229971', secondary_color: '#CEDC00', country: 'United Kingdom' },
        { name: 'Alpine', full_name: 'BWT Alpine F1 Team', color: '#FF87BC', secondary_color: '#0093CC', country: 'France' },
        { name: 'Williams', full_name: 'Williams Racing', color: '#64C4FF', secondary_color: '#041E42', country: 'United Kingdom' },
        { name: 'RB', full_name: 'Visa Cash App RB F1 Team', color: '#6692FF', secondary_color: '#FFFFFF', country: 'Italy' },
        { name: 'Kick Sauber', full_name: 'Stake F1 Team Kick Sauber', color: '#52E252', secondary_color: '#000000', country: 'Switzerland' },
        { name: 'Haas', full_name: 'MoneyGram Haas F1 Team', color: '#B6BABD', secondary_color: '#E10600', country: 'United States' }
    ];

    const insertTeam = db.prepare(`
        INSERT OR IGNORE INTO teams (name, full_name, color, secondary_color, country)
        VALUES (@name, @full_name, @color, @secondary_color, @country)
    `);

    for (const team of teams) {
        insertTeam.run(team);
    }
    console.log('Equipos insertados');

    // Pilotos F1 2024
    const drivers = [
        { name: 'Max Verstappen', abbreviation: 'VER', number: 1, team: 'Red Bull', country: 'Netherlands' },
        { name: 'Sergio Pérez', abbreviation: 'PER', number: 11, team: 'Red Bull', country: 'Mexico' },
        { name: 'Charles Leclerc', abbreviation: 'LEC', number: 16, team: 'Ferrari', country: 'Monaco' },
        { name: 'Carlos Sainz', abbreviation: 'SAI', number: 55, team: 'Ferrari', country: 'Spain' },
        { name: 'Lewis Hamilton', abbreviation: 'HAM', number: 44, team: 'Mercedes', country: 'United Kingdom' },
        { name: 'George Russell', abbreviation: 'RUS', number: 63, team: 'Mercedes', country: 'United Kingdom' },
        { name: 'Lando Norris', abbreviation: 'NOR', number: 4, team: 'McLaren', country: 'United Kingdom' },
        { name: 'Oscar Piastri', abbreviation: 'PIA', number: 81, team: 'McLaren', country: 'Australia' },
        { name: 'Fernando Alonso', abbreviation: 'ALO', number: 14, team: 'Aston Martin', country: 'Spain' },
        { name: 'Lance Stroll', abbreviation: 'STR', number: 18, team: 'Aston Martin', country: 'Canada' },
        { name: 'Pierre Gasly', abbreviation: 'GAS', number: 10, team: 'Alpine', country: 'France' },
        { name: 'Esteban Ocon', abbreviation: 'OCO', number: 31, team: 'Alpine', country: 'France' },
        { name: 'Alexander Albon', abbreviation: 'ALB', number: 23, team: 'Williams', country: 'Thailand' },
        { name: 'Logan Sargeant', abbreviation: 'SAR', number: 2, team: 'Williams', country: 'United States' },
        { name: 'Yuki Tsunoda', abbreviation: 'TSU', number: 22, team: 'RB', country: 'Japan' },
        { name: 'Daniel Ricciardo', abbreviation: 'RIC', number: 3, team: 'RB', country: 'Australia' },
        { name: 'Valtteri Bottas', abbreviation: 'BOT', number: 77, team: 'Kick Sauber', country: 'Finland' },
        { name: 'Zhou Guanyu', abbreviation: 'ZHO', number: 24, team: 'Kick Sauber', country: 'China' },
        { name: 'Kevin Magnussen', abbreviation: 'MAG', number: 20, team: 'Haas', country: 'Denmark' },
        { name: 'Nico Hülkenberg', abbreviation: 'HUL', number: 27, team: 'Haas', country: 'Germany' }
    ];

    const getTeamId = db.prepare('SELECT id FROM teams WHERE name = ?');
    const insertDriver = db.prepare(`
        INSERT OR IGNORE INTO drivers (name, abbreviation, number, team_id, country)
        VALUES (@name, @abbreviation, @number, @team_id, @country)
    `);

    for (const driver of drivers) {
        const team = getTeamId.get(driver.team);
        if (team) {
            insertDriver.run({
                name: driver.name,
                abbreviation: driver.abbreviation,
                number: driver.number,
                team_id: team.id,
                country: driver.country
            });
        }
    }
    console.log('Pilotos insertados');

    // Circuitos F1 2024
    const tracks = [
        { name: 'Bahrain International Circuit', country: 'Bahrain', city: 'Sakhir', length_km: 5.412, laps: 57, corners: 15, drs_zones: 3 },
        { name: 'Jeddah Corniche Circuit', country: 'Saudi Arabia', city: 'Jeddah', length_km: 6.174, laps: 50, corners: 27, drs_zones: 3 },
        { name: 'Albert Park Circuit', country: 'Australia', city: 'Melbourne', length_km: 5.278, laps: 58, corners: 14, drs_zones: 4 },
        { name: 'Suzuka International Racing Course', country: 'Japan', city: 'Suzuka', length_km: 5.807, laps: 53, corners: 18, drs_zones: 2 },
        { name: 'Shanghai International Circuit', country: 'China', city: 'Shanghai', length_km: 5.451, laps: 56, corners: 16, drs_zones: 2 },
        { name: 'Miami International Autodrome', country: 'United States', city: 'Miami', length_km: 5.412, laps: 57, corners: 19, drs_zones: 3 },
        { name: 'Autodromo Enzo e Dino Ferrari', country: 'Italy', city: 'Imola', length_km: 4.909, laps: 63, corners: 19, drs_zones: 2 },
        { name: 'Circuit de Monaco', country: 'Monaco', city: 'Monte Carlo', length_km: 3.337, laps: 78, corners: 19, drs_zones: 1 },
        { name: 'Circuit Gilles Villeneuve', country: 'Canada', city: 'Montreal', length_km: 4.361, laps: 70, corners: 14, drs_zones: 2 },
        { name: 'Circuit de Barcelona-Catalunya', country: 'Spain', city: 'Barcelona', length_km: 4.657, laps: 66, corners: 16, drs_zones: 2 },
        { name: 'Red Bull Ring', country: 'Austria', city: 'Spielberg', length_km: 4.318, laps: 71, corners: 10, drs_zones: 3 },
        { name: 'Silverstone Circuit', country: 'United Kingdom', city: 'Silverstone', length_km: 5.891, laps: 52, corners: 18, drs_zones: 2 },
        { name: 'Hungaroring', country: 'Hungary', city: 'Budapest', length_km: 4.381, laps: 70, corners: 14, drs_zones: 2 },
        { name: 'Circuit de Spa-Francorchamps', country: 'Belgium', city: 'Spa', length_km: 7.004, laps: 44, corners: 19, drs_zones: 2 },
        { name: 'Circuit Zandvoort', country: 'Netherlands', city: 'Zandvoort', length_km: 4.259, laps: 72, corners: 14, drs_zones: 2 },
        { name: 'Autodromo Nazionale Monza', country: 'Italy', city: 'Monza', length_km: 5.793, laps: 53, corners: 11, drs_zones: 2 },
        { name: 'Marina Bay Street Circuit', country: 'Singapore', city: 'Singapore', length_km: 4.940, laps: 62, corners: 19, drs_zones: 3 },
        { name: 'Circuit of the Americas', country: 'United States', city: 'Austin', length_km: 5.513, laps: 56, corners: 20, drs_zones: 2 },
        { name: 'Autódromo Hermanos Rodríguez', country: 'Mexico', city: 'Mexico City', length_km: 4.304, laps: 71, corners: 17, drs_zones: 3 },
        { name: 'Interlagos Circuit', country: 'Brazil', city: 'São Paulo', length_km: 4.309, laps: 71, corners: 15, drs_zones: 2 },
        { name: 'Las Vegas Street Circuit', country: 'United States', city: 'Las Vegas', length_km: 6.201, laps: 50, corners: 17, drs_zones: 2 },
        { name: 'Losail International Circuit', country: 'Qatar', city: 'Lusail', length_km: 5.419, laps: 57, corners: 16, drs_zones: 2 },
        { name: 'Yas Marina Circuit', country: 'United Arab Emirates', city: 'Abu Dhabi', length_km: 5.281, laps: 58, corners: 16, drs_zones: 2 }
    ];

    const insertTrack = db.prepare(`
        INSERT OR IGNORE INTO tracks (name, country, city, length_km, laps, corners, drs_zones)
        VALUES (@name, @country, @city, @length_km, @laps, @corners, @drs_zones)
    `);

    for (const track of tracks) {
        insertTrack.run(track);
    }
    console.log('Circuitos insertados');

    console.log('Seed completado exitosamente');
    db.close();
}

seed().catch(console.error);
