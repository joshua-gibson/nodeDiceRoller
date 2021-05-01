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

  // static ground
  physics.add.ground(
    { width: 120, height: 120 },
    { lambert: { color: "rgb(0,100,0)" } }
  );

  new THREE.GLTFLoader().loadAsync("die-alpha.gltf").then((gltf) => {
    const die = gltf.scene.children[2];
    die.position.z = -55;
    die.position.y = 8;
    scene.add(die);
    physics.add.existing(die, { shape: "box", width: 2, height: 2, depth: 2 });
    die.body.setGravity(0, -15, 0);
    die.body.setVelocity(3, 2, 20);
    die.body.setAngularVelocity(5, 7, 15);
    die.body.setBounciness(1);
    die.body.setFriction(0.6);
    // die.body.applyForceX(5);
    // die.body.applyForceZ(8);
    // die.body.applyForceY(0);
    // die.body.applyTorque(0, 15, 15);
  });

  new THREE.GLTFLoader().loadAsync("die-alpha.gltf").then((gltf) => {
    const die_two = gltf.scene.children[2];
    die_two.position.z = -52;
    die_two.position.y = 7;
    scene.add(die_two);
    physics.add.existing(die_two, {
      shape: "box",
      width: 2,
      height: 2,
      depth: 2,
    });
    die_two.body.setGravity(0, -15, 0);
    die_two.body.setVelocity(2, 3, 17);
    die_two.body.setAngularVelocity(2, 8, 15);
    die_two.body.setFriction(0.5);
  });

  // clock
  const clock = new THREE.Clock();

  // loop
  const animate = () => {
    physics.update(clock.getDelta() * 10000);

    renderer.render(scene, camera);

    requestAnimationFrame(animate);
  };
  requestAnimationFrame(animate);
};
PhysicsLoader("/lib/ammo/kripken", () => MainScene());
