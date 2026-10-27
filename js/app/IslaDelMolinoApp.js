import { Engine } from '../core/Engine.js';
import { Camera } from '../scene/Camera.js';
import { Mesh } from '../scene/Mesh.js';
import { DirectionalLight } from '../scene/lights/DirectionalLight.js';
import { AmbientLight } from '../scene/lights/AmbientLight.js';
import { EmissiveMaterial } from '../scene/materials/EmissiveMaterial.js';
import { SkyMaterial } from '../scene/materials/SkyMaterial.js';
import { SphereGeometry } from '../geometry/SphereGeometry.js';
import { DayNightCycle } from '../world/DayNightCycle.js';
import { WindSystem } from '../world/WindSystem.js';
import { WaveSystem } from '../world/WaveSystem.js';
import { Island } from '../scene/objects/Island.js';
import { Windmill } from '../scene/objects/Windmill.js';
import { Dock } from '../scene/objects/Dock.js';
import { Path } from '../scene/objects/Path.js';
import { Boat } from '../scene/objects/Boat.js';
import { PalmTree } from '../scene/objects/PalmTree.js';
import { Bush } from '../scene/objects/Bush.js';
import { GrassTuft } from '../scene/objects/GrassTuft.js';
import { Rock } from '../scene/objects/Rock.js';
import { Sea } from '../scene/objects/Sea.js';
import { Buoy } from '../scene/objects/Buoy.js';
import { sceneConfig } from '../config/sceneConfig.js';
import { log } from '../utils/logger.js';

/**
 * Aplicación "Isla del Molino", construida sobre la arquitectura del Mini Motor Gráfico.
 * Encapsula la orquestación de la escena, luces, entorno, mallas procedurales
 * y el bucle de actualización en una clase cohesiva y altamente escalable.
 */
export class IslaDelMolinoApp {
  constructor(canvas) {
    this.canvas = typeof canvas === 'string' ? document.getElementById(canvas) : canvas;

    // Cámara con punto de mira elevado e interactividad orbital
    this.camera = new Camera({ target: [0, 1.4, 0], distancia: 23 });

    // Inicialización del Mini Motor
    this.engine = new Engine(this.canvas, { camera: this.camera });

    // Carga de texturas procedurales y de escena
    this.textures = this.engine.textureLoader.loadAll();

    // Componentes del mundo y la escena
    this._initEnvironment();
    this._initIslandAndLandmarks();
    this._initMaritime();
    this._initVegetationAndRocks();
    this._setupEnginePipeline();

    log.info('IslaDelMolinoApp lista y configurada en clases.');
  }
  // Inicialización de luces, cielo, ciclo día/noche, viento y olas
  _initEnvironment() {
    this.sun = new DirectionalLight();
    this.ambient = new AmbientLight(0.15);

    this.skyMat = new SkyMaterial();
    this.sky = new Mesh(new SphereGeometry(1, 16, 24), this.skyMat);
    this.sky.scale = [80, 80, 80];

    // Asignar la textura real del mapa de estrellas al material del cielo
    const starTex = this.textures['cielo_estrellas.png'];
    if (starTex) { this.skyMat.starMapTexture = starTex; }

    this.dayNight = new DayNightCycle(this.sun, this.ambient, this.skyMat);
    this.wind = new WindSystem();
    this.waves = new WaveSystem();


    // Mallas luminosas para el Sol y la Luna
    this.sunMesh = new Mesh(
      new SphereGeometry(1.8, 12, 16),
      new EmissiveMaterial(this.textures['sol.jpg']),
    );
    this.moonMesh = new Mesh(
      new SphereGeometry(1.1, 12, 16),
      new EmissiveMaterial(this.textures['luna.jpg']),
    );

    this.engine.add(this.sky, this.sun, this.ambient, this.sunMesh, this.moonMesh);
  }
  // Inicialización de la isla, molino, muelle y sendero
  _initIslandAndLandmarks() {
    this.island = new Island(this.textures);

    this.windmill = new Windmill(this.textures);
    const millPos = sceneConfig.windmill.position;
    this.windmill.position = [
      millPos[0],
      this.island.heightAt(millPos[0], millPos[2]),
      millPos[2],
    ];

    this.dock = new Dock(this.textures);
    this.path = new Path(this.textures, this.island);

    this.engine.add(this.island, this.windmill, this.dock, this.path);
  }
  // Inicialización de barco, boyas y mar con olas
  _initMaritime() {
    this.boat = new Boat(this.textures);
    this.sea = new Sea(this.waves);
    this.buoys = (sceneConfig.buoys || []).map((cfg) => new Buoy(this.textures, cfg));

    this.engine.add(this.sea, this.boat, ...this.buoys);
  }
  // Inicialización de palmeras, arbustos, hierba y rocas
  _initVegetationAndRocks() {
    // Palmeras con hojas curvadas perfectamente centradas
    this.palms = sceneConfig.palms.map((cfg) => {
      const tree = new PalmTree(this.textures, cfg);
      tree.position[1] = this.island.heightAt(cfg.position[0], cfg.position[2]);
      return tree;
    });

    // Rocas sobre el terreno orgánico y orilla
    this.rocks = sceneConfig.rocks.map((cfg) => {
      const rock = new Rock(this.textures, cfg);
      const h = this.island.heightAt(cfg.position[0], cfg.position[2]);
      rock.position[1] = h > 0 ? h + 0.05 : 0.15;
      return rock;
    });

    // Arbustos costeros en las laderas
    this.bushes = (sceneConfig.bushes || []).map((cfg) => {
      const bush = new Bush(this.textures, cfg);
      bush.position[1] = Math.max(0.1, this.island.heightAt(cfg.position[0], cfg.position[2]));
      return bush;
    });

    // Mechones de hierba
    this.grass = (sceneConfig.grassTufts || []).map((cfg) => {
      const g = new GrassTuft(this.textures, cfg);
      g.position[1] = Math.max(0.08, this.island.heightAt(cfg.position[0], cfg.position[2]));
      return g;
    });

    this.engine.add(...this.palms, ...this.rocks, ...this.bushes, ...this.grass);
  }
  // Configuración del bucle de actualización y sistemas del Mini Motor
  _setupEnginePipeline() {
    // Registro de sistemas temporales en el Mini Motor
    this.engine.addSystem('dayNight', this.dayNight);
    this.engine.addSystem('wind', this.wind);
    this.engine.addSystem('waves', this.waves);

    // Conexión del estado ambiental al renderizador
    this.engine.environment.sun = this.sun;
    this.engine.environment.ambient = this.ambient;
    this.engine.environment.wind = this.wind;
    this.engine.environment.waves = this.waves;
    this.engine.environment.dayNight = this.dayNight;

    // Lógica por fotograma
    this.engine.onUpdate(this);
  }
  // Actualización de la escena por fotograma
  update(dt, t) {
    // 1. Dinámica de flotación del barco y boyas con olas de mar
    this.boat.update(dt, this.waves);
    for (const buoy of this.buoys) {
      buoy.update(dt, this.waves);
    }

    // 2. Rotación de las aspas del molino según intensidad del viento
    this.windmill.update(dt, this.wind);

    // 3. Movimiento orgánico del follaje (palmeras, arbustos, hierbas)
    for (const palm of this.palms) {
      palm.update(dt, this.wind);
    }
    for (const bush of this.bushes) {
      bush.rotation[1] = Math.sin(t * 1.4 + bush.position[0]) * 0.04 * (this.wind.strength);
    }
    for (const tuft of this.grass) {
      tuft.rotation[2] = Math.sin(t * 2.2 + tuft.position[0] * 1.5) * 0.08 * (this.wind.strength);
    }

    // 4. Trayectoria celeste del Sol y la Luna (alineada con la cámara para coherencia estricta con halos y cielo)
    const eye = this.camera.eye;
    const dist = 75;
    this.sunMesh.position = [
      eye[0] + this.dayNight.sunDirection[0] * dist,
      eye[1] + this.dayNight.sunDirection[1] * dist,
      eye[2] + this.dayNight.sunDirection[2] * dist,
    ];
    this.moonMesh.position = [
      eye[0] + this.dayNight.moonDirection[0] * dist,
      eye[1] + this.dayNight.moonDirection[1] * dist,
      eye[2] + this.dayNight.moonDirection[2] * dist,
    ];
    this.sunMesh.visible = this.dayNight.sunDirection[1] > -0.06;
    this.moonMesh.visible = this.dayNight.moonDirection[1] > -0.06;
  }

  start() {
    this.engine.start();
    log.info('Isla del Molino en marcha (Mini Motor WebGL2 orientado a objetos).');
    return this;
  }

  stop() {
    this.engine.stop();
    return this;
  }
}
