export class InputManager {
  constructor(canvas) {
    this.canvas = canvas;
    this.keys = new Set();
    this.mouse = {
      x: 0,
      y: 0,
      dx: 0,
      dy: 0,
      down: false,
      wheel: 0,
    };
    this._lastTouchDist = 0;
    this._lastTouchPos = null;

    window.addEventListener('keydown', this._onKeyDown);
    window.addEventListener('keyup', this._onKeyUp);
    canvas.addEventListener('mousedown', this._onMouseDown);
    window.addEventListener('mouseup', this._onMouseUp);
    window.addEventListener('mousemove', this._onMouseMove);
    canvas.addEventListener('wheel', this._onWheel, { passive: false });

    canvas.addEventListener('touchstart', this._onTouchStart, { passive: false });
    window.addEventListener('touchend', this._onTouchEnd);
    window.addEventListener('touchmove', this._onTouchMove, { passive: false });
  }

  isDown(code) {
    return this.keys.has(code);
  }

  consumeMouseDelta() {
    const { dx, dy } = this.mouse;
    this.mouse.dx = 0;
    this.mouse.dy = 0;
    return { dx, dy };
  }

  consumeWheel() {
    const w = this.mouse.wheel;
    this.mouse.wheel = 0;
    return w;
  }

  _onKeyDown = (e) => {
    this.keys.add(e.code);
  };

  _onKeyUp = (e) => {
    this.keys.delete(e.code);
  };

  _onMouseDown = (e) => {
    if (e.button === 0) this.mouse.down = true;
  };

  _onMouseUp = () => {
    this.mouse.down = false;
  };

  _onMouseMove = (e) => {
    this.mouse.x = e.clientX;
    this.mouse.y = e.clientY;
    if (this.mouse.down) {
      this.mouse.dx += e.movementX;
      this.mouse.dy += e.movementY;
    }
  };

  _onWheel = (e) => {
    e.preventDefault();
    this.mouse.wheel += e.deltaY;
  };

  _onTouchStart = (e) => {
    e.preventDefault();
    if (e.touches.length === 1) {
      this.mouse.down = true;
      this._lastTouchPos = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2) {
      this.mouse.down = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      this._lastTouchDist = Math.hypot(dx, dy);
    }
  };

  _onTouchMove = (e) => {
    e.preventDefault();
    if (e.touches.length === 1 && this._lastTouchPos) {
      const x = e.touches[0].clientX;
      const y = e.touches[0].clientY;
      this.mouse.dx += x - this._lastTouchPos.x;
      this.mouse.dy += y - this._lastTouchPos.y;
      this._lastTouchPos = { x, y };
    } else if (e.touches.length === 2 && this._lastTouchDist > 0) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const diff = this._lastTouchDist - dist;
      this.mouse.wheel += diff * 2;
      this._lastTouchDist = dist;
    }
  };

  _onTouchEnd = (e) => {
    if (e.touches.length === 0) {
      this.mouse.down = false;
      this._lastTouchPos = null;
      this._lastTouchDist = 0;
    }
  };
}
