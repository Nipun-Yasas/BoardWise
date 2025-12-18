'use client';

import { useState, useEffect, useRef } from 'react';
import { motion } from 'motion/react';

export const Eye = ({ mouseX, mouseY }: { mouseX: number; mouseY: number }) => {
    const eyeRef = useRef<HTMLDivElement>(null);
    const [pupilPos, setPupilPos] = useState({ x: 0, y: 0 });

    useEffect(() => {
        if (!eyeRef.current) return;
        const rect = eyeRef.current.getBoundingClientRect();
        const eyeCenterX = rect.left + rect.width / 2;
        const eyeCenterY = rect.top + rect.height / 2;

        const angle = Math.atan2(mouseY - eyeCenterY, mouseX - eyeCenterX);
        const distance = Math.min(
            4, // Max pupil movement radius
            Math.hypot(mouseX - eyeCenterX, mouseY - eyeCenterY) / 10
        );

        setPupilPos({
            x: Math.cos(angle) * distance,
            y: Math.sin(angle) * distance,
        });
    }, [mouseX, mouseY]);

    return (
        <div
            ref={eyeRef}
            className="w-4 h-4 bg-white rounded-full flex items-center justify-center overflow-hidden"
        >
            <div
                className="w-2 h-2 bg-black rounded-full"
                style={{
                    transform: `translate(${pupilPos.x}px, ${pupilPos.y}px)`,
                }}
            />
        </div>
    );
};

export const Boxy = ({ mouseX, mouseY }: { mouseX: number; mouseY: number }) => {
    return (
        <motion.div
            animate={{ y: [0, -10, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}
            className="relative"
        >
            <div className="absolute -left-4 top-8 w-4 h-12 bg-blue-600 rounded-full -rotate-12 origin-top" />
            <div className="absolute -right-4 top-8 w-4 h-12 bg-blue-600 rounded-full rotate-12 origin-top" />
            <div className="absolute -bottom-8 left-4 w-5 h-10 bg-blue-600 rounded-full" />
            <div className="absolute -bottom-8 right-4 w-5 h-10 bg-blue-600 rounded-full" />
            <div className="w-24 h-24 bg-blue-500 rounded-2xl relative shadow-[0_8px_0_rgb(29,78,216)] border-2 border-blue-600 flex flex-col items-center justify-center gap-2 z-10">
                <div className="flex gap-4">
                    <Eye mouseX={mouseX} mouseY={mouseY} />
                    <Eye mouseX={mouseX} mouseY={mouseY} />
                </div>
                <div className="w-8 h-1 bg-black/20 rounded-full" />
            </div>
        </motion.div>
    );
};

export const Roundy = ({ mouseX, mouseY }: { mouseX: number; mouseY: number }) => {
    return (
        <motion.div
            animate={{ y: [0, -15, 0] }}
            transition={{ duration: 3, repeat: Infinity, ease: 'easeInOut', delay: 1 }}
            className="relative"
        >
            <div className="absolute -left-3 top-10 w-3 h-10 bg-pink-600 rounded-full -rotate-45" />
            <div className="absolute -right-3 top-10 w-3 h-10 bg-pink-600 rounded-full rotate-45" />
            <div className="absolute -bottom-6 left-6 w-3 h-8 bg-pink-600 rounded-full" />
            <div className="absolute -bottom-6 right-6 w-3 h-8 bg-pink-600 rounded-full" />
            <div className="w-20 h-20 bg-pink-500 rounded-full relative shadow-[0_8px_0_rgb(190,24,93)] border-2 border-pink-600 flex flex-col items-center justify-center gap-1 z-10">
                <div className="flex gap-2">
                    <Eye mouseX={mouseX} mouseY={mouseY} />
                </div>
                <div className="w-4 h-2 bg-black/20 rounded-b-full" />
            </div>
        </motion.div>
    );
};

export const Spiky = ({ mouseX, mouseY }: { mouseX: number; mouseY: number }) => {
    return (
        <motion.div
            animate={{ y: [0, -8, 0], rotate: [0, 5, -5, 0] }}
            transition={{ duration: 5, repeat: Infinity, ease: 'easeInOut', delay: 0.5 }}
            className="relative"
        >
            <div className="absolute -left-4 top-10 w-3 h-10 bg-yellow-600 rounded-full -rotate-45" />
            <div className="absolute -right-4 top-10 w-3 h-10 bg-yellow-600 rounded-full rotate-45" />
            <div className="absolute top-[70px] -left-2 w-3 h-10 bg-yellow-600 rounded-full rotate-12" />
            <div className="absolute top-[70px] -right-2 w-3 h-10 bg-yellow-600 rounded-full -rotate-12" />
            <div className="w-0 h-0 border-l-[40px] border-l-transparent border-r-[40px] border-r-transparent border-b-[80px] border-b-yellow-400 relative drop-shadow-[0_8px_0_rgb(202,138,4)] z-10">
                <div className="absolute -left-[40px] top-[40px] w-[80px] flex justify-center gap-1">
                    <Eye mouseX={mouseX} mouseY={mouseY} />
                    <Eye mouseX={mouseX} mouseY={mouseY} />
                </div>
            </div>
        </motion.div>
    );
};
