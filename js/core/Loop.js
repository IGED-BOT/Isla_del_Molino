export class Loop {
  constructor(target) {
    // Clase para manejar un bucle de animación, llamando a step(dt, t) en cada frame
    if (!target || typeof target.step !== 'function') {
      throw new TypeError('El objetivo del bucle debe implementar step(dt, t).');
    }
    this.target = target;
    this.running = false;
    this._last = 0;
    this._raf = 0;
    this.tick = this.tick.bind(this);
  }

  start() {
    // Inicia el bucle de animación, llamando a step(dt, t) en cada frame
    if (this.running) return;
    this.running = true;
    this._last = 0;
    this._raf = requestAnimationFrame(this.tick);
  }

  stop() {
    //  Detiene el bucle de animación
    this.running = false;
    if (this._raf) cancelAnimationFrame(this._raf);
  }

  tick(nowMs) {
    // Función de tick para el bucle de animación
    if (!this.running) return;
    const t = nowMs * 0.001;
    let dt = this._last === 0 ? 0 : t - this._last;
    this._last = t;
    if (dt > 0.1) dt = 0.0;

    this.target.step(dt, t);

    this._raf = requestAnimationFrame(this.tick);
  }
}
