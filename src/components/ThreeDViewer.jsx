import React, { useEffect, useRef, useState } from 'react';
import * as THREE from 'three';
import { OBJLoader } from 'three/examples/jsm/loaders/OBJLoader.js';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';

export default function ThreeDViewer() {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [loadProgress, setLoadProgress] = useState(0);
  const [loadError, setLoadError] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  useEffect(() => {
    let active = true;
    let renderer, scene, camera, controls, animationFrameId;
    let resizeObserver;

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
      camera = new THREE.PerspectiveCamera(45, width / height, 0.1, 1000);
      camera.position.set(0, 2, 13); // Position slightly above and in front

      // 3. Renderer setup
      renderer = new THREE.WebGLRenderer({
        canvas: canvasRef.current,
        antialias: true,
        alpha: true
      });
      renderer.setSize(width, height);
      renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
      renderer.shadowMap.enabled = true;
      renderer.toneMapping = THREE.ACESFilmicToneMapping;
      renderer.toneMappingExposure = 1.2;

      // 4. Controls setup
      controls = new OrbitControls(camera, renderer.domElement);
      controls.enableDamping = true;
      controls.dampingFactor = 0.05;
      controls.enableZoom = true;
      controls.minDistance = 5;
      controls.maxDistance = 20;
      controls.autoRotate = true; // Automatically rotate to showcase the 3D details
      controls.autoRotateSpeed = 1.5;
      controls.target.set(0, 0, 0); // Point camera rotation target at the origin

      // 5. Lighting
      const ambientLight = new THREE.AmbientLight(0xffffff, 0.85);
      scene.add(ambientLight);

      // Key light
      const keyLight = new THREE.DirectionalLight(0xffffff, 1.5);
      keyLight.position.set(5, 10, 7);
      scene.add(keyLight);

      // Backlight
      const backLight = new THREE.DirectionalLight(0xffffff, 1.0);
      backLight.position.set(-5, 5, -7);
      scene.add(backLight);

      // Neon Green accent lights inside the earcups area to highlight Razer brand
      const greenGlowLeft = new THREE.PointLight(0x33ff33, 3.5, 10);
      greenGlowLeft.position.set(-3, 0, 1);
      scene.add(greenGlowLeft);

      const greenGlowRight = new THREE.PointLight(0x33ff33, 3.5, 10);
      greenGlowRight.position.set(3, 0, 1);
      scene.add(greenGlowRight);

      // 6. Theme materials
      const materialChrome = new THREE.MeshStandardMaterial({
        color: 0xdddddd,
        metalness: 0.95,
        roughness: 0.05,
        name: 'Chrome'
      });

      const materialRazerGreen = new THREE.MeshStandardMaterial({
        color: 0x33ff33,
        emissive: 0x00cc00,
        emissiveIntensity: 0.4,
        metalness: 0.1,
        roughness: 0.2,
        name: 'RazerGreen'
      });

      const materialMatteBlack = new THREE.MeshStandardMaterial({
        color: 0x161616,
        metalness: 0.1,
        roughness: 0.7,
        name: 'MatteBlack'
      });

      const materialInnerCushion = new THREE.MeshStandardMaterial({
        color: 0x222222,
        metalness: 0.05,
        roughness: 0.85,
        name: 'Fabric'
      });

      // 7. Load OBJ Model
      const loader = new OBJLoader();
      loader.load(
        '/Razer_kraken.obj',
        (obj) => {
          if (!active) return;
          
          obj.traverse((child) => {
            if (child.isMesh) {
              const matName = child.materialLibraryName || child.materialName || '';
              
              if (matName.includes('Chrome') || child.name.toLowerCase().includes('metal')) {
                child.material = materialChrome;
              } else if (
                matName.includes('Mat.6') || 
                child.name.toLowerCase().includes('green') || 
                child.name.toLowerCase().includes('logo') || 
                matName.includes('green')
              ) {
                child.material = materialRazerGreen;
              } else if (
                matName.includes('Coarse_leather') || 
                matName.includes('Fabric') || 
                matName.includes('Foam')
              ) {
                child.material = materialInnerCushion;
              } else {
                child.material = materialMatteBlack;
              }

              child.castShadow = true;
              child.receiveShadow = true;
            }
          });

          // Calculate bounding box and dimensions
          const box = new THREE.Box3().setFromObject(obj);
          const center = box.getCenter(new THREE.Vector3());
          const size = box.getSize(new THREE.Vector3());

          // Centering using the Pivot Pattern:
          // Shift children inside the obj group so that the model's actual center is at (0,0,0)
          obj.position.set(-center.x, -center.y, -center.z);

          // Add obj to a parent pivot group that we can scale and center in the world
          const pivot = new THREE.Group();
          pivot.add(obj);

          // Scale the pivot group
          const maxDim = Math.max(size.x, size.y, size.z);
          const targetScale = 8.0 / maxDim; // Adjusted scale for perfect centering
          pivot.scale.set(targetScale, targetScale, targetScale);

          // Position the pivot exactly at the scene's origin
          pivot.position.set(0, 0, 0);

          scene.add(pivot);
          setIsLoading(false);
        },
        (xhr) => {
          if (xhr.total > 0 && active) {
            const pct = Math.round((xhr.loaded / xhr.total) * 100);
            setLoadProgress(pct);
          }
        },
        (err) => {
          console.error('Error loading OBJ model:', err);
          if (active) {
            setErrorMessage(err.message || 'Error al descargar modelo 3D');
            setLoadError(true);
            setIsLoading(false);
          }
        }
      );

      // 8. Animation loop
      const animate = () => {
        if (!active) return;
        animationFrameId = requestAnimationFrame(animate);
        controls.update();
        renderer.render(scene, camera);
      };
      animate();

      // 9. ResizeObserver setup (Enterprise Responsive canvas sizing)
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
            src="/razer_kraken_render.png" 
            alt="Razer Kraken Render Fallback" 
            className="loader-fallback-image"
          />
          <div className="three-d-spinner-box">
            <div className="three-d-spinner"></div>
            <span>Cargando modelo 3D interactivo... {loadProgress}%</span>
          </div>
        </div>
      )}

      {/* Fallback Static Image */}
      {loadError && (
        <div className="three-d-fallback-overlay">
          <img 
            src="/razer_kraken_render.png" 
            alt="Razer Kraken Gaming Headset" 
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
