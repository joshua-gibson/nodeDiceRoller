const { AmmoPhysics, PhysicsLoader, ExtendedObject3D } = ENABLE3D;

const init = () => {
  // initialise scene
  const scene = new THREE.Scene();
  const gui = new dat.GUI();

  const enableFog = true;

  if (enableFog) {
    scene.fog = new THREE.FogExp2(0xffffff, 0.005);
  }

  //initialise renderer
  const renderer = new THREE.WebGLRenderer({ antialiasing: true });
  renderer.shadowMap.enabled = true;
  renderer.setSize(window.innerWidth, window.innerHeight);
  renderer.setClearColor("rgb(120, 120, 120)");
  document.body.appendChild(renderer.domElement);

  //initialise camera
  const camera = new THREE.PerspectiveCamera(
    45,
    window.innerWidth / window.innerHeight,
    1,
    1000
  );

  camera.position.x = 40;
  camera.position.y = 50;
  camera.position.z = 15;

  camera.lookAt(new THREE.Vector3(0, 0, 0));

  // orbit controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // initialise physics
  const physics = new AmmoPhysics(scene);
  physics.debug.enable(false);

  // add ground
  physics.add.ground(
    { width: 120, height: 120 },
    { lambert: { color: "rgb(0,100,0)" } }
  );

  // add light
  const lightFolder = gui.addFolder("Light");
  const directionalLight = getDirectionalLight(1);
  const sphere = getSphere(0.3);
  directionalLight.add(sphere);

  directionalLight.position.x = -16;
  directionalLight.position.y = 20;
  directionalLight.position.z = 19;
  directionalLight.intensity = 2;

  scene.add(directionalLight);

  lightFolder.add(directionalLight, "intensity", 0, 10).name("Intensity");
  lightFolder.add(directionalLight.position, "x", -50, 50).name("Move Back");
  lightFolder.add(directionalLight.position, "z", -50, 50).name("Move Over");
  lightFolder.add(directionalLight.position, "y", 1, 30).name("Move Up");

  const includeSpotlight = () => {
    const spotLight = getSpotLight(1);
    const sphere = getSphere(0.3);
    spotLight.add(sphere);

    spotLight.position.x = 26;
    spotLight.position.y = 20;
    spotLight.position.z = -12;
    spotLight.intensity = 2;

    scene.add(spotLight);
    const spotLightFolder = lightFolder.addFolder("SpotLight");
    spotLightFolder.add(spotLight, "intensity", 0, 10).name("Intensity");
    spotLightFolder.add(spotLight.position, "x", -50, 50).name("Move Back");
    spotLightFolder.add(spotLight.position, "z", -50, 50).name("Move Over");
    spotLightFolder.add(spotLight.position, "y", 1, 30).name("Move Up");

    lightFolder.remove(lightController);
  };

  const addSpotLight = {
    includeSpotlight: includeSpotlight,
  };

  lightController = lightFolder
    .add(addSpotLight, "includeSpotlight")
    .name("add SpotLight");

  var dieProperties = {
    gravity: [0, -15, 0],
    velocity: [1, 2, 3],
    angularVelocity: [0.05, 0.2, 0.7],
    friction: 0.6,
    strength: 5,
    spin: 1,
  };
  const dieFolder = gui.addFolder("Die Properties");
  dieFolder.add(dieProperties, "friction", 0, 1).name("Friction");
  dieFolder.add(dieProperties, "strength", 0, 10).name("Strength");
  dieFolder.add(dieProperties, "spin", 0, 5).name("Spin");

  // add dice
  const rollDie = () => {
    new THREE.GLTFLoader().loadAsync("die-alpha.gltf").then((gltf) => {
      const die = gltf.scene.children[2];
      die.position.z = -55;
      die.position.y = 8;
      scene.add(die);
      physics.add.existing(die, {
        shape: "box",
        width: 2,
        height: 2,
        depth: 2,
      });
      die.castShadow = true;
      die.body.setGravity(...dieProperties.gravity);
      die.body.setVelocity(
        ...dieProperties.velocity.map((v) => v * dieProperties.strength)
      );
      die.body.setAngularVelocity(
        ...dieProperties.angularVelocity.map(
          (v) => v * dieProperties.strength * dieProperties.spin
        )
      );
      die.body.setFriction(dieProperties.friction);
    });
  };

  const rollDieManual = {
    rollDie: rollDie,
  };

  gui.add(rollDieManual, "rollDie").name("Roll Die");

  //randomize
  const RandomizeRoll = () => {
    dieProperties.strength = Math.random() * 10;
    dieProperties.spin = Math.random() * 5;
    console.log("Strength: ", (dieProperties.strength = Math.random() * 10));
    console.log("Spin: ", (dieProperties.spin = Math.random() * 10));
    rollDie();
  };
  const rollDieRandom = {
    rollDie: RandomizeRoll,
  };

  gui.add(rollDieRandom, "rollDie").name("Roll Random Die");

  // clock
  const clock = new THREE.Clock();

  const animate = () => {
    physics.update(clock.getDelta() * 10000);

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
};

const getSphere = (size) => {
  const geometry = new THREE.SphereGeometry(size, 24, 24);
  const material = new THREE.MeshBasicMaterial({
    color: "rgb(255, 255, 255)",
  });
  const mesh = new THREE.Mesh(geometry, material);

  return mesh;
};

const getPointLight = (intensity) => {
  const light = new THREE.PointLight(0xffffff, intensity);
  light.castShadow = true;

  return light;
};

const getSpotLight = (intensity) => {
  const light = new THREE.SpotLight(0xffffff, intensity);
  light.castShadow = true;

  var d = 5;

  light.shadow.camera.left = -d;
  light.shadow.camera.right = d;
  light.shadow.camera.top = d;
  light.shadow.camera.bottom = -d;

  light.shadow.camera.near = 1;
  light.shadow.camera.far = 20;

  light.shadow.bias = 0.001;
  light.shadow.mapSize.width = 2048;
  light.shadow.mapSize.height = 2048;

  return light;
};

const getDirectionalLight = (intensity) => {
  const light = new THREE.DirectionalLight(0xffffff, intensity);
  light.castShadow = true;

  light.shadow.camera.left = -10;
  light.shadow.camera.bottom = -10;
  light.shadow.camera.right = 10;
  light.shadow.camera.top = 10;

  return light;
};

PhysicsLoader("/lib/ammo/kripken", () => init());
