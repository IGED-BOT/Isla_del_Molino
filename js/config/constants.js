export const TAU = Math.PI * 2;
// Parámetros de la cámara orbital
export const CAMERA = {
  target: [0.0, 1.2, 0.0],
  distancia: 22.0,
  azimut: 0.55,
  elevacion: 0.38,
  distanciaMin: 6.0,
  distanciaMax: 55.0,
  sensibilidadMouse: 0.008,
  sensibilidadZoom: 0.0035,
};
// Parámetros de la isla y el terreno
export const LIGHT = {
  ambientDay: 0.18,
  ambientNight: 0.06,
};
// Parámetros de la isla y el terreno
export const COLORS = {
  sand: [0.76, 0.66, 0.42],
  rock: [0.42, 0.40, 0.38],
  wood: [0.45, 0.28, 0.14],
  roof: [0.55, 0.22, 0.16],
  waterDeep: [0.02, 0.12, 0.22],
  waterShallow: [0.08, 0.35, 0.42],
  leaf: [0.18, 0.46, 0.16],
  trunk: [0.38, 0.24, 0.12],
  path: [0.62, 0.52, 0.34],
  sail: [0.92, 0.90, 0.82],
  sun: [1.0, 0.85, 0.35],
  moon: [0.82, 0.86, 0.92],
};

// Parámetros del ciclo día/noche (duración de un ciclo completo en segundos)
export const DAY = {
  secondsPerCycle: 90,
};

// Parámetros del viento (fuerza base y amplitud de ráfagas aleatorias)
export const WIND = {
  baseStrength: 0.55,
  gustAmplitude: 0.35,
};

// Parámetros de las olas de la marea (cada ola es un vector 2D con dirección, amplitud, longitud y velocidad)
export const WAVES = [
  { direction: [1.0, 0.15], amplitude: 0.18, length: 11.0, speed: 1.15 },
  { direction: [0.55, 0.82], amplitude: 0.09, length: 5.5, speed: 1.55 },
  { direction: [-0.35, 0.9], amplitude: 0.045, length: 2.8, speed: 2.1 },
];
