const { AmmoPhysics, PhysicsLoader, ExtendedObject3D } = ENABLE3D;

const MainScene = () => {
  // scene
  const scene = new THREE.Scene();
  scene.background = new THREE.Color(0xf0f0f0);

  // camera
  const camera = new THREE.PerspectiveCamera(
    50,
    window.innerWidth / window.innerHeight,
    0.1,
    1000
  );
  camera.position.set(40, 60, 40);

  // renderer
  const renderer = new THREE.WebGLRenderer();
  renderer.setSize(window.innerWidth, window.innerHeight);
  document.body.appendChild(renderer.domElement);

  // dpr
  const DPR = window.devicePixelRatio;
  renderer.setPixelRatio(Math.min(2, DPR));

  // orbit controls
  const controls = new THREE.OrbitControls(camera, renderer.domElement);

  // light
  scene.add(new THREE.HemisphereLight(0xffffbb, 0x080820, 1));
  scene.add(new THREE.AmbientLight(0x666666));
  const light = new THREE.DirectionalLight(0xdfebff, 1);
  light.position.set(50, 200, 100);
  light.position.multiplyScalar(1.3);

  // physics
  const physics = new AmmoPhysics(scene);
  physics.debug.enable(false);

  // extract the object factory from physics
  // the factory will make/add object without physics
  const { factory } = physics;

  // blue box
  // physics.add.box({ x: 0.05, y: 10 }, { lambert: { color: 0x2194ce } });

  // static ground
  physics.add.ground({ width: 120, height: 120 });

  new THREE.GLTFLoader().loadAsync("die-alpha.gltf").then((gltf) => {
    const die = gltf.scene.children[2];
    die.position.z = -55;
    die.position.y = 8;
    scene.add(die);
    physics.add.existing(die, { shape: "box", width: 2, height: 2, depth: 2 });
    die.body.setGravity(0, -20, 0);
    die.body.setVelocity(3, 2, 20);
    die.body.setAngularVelocity(5, 7, 15);
    // die.body.applyForceX(5);
    // die.body.applyForceZ(8);
    // die.body.applyForceY(0);
    // die.body.applyTorque(0, 15, 15);
  });

  // add a normal sphere using the object factory
  // (NOTE: This will be factory.add.sphere() in the future)
  // first parameter is the config for the geometry
  // second parameter is for the material
  // you could also add a custom material like so { custom: new THREE.MeshLambertMaterial({ color: 0x00ff00 }) }
  // let greenSphere = factory.addSphere(
  //   { y: 2, z: 5 },
  //   { lambert: { color: 0x00ff00 } }
  // );
  // once the object is created, you can add physics to it
  // physics.add.existing(greenSphere);

  // green sphere
  // const geometry = new THREE.BoxBufferGeometry();
  // const material = new THREE.MeshLambertMaterial({ color: 0x00ff00 });
  // const cube = new THREE.Mesh(geometry, material);
  // cube.position.set(0, 5, 0);
  // scene.add(cube);
  // physics.add.existing(cube);
  // cube.body.setCollisionFlags(2); // make it kinematic

  // merge children to compound shape
  // const exclamationMark = () => {
  //   const material = new THREE.MeshLambertMaterial({ color: 0xffff00 });

  //   const sphere = new THREE.Mesh(
  //     new THREE.SphereBufferGeometry(0.25),
  //     material
  //   );
  //   sphere.position.set(0, -0.8, 0);

  //   const cube = new THREE.Mesh(
  //     new THREE.BoxBufferGeometry(0.4, 0.8, 0.4),
  //     material
  //   );
  //   cube.position.set(5, 2, 5);

  //   cube.add(sphere);
  //   scene.add(cube);

  //   cube.position.set(5, 5, 5);
  //   cube.rotation.set(0, 0.4, 0.2);

  //   physics.add.existing(cube);
  // };
  // exclamationMark();

  // clock
  const clock = new THREE.Clock();

  // loop
  const animate = () => {
    physics.update(clock.getDelta() * 1000);

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
};
PhysicsLoader("/lib/ammo/kripken", () => MainScene());
