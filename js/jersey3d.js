
import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

const container = document.getElementById('jersey-3d-container');

if (container) {
    // Clear the "Run Server" message since JS is running
    container.innerHTML = '';

    // 1. Scene
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
            let scaleFactor = 3.5 / maxDim;

            // Safety check for bad bounding box
            if (!isFinite(scaleFactor) || scaleFactor === 0) {
                scaleFactor = 1.0;
            }
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);

            // Positioning for Left Column
            model.position.x = 0;
            model.position.y = -0.3; // Slightly lower than center

            scene.add(model);
            console.log("Jersey Loaded & Added. Scale:", scaleFactor);
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

    // 7. Resize
    window.addEventListener('resize', () => {
        const width = container.clientWidth;
        const height = container.clientHeight;

        camera.aspect = width / height;
        camera.updateProjectionMatrix();
        renderer.setSize(width, height);
    });
}
