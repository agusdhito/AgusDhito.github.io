"use client";

import React, { useEffect } from 'react';
import Head from 'next/head';
// import styles from './ar.module.css'; // Import the CSS module

export default function ARPage() {
  useEffect(() => {
    // Dynamically load scripts after component mounts (for client-side only)
    const loadScripts = async () => {
      // Load A-Frame
      const aframeScript = document.createElement('script');
      aframeScript.src = 'https://aframe.io/releases/1.4.2/aframe.min.js';
      aframeScript.async = true;
      document.head.appendChild(aframeScript);

      // Wait for A-Frame to load before loading MindAR
      await new Promise(resolve => {
        aframeScript.onload = resolve;
      });

      // Load MindAR
      const mindarScript = document.createElement('script');
      mindarScript.src = 'https://cdn.jsdelivr.net/npm/mind-ar@1.2.2/dist/mindar-image-aframe.prod.js';
      mindarScript.async = true;
      document.head.appendChild(mindarScript);
    };

    loadScripts();

    // Cleanup function
    return () => {
      // Clean up any event listeners or resources if needed
    };
  }, []);

  return (
    <>
      <Head>
        <title>MindAR Image Tracking Demo</title>
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        {/* <link rel="stylesheet" href="style.css" /> */}
      </Head>

      <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0 }}>
        <a-scene
          mindar-image="imageTargetSrc: ./public/assets/targets/targets.mind;"
          color-space="sRGB"
          renderer="colorManagement: true, physicallyCorrectLights"
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false"
        >
          <a-camera position="0 0 0" look-controls="enabled: false"></a-camera>

          {/* AR content */}
          <a-entity mindar-image-target="targetIndex: 0">
            {/* This content will appear when the image is detected */}
            <a-plane color="blue" opacity="0.5" position="0 0 0" height="0.552" width="1" rotation="0 0 0"></a-plane>
            <a-entity
              text="value: Hello World!; color: white; align: center;"
              position="0 0 0.1"
              scale="0.5 0.5 0.5"
              rotation="0 0 0"
            ></a-entity>
          </a-entity>
        </a-scene>
      </div>
    </>
  );
}