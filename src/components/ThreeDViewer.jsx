import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ThreeDViewer() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    let renderer, scene, camera, controls, animationFrameId;
    let resizeObserver;
    const clock = new THREE.Clock();

    try {
      if (!containerRef.current || !canvasRef.current) {
        throw new Error('Canvas or container reference not found');
      }

      // Initial dimensions
      const width = containerRef.current.clientWidth || 400;
      const height = containerRef.current.clientHeight || 350;

      // 1. Scene setup
      scene = new THREE.Scene();

      // 2. Camera setup
      camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
      camera.position.set(0, 1.5, 9); // Positioned slightly above and in front

      // 3. Renderer setup
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.shadowMap.type = THREE.PCFSoftShadowMap;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.1;

      // 4. Controls setup
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.minDistance = 4;
      controls.maxDistance = 15;
      controls.autoRotate = true;
      controls.autoRotateSpeed = 1.2;
      controls.target.set(0, 0.4, 0); // Point camera target at the cat's chest/head level

      // 5. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.75);
      scene.add(ambientLight);

      // Key light (Warm yellow/gold tone)
      const keyLight = new THREE.DirectionalLight(0xfff1e0, 1.6);
      keyLight.position.set(6, 8, 6);
      keyLight.castShadow = true;
      keyLight.shadow.mapSize.width = 1024;
      keyLight.shadow.mapSize.height = 1024;
      scene.add(keyLight);

      // Backlight (Cool white blue tone)
      const backLight = new THREE.DirectionalLight(0xe0f2fe, 1.0);
      backLight.position.set(-6, 4, -6);
      scene.add(backLight);

      // Warm glow point lights on the sides to showcase the orange cat
      const goldGlowLeft = new THREE.PointLight(0xf59e0b, 2.0, 8);
      goldGlowLeft.position.set(-3, 1, 2);
      scene.add(goldGlowLeft);

      const goldGlowRight = new THREE.PointLight(0xf59e0b, 2.0, 8);
      goldGlowRight.position.set(3, 1, 2);
      scene.add(goldGlowRight);

      // 6. Construct the Procedural Cat
      const catGroup = new THREE.Group();
      
      // Materials
      const orangeMat = new THREE.MeshStandardMaterial({
        color: 0xf59e0b, // Warm Amber/Orange
        roughness: 0.5,
        metalness: 0.1
      });
      const whiteMat = new THREE.MeshStandardMaterial({
        color: 0xffffff, // White socks, belly, muzzle
        roughness: 0.5,
        metalness: 0.05
      });
      const pinkMat = new THREE.MeshStandardMaterial({
        color: 0xfca5a5, // Inner ears and nose
        roughness: 0.6,
        metalness: 0.1
      });
      const eyeMat = new THREE.MeshStandardMaterial({
        color: 0x1e293b, // Deep dark slate eyes
        roughness: 0.1,
        metalness: 0.8
      });
      const collarMat = new THREE.MeshStandardMaterial({
        color: 0x10b981, // Emerald collar
        roughness: 0.5,
        metalness: 0.2
      });
      const bellMat = new THREE.MeshStandardMaterial({
        color: 0xfbbf24, // Gold bell
        roughness: 0.2,
        metalness: 0.85
      });
      const whiskersMat = new THREE.MeshStandardMaterial({
        color: 0x475569, // Dark slate whiskers
        roughness: 0.7
      });

      // A. Body
      const bodyGeo = new THREE.SphereGeometry(1.2, 32, 32);
      const bodyMesh = new THREE.Mesh(bodyGeo, orangeMat);
      bodyMesh.scale.set(1.0, 0.85, 1.35);
      bodyMesh.castShadow = true;
      bodyMesh.receiveShadow = true;
      catGroup.add(bodyMesh);

      // B. Belly (white chest patch)
      const bellyGeo = new THREE.SphereGeometry(0.9, 32, 32);
      const bellyMesh = new THREE.Mesh(bellyGeo, whiteMat);
      bellyMesh.scale.set(0.85, 0.85, 0.35);
      bellyMesh.position.set(0, -0.1, 0.95);
      bellyMesh.rotation.x = Math.PI / 12;
      bellyMesh.castShadow = true;
      bellyMesh.receiveShadow = true;
      catGroup.add(bellyMesh);

      // C. Neck & Collar
      const collarGeo = new THREE.TorusGeometry(0.8, 0.09, 16, 32);
      const collarMesh = new THREE.Mesh(collarGeo, collarMat);
      collarMesh.position.set(0, 0.9, 0.6);
      collarMesh.rotation.x = Math.PI / 2.3;
      collarMesh.castShadow = true;
      catGroup.add(collarMesh);

      // Golden collar bell
      const bellGeo = new THREE.SphereGeometry(0.16, 16, 16);
      const bellMesh = new THREE.Mesh(bellGeo, bellMat);
      bellMesh.position.set(0, 0.65, 1.25);
      bellMesh.castShadow = true;
      catGroup.add(bellMesh);

      // D. Head
      const headGeo = new THREE.SphereGeometry(0.95, 32, 32);
      const headMesh = new THREE.Mesh(headGeo, orangeMat);
      headMesh.position.set(0, 1.45, 0.7);
      headMesh.castShadow = true;
      headMesh.receiveShadow = true;
      catGroup.add(headMesh);

      // E. Muzzle/Cheeks (White puffs)
      const cheekGeo = new THREE.SphereGeometry(0.26, 16, 16);
      
      const leftCheek = new THREE.Mesh(cheekGeo, whiteMat);
      leftCheek.position.set(-0.19, 1.3, 1.4);
      leftCheek.scale.set(1, 0.9, 1);
      leftCheek.castShadow = true;
      catGroup.add(leftCheek);

      const rightCheek = new THREE.Mesh(cheekGeo, whiteMat);
      rightCheek.position.set(0.19, 1.3, 1.4);
      rightCheek.scale.set(1, 0.9, 1);
      rightCheek.castShadow = true;
      catGroup.add(rightCheek);

      // Nose
      const noseGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const noseMesh = new THREE.Mesh(noseGeo, pinkMat);
      noseMesh.scale.set(1.4, 1.0, 0.9);
      noseMesh.position.set(0, 1.38, 1.55);
      noseMesh.castShadow = true;
      catGroup.add(noseMesh);

      // F. Eyes
      const eyeGeo = new THREE.SphereGeometry(0.13, 16, 16);
      const eyeHighlightGeo = new THREE.SphereGeometry(0.04, 8, 8);

      // Left Eye
      const leftEye = new THREE.Mesh(eyeGeo, eyeMat);
      leftEye.position.set(-0.38, 1.55, 1.42);
      leftEye.castShadow = true;
      catGroup.add(leftEye);

      const leftEyeHighlight = new THREE.Mesh(eyeHighlightGeo, whiteMat);
      leftEyeHighlight.position.set(-0.33, 1.6, 1.52);
      catGroup.add(leftEyeHighlight);

      // Right Eye (The Winking Eye)
      const rightEye = new THREE.Mesh(eyeGeo, eyeMat);
      rightEye.position.set(0.38, 1.55, 1.42);
      rightEye.castShadow = true;
      catGroup.add(rightEye);

      const rightEyeHighlight = new THREE.Mesh(eyeHighlightGeo, whiteMat);
      rightEyeHighlight.position.set(0.43, 1.6, 1.52);
      catGroup.add(rightEyeHighlight);

      // G. Ears
      const earGeo = new THREE.ConeGeometry(0.35, 0.7, 4);
      const innerEarGeo = new THREE.ConeGeometry(0.24, 0.55, 4);

      // Left Ear Outer
      const leftEarOuter = new THREE.Mesh(earGeo, orangeMat);
      leftEarOuter.position.set(-0.55, 2.2, 0.55);
      leftEarOuter.rotation.set(-0.15, -0.4, 0.25);
      leftEarOuter.castShadow = true;
      catGroup.add(leftEarOuter);

      // Left Ear Inner (pink)
      const leftEarInner = new THREE.Mesh(innerEarGeo, pinkMat);
      leftEarInner.position.set(-0.52, 2.18, 0.61);
      leftEarInner.rotation.set(-0.15, -0.4, 0.25);
      catGroup.add(leftEarInner);

      // Right Ear Outer
      const rightEarOuter = new THREE.Mesh(earGeo, orangeMat);
      rightEarOuter.position.set(0.55, 2.2, 0.55);
      rightEarOuter.rotation.set(-0.15, 0.4, -0.25);
      rightEarOuter.castShadow = true;
      catGroup.add(rightEarOuter);

      // Right Ear Inner (pink)
      const rightEarInner = new THREE.Mesh(innerEarGeo, pinkMat);
      rightEarInner.position.set(0.52, 2.18, 0.61);
      rightEarInner.rotation.set(-0.15, 0.4, -0.25);
      catGroup.add(rightEarInner);

      // H. Whiskers (Cylinders)
      const whiskerGeo = new THREE.CylinderGeometry(0.012, 0.012, 0.7, 8);
      
      // Left whiskers
      for (let i = 0; i < 3; i++) {
        const whisker = new THREE.Mesh(whiskerGeo, whiskersMat);
        whisker.rotation.z = Math.PI / 2 + (i - 1) * 0.15;
        whisker.rotation.y = 0.2;
        whisker.position.set(-0.62, 1.28 + (i - 1) * 0.06, 1.45);
        catGroup.add(whisker);
      }

      // Right whiskers
      for (let i = 0; i < 3; i++) {
        const whisker = new THREE.Mesh(whiskerGeo, whiskersMat);
        whisker.rotation.z = Math.PI / 2 - (i - 1) * 0.15;
        whisker.rotation.y = -0.2;
        whisker.position.set(0.62, 1.28 + (i - 1) * 0.06, 1.45);
        catGroup.add(whisker);
      }

      // I. Paws / Legs
      const legCylinderGeo = new THREE.CylinderGeometry(0.22, 0.22, 0.7, 16);
      const pawSocksGeo = new THREE.SphereGeometry(0.25, 16, 16);

      // Front Left Leg & Sock
      const flLeg = new THREE.Mesh(legCylinderGeo, orangeMat);
      flLeg.position.set(-0.45, -0.6, 0.7);
      flLeg.castShadow = true;
      catGroup.add(flLeg);
      
      const flSock = new THREE.Mesh(pawSocksGeo, whiteMat);
      flSock.scale.set(1.0, 0.75, 1.2);
      flSock.position.set(-0.45, -0.92, 0.82);
      flSock.castShadow = true;
      catGroup.add(flSock);

      // Front Right Leg & Sock
      const frLeg = new THREE.Mesh(legCylinderGeo, orangeMat);
      frLeg.position.set(0.45, -0.6, 0.7);
      frLeg.castShadow = true;
      catGroup.add(frLeg);
      
      const frSock = new THREE.Mesh(pawSocksGeo, whiteMat);
      frSock.scale.set(1.0, 0.75, 1.2);
      frSock.position.set(0.45, -0.92, 0.82);
      frSock.castShadow = true;
      catGroup.add(frSock);

      // Back Left Leg & Sock
      const blLeg = new THREE.Mesh(legCylinderGeo, orangeMat);
      blLeg.position.set(-0.52, -0.6, -0.6);
      blLeg.castShadow = true;
      catGroup.add(blLeg);
      
      const blSock = new THREE.Mesh(pawSocksGeo, whiteMat);
      blSock.scale.set(1.0, 0.75, 1.2);
      blSock.position.set(-0.52, -0.92, -0.5);
      blSock.castShadow = true;
      catGroup.add(blSock);

      // Back Right Leg & Sock
      const brLeg = new THREE.Mesh(legCylinderGeo, orangeMat);
      brLeg.position.set(0.52, -0.6, -0.6);
      brLeg.castShadow = true;
      catGroup.add(brLeg);
      
      const brSock = new THREE.Mesh(pawSocksGeo, whiteMat);
      brSock.scale.set(1.0, 0.75, 1.2);
      brSock.position.set(0.52, -0.92, -0.5);
      brSock.castShadow = true;
      catGroup.add(brSock);

      // J. Wiggling Tail Group
      const tailGroup = new THREE.Group();
      tailGroup.position.set(0, -0.2, -1.2);
      
      const tailCylinderGeo = new THREE.CylinderGeometry(0.09, 0.08, 1.3, 16);
      const tailMain = new THREE.Mesh(tailCylinderGeo, orangeMat);
      tailMain.position.set(0, 0.55, -0.2);
      tailMain.rotation.x = -Math.PI / 4.5;
      tailMain.castShadow = true;
      tailGroup.add(tailMain);

      const tailTipGeo = new THREE.SphereGeometry(0.09, 16, 16);
      const tailTip = new THREE.Mesh(tailTipGeo, whiteMat);
      tailTip.position.set(0, 1.05, -0.65);
      tailTip.castShadow = true;
      tailGroup.add(tailTip);

      catGroup.add(tailGroup);

      // Center and scale entire cat group
      catGroup.position.set(0, -0.25, 0);
      scene.add(catGroup);

      // Fade-in loader simulation for premium UX transition
      setTimeout(() => {
        if (active) setIsLoading(false);
      }, 450);

      // 8. Animation loop
      const animate = () => {
        if (!active) return;
        animationFrameId = requestAnimationFrame(animate);

        const elapsedTime = clock.getElapsedTime();

        // A. Tail wiggling animation
        if (tailGroup) {
          tailGroup.rotation.y = Math.sin(elapsedTime * 4.5) * 0.35;
          tailGroup.rotation.z = Math.cos(elapsedTime * 2.5) * 0.12;
        }

        // B. Winking eye animation: every 3 seconds, wink for 500ms
        const cycleTime = elapsedTime % 3.0;
        if (cycleTime > 2.5) {
          // Wink down and up smoothly using sine
          const winkProgress = (cycleTime - 2.5) / 0.5; // 0 to 1
          const scaleY = 1.0 - 0.9 * Math.sin(winkProgress * Math.PI);
          
          if (rightEye) {
            rightEye.scale.y = scaleY;
          }
          if (rightEyeHighlight) {
            rightEyeHighlight.scale.setScalar(scaleY > 0.35 ? 1 : 0);
          }
        } else {
          // Eyes open
          if (rightEye) {
            rightEye.scale.y = 1.0;
          }
          if (rightEyeHighlight) {
            rightEyeHighlight.scale.setScalar(1.0);
          }
        }

        // C. Breathe motion (tiny scale oscillations of chest/belly)
        if (bodyMesh) {
          bodyMesh.scale.y = 0.85 + Math.sin(elapsedTime * 1.8) * 0.012;
        }
        if (bellyMesh) {
          bellyMesh.scale.y = 0.85 + Math.sin(elapsedTime * 1.8) * 0.012;
          bellyMesh.position.y = -0.1 + Math.sin(elapsedTime * 1.8) * 0.006;
        }

        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // 9. ResizeObserver setup
      resizeObserver = new ResizeObserver((entries) => {
        if (!active || !camera || !renderer) return;
        for (let entry of entries) {
          const w = entry.contentRect.width || containerRef.current.clientWidth;
          const h = entry.contentRect.height || containerRef.current.clientHeight;
          if (w && h) {
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
          }
        }
      });
      resizeObserver.observe(containerRef.current);

    } catch (err) {
      console.error('Three.js initialization failed:', err);
      setErrorMessage(err.message || 'WebGL no compatible');
      setLoadError(true);
      setIsLoading(false);
    }

    return () => {
      active = false;
      cancelAnimationFrame(animationFrameId);
      if (resizeObserver) {
        resizeObserver.disconnect();
      }
      if (renderer) {
        renderer.dispose();
      }
    };
  }, []);

  return (
    <div 
      className="three-d-container" 
      ref={containerRef} 
      style={{ width: '100%', height: '100%', position: 'relative', minHeight: '320px' }}
    >
      {/* 3D Canvas */}
      <canvas ref={canvasRef} style={{ width: '100%', height: '100%', display: loadError ? 'none' : 'block' }} />

      {/* Loading Overlay */}
      {isLoading && !loadError && (
        <div className="three-d-loader-overlay">
          <img 
            src="/cys_cat_winking.png" 
            alt="Cat Winking Render Fallback" 
            className="loader-fallback-image"
          />
          <div className="three-d-spinner-box">
            <div className="three-d-spinner"></div>
            <span>Creando gatito 3D interactivo...</span>
          </div>
        </div>
      )}

      {/* Fallback Static Image */}
      {loadError && (
        <div className="three-d-fallback-overlay">
          <img 
            src="/cys_cat_winking.png" 
            alt="Gato 3D CyS Solutions Animals" 
            className="three-d-static-image"
          />
          <div style={{
            position: 'absolute',
            bottom: '12px',
            background: 'rgba(239, 68, 68, 0.1)',
            border: '1px solid rgba(239, 68, 68, 0.2)',
            color: '#ef4444',
            padding: '4px 12px',
            borderRadius: '50px',
            fontSize: '0.75rem',
            fontWeight: 600
          }}>
            Vista 3D no disponible ({errorMessage || 'WebGL bloqueado'})
          </div>
        </div>
      )}
    </div>
  );
}
