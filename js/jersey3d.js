
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';
import { OrbitControls } from 'three/addons/controls/OrbitControls.js';

const container = document.getElementById('jersey-3d-container');

if (container) {
    // Clear the "Run Server" message since JS is running
    container.innerHTML = '';

    // 1. Scene
    const scene = new THREE.Scene();

    // 2. Camera - Neutral Eye Level
    const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
    camera.position.set(0, 0, 10.0); // Moved back for large scale

    // 3. Renderer
    const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
    renderer.setSize(container.clientWidth, container.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    container.appendChild(renderer.domElement);

    // 4. Controls (Manual Rotation)
    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.dampingFactor = 0.05;
    controls.enableZoom = false; // Disable zoom to keep layout stable
    controls.enablePan = false;  // Disable pan to keep centered
    controls.autoRotate = true;  // Keep auto-rotation
    controls.autoRotateSpeed = 2.0;

    // 5. Lighting
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

    // 6. Loading Manager & Loader
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
            scene.remove(placeholder);

            // Calculate Bounding Box
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            // Center Model at Origin
            model.position.x += (model.position.x - center.x);
            model.position.y += (model.position.y - center.y);
            model.position.z += (model.position.z - center.z);

            scene.add(model);

            // Apply responsive Layout immediately
            updateModelResponsiveState();
        },
        (xhr) => {
            // progress
        },
        (error) => {
            console.error('An error occurred:', error);
            // Error Message (fallback)
            const errorDiv = document.createElement('div');
            // ... (keep existing error handling if needed, but HTML handles it mostly now)
        }
    );

    // 7. Resize & Responsive Logic
    function updateModelResponsiveState() {
        if (!model) return;

        const isMobile = window.innerWidth < 768;

        // Recalculate generic scale base
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const maxDim = Math.max(size.x, size.y, size.z);

        if (isMobile) {
            // Mobile: Larger scale for visibility, centered
            // Previously 3.5, increasing to 5.0 for better mobile impact
            const scaleFactor = 5.0 / maxDim;
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);
            model.position.x = 0;
            model.position.y = -1.0; // Centered but slightly lower
        } else {
            // Desktop: Massive scale (7.0), offset right and down
            const scaleFactor = 7.0 / maxDim;
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);
            model.position.x = 1.0;
            model.position.y = -3.0;
        }
    }

    // 8. Animation
    function animate() {
        requestAnimationFrame(animate);

        controls.update(); // Update controls (damping, auto-rotate)

        if (!model) {
            placeholder.rotation.x += 0.05;
        }

        renderer.render(scene, camera);
    }
    animate();

    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);

        // Update model specific sizing
        updateModelResponsiveState();
    });

    window.updateJerseyResponsive = updateModelResponsiveState;
}
const scene = new THREE.Scene();

// 2. Camera - Neutral Eye Level
const camera = new THREE.PerspectiveCamera(45, container.clientWidth / container.clientHeight, 0.1, 1000);
camera.position.set(0, 0, 10.0); // Moved back further to fit large jersey

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
        scene.remove(placeholder);

        // Calculate Bounding Box
        const box = new THREE.Box3().setFromObject(model);
        const size = box.getSize(new THREE.Vector3());
        const center = box.getCenter(new THREE.Vector3());

        // Center Model at Origin
        model.position.x += (model.position.x - center.x);
        model.position.y += (model.position.y - center.y);
        model.position.z += (model.position.z - center.z);

        // Robust Auto-Scaling
        const maxDim = Math.max(size.x, size.y, size.z);
        let scaleFactor = 7.0 / maxDim;

        // Safety check for bad bounding box
        if (!isFinite(scaleFactor) || scaleFactor === 0) {
            scaleFactor = 1.0;
        }
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);

        // Positioning for Left Column
        model.position.x = 1.0; // Moved Right
        model.position.y = -3.0; // Moved down 30% more to fix overlap

        scene.add(model);

        // Apply responsive Layout
        if (window.updateJerseyResponsive) {
            window.updateJerseyResponsive();
        } else {
            console.log("Responsive handler not ready yet");
        }
    },
    (xhr) => {
        // progress
    },
    (error) => {
        console.error('An error occurred:', error);
        // Error Message
        const errorDiv = document.createElement('div');
        errorDiv.style.position = 'absolute';
        errorDiv.style.top = '50%';
        errorDiv.style.left = '50%';
        errorDiv.style.transform = 'translate(-50%, -50%)';
        errorDiv.style.color = 'red';
        errorDiv.style.textAlign = 'center';
        errorDiv.style.background = 'rgba(0,0,0,0.8)';
        errorDiv.style.padding = '20px';
        errorDiv.style.zIndex = '100';
        errorDiv.innerHTML = `
                <h3 style="margin-top:0">⚠️ 3D Model Blocked by Browser</h3>
                <p>Browsers do not allow 3D files to load directly from your computer for security.</p>
                <div style="background: #333; padding: 10px; margin: 10px 0; border-radius: 5px; text-align: left;">
                    <strong>The Solution:</strong><br>
                    1. Open the folder <code>Code</code> on your computer.<br>
                    2. Double-click the file named <strong>start_server.bat</strong>.<br>
                    3. A black window will open. Leave it open.<br>
                    4. Go to <a href="http://localhost:8000" style="color: cyan;">http://localhost:8000</a>
                </div>
            `;
        container.appendChild(errorDiv);
    }
);

// 6. Animation
function animate() {
    requestAnimationFrame(animate);

    if (model) {
        model.rotation.y += 0.003; // Simple spin
    } else {
        placeholder.rotation.x += 0.05;
    }

    renderer.render(scene, camera);
}
animate();

// 7. Resize & Responsive Logic
function updateModelResponsiveState() {
    if (!model) return;

    const isMobile = window.innerWidth < 768;

    // Recalculate generic scale base (to avoid accumulating math errors)
    const box = new THREE.Box3().setFromObject(model);
    const size = box.getSize(new THREE.Vector3());
    const maxDim = Math.max(size.x, size.y, size.z);

    if (isMobile) {
        // Mobile: Smaller scale to fit width, centered
        const scaleFactor = 3.5 / maxDim;
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);
        model.position.x = 0;
        model.position.y = -0.5;
    } else {
        // Desktop: Massive scale (7.0), offset right and down
        const scaleFactor = 7.0 / maxDim;
        model.scale.set(scaleFactor, scaleFactor, scaleFactor);
        model.position.x = 1.0;
        model.position.y = -3.0;
    }
}

window.addEventListener('resize', () => {
    const width = container.clientWidth;
    const height = container.clientHeight;

    camera.aspect = width / height;
    camera.updateProjectionMatrix();
    renderer.setSize(width, height);

    // Update model specific sizing
    updateModelResponsiveState();
});

// Also call continuously or on load, but we call it once model loads below
// We expose it to be called from the loader callback
window.updateJerseyResponsive = updateModelResponsiveState;
}
