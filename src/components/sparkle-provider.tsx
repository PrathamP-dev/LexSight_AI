'use client';

import React, { createContext, useContext, useEffect } from 'react';

const SparkleContext = createContext<((e: MouseEvent) => void) | null>(null);

export const useSparkle = () => {
    return useContext(SparkleContext);
};

export const SparkleProvider = ({ children }: { children: React.ReactNode }) => {

    const createSparkle = (e: MouseEvent) => {
        const sparkle = document.createElement('div');
        sparkle.className = 'sparkle';
        document.body.appendChild(sparkle);

        sparkle.style.left = `${e.clientX}px`;
        sparkle.style.top = `${e.clientY}px`;

        setTimeout(() => {
            sparkle.remove();
        }, 500);
    };

    useEffect(() => {
        window.addEventListener('click', createSparkle);
        return () => window.removeEventListener('click', createSparkle);
    }, []);

    return (
        <SparkleContext.Provider value={createSparkle}>
            {children}
        </SparkleContext.Provider>
    );
};
