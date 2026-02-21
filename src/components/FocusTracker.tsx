import { useEffect, useRef } from 'react';
import * as tf from '@tensorflow/tfjs-core';
import '@tensorflow/tfjs-backend-webgl';
import * as faceDetection from '@tensorflow-models/face-detection';
import { useApp } from '../context/AppContext';

export default function FocusTracker() {
    const { state, dispatch } = useApp();
    const videoRef = useRef<HTMLVideoElement>(null);
    const detectorRef = useRef<faceDetection.FaceDetector | null>(null);
    const scoreRef = useRef(100);

    useEffect(() => {
        let stream: MediaStream | null = null;
        let animationFrameId: number;

        const setupDetector = async () => {
            try {
                dispatch({ type: 'SET_FOCUS_STATUS', payload: 'loading' });
                await tf.ready();
                const model = faceDetection.SupportedModels.MediaPipeFaceDetector;
                const detectorConfig: any = {
                    runtime: 'mediapipe', // Advanced runtime
                    solutionPath: `https://cdn.jsdelivr.net/npm/@mediapipe/face_detection`,
                    modelType: 'short',
                };
                detectorRef.current = await faceDetection.createDetector(model, detectorConfig);
            } catch (e) {
                console.error('FocusTracker: Detector setup failed', e);
                dispatch({ type: 'SET_FOCUS_STATUS', payload: 'error' });
                throw e;
            }
        };

        const startCamera = async () => {
            try {
                if (!detectorRef.current) await setupDetector();

                stream = await navigator.mediaDevices.getUserMedia({
                    video: { width: 320, height: 240, frameRate: 15 }
                });

                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                    videoRef.current.onloadedmetadata = () => {
                        videoRef.current?.play();
                        dispatch({ type: 'SET_FOCUS_STATUS', payload: 'ready' });
                        analyze();
                    };
                }
            } catch (err) {
                console.error('FocusTracker: Initialization failed', err);
                dispatch({ type: 'SET_FOCUS_STATUS', payload: 'error' });
            }
        };

        const analyze = async () => {
            const video = videoRef.current;
            if (!video || !detectorRef.current || video.paused || video.ended) return;

            try {
                const faces = await detectorRef.current.estimateFaces(video);
                let newScore = scoreRef.current;

                if (!faces || faces.length === 0) {
                    // No face detected - User might be away
                    newScore = Math.max(0, newScore - 4);
                } else if (faces.length > 1) {
                    // Multiple faces - Potential distraction
                    newScore = Math.max(0, newScore - 2);
                } else {
                    // Single face detected - Check position
                    const face = faces[0];
                    const box = face.box;

                    // Check if centered (simple heuristic)
                    const centerX = box.xMin + box.width / 2;
                    const centerY = box.yMin + box.height / 2;

                    const isLookingAway = centerX < 60 || centerX > 260 || centerY < 40 || centerY > 200;

                    if (isLookingAway) {
                        newScore = Math.max(0, newScore - 1);
                    } else {
                        newScore = Math.min(100, newScore + 0.5);
                    }
                }

                scoreRef.current = newScore;
                if (Math.abs(newScore - (state.focusSession?.score ?? 100)) >= 1) {
                    dispatch({ type: 'UPDATE_FOCUS_SCORE', payload: Math.round(newScore) });
                }
            } catch (e) {
                console.error('Face Analysis Error', e);
            }

            animationFrameId = requestAnimationFrame(analyze);
        };

        if (state.focusSession?.active) {
            startCamera();
        }

        return () => {
            if (stream) {
                stream.getTracks().forEach(track => track.stop());
            }
            if (animationFrameId) cancelAnimationFrame(animationFrameId);
        };
    }, [state.focusSession?.active, dispatch]);

    return (
        <div style={{ position: 'absolute', opacity: 0, pointerEvents: 'none' }}>
            <video ref={videoRef} width="320" height="240" muted playsInline />
        </div>
    );
}
