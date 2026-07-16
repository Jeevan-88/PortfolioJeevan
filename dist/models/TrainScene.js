import React, { useRef, useEffect } from 'react';
import { useGLTF, useAnimations } from '@react-three/drei';
import { useFrame } from '@react-three/fiber';

export default function TrainScene() {
    const group = useRef();
    // Ensure your GLB file is in the 'public/models' folder
    const { scene, animations } = useGLTF('/models/train.glb');
    const { actions } = useAnimations(animations, group);

    useEffect(() => {
        // This triggers the door animation when the scene loads
        // Make sure 'DoorOpen' matches the name of the animation in your Blender file
        if (actions.DoorOpen) {
            actions.DoorOpen.play();
        }
    }, [actions]);

    return <primitive ref={group} object={scene} />;
}