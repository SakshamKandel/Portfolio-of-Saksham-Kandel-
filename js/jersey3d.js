
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('jersey-3d-container');

if (container) {
    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera - Pulled back for better full view
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 7); // Zoomed out for full fit

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 3);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 4);
    dirLight.position.set(2, 2, 5);
    scene.add(dirLight);

    // Rim lights
    const purpleLight = new THREE.PointLight(0xaa00ff, 5);
    purpleLight.position.set(-5, 0, -5);
    scene.add(purpleLight);

    // 5. Loading Manager & Loader
    const loadingManager = new THREE.LoadingManager();
    const loader = new GLTFLoader(loadingManager);

    // Placeholder
    const geo = new THREE.BoxGeometry(0.01, 0.01, 0.01);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const placeholder = new THREE.Mesh(geo, mat);
    scene.add(placeholder);

    let model;

    loader.load(
        'assets/3d/bk.glb',
        (gltf) => {
            model = gltf.scene;
            requestAnimationFrame(animate);

            if (model) {
                model.rotation.y += 0.003; // Simple spin
            } else {
                placeholder.rotation.x += 0.05;
            }

            renderer.render(scene, camera);
        }
    animate();

    // 7. Resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}
