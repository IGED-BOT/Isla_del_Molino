import { DAY } from '../config/constants.js';
import { MathUtils } from '../math/MathUtils.js';
import { Vec3 } from '../math/Vec3.js';

export class DayNightCycle {
  constructor(sun, ambient, skyMaterial) {
    this.sun = sun;
    this.ambient = ambient;
    this.skyMaterial = skyMaterial;
    this.angle = 0.55;
    this.skyColor = [0.4, 0.6, 0.85];
    this.sunDirection = [0.85, 0.52, 0.16];
    this.moonDirection = [-0.85, -0.52, -0.16];
    this.sunPosition = [35, 20, 7];
    this.moonPosition = [-35, -20, -7];
  }

  update(dt) {
    this.angle += dt * (Math.PI * 2) / DAY.secondsPerCycle;
    const a = this.angle;
    const elev = Math.sin(a);
    const cosA = Math.cos(a);

    // Dirección celeste normalizada (con leve inclinación constante en Z para trayectoria natural)
    const sunDir = Vec3.normalize([cosA * 42, elev * 38, 8]);
    const moonDir = Vec3.negate(sunDir);

    this.sunDirection = sunDir;
    this.moonDirection = moonDir;
    this.sunPosition = Vec3.scale(sunDir, 75);
    this.moonPosition = Vec3.scale(moonDir, 75);

    // Factores de día y de noche / luna
    const dayBlend = MathUtils.saturate(elev * 4.0 + 0.5);
    const dayFactor = MathUtils.saturate(elev * 0.9 + 0.1);
    const moonFactor = MathUtils.saturate(-elev * 1.15);

    // Parámetros de la luz solar (cálida diurna / puesta de sol dorada en el horizonte)
    const sunColor = MathUtils.lerpVec3([1.0, 0.55, 0.28], [1.0, 0.94, 0.82], MathUtils.saturate(elev * 1.8));
    const sunIntensity = 0.15 + dayFactor * 1.05;

    // Parámetros de la luz lunar (iluminación tenue plateada-azulada en la noche)
    const moonColor = [0.68, 0.80, 1.0];
    const moonIntensity = 0.22 + moonFactor * 0.12;

    // Atenuación suave de la luz en el horizonte para transiciones naturales en amanecer y atardecer
    const sunHorizonFade = MathUtils.saturate(sunDir[1] * 8.0);
    const moonHorizonFade = MathUtils.saturate(moonDir[1] * 8.0);

    // La iluminación proviene exactamente del cuerpo celeste que está sobre el horizonte
    if (sunDir[1] >= 0) {
      this.sun.direction = Vec3.negate(sunDir);
      this.sun.color = sunColor;
      this.sun.intensity = sunIntensity * sunHorizonFade;
    } else {
      this.sun.direction = Vec3.negate(moonDir);
      this.sun.color = moonColor;
      this.sun.intensity = moonIntensity * moonHorizonFade;
    }

    // Luz ambiental: en la noche se mantiene una iluminación tenue (azul noche)
    // para que la escena nunca quede en completa oscuridad
    const ambientNightColor = [0.32, 0.42, 0.68];
    const ambientDayColor = [0.62, 0.72, 0.9];
    const ambientNightIntensity = 0.18;
    const ambientDayIntensity = 0.24;

    this.ambient.intensity = MathUtils.lerp(ambientNightIntensity, ambientDayIntensity, dayFactor);
    this.ambient.color = MathUtils.lerpVec3(ambientNightColor, ambientDayColor, dayFactor);

    // Gradientes del cielo
    const zenithDay = [0.22, 0.48, 0.86];
    const zenithNight = [0.05, 0.08, 0.18];
    const horizonDay = [0.78, 0.84, 0.92];
    const horizonDusk = [0.95, 0.55, 0.28];
    const horizonNight = [0.14, 0.18, 0.32];
    const dusk = MathUtils.saturate(1 - Math.abs(elev) * 2.2);

    if (this.skyMaterial) {
      this.skyMaterial.zenith = MathUtils.lerpVec3(zenithNight, zenithDay, dayFactor);
      this.skyMaterial.horizon = MathUtils.lerpVec3(
        MathUtils.lerpVec3(horizonNight, horizonDusk, dusk),
        horizonDay,
        dayFactor,
      );
      this.skyMaterial.nadir = MathUtils.lerpVec3([0.06, 0.09, 0.14], [0.12, 0.2, 0.22], dayFactor);
    }

    this.skyColor = this.skyMaterial?.horizon ?? horizonDay;
  }
}
