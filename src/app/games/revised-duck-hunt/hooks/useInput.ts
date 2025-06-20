import { useState, useEffect } from 'react';

// returns a set of keys pressed 
export const useInput = () => {
    const [keysPressed, setKeysPressed] = useState<Set<string>>(new Set());


    useEffect(() => {
        // this function will add the keys pressed to the set state
        const handleKeyDown = (event: KeyboardEvent) => {
            setKeysPressed((prev)=> new Set(prev).add(event.key))
        };

        // this function will remove the keys released from the set state
        const handleKeyUp = (event: KeyboardEvent) => {
            setKeysPressed((prev)=>{
                const newSet = new Set(prev);
                newSet.delete(event.key);
                return newSet;                
            });
        };

        // add this function to the window object event listeners for keydown and keyup
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);


        return () => {
            // remove the event listeners when the component unmounts
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        }
    }, []);
    return keysPressed;
}