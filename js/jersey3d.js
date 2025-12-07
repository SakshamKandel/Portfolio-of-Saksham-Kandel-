
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

    // Lights
    const ambientLight = new THREE.AmbientLight(0xffffff, 1.5); // Soft white light
    scene.add(ambientLight);

    const directionalLight = new THREE.DirectionalLight(0xffffff, 2);
    directionalLight.position.set(2, 2, 5);
    scene.add(directionalLight);

    const rimLight = new THREE.PointLight(0x00FFFF, 3); // Cyan rim light (Yaks theme)
    rimLight.position.set(-5, 0, -5);
    scene.add(rimLight);

    const goldLight = new THREE.PointLight(0xFFD700, 2); // Gold rim light (Kings theme)
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
            // Logic: if it's too big, scale down. Target ~3 units height
            const maxDim = Math.max(size.x, size.y, size.z);
            const scale = 3.5 / maxDim; // Adjust 3.5 for size preference
            model.scale.set(scale, scale, scale);

            // Initial Position - Centered since it's in its own section now
            model.position.x = 0;
            model.position.y = -0.5;

            // if (window.innerWidth > 768) {
            //      model.position.x = 1.5; // Offset right on desktop
            // } else {
            //      model.position.x = 0;   // Center on mobile
            //      model.position.y = -0.5; // Lower slightly
            // }

            scene.add(model);
            console.log("3D Model Loaded!");
        },
        undefined,
        (error) => {
            console.error('An error occurred loading the 3D model:', error);
        }
    );

    // Animation Loop
    let targetRotation = 0;

    function animate() {
        requestAnimationFrame(animate);

        // Smooth Rotation Logic
        if (model) {
            // Base rotation (idle)
            model.rotation.y += 0.002;

            // Scroll influence
            const scrollPercent = window.scrollY / (document.body.scrollHeight - window.innerHeight);

            // We want it to spin faster or to a specific angle based on scroll ?
            // Let's make it rotate based on scroll

            // Example: Rotate 360 degrees (2*PI) over the length of the page
            // Or just add scroll delta. Let's try direct mapping + idle spin

            // Override idle spin with scroll control?
            // Let's do: Position = Scroll * Factor
            model.rotation.y = scrollPercent * Math.PI * 4 + 0.5; // 2 full spins over page
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
