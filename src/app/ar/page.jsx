"use client";

import React, { useEffect, useRef, useState } from 'react';

export default function ARPage() {
  const containerRef = useRef(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    // Function to load scripts in sequence
    const loadScripts = async () => {
      try {
        // Load A-Frame first
        const aframeScript = document.createElement('script');
        aframeScript.src = 'https://aframe.io/releases/1.4.2/aframe.min.js';
        aframeScript.async = true;
        document.head.appendChild(aframeScript);

        // Wait for A-Frame to load
        await new Promise((resolve) => {
          aframeScript.onload = resolve;
        });

        // Then load MindAR
        const mindarScript = document.createElement('script');
        mindarScript.src = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.2/dist/mindar-image-aframe.prod.js';
        mindarScript.async = true;
        document.head.appendChild(mindarScript);

        // Wait for MindAR to load
        await new Promise((resolve) => {
          mindarScript.onload = resolve;
        });

        // Set loading to false when done
        setIsLoading(false);
      } catch (err) {
        setError("Failed to load AR scripts");
        console.error(err);
      }
    };

    loadScripts();

    // Cleanup function
    return () => {
      // Cleanup code here if needed
    };
  }, []);

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div style={{ position: 'relative', height: '100vh', width: '100vw' }}>
      {isLoading ? (
        <div style={{
          position: 'absolute',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: '#000',
          color: '#fff',
          zIndex: 1000
        }}>
          Loading AR Experience...
        </div>
      ) : (
        <div ref={containerRef} style={{ width: '100%', height: '100%' }}>
          <a-scene
            mindar-image="imageTargetSrc: /assets/targets/targets.mind;"
            color-space="sRGB"
            renderer="colorManagement: true, physicallyCorrectLights"
            vr-mode-ui="enabled: false"
            device-orientation-permission-ui="enabled: true"
          >
            <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>
            <a-entity mindar-image-target="targetIndex: 0">
              <a-plane color="blue" opacity="0.5" position="0 0 0" height="0.552" width="1" rotation="0 0 0"></a-plane>
              {/* <a-gltf-model rotation="0 0 0" position="0 0 0.1" scale="0.005 0.005 0.005" src="/assets/models/microphone.glb"></a-gltf-model> */}
              <a-entity
                text="value: Hello World!; color: white; align: center;"
                position="0 0 0.1"
                scale="0.5 0.5 0.5"
                rotation="0 0 0"
              ></a-entity>
            </a-entity>
          </a-scene>
        </div>
      )}
    </div>
  );
}