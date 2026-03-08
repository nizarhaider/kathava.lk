'use client';

import React, { useRef, useEffect } from 'react';
import * as THREE from 'three';
import { EXRLoader } from 'three/addons/loaders/EXRLoader.js';
import { EffectComposer } from 'three/addons/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/addons/postprocessing/RenderPass.js';
import { ShaderPass } from 'three/addons/postprocessing/ShaderPass.js';
import { UnrealBloomPass } from 'three/addons/postprocessing/UnrealBloomPass.js';
import { FXAAShader } from 'three/addons/shaders/FXAAShader.js';
import { Analyser } from '@/lib/gemini/analyser';

// Shaders from the example
const backdropVS = `precision highp float;
in vec3 position;
uniform mat4 modelViewMatrix;
uniform mat4 projectionMatrix;
void main() {
  gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.);
}`;

const backdropFS = `precision highp float;
out vec4 fragmentColor;
uniform vec2 resolution;
uniform float rand;
void main() {
  float aspectRatio = resolution.x / resolution.y; 
  vec2 vUv = gl_FragCoord.xy / resolution;
  float noise = (fract(sin(dot(vUv, vec2(12.9898 + rand,78.233)*2.0)) * 43758.5453));
  vUv -= .5;
  vUv.x *= aspectRatio;
  float factor = 4.;
  float d = factor * length(vUv);
  vec3 from = vec3(3.) / 255.;
  vec3 to = vec3(16., 12., 20.) / 2550.;
  fragmentColor = vec4(mix(from, to, d) + .005 * noise, 1.);
}`;

const sphereVS = `#define STANDARD
varying vec3 vViewPosition;
#include <common>
#include <batching_pars_vertex>
#include <uv_pars_vertex>
#include <displacementmap_pars_vertex>
#include <color_pars_vertex>
#include <fog_pars_vertex>
#include <normal_pars_vertex>
#include <morphtarget_pars_vertex>
#include <skinning_pars_vertex>
#include <shadowmap_pars_vertex>
#include <logdepthbuf_pars_vertex>
#include <clipping_planes_pars_vertex>
uniform float time;
uniform vec4 inputData;
uniform vec4 outputData;
vec3 calc( vec3 pos ) {
  vec3 dir = normalize( pos );
  return pos +
    1. * inputData.x * inputData.y * dir * (.5 + .5 * sin(inputData.z * pos.x + time)) +
    1. * outputData.x * outputData.y * dir * (.5 + .5 * sin(outputData.z * pos.y + time))
  ;
}
vec3 spherical( float r, float theta, float phi ) {
  return r * vec3(
    cos( theta ) * cos( phi ),
    sin( theta ) * cos( phi ),
    sin( phi )
  );
}
void main() {
  #include <uv_vertex>
  #include <color_vertex>
  #include <morphinstance_vertex>
  #include <morphcolor_vertex>
  #include <batching_vertex>
  #include <beginnormal_vertex>
  #include <morphnormal_vertex>
  #include <skinbase_vertex>
  #include <skinnormal_vertex>
  #include <defaultnormal_vertex>
  #include <normal_vertex>
  #include <begin_vertex>
  float inc = 0.001;
  float r = length( position );
  float theta = ( uv.x + 0.5 ) * 2. * PI;
  float phi = -( uv.y + 0.5 ) * PI;
  vec3 np = calc( spherical( r, theta, phi )  );
  vec3 tangent = normalize( calc( spherical( r, theta + inc, phi ) ) - np );
  vec3 bitangent = normalize( calc( spherical( r, theta, phi + inc ) ) - np );
  transformedNormal = -normalMatrix * normalize( cross( tangent, bitangent ) );
  vNormal = normalize( transformedNormal );
  transformed = np;
  #include <morphtarget_vertex>
  #include <skinning_vertex>
  #include <displacementmap_vertex>
  #include <project_vertex>
  #include <logdepthbuf_vertex>
  #include <clipping_planes_vertex>
  vViewPosition = - mvPosition.xyz;
  #include <worldpos_vertex>
  #include <shadowmap_vertex>
  #include <fog_vertex>
}`;

interface AudioOrbProps {
    inputNode: AudioNode | null;
    outputNode: AudioNode | null;
}

const AudioOrb: React.FC<AudioOrbProps> = ({ inputNode, outputNode }) => {
    const containerRef = useRef<HTMLDivElement>(null);
    const canvasRef = useRef<HTMLCanvasElement>(null);

    const inputAnalyserRef = useRef<Analyser | null>(null);
    const outputAnalyserRef = useRef<Analyser | null>(null);

    useEffect(() => {
        if (inputNode) inputAnalyserRef.current = new Analyser(inputNode);
    }, [inputNode]);

    useEffect(() => {
        if (outputNode) outputAnalyserRef.current = new Analyser(outputNode);
    }, [outputNode]);

    useEffect(() => {
        if (!canvasRef.current) return;

        const scene = new THREE.Scene();
        scene.background = new THREE.Color(0x020617); // Match slate-950

        const width = containerRef.current?.clientWidth || window.innerWidth;
        const height = containerRef.current?.clientHeight || window.innerHeight;

        const camera = new THREE.PerspectiveCamera(75, width / height, 0.1, 1000);
        camera.position.set(0, 0, 5);

        const renderer = new THREE.WebGLRenderer({
            canvas: canvasRef.current,
            antialias: true,
            alpha: true
        });
        renderer.setSize(width, height);
        renderer.setPixelRatio(window.devicePixelRatio);

        const backdrop = new THREE.Mesh(
            new THREE.IcosahedronGeometry(10, 5),
            new THREE.RawShaderMaterial({
                uniforms: {
                    resolution: { value: new THREE.Vector2(width, height) },
                    rand: { value: 0 },
                },
                vertexShader: backdropVS,
                fragmentShader: backdropFS,
                glslVersion: THREE.GLSL3,
            })
        );
        backdrop.material.side = THREE.BackSide;
        scene.add(backdrop);

        const geometry = new THREE.IcosahedronGeometry(1.5, 32);
        const sphereMaterial = new THREE.MeshStandardMaterial({
            color: 0x3b82f6, // blue-500
            metalness: 0.8,
            roughness: 0.1,
            emissive: 0x1d4ed8, // blue-700
            emissiveIntensity: 0.5,
        });

        sphereMaterial.onBeforeCompile = (shader) => {
            shader.uniforms.time = { value: 0 };
            shader.uniforms.inputData = { value: new THREE.Vector4() };
            shader.uniforms.outputData = { value: new THREE.Vector4() };
            sphereMaterial.userData.shader = shader;
            shader.vertexShader = sphereVS;
        };

        const sphere = new THREE.Mesh(geometry, sphereMaterial);
        scene.add(sphere);

        // Light
        const pointLight = new THREE.PointLight(0xffffff, 50);
        pointLight.position.set(5, 5, 5);
        scene.add(pointLight);

        const ambientLight = new THREE.AmbientLight(0x404040);
        scene.add(ambientLight);

        const renderPass = new RenderPass(scene, camera);
        const bloomPass = new UnrealBloomPass(
            new THREE.Vector2(width, height),
            1.5,
            0.4,
            0.85
        );

        const composer = new EffectComposer(renderer);
        composer.addPass(renderPass);
        composer.addPass(bloomPass);

        let animationId: number;
        let prevTime = 0;
        const rotation = new THREE.Vector3(0, 0, 0);

        const animate = (t: number) => {
            animationId = requestAnimationFrame(animate);

            if (inputAnalyserRef.current) inputAnalyserRef.current.update();
            if (outputAnalyserRef.current) outputAnalyserRef.current.update();

            const dt = (t - prevTime) / (1000 / 60);
            prevTime = t;

            backdrop.material.uniforms.rand.value = Math.random() * 10000;

            if (sphereMaterial.userData.shader) {
                const inputFreq = inputAnalyserRef.current?.data[1] || 0;
                const outputFreq = outputAnalyserRef.current?.data[1] || 0;
                const inputLow = inputAnalyserRef.current?.data[0] || 0;
                const outputLow = outputAnalyserRef.current?.data[0] || 0;

                sphere.scale.setScalar(1 + (0.3 * outputFreq) / 255 + (0.1 * inputFreq) / 255);

                const f = 0.001;
                rotation.x += (dt * f * 0.5 * outputFreq) / 255;
                rotation.z += (dt * f * 0.5 * inputFreq) / 255;
                rotation.y += (dt * f * 0.25 * (inputFreq + outputFreq)) / 255;

                sphere.rotation.set(rotation.x, rotation.y, rotation.z);

                sphereMaterial.userData.shader.uniforms.time.value += (dt * 0.05 * (inputLow + outputLow)) / 255 || 0.01;

                sphereMaterial.userData.shader.uniforms.inputData.value.set(
                    (1 * (inputAnalyserRef.current?.data[0] || 0)) / 255,
                    (0.1 * (inputAnalyserRef.current?.data[1] || 0)) / 255,
                    (10 * (inputAnalyserRef.current?.data[2] || 0)) / 255,
                    0
                );
                sphereMaterial.userData.shader.uniforms.outputData.value.set(
                    (2 * (outputAnalyserRef.current?.data[0] || 0)) / 255,
                    (0.1 * (outputAnalyserRef.current?.data[1] || 0)) / 255,
                    (10 * (outputAnalyserRef.current?.data[2] || 0)) / 255,
                    0
                );
            }

            composer.render();
        };

        animate(0);

        const handleResize = () => {
            const w = containerRef.current?.clientWidth || window.innerWidth;
            const h = containerRef.current?.clientHeight || window.innerHeight;
            camera.aspect = w / h;
            camera.updateProjectionMatrix();
            renderer.setSize(w, h);
            composer.setSize(w, h);
            backdrop.material.uniforms.resolution.value.set(w, h);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            cancelAnimationFrame(animationId);
            window.removeEventListener('resize', handleResize);
            renderer.dispose();
            geometry.dispose();
            sphereMaterial.dispose();
        };
    }, []);

    return (
        <div ref={containerRef} className="w-full h-full absolute inset-0 rounded-[2.5rem] overflow-hidden">
            <canvas ref={canvasRef} className="block w-full h-full" />
        </div>
    );
};

export default AudioOrb;
