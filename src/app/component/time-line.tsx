'use client';
import { useEffect, useState, useRef } from "react";

export const TimeLine = () => {
    const [currentTime, setCurrentTime] = useState(new Date());
    const [scrollProgress, setScrollProgress] = useState(0);
    const containerRef = useRef<HTMLElement>(null);
    

    const minHeight = 100;
    const maxHeight = 1000;

    useEffect(()=>{
        const container = containerRef.current;
        if(!container) return;

        const scrollDistance = maxHeight - minHeight;
        const initialOffsetTop = container.offsetTop * 0.1;

        const handleScroll = () =>{
            const currentScroll = window.scrollY;
            const scrolled = currentScroll - initialOffsetTop;
            let progress = scrolled / scrollDistance;
            progress = Math.min(1, Math.max(0, progress));
            console.log('progress',progress)
            setScrollProgress(progress);
        }

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

   

    const scrollHourAngle = scrollProgress * 360 * 2;
    const scrollMinuteAngle = scrollProgress * 360 * 12;


    const hourAngle = scrollProgress > 0 ? scrollHourAngle : (currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5;
    const minuteAngle = scrollProgress > 0 ? scrollMinuteAngle : currentTime.getMinutes() * 6; 
    const currentHeight = minHeight + (maxHeight - minHeight) * scrollProgress;

    return (
        <section ref={containerRef}  
            className="p-6 rounded-lg bg-white flex items-center justify-center transition-transform duration-300"
            style={{height: `${currentHeight}px`}}
            >   
            
            <div id='clock' 
                className="sticky top-10/12 flex"
                >
                <svg viewBox="0 0 50 50" className="h-15 w-15 mr-2">
                    <circle cx="25" cy="25" r="20" className="stroke-current stroke-4 fill-none" />

                    <line x1="25" y1="7" x2="25" y2="10" className="stroke-current stroke-2" />
                    <line x1="25" y1="40" x2="25" y2="43" className="stroke-current stroke-2" />
                    <line x1="40" y1="25" x2="43" y2="25" className="stroke-current stroke-2" />
                    <line x1="7" y1="25" x2="10" y2="25" className="stroke-current stroke-2" />
                    {/* long hand */}
                    <line x1="25" y1="25" x2="25" y2="16"
                        className="stroke-current stroke-2 origin-center"
                        style={{ transform: `rotate(${hourAngle}deg)`, transformOrigin: '25px 25px' }} />
                    {/* short hand */}
                    <line x1="25" y1="25" x2="25" y2="10"
                        className="stroke-current stroke-1 origin-center"
                        style={{ transform: `rotate(${minuteAngle}deg)`, transformOrigin: '25px 25px' }} />

                    <circle cx="25" cy="25" r="1.5" className="fill-current" />
                </svg>
            </div>
        </section>
    )
}