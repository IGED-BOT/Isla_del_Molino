/**
 * Sistema de registro de logs del Mini Motor Gráfico.
 */
export class Logger {
  static prefix = '[isla-molino]';

  static info(...args) {
    console.log(this.prefix, ...args);
  }

  static warn(...args) {
    console.warn(this.prefix, ...args);
  }

  static error(...args) {
    console.error(this.prefix, ...args);
  }
}

export const log = Logger;
