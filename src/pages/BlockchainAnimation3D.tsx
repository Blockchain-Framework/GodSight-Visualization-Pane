import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';

const BlockchainAnimation3D: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (containerRef.current) {
      const scene = new THREE.Scene();
      const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
      const renderer = new THREE.WebGLRenderer({ alpha: true });

      renderer.setSize(200, 200);
      renderer.setClearColor(0x000000, 0);
      containerRef.current.appendChild(renderer.domElement);

      const blockGeometry = new THREE.BoxGeometry(1, 1, 1);
      const blockMaterial = new THREE.MeshBasicMaterial({ color: 0x888888 });
      const edgeMaterial = new THREE.LineBasicMaterial({ color: 0xffffff });

      const blocks = [];
      const numBlocks = 5;
      const spacing = 2;

      for (let i = 0; i < numBlocks; i++) {
        const block = new THREE.Mesh(blockGeometry, blockMaterial);
        block.position.x = i * spacing;
        scene.add(block);

        const edges = new THREE.EdgesGeometry(blockGeometry);
        const lineSegments = new THREE.LineSegments(edges, edgeMaterial);
        lineSegments.position.x = i * spacing;
        scene.add(lineSegments);

        blocks.push(block);
        blocks.push(lineSegments);
      }

      camera.position.z = 10;

      const animate = () => {
        requestAnimationFrame(animate);
        blocks.forEach((block, index) => {
          block.rotation.x += 0.01;
          block.rotation.y += 0.01;
          block.position.y = Math.sin(Date.now() * 0.001 + index * 0.5) * 0.5;
        });
        renderer.render(scene, camera);
      };

      animate();

      return () => {
        containerRef.current?.removeChild(renderer.domElement);
      };
    }
  }, []);

  return <div ref={containerRef} />;
};

export default BlockchainAnimation3D;