
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('jersey-3d-container');

if (container) {
    // Scene Setup
    const scene = new THREE.Scene();

    // Camera
    const camera = new THREE.PerspectiveCamera(45, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    camera.position.y = 0;
    camera.position.x = 0;

    // Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(window.innerWidth, window.innerHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Cap pixel ratio for performance
    container.appendChild(renderer.domElement);

    // Lights - Increased Intensity for Better Visibility
    const ambientLight = new THREE.AmbientLight(0xffffff, 2.5);
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 4);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);

    const rimLight = new THREE.PointLight(0x00FFFF, 5);
    rimLight.position.set(-5, 0, -5);
    scene.add(rimLight);

    const goldLight = new THREE.PointLight(0xFFD700, 5);
    goldLight.position.set(5, 0, -5);
    scene.add(goldLight);


    // Model Loading
    let model;
    const loader = new GLTFLoader();

    loader.load(
        'assets/3d/bk.glb',
        (gltf) => {
            model = gltf.scene;

            // Auto-center and scale
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());
            const size = box.getSize(new THREE.Vector3());

            // Reset position to center
            model.position.x += (model.position.x - center.x);
            model.position.y += (model.position.y - center.y);
            model.position.z += (model.position.z - center.z);

            // Scale to fit nice on screen
            const maxDim = Math.max(size.x, size.y, size.z);
            let scaleFactor = 4.0 / maxDim;
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);

            // Centered Position
            model.position.x = 0;
            model.position.y = -0.5;

            scene.add(model);
            console.log("3D Model Loaded Successfully!");
        },
        undefined,
        (error) => {
            console.error('An error occurred loading the 3D model:', error);
        }
    );

    // Animation Loop
    function animate() {
        requestAnimationFrame(animate);

        // Smooth Rotation Logic
        if (model) {
            // Base rotation (idle)
            model.rotation.y += 0.002;

            // Scroll influence - only when visible in viewport ideally, but global scroll works for now
            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);

            // Interaction: Spin based on scroll
            model.rotation.y = scrollPercent * Math.PI * 4 + 0.5;
        }

        renderer.render(scene, camera);
    }

    animate();


    // Handle Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);

        if (model) {
            model.position.x = 0;
            model.position.y = -0.5;
        }
    });
}
