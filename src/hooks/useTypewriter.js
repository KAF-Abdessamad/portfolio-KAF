import { useState, useEffect, useCallback } from 'react';

/**
 * Custom hook for typewriter effect
 * @param {string} text - The full text to type
 * @param {number} speed - Typing speed in ms
 * @param {number} delay - Delay before starting in ms
 */
export const useTypewriter = (text, speed = 100, delay = 500) => {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        let timeout;
        let currentIndex = 0;

        const startTyping = () => {
            if (currentIndex <= text.length) {
                setDisplayText(text.substring(0, currentIndex));
                currentIndex++;
                timeout = setTimeout(startTyping, speed);
            } else {
                setIsComplete(true);
            }
        };

        const initialDelay = setTimeout(startTyping, delay);

        return () => {
            clearTimeout(timeout);
            clearTimeout(initialDelay);
        };
    }, [text, speed, delay]);

    return { displayText, isComplete };
};
