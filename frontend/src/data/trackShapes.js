// Definiciones SVG de circuitos F1
// Cada circuito tiene un path y puntos para posicionar los autos

export const trackShapes = {
    // Monza - Óvalo con chicanes
    1: {
        name: 'Oval Circuit',
        viewBox: '0 0 500 400',
        path: 'M 250 50 L 400 50 Q 450 50 450 100 L 450 300 Q 450 350 400 350 L 100 350 Q 50 350 50 300 L 50 100 Q 50 50 100 50 Z',
        getPosition: (progress) => {
            const p = progress / 100;
            const perimeter = 1200;
            const dist = p * perimeter;

            if (dist < 300) { // Top
                return { x: 100 + dist, y: 50 };
            } else if (dist < 550) { // Right curve + right side
                const d = dist - 300;
                if (d < 50) {
                    const angle = (d / 50) * Math.PI / 2;
                    return { x: 400 + 50 * Math.sin(angle), y: 50 + 50 * (1 - Math.cos(angle)) };
                }
                return { x: 450, y: 100 + (d - 50) };
            } else if (dist < 600) { // Bottom right curve
                const d = dist - 550;
                const angle = (d / 50) * Math.PI / 2;
                return { x: 450 - 50 * (1 - Math.cos(angle)), y: 300 + 50 * Math.sin(angle) };
            } else if (dist < 900) { // Bottom
                return { x: 400 - (dist - 600), y: 350 };
            } else if (dist < 950) { // Bottom left curve
                const d = dist - 900;
                const angle = (d / 50) * Math.PI / 2;
                return { x: 100 - 50 * Math.sin(angle), y: 350 - 50 * (1 - Math.cos(angle)) };
            } else if (dist < 1150) { // Left side
                return { x: 50, y: 300 - (dist - 950) };
            } else { // Top left curve
                const d = dist - 1150;
                const angle = (d / 50) * Math.PI / 2;
                return { x: 50 + 50 * (1 - Math.cos(angle)), y: 100 - 50 * Math.sin(angle) };
            }
        }
    },

    // Monaco - Circuito técnico con muchas curvas
    2: {
        name: 'Monaco Style',
        viewBox: '0 0 500 400',
        path: 'M 50 200 L 50 100 Q 50 50 100 50 L 200 50 L 250 100 L 350 100 Q 400 100 400 150 L 400 200 L 450 200 L 450 300 Q 450 350 400 350 L 200 350 Q 150 350 150 300 L 150 250 L 100 250 L 100 200 Z',
        getPosition: (progress) => {
            const p = (progress % 100) / 100;
            const points = [
                { x: 50, y: 200 }, { x: 50, y: 100 }, { x: 100, y: 50 },
                { x: 200, y: 50 }, { x: 250, y: 100 }, { x: 350, y: 100 },
                { x: 400, y: 150 }, { x: 400, y: 200 }, { x: 450, y: 200 },
                { x: 450, y: 300 }, { x: 400, y: 350 }, { x: 200, y: 350 },
                { x: 150, y: 300 }, { x: 150, y: 250 }, { x: 100, y: 250 },
                { x: 100, y: 200 }, { x: 50, y: 200 }
            ];
            const idx = Math.floor(p * (points.length - 1));
            const t = (p * (points.length - 1)) - idx;
            const p1 = points[idx];
            const p2 = points[Math.min(idx + 1, points.length - 1)];
            return {
                x: p1.x + (p2.x - p1.x) * t,
                y: p1.y + (p2.y - p1.y) * t
            };
        }
    },

    // Spa style - Circuito largo con Eau Rouge
    3: {
        name: 'Spa Style',
        viewBox: '0 0 500 400',
        path: 'M 50 350 L 50 250 L 100 200 L 100 100 Q 100 50 150 50 L 350 50 Q 400 50 400 100 L 400 150 L 450 200 L 450 300 Q 450 350 400 350 L 200 350 L 150 300 L 100 350 Z',
        getPosition: (progress) => {
            const p = (progress % 100) / 100;
            const points = [
                { x: 50, y: 350 }, { x: 50, y: 250 }, { x: 100, y: 200 },
                { x: 100, y: 100 }, { x: 150, y: 50 }, { x: 350, y: 50 },
                { x: 400, y: 100 }, { x: 400, y: 150 }, { x: 450, y: 200 },
                { x: 450, y: 300 }, { x: 400, y: 350 }, { x: 200, y: 350 },
                { x: 150, y: 300 }, { x: 100, y: 350 }, { x: 50, y: 350 }
            ];
            const idx = Math.floor(p * (points.length - 1));
            const t = (p * (points.length - 1)) - idx;
            const p1 = points[idx];
            const p2 = points[Math.min(idx + 1, points.length - 1)];
            return {
                x: p1.x + (p2.x - p1.x) * t,
                y: p1.y + (p2.y - p1.y) * t
            };
        }
    },

    // Silverstone style - Fluido y rápido
    4: {
        name: 'Silverstone Style',
        viewBox: '0 0 500 400',
        path: 'M 100 350 Q 50 350 50 300 L 50 150 Q 50 100 100 100 L 150 100 L 200 50 L 350 50 Q 400 50 400 100 L 400 150 L 450 200 Q 480 230 450 260 L 400 300 L 400 350 Q 400 380 350 350 L 250 300 L 150 350 Z',
        getPosition: (progress) => {
            const p = (progress % 100) / 100;
            const points = [
                { x: 100, y: 350 }, { x: 50, y: 300 }, { x: 50, y: 150 },
                { x: 100, y: 100 }, { x: 150, y: 100 }, { x: 200, y: 50 },
                { x: 350, y: 50 }, { x: 400, y: 100 }, { x: 400, y: 150 },
                { x: 450, y: 200 }, { x: 450, y: 260 }, { x: 400, y: 300 },
                { x: 400, y: 350 }, { x: 350, y: 350 }, { x: 250, y: 300 },
                { x: 150, y: 350 }, { x: 100, y: 350 }
            ];
            const idx = Math.floor(p * (points.length - 1));
            const t = (p * (points.length - 1)) - idx;
            const p1 = points[idx];
            const p2 = points[Math.min(idx + 1, points.length - 1)];
            return {
                x: p1.x + (p2.x - p1.x) * t,
                y: p1.y + (p2.y - p1.y) * t
            };
        }
    },

    // Suzuka style - Figura 8
    5: {
        name: 'Suzuka Style (Figure 8)',
        viewBox: '0 0 500 400',
        path: 'M 250 200 Q 150 100 100 150 Q 50 200 100 250 Q 150 300 250 200 Q 350 100 400 150 Q 450 200 400 250 Q 350 300 250 200',
        getPosition: (progress) => {
            const p = (progress % 100) / 100;
            const angle = p * Math.PI * 2;
            // Lemniscate (figure 8)
            const scale = 150;
            const a = scale;
            const cos = Math.cos(angle);
            const sin = Math.sin(angle);
            const denom = 1 + sin * sin;
            return {
                x: 250 + (a * cos) / denom,
                y: 200 + (a * sin * cos) / denom
            };
        }
    },

    // COTA style - Americas
    6: {
        name: 'COTA Style',
        viewBox: '0 0 500 400',
        path: 'M 50 200 L 100 100 L 200 100 L 250 50 L 350 50 L 400 100 L 400 200 L 450 250 L 450 350 L 350 350 L 300 300 L 200 300 L 150 350 L 50 350 Z',
        getPosition: (progress) => {
            const p = (progress % 100) / 100;
            const points = [
                { x: 50, y: 200 }, { x: 100, y: 100 }, { x: 200, y: 100 },
                { x: 250, y: 50 }, { x: 350, y: 50 }, { x: 400, y: 100 },
                { x: 400, y: 200 }, { x: 450, y: 250 }, { x: 450, y: 350 },
                { x: 350, y: 350 }, { x: 300, y: 300 }, { x: 200, y: 300 },
                { x: 150, y: 350 }, { x: 50, y: 350 }, { x: 50, y: 200 }
            ];
            const idx = Math.floor(p * (points.length - 1));
            const t = (p * (points.length - 1)) - idx;
            const p1 = points[idx];
            const p2 = points[Math.min(idx + 1, points.length - 1)];
            return {
                x: p1.x + (p2.x - p1.x) * t,
                y: p1.y + (p2.y - p1.y) * t
            };
        }
    },

    // Bahrain style - Muchas frenadas
    7: {
        name: 'Bahrain Style',
        viewBox: '0 0 500 400',
        path: 'M 100 350 L 100 250 L 50 200 L 50 100 L 150 100 L 150 50 L 350 50 L 350 100 L 450 100 L 450 200 L 400 250 L 400 350 L 300 350 L 300 300 L 200 300 L 200 350 Z',
        getPosition: (progress) => {
            const p = (progress % 100) / 100;
            const points = [
                { x: 100, y: 350 }, { x: 100, y: 250 }, { x: 50, y: 200 },
                { x: 50, y: 100 }, { x: 150, y: 100 }, { x: 150, y: 50 },
                { x: 350, y: 50 }, { x: 350, y: 100 }, { x: 450, y: 100 },
                { x: 450, y: 200 }, { x: 400, y: 250 }, { x: 400, y: 350 },
                { x: 300, y: 350 }, { x: 300, y: 300 }, { x: 200, y: 300 },
                { x: 200, y: 350 }, { x: 100, y: 350 }
            ];
            const idx = Math.floor(p * (points.length - 1));
            const t = (p * (points.length - 1)) - idx;
            const p1 = points[idx];
            const p2 = points[Math.min(idx + 1, points.length - 1)];
            return {
                x: p1.x + (p2.x - p1.x) * t,
                y: p1.y + (p2.y - p1.y) * t
            };
        }
    },

    // Default oval
    default: {
        name: 'Classic Oval',
        viewBox: '0 0 500 400',
        path: null, // Uses ellipse
        getPosition: (progress) => {
            const p = (progress % 100) / 100;
            const angle = p * Math.PI * 2 - Math.PI / 2;
            return {
                x: 250 + 200 * Math.cos(angle),
                y: 200 + 150 * Math.sin(angle)
            };
        }
    }
};

// Asignar formas a los circuitos de la base de datos
export const trackIdToShape = {
    1: 7,   // Bahrain
    2: 2,   // Jeddah - Monaco style (technical)
    3: 4,   // Melbourne - Silverstone style
    4: 5,   // Suzuka - Figure 8
    5: 1,   // Shanghai - Oval
    6: 6,   // Miami - COTA style
    7: 2,   // Imola - Monaco style
    8: 2,   // Monaco
    9: 4,   // Montreal - Silverstone
    10: 1,  // Barcelona - Oval
    11: 1,  // Austria - Oval
    12: 4,  // Silverstone
    13: 3,  // Hungary - Spa style
    14: 3,  // Spa
    15: 1,  // Zandvoort - Oval
    16: 1,  // Monza - Oval
    17: 2,  // Singapore - Monaco style
    18: 6,  // COTA
    19: 7,  // Mexico - Bahrain style
    20: 3,  // Brazil - Spa style
    21: 1,  // Las Vegas - Oval
    22: 7,  // Qatar - Bahrain style
    23: 6   // Abu Dhabi - COTA style
};

export function getTrackShape(trackId) {
    const shapeId = trackIdToShape[trackId] || 'default';
    return trackShapes[shapeId] || trackShapes.default;
}
