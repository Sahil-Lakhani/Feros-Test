import { useEffect, useRef } from 'react';
import * as THREE from 'three';

const ORANGE = 0xff7a2e;
const GERMANY_LAT = 51.1657;
const GERMANY_LON = 10.4515;

function latLonToVector3(lat, lon, radius) {
  const phi = THREE.MathUtils.degToRad(90 - lat);
  const theta = THREE.MathUtils.degToRad(lon);
  const x = -radius * Math.sin(phi) * Math.cos(theta);
  const y = radius * Math.cos(phi);
  const z = radius * Math.sin(phi) * Math.sin(theta);
  return new THREE.Vector3(x, y, z);
}

function drawRings(rings, parent, radius, mat) {
  rings.forEach((ring) => {
    const points = ring.map(([lon, lat]) => latLonToVector3(lat, lon, radius));
    const geometry = new THREE.BufferGeometry().setFromPoints(points);
    const line = new THREE.Line(geometry, mat);
    parent.add(line);
  });
}

export default function Globe({ size = 500, paused = false }) {
  const mountRef = useRef(null);
  const pausedRef = useRef(paused);

  useEffect(() => {
    pausedRef.current = paused;
  }, [paused]);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(45, 1, 0.1, 1000);
    camera.position.z = 3;

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(size, size);
    renderer.setClearColor(0x000000, 0);
    mount.appendChild(renderer.domElement);
    renderer.domElement.style.touchAction = 'none';
    renderer.domElement.style.cursor = 'grab';
    renderer.domElement.style.display = 'block';

    const globeGroup = new THREE.Group();
    scene.add(globeGroup);

    // Solid sphere interior
    const sphereGeom = new THREE.SphereGeometry(0.995, 64, 64);
    const sphereMat = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      transparent: true,
      opacity: 0.95,
    });
    const sphere = new THREE.Mesh(sphereGeom, sphereMat);
    globeGroup.add(sphere);

    // Orange wireframe lat/lon grid
    const wireGeom = new THREE.SphereGeometry(1.001, 24, 16);
    const wireMat = new THREE.LineBasicMaterial({
      color: ORANGE,
      transparent: true,
      opacity: 0.35,
    });
    const wireframe = new THREE.LineSegments(
      new THREE.WireframeGeometry(wireGeom),
      wireMat
    );
    globeGroup.add(wireframe);

    // Equatorial halo ring
    const ringGeom = new THREE.RingGeometry(1.08, 1.085, 128);
    const ringMat = new THREE.MeshBasicMaterial({
      color: ORANGE,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.6,
    });
    const haloRing = new THREE.Mesh(ringGeom, ringMat);
    haloRing.rotation.x = Math.PI / 2;
    globeGroup.add(haloRing);

    // Country borders
    const bordersGroup = new THREE.Group();
    globeGroup.add(bordersGroup);

    const borderMat = new THREE.LineBasicMaterial({
      color: ORANGE,
      transparent: true,
      opacity: 0.7,
    });

    (async () => {
      try {
        const topoResp = await fetch(
          'https://cdn.jsdelivr.net/npm/world-atlas@2/countries-110m.json'
        );
        const topo = await topoResp.json();
        const topojsonMod = await import(
          /* @vite-ignore */ 'https://cdn.jsdelivr.net/npm/topojson-client@3/+esm'
        );
        const feature = topojsonMod.feature(topo, topo.objects.countries);
        feature.features.forEach((f) => {
          const geom = f.geometry;
          if (!geom) return;
          if (geom.type === 'Polygon') {
            drawRings(geom.coordinates, bordersGroup, 1.002, borderMat);
          } else if (geom.type === 'MultiPolygon') {
            geom.coordinates.forEach((poly) => {
              drawRings(poly, bordersGroup, 1.002, borderMat);
            });
          }
        });
      } catch (err) {
        console.warn('Failed to load country borders', err);
      }
    })();

    // Germany marker
    const markerGroup = new THREE.Group();
    const markerPos = latLonToVector3(GERMANY_LAT, GERMANY_LON, 1.015);
    markerGroup.position.copy(markerPos);

    const markerSphereGeom = new THREE.SphereGeometry(0.025, 16, 16);
    const markerMat = new THREE.MeshBasicMaterial({ color: ORANGE });
    const markerSphere = new THREE.Mesh(markerSphereGeom, markerMat);
    markerGroup.add(markerSphere);

    const markerRingGeom = new THREE.RingGeometry(0.035, 0.05, 32);
    const markerRingMat = new THREE.MeshBasicMaterial({
      color: ORANGE,
      side: THREE.DoubleSide,
      transparent: true,
      opacity: 0.8,
    });
    const markerRing = new THREE.Mesh(markerRingGeom, markerRingMat);
    markerRing.lookAt(0, 0, 0);
    markerGroup.add(markerRing);
    globeGroup.add(markerGroup);

    // Initial orientation: Germany faces camera (+Z)
    const germanyRotation = {
      x: -THREE.MathUtils.degToRad(GERMANY_LAT),
      y: -THREE.MathUtils.degToRad(GERMANY_LON) + Math.PI / 2,
    };
    const targetRotation = { x: germanyRotation.x, y: germanyRotation.y };
    globeGroup.rotation.x = targetRotation.x;
    globeGroup.rotation.y = targetRotation.y;

    // Interaction state
    let isDragging = false;
    let lastX = 0;
    let lastY = 0;
    let velX = 0;
    let velY = 0;

    const onPointerDown = (e) => {
      isDragging = true;
      lastX = e.clientX;
      lastY = e.clientY;
      velX = 0;
      velY = 0;
      renderer.domElement.setPointerCapture(e.pointerId);
      renderer.domElement.style.cursor = 'grabbing';
    };
    const onPointerMove = (e) => {
      if (!isDragging) return;
      const dx = e.clientX - lastX;
      const dy = e.clientY - lastY;
      lastX = e.clientX;
      lastY = e.clientY;
      const rotSpeed = 0.005;
      velX = dy * rotSpeed;
      velY = dx * rotSpeed;
      targetRotation.y += velY;
      targetRotation.x += velX;
      targetRotation.x = Math.max(
        -Math.PI / 2,
        Math.min(Math.PI / 2, targetRotation.x)
      );
    };
    const onPointerUp = (e) => {
      if (!isDragging) return;
      isDragging = false;
      try {
        renderer.domElement.releasePointerCapture(e.pointerId);
      } catch {
        /* ignore */
      }
      renderer.domElement.style.cursor = 'grab';
    };

    renderer.domElement.addEventListener('pointerdown', onPointerDown);
    renderer.domElement.addEventListener('pointermove', onPointerMove);
    renderer.domElement.addEventListener('pointerup', onPointerUp);
    renderer.domElement.addEventListener('pointercancel', onPointerUp);

    let rafId;
    const animate = (t) => {
      if (pausedRef.current) {
        // Hold on Germany until the page is revealed
        velX = 0;
        velY = 0;
        targetRotation.x = germanyRotation.x;
        targetRotation.y = germanyRotation.y;
      } else if (!isDragging) {
        // Momentum decay
        velX *= 0.95;
        velY *= 0.95;
        targetRotation.x += velX;
        targetRotation.y += velY;
        targetRotation.x = Math.max(
          -Math.PI / 2,
          Math.min(Math.PI / 2, targetRotation.x)
        );

        // Idle auto-rotation
        const velMag = Math.sqrt(velX * velX + velY * velY);
        if (velMag < 0.0005) {
          targetRotation.y += 0.0015;
        }
      }

      // Smooth interpolation
      globeGroup.rotation.x += (targetRotation.x - globeGroup.rotation.x) * 0.1;
      globeGroup.rotation.y += (targetRotation.y - globeGroup.rotation.y) * 0.1;

      // Marker pulse
      const pulse = 1 + Math.sin(t * 0.003) * 0.15;
      markerGroup.scale.setScalar(pulse);

      renderer.render(scene, camera);
      rafId = requestAnimationFrame(animate);
    };
    rafId = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(rafId);
      renderer.domElement.removeEventListener('pointerdown', onPointerDown);
      renderer.domElement.removeEventListener('pointermove', onPointerMove);
      renderer.domElement.removeEventListener('pointerup', onPointerUp);
      renderer.domElement.removeEventListener('pointercancel', onPointerUp);
      if (renderer.domElement.parentNode) {
        renderer.domElement.parentNode.removeChild(renderer.domElement);
      }
      scene.traverse((obj) => {
        if (obj.geometry) obj.geometry.dispose();
        if (obj.material) {
          if (Array.isArray(obj.material)) obj.material.forEach((m) => m.dispose());
          else obj.material.dispose();
        }
      });
      renderer.dispose();
    };
  }, [size]);

  return (
    <div
      ref={mountRef}
      style={{
        width: size,
        height: size,
        maxWidth: '100%',
        maxHeight: '100%',
      }}
    />
  );
}
