import * as THREE from 'three';

export interface PreviewScene {
  renderer: THREE.WebGLRenderer;
  scene: THREE.Scene;
  camera: THREE.PerspectiveCamera;
  dispose: () => void;
}

export function createPreviewScene(canvas: HTMLCanvasElement): PreviewScene {
  const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: 'high-performance' });
  renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 1.75));
  renderer.setSize(canvas.clientWidth || window.innerWidth, canvas.clientHeight || window.innerHeight, false);
  renderer.shadowMap.enabled = true;
  renderer.shadowMap.type = THREE.PCFSoftShadowMap;

  const scene = new THREE.Scene();
  scene.background = new THREE.Color('#a9c7d7');
  scene.fog = new THREE.Fog('#a9c7d7', 42, 180);

  const camera = new THREE.PerspectiveCamera(58, 1, 0.1, 350);
  camera.position.set(0, 5.2, 10.5);
  camera.lookAt(0, 0.8, -5);

  const hemi = new THREE.HemisphereLight('#e8f4ff', '#33402f', 2.1);
  scene.add(hemi);
  const sun = new THREE.DirectionalLight('#fff1d5', 2.8);
  sun.position.set(-8, 15, 6);
  sun.castShadow = true;
  sun.shadow.mapSize.set(1024, 1024);
  scene.add(sun);

  const ground = new THREE.Mesh(new THREE.PlaneGeometry(220, 220), new THREE.MeshStandardMaterial({ color: '#53634d', roughness: 1 }));
  ground.rotation.x = -Math.PI / 2;
  ground.position.y = -0.06;
  ground.receiveShadow = true;
  scene.add(ground);

  const road = new THREE.Mesh(new THREE.PlaneGeometry(10, 180), new THREE.MeshStandardMaterial({ color: '#252a31', roughness: 0.95 }));
  road.rotation.x = -Math.PI / 2;
  road.position.y = 0;
  road.receiveShadow = true;
  scene.add(road);

  const lineMaterial = new THREE.MeshBasicMaterial({ color: '#e6e3d4' });
  for (let z = -85; z < 90; z += 10) {
    const dash = new THREE.Mesh(new THREE.PlaneGeometry(0.16, 4.5), lineMaterial);
    dash.rotation.x = -Math.PI / 2;
    dash.position.set(0, 0.012, z);
    scene.add(dash);
  }

  const car = new THREE.Group();
  const body = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.58, 3.9), new THREE.MeshStandardMaterial({ color: '#c7d2dc', metalness: 0.62, roughness: 0.28 }));
  body.position.y = 0.78;
  body.castShadow = true;
  car.add(body);
  const cabin = new THREE.Mesh(new THREE.BoxGeometry(1.55, 0.62, 1.8), new THREE.MeshStandardMaterial({ color: '#263743', metalness: 0.25, roughness: 0.2 }));
  cabin.position.set(0, 1.34, -0.18);
  cabin.castShadow = true;
  car.add(cabin);
  const wheelMaterial = new THREE.MeshStandardMaterial({ color: '#111418', roughness: 0.85 });
  for (const x of [-0.98, 0.98]) for (const z of [-1.22, 1.22]) {
    const wheel = new THREE.Mesh(new THREE.CylinderGeometry(0.37, 0.37, 0.22, 20), wheelMaterial);
    wheel.rotation.z = Math.PI / 2;
    wheel.position.set(x, 0.38, z);
    wheel.castShadow = true;
    car.add(wheel);
  }
  car.position.set(0, 0, 2.2);
  scene.add(car);

  const resize = () => {
    const width = Math.max(1, canvas.clientWidth || window.innerWidth);
    const height = Math.max(1, canvas.clientHeight || window.innerHeight);
    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height, false);
  };
  window.addEventListener('resize', resize);
  resize();
  renderer.render(scene, camera);

  return {
    renderer, scene, camera,
    dispose: () => {
      window.removeEventListener('resize', resize);
      scene.traverse((object) => {
        if (object instanceof THREE.Mesh) {
          object.geometry.dispose();
          const materials = Array.isArray(object.material) ? object.material : [object.material];
          materials.forEach((material) => material.dispose());
        }
      });
      renderer.dispose();
    },
  };
}
