"use client";

import { motion } from 'framer-motion';
import { useEffect, useRef, useState } from 'react';

const CHARS = "ABCDEFGHIJKLMNOPQRSTUVWXYZ!@#$%^&*():{};|,.<>?";

export function ScrambleText({ text }: { text: string }) {
    const [displayText, setDisplayText] = useState(text);
    const intervalRef = useRef<any>(null);

    useEffect(() => {
        let iteration = 0;
        clearInterval(intervalRef.current);

        intervalRef.current = setInterval(() => {
            setDisplayText(prev => prev
                .split("")
                .map((letter, index) => {
                    if (index < iteration) {
                        return text[index];
                    }
                    return CHARS[Math.floor(Math.random() * CHARS.length)]
                })
                .join("")
            );

            if (iteration >= text.length) {
                clearInterval(intervalRef.current);
            }

            iteration += 1 / 3;
        }, 40);

        return () => clearInterval(intervalRef.current);

    }, [text]);


    return (
        <motion.span
            whileHover={{
                scale: 1.05,
                transition: { duration: 0.2 },
            }}
            className="inline-block"
        >
            {displayText}
        </motion.span>
    );
};
