
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

    // Placeholder (Made visible)
    const geo = new THREE.BoxGeometry(2, 2, 2); // Big cube
    const mat = new THREE.MeshBasicMaterial({ color: 0x333333, wireframe: true });
    const placeholder = new THREE.Mesh(geo, mat);
    scene.add(placeholder);

    // Initial Loading Text
    const loadingDiv = document.createElement('div');
    loadingDiv.id = 'jersey-loading';
    loadingDiv.style.position = 'absolute';
    loadingDiv.style.top = '50%';
    loadingDiv.style.left = '50%';
    loadingDiv.style.transform = 'translate(-50%, -50%)';
    loadingDiv.style.color = 'white';
    loadingDiv.style.fontFamily = 'sans-serif';
    loadingDiv.innerText = 'LOADING 3D MODEL...';
    container.appendChild(loadingDiv);

    let model;

    loader.load(
        'assets/3d/bk.glb',
        (gltf) => {
            model = gltf.scene;
            scene.remove(placeholder);
            if (document.getElementById('jersey-loading')) document.getElementById('jersey-loading').remove();

            // Auto-scale logic
            const box = new THREE.Box3().setFromObject(model);
            const size = box.getSize(new THREE.Vector3());
            const center = box.getCenter(new THREE.Vector3());

            // Zero centering
            model.position.x += (model.position.x - center.x);
            model.position.y += (model.position.y - center.y);
            model.position.z += (model.position.z - center.z);

            // Scale Adjustment
            const maxDim = Math.max(size.x, size.y, size.z);
            const scaleFactor = 4.2 / maxDim; // HUGE scale
            model.scale.set(scaleFactor, scaleFactor, scaleFactor);

            // Position Adjustment
            model.position.x = 0;
            model.position.y = -0.6; // Moved up slightly from -0.8

            scene.add(model);
            console.log("Jersey Loaded Correctly");
        },
        (xhr) => {
            // loading progress
        },
        (error) => {
            console.error('An error occurred:', error);

            // Smarter Error Handling
            const isFileProtocol = window.location.protocol === 'file:';

            const errorDiv = document.createElement('div');
            errorDiv.style.position = 'absolute';
            errorDiv.style.top = '50%';
            errorDiv.style.left = '50%';
            errorDiv.style.transform = 'translate(-50%, -50%)';
            errorDiv.style.color = 'red';
            errorDiv.style.textAlign = 'center';
            errorDiv.style.background = 'rgba(0,0,0,0.9)';
            errorDiv.style.padding = '30px';
            errorDiv.style.borderRadius = '10px';
            errorDiv.style.zIndex = '100';
            errorDiv.style.maxWidth = '80%';

            if (isFileProtocol) {
                // User opened index.html directly
                errorDiv.innerHTML = `
                    <h2 style="margin-top:0; color: #ff4444;">⚠️ SETUP REQUIRED</h2>
                    <p style="color: white; font-size: 1.1em;">You are strictly <b>NOT</b> allowed to open this file directly.</p>
                    <div style="background: #222; padding: 15px; margin: 15px 0; border: 1px solid #444; text-align: left;">
                        <strong style="color: yellow;">THE FIX:</strong><br>
                        1. Go to your folder.<br>
                        2. Double-click <b>start_server.bat</b>.<br>
                        3. Go to <a href="http://localhost:8000" style="color: cyan;">http://localhost:8000</a>
                    </div>
                `;
            } else {
                // User is on server but file failed
                errorDiv.innerHTML = `
                    <h2 style="margin-top:0; color: orange;">⚠️ LOADING ERROR</h2>
                    <p style="color: white;">The 3D Model could not be found.</p>
                    <p style="font-family: monospace; color: #888;">${error.message || 'Unknown Error'}</p>
                `;
            }

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
