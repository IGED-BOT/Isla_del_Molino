import { Texture } from '../core/Texture.js';
import { log } from '../utils/logger.js';

/**
 * Gestor y cargador de texturas del Mini Motor Gráfico.
 * Soporta carga asíncrona de imágenes de disco con texturas provisionales,
 * además de generación procedural procedural en vivo en Canvas2D para todas
 * las superficies del mundo (arena, roca, madera, follaje, cielo, agua, terreno, velas).
 */

export class TextureLoader {
  constructor(gl) {
    this.gl = gl;
    this.cache = new Map();
    this.recipes = new Map();
    this._registerDefaultRecipes();
  }

  static paintNoise(ctx, w, h, base, amp, scale) {
    const img = ctx.createImageData(w, h);
    for (let y = 0; y < h; y++) {
      for (let x = 0; x < w; x++) {
        const n = Math.sin(x * scale) * Math.cos(y * scale * 1.3)
          + Math.sin((x + y) * scale * 0.7);
        const t = (n * 0.5 + 0.5) * amp;
        const i = (y * w + x) * 4;
        img.data[i] = Math.min(255, base[0] + t);
        img.data[i + 1] = Math.min(255, base[1] + t * 0.8);
        img.data[i + 2] = Math.min(255, base[2] + t * 0.5);
        img.data[i + 3] = 255;
      }
    }
    ctx.putImageData(img, 0, 0);
  }

  _registerDefaultRecipes() {
    const paint = TextureLoader.paintNoise;

    this.registerRecipe('arena.jpg', (ctx) => paint(ctx, 128, 128, [210, 176, 110], 40, 0.18));
    this.registerRecipe('roca.jpg', (ctx) => paint(ctx, 128, 128, [110, 105, 100], 35, 0.31));
    this.registerRecipe('madera.jpg', (ctx) => {
      for (let x = 0; x < 128; x++) {
        const stripe = Math.sin(x * 0.35) * 18;
        ctx.fillStyle = `rgb(${120 + stripe},${72 + stripe * 0.4},${36})`;
        ctx.fillRect(x, 0, 1, 128);
      }
      paint(ctx, 128, 128, [118, 70, 34], 18, 0.4);
    });
    this.registerRecipe('techo.jpg', (ctx) => paint(ctx, 128, 128, [150, 55, 42], 28, 0.25));
    this.registerRecipe('agua_normal.png', (ctx) => paint(ctx, 128, 128, [128, 128, 255], 40, 0.5));
    this.registerRecipe('palmera_hoja.png', (ctx) => {
      ctx.clearRect(0, 0, 128, 128);
      ctx.fillStyle = '#2d8426';
      ctx.beginPath();
      ctx.moveTo(64, 6);
      ctx.quadraticCurveTo(10, 64, 64, 124);
      ctx.quadraticCurveTo(118, 64, 64, 6);
      ctx.fill();

      ctx.strokeStyle = '#3bb033';
      ctx.lineWidth = 2.5;
      for (let y = 14; y < 118; y += 7) {
        const span = Math.sin((y / 128) * Math.PI) * 48;
        ctx.beginPath();
        ctx.moveTo(64, y);
        ctx.lineTo(64 - span, y + 8);
        ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(64, y);
        ctx.lineTo(64 + span, y + 8);
        ctx.stroke();
      }

      ctx.strokeStyle = '#1b5616';
      ctx.lineWidth = 3.5;
      ctx.beginPath();
      ctx.moveTo(64, 6);
      ctx.lineTo(64, 126);
      ctx.stroke();
    });
    this.registerRecipe('cielo_dia.jpg', (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 0, 128);
      g.addColorStop(0, '#6cb4ea');
      g.addColorStop(1, '#d7e9f8');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    });
    this.registerRecipe('cielo_noche.jpg', (ctx) => {
      const g = ctx.createLinearGradient(0, 0, 0, 128);
      g.addColorStop(0, '#050814');
      g.addColorStop(1, '#1a2744');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    });
    this.registerRecipe('sol.jpg', (ctx) => {
      const g = ctx.createRadialGradient(64, 64, 8, 64, 64, 64);
      g.addColorStop(0, '#fff4b0');
      g.addColorStop(1, '#ff9a2a');
      ctx.fillStyle = g;
      ctx.fillRect(0, 0, 128, 128);
    });
    this.registerRecipe('luna.jpg', (ctx) => paint(ctx, 128, 128, [200, 205, 210], 22, 0.22));
    this.registerRecipe('isla_terreno.jpg', (ctx) => {
      paint(ctx, 128, 128, [218, 185, 120], 32, 0.18);
      const img = ctx.getImageData(0, 0, 128, 128);
      for (let y = 0; y < 128; y++) {
        const ny = (y - 64) / 64;
        for (let x = 0; x < 128; x++) {
          const nx = (x - 64) / 64;
          const dist = Math.hypot(nx, ny);
          const noise = Math.sin(x * 0.35) * Math.cos(y * 0.35) * 0.08;
          const grassFactor = Math.max(0, Math.min(1, (0.75 - (dist + noise)) * 3.5));
          if (grassFactor > 0) {
            const i = (y * 128 + x) * 4;
            const gR = 55 + Math.sin(x * 0.5 + y * 0.3) * 12;
            const gG = 126 + Math.sin(x * 0.4 - y * 0.6) * 18;
            const gB = 44 + Math.cos(x * 0.3 + y * 0.4) * 8;
            img.data[i] = Math.round(img.data[i] * (1 - grassFactor) + gR * grassFactor);
            img.data[i + 1] = Math.round(img.data[i + 1] * (1 - grassFactor) + gG * grassFactor);
            img.data[i + 2] = Math.round(img.data[i + 2] * (1 - grassFactor) + gB * grassFactor);
          }
        }
      }
      ctx.putImageData(img, 0, 0);
    });
    this.registerRecipe('vela.jpg', (ctx) => {
      paint(ctx, 128, 128, [235, 230, 215], 16, 0.35);
      ctx.strokeStyle = 'rgba(180, 170, 150, 0.45)';
      ctx.lineWidth = 1;
      for (let y = 16; y < 128; y += 24) {
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(128, y);
        ctx.stroke();
      }
    });
  }

  registerRecipe(name, recipeFn) {
    this.recipes.set(name, recipeFn);
    return this;
  }

  createProcedural(name, width = 128, height = 128) {
    const canvas = document.createElement('canvas');
    canvas.width = width;
    canvas.height = height;
    const ctx = canvas.getContext('2d');

    const fn = this.recipes.get(name) || this.recipes.get('arena.jpg');
    fn(ctx);

    const texture = Texture.fromCanvas(this.gl, canvas);
    this.cache.set(name, texture);
    return texture;
  }

  load(url) {
    const file = url.split('/').pop();
    if (this.cache.has(file)) return this.cache.get(file);

    const gl = this.gl;
    const texture = Texture.placeholder(gl);
    this.cache.set(file, texture);

    const image = new Image();
    image.onload = () => {
      gl.bindTexture(gl.TEXTURE_2D, texture.handle);
      gl.pixelStorei(gl.UNPACK_FLIP_Y_WEBGL, true);
      gl.texImage2D(gl.TEXTURE_2D, 0, gl.RGBA, gl.RGBA, gl.UNSIGNED_BYTE, image);
      gl.generateMipmap(gl.TEXTURE_2D);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.LINEAR_MIPMAP_LINEAR);
      gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.LINEAR);
    };
    image.onerror = () => {
      const generated = this.createProcedural(file);
      texture.handle = generated.handle;
      log.warn('Textura fallback procedural:', file);
    };
    image.src = url;
    return texture;
  }

  loadAll(names = [
    'arena.jpg', 'roca.jpg', 'madera.jpg', 'techo.jpg',
    'agua_normal.png', 'palmera_hoja.png',
    'cielo_dia.jpg', 'cielo_noche.jpg', 'sol.jpg', 'luna.jpg',
    'isla_terreno.jpg', 'vela.jpg',
  ]) {
    const map = {};
    for (const name of names) {
      map[name] = this.createProcedural(name);
    }
    // Cargar la textura real del mapa de estrellas desde assets
    map['cielo_estrellas.png'] = this.load('assets/textures/cielo_estrellas.png');
    return map;
  }

  get(name) {
    return this.cache.get(name);
  }

  has(name) {
    return this.cache.has(name);
  }
}
