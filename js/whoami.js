import * as THREE from 'three';
import { GLTFLoader } from 'three/addons/loaders/GLTFLoader.js';

/* ═══════════════════════════════════════════════════════════════
   WHOAMI — AAA Cinematic Train Journey (Daylight / Overcast)
   Three.js + GSAP intro scene for the portfolio "Who Am I" tab
   
   High Fidelity Refinements:
     1. Track scroll loop length computed after scaling (fixes drift/stutter)
     2. Mountain landscape shifted to x = -130 (stops carriage clipping)
     3. Ground base plane lowered to y = -0.25 (stops Z-fighting with sleepers)
     4. Initial camera angled downwards along the tracks to highlight motion
     5. Organic clear-glass cursive name drawing on foggy window
   ═══════════════════════════════════════════════════════════════ */

(() => {
    'use strict';

    /* ── DOM references ── */
    const panel      = document.querySelector('[data-browser-panel="whoami"]');
    const container  = document.getElementById('whoami-canvas-container');
    const canvas     = document.getElementById('whoami-canvas');
    const loadingEl  = document.getElementById('whoami-loading');
    const skipBtn    = document.getElementById('whoami-skip');
    const replayBtn  = document.getElementById('whoami-replay');
    const nameReveal = document.getElementById('whoami-name-reveal');

    if (!panel || !container || !canvas) return;

    /* ── Constants ── */
    const TRAIN_SPEED   = 4.5;
    const RAIN_COUNT    = 1800; // Optimized for performance
    
    /* Model Paths */
    const PATH_TRAIN     = 'public/models/bombardier_s_train_carriage_-_london_underground.glb';
    const PATH_TRACKS    = 'public/models/modular_railway_section_part.2_derivative.glb';
    const PATH_MOUNTAINS = 'public/models/rugged_mountain_landscape.glb';

    /* ── Mutable state ── */
    let scene, camera, renderer, clock;
    let isInitialized = false;
    let frameId       = null;
    let timeline      = null;
    let rainGeo       = null;
    
    /* Track scrolling state */
    const trackSections = [];
    let trackLength = 20; // Calculated dynamically on load
    
    /* Mountain scrolling state */
    let mountainMesh = null;
    let mountainSpeed = 0.04;

    /* Character Arm Joints */
    let armGroup, upperArm, lowerArm;

    /* Window Drawing & Rain Droplets Canvas */
    let windowCanvas, windowCtx, windowTexture;
    let windowMesh;
    const drawnPoints = [];
    const windowDroplets = [];
    let nameDrawProgress = { val: 0 };
    const nameString = 'avula jeevan yadav'; // Lowercase for handwritten feel

    /* Camera proxy — GSAP tweens these values, render loop reads them */
    const cam = {
        px: 2.6,  py: 0.28, pz: -5.0,
        lx: 0.4,  ly: -0.1, lz: -1.0,
        fov: 52
    };

    /* ═══════════════════════════════════
       SCENE, RENDERER, CLOCK
       ═══════════════════════════════════ */
    function setupScene() {
        scene = new THREE.Scene();
        
        /* Overcast rainy day background and fog (moody slate-blue grey) */
        scene.background = new THREE.Color(0x4a5568);
        scene.fog = new THREE.FogExp2(0x4a5568, 0.022);

        camera = new THREE.PerspectiveCamera(
            cam.fov,
            container.clientWidth / Math.max(container.clientHeight, 1),
            0.05,
            250
        );

        renderer = new THREE.WebGLRenderer({ canvas, antialias: true, powerPreference: "high-performance" });
        renderer.setPixelRatio(Math.min(window.devicePixelRatio, 1.25));
        renderer.setSize(container.clientWidth, container.clientHeight);
        
        renderer.shadowMap.enabled = true;
        renderer.shadowMap.type = THREE.PCFSoftShadowMap;
        renderer.toneMapping = THREE.ACESFilmicToneMapping;
        renderer.toneMappingExposure = 0.9;

        clock = new THREE.Clock();
    }

    /* ═══════════════════════════════════
       LIGHTING (Daytime Overcast)
       ═══════════════════════════════════ */
    function addLighting() {
        /* Soft, bright daylight from the sky */
        const sun = new THREE.DirectionalLight(0xaabbdd, 3.2);
        sun.position.set(-30, 45, -10);
        sun.castShadow = false;
        scene.add(sun);

        /* Soft global fill */
        scene.add(new THREE.AmbientLight(0x7a8ba8, 0.75));

        /* Cozy interior carriage lights */
        const positions = [-4, -1.5, 1, 3.5];
        positions.forEach(z => {
            const warm = new THREE.PointLight(0xff8833, 1.0, 7, 2);
            warm.position.set(0, 1.7, z);
            warm.castShadow = true;
            warm.shadow.bias = -0.0015;
            scene.add(warm);
        });

        /* Soft rim highlight from the left windows */
        const rimL = new THREE.PointLight(0x5577cc, 0.5, 7, 1.5);
        rimL.position.set(-1.8, 1.3, 1);
        scene.add(rimL);
    }

    /* ═══════════════════════════════════
       RAIN SYSTEM
       ═══════════════════════════════════ */
    function buildRain() {
        const positions = new Float32Array(RAIN_COUNT * 3);

        for (let i = 0; i < RAIN_COUNT; i++) {
            const i3 = i * 3;
            positions[i3]     = (Math.random() - 0.5) * 40;
            positions[i3 + 1] = Math.random() * 18;
            positions[i3 + 2] = (Math.random() - 0.5) * 60;
        }

        rainGeo = new THREE.BufferGeometry();
        rainGeo.setAttribute('position', new THREE.BufferAttribute(positions, 3));

        const mat = new THREE.PointsMaterial({
            color: 0x99aacc,
            size: 0.05,
            transparent: true,
            opacity: 0.35,
            sizeAttenuation: true,
            depthWrite: false
        });

        scene.add(new THREE.Points(rainGeo, mat));
    }

    /* ═══════════════════════════════════
       DYNAMIC DRAWING WINDOW CANVAS & RAIN
       ═══════════════════════════════════ */
    function buildDrawingWindow() {
        windowCanvas = document.createElement('canvas');
        windowCanvas.width = 1024;
        windowCanvas.height = 512;
        windowCtx = windowCanvas.getContext('2d');

        windowTexture = new THREE.CanvasTexture(windowCanvas);

        /* 2:1 aspect ratio geometry to match canvas and prevent stretching */
        const windowGeo = new THREE.PlaneGeometry(1.7, 0.85);
        
        const windowMat = new THREE.MeshStandardMaterial({
            color: 0xffffff,
            transparent: true,
            opacity: 0.85,
            roughness: 0.15,
            metalness: 0.1,
            alphaMap: windowTexture,
            map: windowTexture,
            side: THREE.DoubleSide
        });

        windowMesh = new THREE.Mesh(windowGeo, windowMat);
        windowMesh.rotation.y = Math.PI / 2;
        windowMesh.position.set(-0.99, 1.25, 0.95);
        scene.add(windowMesh);

        /* Initialize sliding rain droplets on window */
        for (let i = 0; i < 50; i++) {
            windowDroplets.push({
                x: Math.random() * windowCanvas.width,
                y: Math.random() * windowCanvas.height,
                speed: 1.2 + Math.random() * 2.8,
                size: 1 + Math.random() * 2.5,
                trail: []
            });
        }

        drawWindowBackground(0);
    }

    function isPointWiped(x, y) {
        if (drawnPoints.length === 0) return false;
        
        for (let i = 0; i < drawnPoints.length; i++) {
            const pt = drawnPoints[i];
            const dx = pt.x - x;
            const dy = pt.y - y;
            if (dx * dx + dy * dy < 256) { // 16px radius wipe area
                return true;
            }
        }
        return false;
    }

    function updateWindowDroplets() {
        const w = windowCanvas.width;
        const h = windowCanvas.height;

        windowDroplets.forEach(d => {
            d.y += d.speed;
            
            d.trail.push({ x: d.x, y: d.y });
            if (d.trail.length > 7) d.trail.shift();

            if (d.y > h) {
                d.x = Math.random() * w;
                d.y = -10;
                d.speed = 1.2 + Math.random() * 2.8;
                d.trail = [];
            }
        });
    }

    function drawWindowBackground(wipeProgress = 0) {
        if (!windowCtx) return;
        const w = windowCanvas.width;
        const h = windowCanvas.height;

        windowCtx.clearRect(0, 0, w, h);

        /* 1. Translucent misty condensation fog layer */
        windowCtx.fillStyle = 'rgba(215, 222, 238, 0.65)'; // Soft white condensation
        windowCtx.fillRect(0, 0, w, h);

        /* 2. Draw sliding rain water droplets */
        windowCtx.fillStyle = 'rgba(255, 255, 255, 0.75)';
        windowDroplets.forEach(d => {
            if (isPointWiped(d.x, d.y)) return;

            windowCtx.beginPath();
            windowCtx.arc(d.x, d.y, d.size, 0, Math.PI * 2);
            windowCtx.fill();

            if (d.trail.length > 1) {
                windowCtx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
                windowCtx.lineWidth = d.size * 0.6;
                windowCtx.beginPath();
                windowCtx.moveTo(d.trail[0].x, d.trail[0].y);
                for (let i = 1; i < d.trail.length; i++) {
                    windowCtx.lineTo(d.trail[i].x, d.trail[i].y);
                }
                windowCtx.stroke();
            }
        });

        /* 3. Draw wiped path - First pass: draw a soft wet outline (water refraction glow) */
        windowCtx.globalCompositeOperation = 'source-over';
        
        // Draw outline of the traced points (finger path)
        if (drawnPoints.length > 1) {
            windowCtx.strokeStyle = 'rgba(255, 255, 255, 0.35)'; // Wet shine border
            windowCtx.lineWidth = 26;
            windowCtx.lineCap = 'round';
            windowCtx.lineJoin = 'round';
            windowCtx.beginPath();
            windowCtx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
            for (let i = 1; i < drawnPoints.length; i++) {
                windowCtx.lineTo(drawnPoints[i].x, drawnPoints[i].y);
            }
            windowCtx.stroke();
        }

        // Draw outline of the letters (name string)
        const charsToDraw = Math.floor(nameString.length * wipeProgress);
        const namePart = nameString.substring(0, charsToDraw);
        
        if (namePart.length > 0) {
            windowCtx.font = 'italic bold 72px "Comic Sans MS", "Arial", sans-serif'; // Organic cursive
            windowCtx.textAlign = 'center';
            windowCtx.textBaseline = 'middle';
            
            // Draw a wet white outline to represent water droplets on the letter boundaries
            windowCtx.strokeStyle = 'rgba(255, 255, 255, 0.45)';
            windowCtx.lineWidth = 26;
            windowCtx.strokeText(namePart, w / 2, h / 2);
        }

        /* 4. Draw wiped path - Second pass: erase center to reveal CLEAR glass! */
        windowCtx.globalCompositeOperation = 'destination-out';

        // Erase finger path
        if (drawnPoints.length > 1) {
            windowCtx.lineWidth = 18; // Smaller than wet outline
            windowCtx.lineCap = 'round';
            windowCtx.lineJoin = 'round';
            windowCtx.beginPath();
            windowCtx.moveTo(drawnPoints[0].x, drawnPoints[0].y);
            for (let i = 1; i < drawnPoints.length; i++) {
                windowCtx.lineTo(drawnPoints[i].x, drawnPoints[i].y);
            }
            windowCtx.stroke();
        }

        // Erase letters
        if (namePart.length > 0) {
            windowCtx.lineWidth = 18;
            windowCtx.strokeText(namePart, w / 2, h / 2);
            windowCtx.fillText(namePart, w / 2, h / 2);
        }

        /* Reset blending */
        windowCtx.globalCompositeOperation = 'source-over';

        /* 5. Glistening droplets inside clear areas (representing moisture that runs down) */
        windowCtx.fillStyle = 'rgba(255, 255, 255, 0.9)';
        drawnPoints.forEach((pt, idx) => {
            if (idx % 12 === 0 && idx < drawnPoints.length * wipeProgress) {
                // Little droplets hanging from letters
                windowCtx.beginPath();
                windowCtx.arc(pt.x, pt.y + (idx % 3) * 1.5, 2 + (idx % 2), 0, Math.PI * 2);
                windowCtx.fill();
            }
        });

        windowTexture.needsUpdate = true;
    }

    /* ═══════════════════════════════════
       PASSENGER & DYNAMIC ARM MODEL
       ═══════════════════════════════════ */
    function buildCharacter() {
        const g    = new THREE.Group();
        const body = new THREE.MeshStandardMaterial({ color: 0x141424, roughness: 0.95 });
        const skin = new THREE.MeshStandardMaterial({ color: 0x937648, roughness: 0.75 });
        const hair = new THREE.MeshStandardMaterial({ color: 0x060606, roughness: 0.96 });

        const addMesh = (geo, mat, px, py, pz) => {
            const m = new THREE.Mesh(geo, mat);
            m.position.set(px, py, pz);
            g.add(m);
            return m;
        };

        /* Torso */
        addMesh(new THREE.BoxGeometry(0.36, 0.44, 0.24), body, 0, 0.22, 0);

        /* Shoulders */
        addMesh(new THREE.BoxGeometry(0.46, 0.09, 0.23), body, 0, 0.46, 0);

        /* Neck */
        addMesh(new THREE.CylinderGeometry(0.055, 0.065, 0.09, 8), skin, 0, 0.54, 0);

        /* Head */
        addMesh(new THREE.SphereGeometry(0.11, 16, 16), skin, 0, 0.65, 0);

        /* Hair */
        const hairMesh = new THREE.Mesh(new THREE.SphereGeometry(0.115, 16, 16), hair);
        hairMesh.scale.set(1.02, 0.9, 1.08);
        hairMesh.position.set(0, 0.68, -0.015);
        g.add(hairMesh);

        /* Right Arm (Resting) */
        addMesh(new THREE.BoxGeometry(0.09, 0.38, 0.1), body, 0.22, 0.2, 0);

        /* Left Segmented Arm (Active drawing arm) */
        armGroup = new THREE.Group();
        armGroup.position.set(-0.22, 0.38, 0); // Shoulder joint location

        upperArm = new THREE.Mesh(new THREE.BoxGeometry(0.08, 0.22, 0.08), body);
        upperArm.position.set(-0.04, -0.1, 0);
        armGroup.add(upperArm);

        lowerArm = new THREE.Group();
        lowerArm.position.set(-0.04, -0.2, 0); // Elbow joint location
        
        const forearm = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.22, 0.07), body);
        forearm.position.set(0, -0.1, 0);
        lowerArm.add(forearm);

        // Hand + pointing finger
        const hand = new THREE.Mesh(new THREE.SphereGeometry(0.04, 8, 8), skin);
        hand.position.set(0, -0.2, 0);
        lowerArm.add(hand);

        const finger = new THREE.Mesh(new THREE.CylinderGeometry(0.008, 0.01, 0.08, 8), skin);
        finger.position.set(0, -0.24, 0.03);
        finger.rotation.x = Math.PI / 3;
        lowerArm.add(finger);

        armGroup.add(lowerArm);
        g.add(armGroup);

        /* Upper legs */
        [-0.085, 0.085].forEach(x => {
            addMesh(new THREE.BoxGeometry(0.13, 0.1, 0.36), body, x, -0.02, 0.08);
        });

        /* Lower legs */
        [-0.085, 0.085].forEach(x => {
            addMesh(new THREE.BoxGeometry(0.1, 0.3, 0.1), body, x, -0.19, 0.24);
        });

        /* Seat cushion */
        const seatMat = new THREE.MeshStandardMaterial({ color: 0x111425, roughness: 0.9 });
        addMesh(new THREE.BoxGeometry(0.55, 0.055, 0.42), seatMat, 0, -0.06, 0.02);

        /* Seat back */
        addMesh(new THREE.BoxGeometry(0.55, 0.5, 0.06), seatMat, 0, 0.18, -0.2);

        /* Position: seated by the left window */
        g.position.set(-0.85, 1.05, 1.0);
        scene.add(g);
    }

    /* ═══════════════════════════════════
       ASSET LOADERS
       ═══════════════════════════════════ */
    function loadGLB(path, onProgress) {
        return new Promise((resolve, reject) => {
            new GLTFLoader().load(path, gltf => resolve(gltf), onProgress, err => reject(err));
        });
    }

    async function loadAssets() {
        const progressTracker = { train: 0, tracks: 0, mountains: 0 };

        const updateHUD = () => {
            if (!loadingEl) return;
            const span = loadingEl.querySelector('span');
            if (span) {
                const totalPct = Math.round((progressTracker.train + progressTracker.tracks + progressTracker.mountains) / 3);
                span.textContent = `Grounding cinematic space… ${totalPct}%`;
            }
        };

        try {
            const [trainGLTF, tracksGLTF, mountainGLTF] = await Promise.all([
                loadGLB(PATH_TRAIN, xhr => {
                    if (xhr.total) progressTracker.train = Math.min(100, (xhr.loaded / xhr.total) * 100);
                    updateHUD();
                }),
                loadGLB(PATH_TRACKS, xhr => {
                    if (xhr.total) progressTracker.tracks = Math.min(100, (xhr.loaded / xhr.total) * 100);
                    updateHUD();
                }),
                loadGLB(PATH_MOUNTAINS, xhr => {
                    if (xhr.total) progressTracker.mountains = Math.min(100, (xhr.loaded / xhr.total) * 100);
                    updateHUD();
                })
            ]);

            /* ── Setup Train Carriage ── */
            const trainScene = trainGLTF.scene;
            const tBox = new THREE.Box3().setFromObject(trainScene);
            const tSize = tBox.getSize(new THREE.Vector3());
            trainScene.scale.setScalar(12 / Math.max(tSize.x, tSize.y, tSize.z));
            
            // Align Z axis
            const stBox = new THREE.Box3().setFromObject(trainScene);
            const stSize = stBox.getSize(new THREE.Vector3());
            if (stSize.x > stSize.z * 1.5) trainScene.rotation.y = Math.PI / 2;

            const finalTBox = new THREE.Box3().setFromObject(trainScene);
            const tCenter = finalTBox.getCenter(new THREE.Vector3());
            const ftSize = finalTBox.getSize(new THREE.Vector3());
            trainScene.position.sub(tCenter);
            
            /* Wheel Y alignment relative to the rail tracks (0.115 puts wheels directly on rail tops) */
            trainScene.position.y += ftSize.y / 2 + 0.115;

            /* Metallic shaders & shadow settings */
            trainScene.traverse(child => {
                if (!child.isMesh) return;
                
                const name = (child.name || '').toLowerCase();
                const matName = (child.material?.name || '').toLowerCase();

                if (name.includes('handle') || name.includes('fixture') || name.includes('pole') || name.includes('screw')) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                } else {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }

                if (name.includes('window') || name.includes('glass') || matName.includes('glass')) {
                    child.material = new THREE.MeshPhysicalMaterial({
                        color: 0x556688,
                        transparent: true,
                        opacity: 0.15,
                        roughness: 0.1,
                        metalness: 0.1,
                        transmission: 0.85,
                        ior: 1.5,
                        side: THREE.DoubleSide
                    });
                } else if (name.includes('body') || name.includes('chassis') || name.includes('metal') || matName.includes('metal')) {
                    child.material = child.material.clone();
                    child.material.metalness = 0.98;
                    child.material.roughness = 0.18;
                    child.material.roughnessMap = null;
                } else if (name.includes('seat') || matName.includes('fabric')) {
                    child.material = child.material.clone();
                    child.material.roughness = 0.95;
                }
            });
            scene.add(trainScene);

            /* ── Setup Modular Tracks ── */
            const trackBase = tracksGLTF.scene;
            trackBase.traverse(child => {
                if (child.isMesh) {
                    child.receiveShadow = true;
                    child.castShadow = false;
                    const name = (child.name || '').toLowerCase();
                    if (name.includes('rail')) {
                        child.material = child.material.clone();
                        child.material.metalness = 0.95;
                        child.material.roughness = 0.15;
                    }
                }
            });

            const trBox = new THREE.Box3().setFromObject(trackBase);
            const trSize = trBox.getSize(new THREE.Vector3());

            const scaleFactor = 1.45 / trSize.x;
            trackBase.scale.set(scaleFactor, scaleFactor, scaleFactor);

            // Compute length after scaling is applied to fix spacing drift/motion
            const trBoxScaled = new THREE.Box3().setFromObject(trackBase);
            trackLength = trBoxScaled.getSize(new THREE.Vector3()).z;

            // Base ground plane directly under sleepers (lowered to y = -0.25 to prevent clipping ties)
            const groundGeo = new THREE.PlaneGeometry(120, 300);
            const groundMat = new THREE.MeshStandardMaterial({
                color: 0x232931,
                roughness: 0.95,
                metalness: 0.1,
                fog: true
            });
            const ground = new THREE.Mesh(groundGeo, groundMat);
            ground.rotation.x = -Math.PI / 2;
            ground.position.set(0, -0.25, 0); 
            ground.receiveShadow = true;
            scene.add(ground);

            // Spawn 3 segments of track (forming a long continuous railway track)
            for (let i = 0; i < 3; i++) {
                const trackCopy = trackBase.clone();
                trackCopy.position.set(0, -0.06, -trackLength + i * trackLength);
                scene.add(trackCopy);
                trackSections.push(trackCopy);
            }

            /* ── Setup Mountain Landscape ── */
            const mountainScene = mountainGLTF.scene;
            const mBox = new THREE.Box3().setFromObject(mountainScene);
            const mSize = mBox.getSize(new THREE.Vector3());
            
            // Scale landscape
            const landscapeScale = 140 / Math.max(mSize.x, mSize.y, mSize.z);
            mountainScene.scale.set(landscapeScale, landscapeScale, landscapeScale);

            const fmBox = new THREE.Box3().setFromObject(mountainScene);
            const mCenter = fmBox.getCenter(new THREE.Vector3());
            mountainScene.position.sub(mCenter);
            
            // Shifted further left to x = -130 to prevent mountains from clipping train walls
            mountainScene.position.set(-130, -5, -10);

            // Mountain visibility: styled in slate-grey day colors
            mountainScene.traverse(child => {
                if (child.isMesh) {
                    child.castShadow = false;
                    child.receiveShadow = false;
                    child.material = new THREE.MeshStandardMaterial({
                        color: 0x3d495e, // slate-blue grey mountain
                        roughness: 0.95,
                        metalness: 0.1,
                        fog: true
                    });
                }
            });

            scene.add(mountainScene);
            mountainMesh = mountainScene;

        } catch (e) {
            console.warn("Error loading high-fidelity GLB assets:", e);
        }
    }

    /* ═══════════════════════════════════
       GSAP CINEMATIC TIMELINE
       ═══════════════════════════════════ */
    function buildTimeline() {
        if (timeline) timeline.kill();

        Object.assign(cam, {
            px: 2.6,  py: 0.28, pz: -5.0,
            lx: 0.4,  ly: -0.1, lz: -1.0,
            fov: 52
        });

        if (armGroup) {
            armGroup.rotation.set(0, 0, 0);
            lowerArm.rotation.set(0, 0, 0);
        }
        drawnPoints.length = 0;
        nameDrawProgress.val = 0;
        drawWindowBackground(0);

        if (nameReveal) {
            nameReveal.classList.remove('visible');
            nameReveal.innerHTML = '';
        }

        const tl = gsap.timeline({ paused: true, onComplete: onIntroDone });

        /* Phase 1 — Low-angle tracks & spinning wheels (0 → 4.5 s) (Angled down to show tracks) */
        tl.to(cam, {
            duration: 4.5,
            px: 1.9,  py: 0.38, pz: -1.5,
            lx: 0.3,  ly: 0.1,  lz: 3.0,
            fov: 55,
            ease: 'power1.inOut'
        });

        /* Phase 2 — Rise alongside train exterior panel (4.5 → 8.5 s) */
        tl.to(cam, {
            duration: 4,
            px: 0.35, py: 1.82, pz: 3.2,
            lx: -0.2, ly: 1.5,  lz: 0,
            fov: 50,
            ease: 'power2.inOut'
        });

        /* Phase 3 — Enter train carriage, glide in behind passenger shoulder (8.5 → 12.5 s) */
        tl.to(cam, {
            duration: 4,
            px: -0.15, py: 1.58, pz: 1.75,
            lx: -0.85, ly: 1.42, lz: 0.9,
            fov: 42,
            ease: 'power1.inOut'
        });

        /* Phase 4 — Close to passenger's head (12.5 → 14.5 s) */
        tl.to(cam, {
            duration: 2,
            px: -0.5, py: 1.55, pz: 1.2,
            lx: -0.85, ly: 1.5, lz: 0.95,
            fov: 38,
            ease: 'sine.inOut'
        });

        /* Phase 5 — Snap to passenger POV (14.5 → 15.5 s) */
        tl.to(cam, {
            duration: 1,
            px: -0.84, py: 1.55, pz: 1.0,
            lx: -0.84, ly: 1.5,  lz: -2,
            fov: 65,
            ease: 'power3.inOut'
        });

        /* Phase 6 — Turn head left to face the window (15.5 → 19.5 s) */
        tl.to(cam, {
            duration: 4,
            lx: -6,   ly: 1.25, lz: 1.0,
            fov: 58,
            ease: 'power2.inOut'
        });

        /* ── Segmented Arm Animation (Starts at 15.6 s) ── */
        tl.to(armGroup.rotation, {
            duration: 1.8,
            x: -Math.PI / 3.8,
            z: -Math.PI / 4.5,
            ease: 'power2.out'
        }, 15.6);

        tl.to(lowerArm.rotation, {
            duration: 1.8,
            x: Math.PI / 7,
            z: -Math.PI / 10,
            ease: 'power2.out'
        }, 15.6);

        /* ── Tracing the window text (17.5 → 22 s) ── */
        tl.to(nameDrawProgress, {
            duration: 4.5,
            val: 1.0,
            ease: 'sine.inOut',
            onUpdate: animateWipePath
        }, 17.5);

        /* Retract hand once name is fully traced */
        tl.to(armGroup.rotation, {
            duration: 1.5,
            x: 0, z: 0,
            ease: 'power2.inOut'
        }, 22.2);

        tl.to(lowerArm.rotation, {
            duration: 1.5,
            x: 0, z: 0,
            ease: 'power2.inOut',
            onComplete: revealTitleCard
        }, 22.2);

        timeline = tl;
        return tl;
    }

    /* ═══════════════════════════════════
       WIPE EFFECT AND DRAW PATH GENERATION
       ═══════════════════════════════════ */
    function animateWipePath() {
        const w = windowCanvas.width;
        const h = windowCanvas.height;
        
        const progress = nameDrawProgress.val;
        drawnPoints.length = 0;

        const maxPoints = 280;
        const currentPoints = Math.floor(maxPoints * progress);

        for (let i = 0; i < currentPoints; i++) {
            const ptPct = i / maxPoints;
            const px = 100 + ptPct * (w - 200);
            const py = h / 2 + Math.sin(ptPct * Math.PI * 18) * 45;
            
            drawnPoints.push({ x: px, y: py });
        }

        drawWindowBackground(progress);
    }

    // Displays full proper name inside the HTML HUD popup card
    function revealTitleCard() {
        if (!nameReveal) return;
        nameReveal.innerHTML = '';

        const wrapper = document.createElement('div');
        wrapper.className = 'whoami-name-text';

        'AVULA JEEVAN YADAV'.split('').forEach(ch => {
            const span = document.createElement('span');
            span.className = 'whoami-name-char';
            span.textContent = ch === ' ' ? '\u00A0' : ch;
            wrapper.appendChild(span);
        });

        nameReveal.appendChild(wrapper);
        nameReveal.classList.add('visible');

        gsap.fromTo(
            wrapper.querySelectorAll('.whoami-name-char'),
            { opacity: 0, y: 15, scale: 0.65, filter: 'blur(8px)' },
            {
                opacity: 1, y: 0, scale: 1, filter: 'blur(0px)',
                duration: 0.35,
                stagger: 0.05,
                ease: 'back.out(1.6)'
            }
        );
    }

    function onIntroDone() {
        if (skipBtn)   skipBtn.style.display = 'none';
        if (replayBtn) replayBtn.style.display = '';
    }

    /* ═══════════════════════════════════
       PER-FRAME UPDATES
       ═══════════════════════════════════ */
    function updateTracks(dt) {
        if (trackSections.length === 0) return;
        
        const wrap = trackLength * 3;
        for (const track of trackSections) {
            track.position.z -= TRAIN_SPEED * dt;
            
            // Loop across 3 track segments seamlessly
            if (track.position.z < -trackLength * 1.5) {
                track.position.z += wrap;
            }
        }
    }

    function updateRain(dt) {
        if (!rainGeo) return;
        const p = rainGeo.attributes.position.array;

        for (let i = 0, n = p.length; i < n; i += 3) {
            p[i + 1] -= (9.5 + (i % 5) * 0.75) * dt;
            p[i + 2] -= TRAIN_SPEED * dt * 0.22;
            p[i]     -= 1.6 * dt;

            if (p[i + 1] < -2.0) {
                p[i]     = (Math.random() - 0.5) * 40;
                p[i + 1] = 16 + Math.random() * 4;
                p[i + 2] = (Math.random() - 0.5) * 60;
            }
        }

        rainGeo.attributes.position.needsUpdate = true;
    }

    function updateMountains(dt) {
        if (mountainMesh) {
            mountainMesh.position.z -= mountainSpeed * TRAIN_SPEED * dt;
            
            if (mountainMesh.position.z < -80) {
                mountainMesh.position.z = 60;
            }
        }
    }

    function syncCamera() {
        camera.position.set(cam.px, cam.py, cam.pz);
        camera.lookAt(cam.lx, cam.ly, cam.lz);
        if (Math.abs(camera.fov - cam.fov) > 0.05) {
            camera.fov = cam.fov;
            camera.updateProjectionMatrix();
        }
    }

    /* ═══════════════════════════════════
       RENDER LOOP
       ═══════════════════════════════════ */
    function loop() {
        frameId = requestAnimationFrame(loop);
        const dt = Math.min(clock.getDelta(), 0.06);

        updateTracks(dt);
        updateRain(dt);
        updateMountains(dt);
        
        updateWindowDroplets();
        drawWindowBackground(nameDrawProgress.val);

        syncCamera();

        renderer.render(scene, camera);
    }

    /* ═══════════════════════════════════
       RESIZE
       ═══════════════════════════════════ */
    function onResize() {
        if (!renderer) return;
        const w = container.clientWidth;
        const h = container.clientHeight;
        if (w < 1 || h < 1) return;

        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        renderer.setSize(w, h);
    }

    /* ═══════════════════════════════════
       INITIALISATION
       ═══════════════════════════════════ */
    async function init() {
        if (isInitialized) return;
        isInitialized = true;

        setupScene();
        addLighting();
        buildRain();
        buildDrawingWindow();
        buildCharacter();

        loop();

        const timeout = new Promise(r => setTimeout(r, 12000));
        const assetsReady = loadAssets();
        await Promise.race([assetsReady, timeout]);

        if (loadingEl) loadingEl.style.display = 'none';
        if (skipBtn)   skipBtn.style.display   = '';

        buildTimeline();
        timeline.play();

        new ResizeObserver(onResize).observe(container);
    }

    /* ═══════════════════════════════════
       UI EVENTS
       ═══════════════════════════════════ */
    skipBtn?.addEventListener('click', () => {
        if (timeline) {
            timeline.progress(1);
            revealTitleCard();
        }
    });

    replayBtn?.addEventListener('click', () => {
        if (nameReveal) {
            nameReveal.classList.remove('visible');
            nameReveal.innerHTML = '';
        }
        if (replayBtn) replayBtn.style.display = 'none';
        if (skipBtn)   skipBtn.style.display   = '';

        buildTimeline();
        timeline.play();
    });

    /* ═══════════════════════════════════
       TAB VISIBILITY OBSERVER
       ═══════════════════════════════════ */
    const obs = new MutationObserver(() => {
        const visible = panel.classList.contains('active');

        if (visible && !isInitialized) {
            init();
        } else if (visible && frameId === null && isInitialized) {
            clock.start();
            loop();
        } else if (!visible && frameId !== null) {
            cancelAnimationFrame(frameId);
            frameId = null;
        }
    });
    obs.observe(panel, { attributes: true, attributeFilter: ['class'] });

    if (panel.classList.contains('active')) init();

})();
