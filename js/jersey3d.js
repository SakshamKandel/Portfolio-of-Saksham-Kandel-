
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('jersey-3d-container');

if (container) {
    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 5); // Start back

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Lighting (Overkill to ensure visibility)
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);

    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 3);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);

    const dirLight = new THREE.DirectionalLight(0xffffff, 4);
    dirLight.position.set(2, 2, 5);
    scene.add(dirLight);

    // Rim lights for cool effect
    const purpleLight = new THREE.PointLight(0xaa00ff, 5);
    purpleLight.position.set(-5, 0, -5);
    scene.add(purpleLight);

    // 5. Loading Manager & Loader
    const loadingManager = new THREE.LoadingManager();
    const loader = new GLTFLoader(loadingManager);

    // Placeholder until model loads (Invisible box just to test scene works)
    const geo = new THREE.BoxGeometry(0.01, 0.01, 0.01);
    const mat = new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true });
    const placeholder = new THREE.Mesh(geo, mat);
    scene.add(placeholder);

    let model;

    loader.load(
        'assets/3d/bk.glb',
        (gltf) => {
            model = gltf.scene;
            scene.remove(placeholder);

            // Auto-scale to Fit
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            // Center model
            model.position.x += (model.position.x - center.x);
            model.position.y += (model.position.y - center.y);
            model.position.z += (model.position.z - center.z);

            // Logic: Make longest side = 3.5 units
            const maxDim = Math.max(size.x, size.y, size.z);
            const scaleFactor = 3.5 / maxDim;
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);

            // Final manual adjustment
            model.position.y = -0.3; // Sits slightly lower

            scene.add(model);
            console.log("Jersey Loaded", scaleFactor);
        },
        (xhr) => {
            console.log((xhr.loaded / xhr.total * 100) + '% loaded');
        },
        (error) => {
            console.error('An error occurred:', error);
            // Add a red error cube if it fails
            const errorGeo = new THREE.BoxGeometry(1, 1, 1);
            const errorMat = new THREE.MeshBasicMaterial({ color: 0xff0000 });
            const errorMesh = new THREE.Mesh(errorGeo, errorMat);
            scene.add(errorMesh);
        }
    );

    // 6. Animation
    function animate() {
        requestAnimationFrame(animate);

        if (model) {
            // Idle Spin
            model.rotation.y += 0.003;

            // Scroll Interaction (optional, keeping it simple for now to ensure visibility first)
            // const scrollY = window.scrollY;
            // model.rotation.y = scrollY * 0.002; 
        } else {
            placeholder.rotation.x += 0.05;
            placeholder.rotation.y += 0.05;
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
