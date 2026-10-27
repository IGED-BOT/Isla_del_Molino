/**
 * Gestor y factoría de geometrías reutilizables para el Mini Motor WebGL2.
 * Evita instanciar buffers duplicados para mallas que comparten la misma forma.
 */

export class GeometryFactory {
  static #cache = new Map();

  static get(key, factory) {
    if (!this.#cache.has(key)) {
      this.#cache.set(key, factory());
    }
    return this.#cache.get(key);
  }

  static has(key) {
    return this.#cache.has(key);
  }

  static set(key, geometry) {
    this.#cache.set(key, geometry);
    return geometry;
  }

  static remove(key) {
    return this.#cache.delete(key);
  }

  static clear() {
    this.#cache.clear();
  }

  static count() {
    return this.#cache.size;
  }
}
