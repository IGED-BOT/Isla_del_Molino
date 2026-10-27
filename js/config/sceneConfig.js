import { COLORS } from './constants.js';
// Configuración de la escena "Isla del Molino" con posiciones, escalas y orientaciones de objetos
export const sceneConfig = {
  island: {
    // Isla con forma elíptica y ligera pendiente hacia el mar
    radius: 9.2,
    flatten: 0.42,
    position: [0, 0, 0],
  },
  windmill: {
    // Molino de viento con aspas giratorias y base de madera
    position: [-1.2, 0, -1.6],
    scale: 1.0,
  },
  dock: {
    // Muelle de madera con tablones y pilares sumergidos
    position: [8.4, 0.32, 3.8],
    length: 4.8,
    width: 1.4,
  },
  path: {
    // Sendero de arena que conecta el molino con la playa
    from: [7.0, 0, 3.2],
    to: [-0.7, 0, -1.0],
    steps: 18,
  },
  boat: {
    // Amarrado junto al muelle en aguas abiertas con holgura lateral
    position: [10.8, 0.0, 2.9],
    yaw: 1.15,
  },
  palms: [
    // Palmeras con hojas curvadas perfectamente centradas
    { position: [3.2, 0, -2.6], scale: 1.05, yaw: 0.4 },
    { position: [-3.4, 0, 2.0], scale: 0.9, yaw: 1.2 },
    { position: [2.2, 0, 4.4], scale: 0.8, yaw: -0.6 },
    { position: [-4.0, 0, -2.8], scale: 1.15, yaw: 2.1 },
    { position: [-1.8, 0, 3.8], scale: 0.85, yaw: 0.8 },
  ],
  bushes: [
    // Arbustos costeros en las laderas
    { position: [-2.1, 0, -2.4], scale: 1.05, seed: 1 },
    { position: [-0.4, 0, -2.2], scale: 0.9, seed: 2 },
    { position: [1.2, 0, 0.5], scale: 1.1, seed: 3 },
    { position: [3.8, 0, -1.8], scale: 0.85, seed: 4 },
    { position: [-2.8, 0, 1.2], scale: 1.0, seed: 5 },
    { position: [1.5, 0, 3.4], scale: 0.95, seed: 6 },
    { position: [5.2, 0, 1.8], scale: 0.8, seed: 7 },
  ],
  grassTufts: [
    // Mechones de hierba
    { position: [5.8, 0, 2.5], scale: 1.0, yaw: 0.3 },
    { position: [4.4, 0, 1.9], scale: 0.9, yaw: 1.1 },
    { position: [3.1, 0, 1.1], scale: 0.85, yaw: 2.2 },
    { position: [1.8, 0, 0.2], scale: 1.1, yaw: 0.7 },
    { position: [0.5, 0, -0.6], scale: 0.95, yaw: 1.8 },
    { position: [-2.4, 0, -0.8], scale: 1.0, yaw: 2.9 },
    { position: [2.6, 0, 3.8], scale: 0.9, yaw: 0.5 },
  ],
  rocks: [
    // Rocas sobre el terreno orgánico y orilla
    { position: [5.6, 0, -3.8], scale: 0.85 },
    { position: [-5.2, 0, 4.1], scale: 1.1 },
    { position: [6.4, 0, 1.2], scale: 0.65 },
    { position: [-6.0, 0, -1.4], scale: 0.75 },
    { position: [-6.8, 0, 6.2], scale: 0.9 },
    { position: [8.2, 0, -4.5], scale: 0.7 },
  ],
  buoys: [
    {
      // Boya Este / Sureste (mar abierto despejado tras barco y muelle)
      position: [14.2, 0.0, -3.8],
      drift: { direction: [0.8, 0.6], speed: 0.45, radius: 0.75, phase: 0.0 },
    },
    {
      // Boya Norte / Noreste (mar abierto despejado al norte de la costa)
      position: [2.5, 0.0, 15.0],
      drift: { direction: [-0.6, 0.8], speed: 0.50, radius: 0.80, phase: 1.6 },
    },
    {
      // Boya Noroeste (mar abierto despejado al oeste de la isla)
      position: [-13.8, 0.0, 4.2],
      drift: { direction: [-0.7, -0.7], speed: 0.42, radius: 0.70, phase: 3.1 },
    },
    {
      // Boya Suroeste / Sur (mar abierto despejado al sur de la isla)
      position: [-4.2, 0.0, -13.6],
      drift: { direction: [0.7, -0.7], speed: 0.48, radius: 0.75, phase: 4.7 },
    },
  ],
  sea: {
    // Mar con olas de marea y espuma en la orilla
    size: 90,
    segments: 80,
  },
  colors: COLORS,
};
