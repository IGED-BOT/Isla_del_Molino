/**
 * Cargador de código fuente GLSL del Mini Motor Gráfico.
 * Soporta carga asíncrona vía fetch y caché de strings de shader.
 */

export class ShaderLoader {
  static #cache = new Map();

  static async load(url) {
    if (this.#cache.has(url)) {
      return this.#cache.get(url);
    }
    const response = await fetch(url);
    if (!response.ok) {
      throw new Error(`No se pudo cargar shader desde: ${url}`);
    }
    const source = await response.text();
    this.#cache.set(url, source);
    return source;
  }

  static async loadMultiple(urls = {}) {
    const results = {};
    const entries = Object.entries(urls);
    await Promise.all(
      entries.map(async ([key, url]) => {
        results[key] = await this.load(url);
      }),
    );
    return results;
  }

  static clear() {
    this.#cache.clear();
  }
}
