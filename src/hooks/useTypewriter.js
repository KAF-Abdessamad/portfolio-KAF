import { useState, useEffect } from 'react';

/**
 * Custom hook for typewriter effect
 * @param {string} text - The full text to type
 * @param {number} speed - Typing speed in ms
 * @param {number} delay - Delay before starting in ms
 */
export const useTypewriter = (text = '', speed = 100, delay = 500) => {
    const [displayText, setDisplayText] = useState('');
    const [isComplete, setIsComplete] = useState(false);

    useEffect(() => {
        const safeText = text || '';
        setDisplayText('');
        setIsComplete(false);

        if (!safeText) return;

        let timeout;
        let currentIndex = 0;

        const startTyping = () => {
            if (currentIndex <= safeText.length) {
                setDisplayText(safeText.substring(0, currentIndex));
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
