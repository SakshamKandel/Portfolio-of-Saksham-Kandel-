
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('jersey-3d-container');

if (container) {
    container.innerHTML = '';

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 10.0);

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Group for Pivoting
    // We add the model here, but we center the model relative to this group.
    // We move the GROUP for layout, so rotating the group will spin in place.
    const jerseyGroup = new THREE.Group();
    scene.add(jerseyGroup);

    // 5. Controls
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false;
    controls.enablePan = false;
    controls.autoRotate = true;
    controls.autoRotateSpeed = 2.0;

    // 6. Lighting
    const ambientLight = new THREE.AmbientLight(0xffffff, 3);
    scene.add(ambientLight);
    const hemiLight = new THREE.HemisphereLight(0xffffff, 0x444444, 3);
    hemiLight.position.set(0, 20, 0);
    scene.add(hemiLight);
    const dirLight = new THREE.DirectionalLight(0xffffff, 4);
    dirLight.position.set(2, 2, 5);
    scene.add(dirLight);
    const purpleLight = new THREE.PointLight(0xaa00ff, 5);
    purpleLight.position.set(-5, 0, -5);
    scene.add(purpleLight);

    // 7. Loader
    const loadingManager = new THREE.LoadingManager();
    const loader = new GLTFLoader(loadingManager);

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

            // Correct Centering inside Group
            const box = new THREE.Box3().setFromObject(model);
            const center = box.getCenter(new THREE.Vector3());

            // Move model so its center is at (0,0,0) of the Group
            // This fixes the "rotating from sleeves" issue
            model.position.sub(center);

            jerseyGroup.add(model);

            updateModelResponsiveState();
        },
        undefined,
        (error) => {
            console.error(error);
            const errorDiv = document.createElement('div');
            // Check if styles exist, otherwise inline defaults
            errorDiv.style.position = 'absolute';
            errorDiv.style.top = '50%';
            errorDiv.style.left = '50%';
            errorDiv.style.transform = 'translate(-50%, -50%)';
            errorDiv.innerHTML = `<h3 style="color:red">3D Error</h3>`;
            container.appendChild(errorDiv);
        }
    );

    function animate() {
        requestAnimationFrame(animate);
        controls.update();

        // No manual rotation of model needed if using OrbitControls autoRotate,
        // BUT controls rotates the camera.
        // If we want the object to spin in place, we can rotate the group.
        // If we use controls.autoRotate, the camera orbits the target.

        if (!model) placeholder.rotation.x += 0.05;
        renderer.render(scene, camera);
    }
    animate();

    function updateModelResponsiveState() {
        if (!model) return;

        const isMobile = window.innerWidth < 768;

        // FIX: Calculate box from the MODEL (which scale is 1), not the group (which is scaled)
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        if (isMobile) {
            // Mobile
            const scaleFactor = 5.5 / maxDim; // Bigger for mobile
            jerseyGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
            // Center roughly
            jerseyGroup.position.set(0, 0.0, 0); // Moved up to valid overlap

            // Controls should target the group position so we orbit the jersey
            controls.target.set(0, 0.0, 0);
        } else {
            // Desktop
            const scaleFactor = 7.0 / maxDim;
            jerseyGroup.scale.set(scaleFactor, scaleFactor, scaleFactor);
            // Move Right
            jerseyGroup.position.set(1.0, -3.0, 0);

            // Controls should target the group position
            controls.target.set(1.0, -3.0, 0);
        }
    }

    window.addEventListener('resize', () => {
        camera.aspect = container.clientWidth / container.clientHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(container.clientWidth, container.clientHeight);
        updateModelResponsiveState();
    });

    window.updateJerseyResponsive = updateModelResponsiveState;
}
