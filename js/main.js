import { IslaDelMolinoApp } from './app/IslaDelMolinoApp.js';

class ApplicationBootstrap {
  static start() {
    const canvas = document.getElementById('glCanvas');
    this.app = new IslaDelMolinoApp(canvas);
    this.app.start();
    window.app = this.app;
  }
}

ApplicationBootstrap.start();
