'use client';
import { useEffect, useState, useRef } from "react";
import { Clock } from "./parts/clock";

export const TimeLine = () => {
    const date = new Date();
    const [currentTime, setCurrentTime] = useState<Date>(date);
    const [scrollProgress, setScrollProgress] = useState(0);
    const containerRef = useRef<HTMLElement>(null);

    const year = currentTime.getFullYear();
    const listOfYears = [];

    for (let y = 2013; year >= y; y++) {
        listOfYears.push(y === year ? 'current Year' : y + "");
    }

    const month = currentTime.getMonth();
    const height_from_year = (year - 2013) + Number((Math.round((month / 12) * 100) / 100).toFixed(2));

    const minHeight = 100;
    const minHeightBody = 0;
    const maxHeight = height_from_year * 100;

    useEffect(() => {
        const container = containerRef.current;
        if (!container) return;

        const scrollDistance = maxHeight - minHeight;
        const initialOffsetTop = container.offsetTop * 0.1;

        const handleScroll = () => {
            const currentScroll = window.scrollY;
            const scrolled = currentScroll - initialOffsetTop;
            let progress = scrolled / scrollDistance;
            progress = Math.min(1, Math.max(0, progress));
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
    const currentBodyHeight = minHeightBody + (maxHeight - minHeightBody) * scrollProgress;
    const tempIndex = Math.floor(currentBodyHeight / 100)
    let tempArray = listOfYears.reverse().slice(0, tempIndex)
    return (
        <section ref={containerRef}
            className="p-6 rounded-lg bg-white flex  flex-col items-center justify-center transition-transform duration-300"
            style={{ height: `${currentHeight}px` }}
        >
            <div id='timelinebody' className="flex flex-row items-center justify-center w-full"
                style={{ height: `${currentBodyHeight}px` }}
            >
                <div id='education' className='bg-amber-400 w-6/13 h-full'></div>
                <div id='divider' className="w-1/13 h-full flex items-center justify-center flex-col pt-0">
                    {tempArray.map((year, index) => {
                        const isCurrentYearLine = index === tempArray.length - 1;
                        const currentYearLine = maxHeight % 100;
                        const scrollProgressInYear = currentBodyHeight % 100;
                    
                       let lineHeight = isCurrentYearLine ? Math.min(scrollProgressInYear, 80): 80;
                       if(index === 1){
                            lineHeight = Math.min(scrollProgressInYear, currentYearLine);
                       }else if(index === (listOfYears.length - 2) ){
                            lineHeight = Math.min(scrollProgressInYear+(currentYearLine*3), 80);
                       }

                        return (
                            <div key={index} className="flex flex-col items-center">
                                {index !== 0 && (
                                    <div
                                        className="w-2 bg-black mb-2"
                                        style={{
                                            height: `${lineHeight}px`,
                                            transition: 'height 0.1s linear'
                                        }}
                                    />
                                )}
                                <div className="px-1 py-0 bg-white rounded">
                                    {year}
                                </div>
                            </div>
                        );
                    })}
                </div>
                <div id='work' className="bg-blue-400 w-6/13 h-full"></div>
            </div>
            <Clock hourAngle={hourAngle} minuteAngle={minuteAngle} />
        </section>
    )
}