'use client';
import { useEffect, useState, useRef } from "react";
import { Clock } from "./parts/clock";
import { works, educations } from "./data/data";
import { FaBriefcase, FaUniversity } from "react-icons/fa";

const CONSTANT_GAP = 10;

const calculateMonthDifference = (startDate: Date | string, endDate: Date | string) => {
    const end = endDate === 'current' ? new Date() : new Date(endDate);
    const start = startDate === 'current' ? new Date() : new Date(startDate);

    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();

    return (endYear - startYear) * 12 + (endMonth - startMonth);
};

export const TimeLine = () => {
    const date = new Date();
    const [currentTime, setCurrentTime] = useState<Date>(date);
    const [scrollProgress, setScrollProgress] = useState(0);
    const containerRef = useRef<HTMLElement>(null);

    const dividerLineColor = 'rgb(75 85 99)';
    const year = currentTime.getFullYear();
    const listOfYears = [];

    for (let y = 2013; year >= y; y++) {
        listOfYears.push(y === year ? 'current Year' : y + "");
    }
    
    const height_from_year = calculateMonthDifference('2014-12-25', date);
    const minHeight = 100;
    const maxHeight = height_from_year * CONSTANT_GAP;

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
    const currentHeight = maxHeight * scrollProgress;
    const currentBodyHeight = maxHeight * scrollProgress;
    const tempIndex = Math.floor(currentBodyHeight / 100)
    let tempArray = listOfYears.reverse().slice(0, tempIndex)

    return (
        <section ref={containerRef}
            className="p-6 rounded-lg bg-white flex flex-col items-center justify-center transition-transform duration-300"
            style={{ height: `${currentHeight}px` }}
        >
            <div id='timeLineHeader' className="flex flex-row items-center justify-center w-full text-center">
                <div className="flex flex-col items-center w-full">
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                        <span className="w-10 h-10 bg-[var(--secondary)] text-black-500 rounded-full flex items-center justify-center mr-2">
                            <FaBriefcase className="w-6 h-6" />
                        </span>
                        Work
                    </h2>
                </div>                     
                <div className="flex flex-col items-center w-full">    
                    <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                        <span className="w-10 h-10 bg-[var(--secondary)] text-black-500 rounded-full flex items-center justify-center mr-2">
                            <FaUniversity className="w-6 h-6" />
                        </span>
                        Education
                    </h2>
                </div> 
            </div>

            <div id='timelinebody' className="flex flex-row items-center justify-center w-full text-center"
                style={{ height: `${currentBodyHeight}px` }}
            >
                {/* Education Column */}
                <div id='education' className='w-6/13 h-full flex flex-col items-center'>
                    <div className="relative w-full h-full">
                        {educations.map((edu, index) => {
                            const top = calculateMonthDifference(edu.time.end, date) * CONSTANT_GAP;
                            const height = calculateMonthDifference(edu.time.start, edu.time.end) * CONSTANT_GAP;  
                            const isVisible = currentBodyHeight > top;
                                   
                            return (
                                isVisible && (
                                    <div key={index} 
                                        className="absolute left-4 w-4/5 p-4 rounded-lg bg-green-50 shadow-md transition-all duration-500 ease-out"
                                        style={{ 
                                            top: `${top}px`, 
                                            height: `${height}px`,
                                            opacity: isVisible ? 1 : 0,
                                            transform: `translateY(${isVisible ? 0 : 20}px)`
                                        }}>
                                        <div className="flex items-center mb-2">
                                            <div className="w-3 h-3 bg-green-500 rounded-full mr-2" />
                                            <h3 className="font-semibold text-sm text-green-800">
                                            {edu.institution}-{edu.location}
                                            </h3>
                                        </div>
                                        <ul className="text-xs text-green-700 list-disc list-inside pl-2">
                                            {edu.material.map((material, i) => (
                                                <li key={i} className="mb-1">{material}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            );
                        })}
                    </div>
                </div>

                {/* Timeline Divider */}
                <div id='divider' className="w-1/13 h-full flex items-center justify-center flex-col pt-0">
                    {tempArray.map((year, index) => {
                        const isCurrentYearLine = index === tempArray.length - 1;
                        const currentYearLine = maxHeight % 100;
                        const scrollProgressInYear = currentBodyHeight % 100;

                        let lineHeight = isCurrentYearLine ? Math.min(scrollProgressInYear, 80) : 80;
                        if (index === 1) {
                            lineHeight = Math.min(scrollProgressInYear, currentYearLine);
                        } else if (index === (listOfYears.length - 2)) {
                            lineHeight = Math.min(scrollProgressInYear + (currentYearLine * 3), 80);
                        }
                        
                        return (
                            <div key={index} className="flex flex-col items-center">
                                {index !== 0 && (
                                    <div
                                        className="w-2 mb-2"
                                        style={{
                                            height: `${lineHeight}px`,
                                            transition: 'height 0.1s linear',
                                            backgroundColor: dividerLineColor
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

                {/* Work Column */}
                <div id='work' className="w-6/13 h-full flex flex-col items-center">
                    <div className="relative w-full h-full">
                        {works.map((work, index) => {
                            const top = calculateMonthDifference(work.time.end, date) * CONSTANT_GAP;
                            const height = calculateMonthDifference(work.time.start, work.time.end) * CONSTANT_GAP;
                            const isVisible = currentBodyHeight > top;
                            
                            return (
                                isVisible && (
                                    <div key={index} 
                                        className="absolute left-4 w-4/5 p-4 rounded-lg bg-blue-50 shadow-md transition-all duration-500 ease-out"
                                        style={{ 
                                            top: `${top}px`, 
                                            height: `${height}px`,
                                            opacity: isVisible ? 1 : 0,
                                            transform: `translateY(${isVisible ? 0 : 20}px)`
                                        }}>
                                        <div className="flex items-center mb-2">
                                            <div className="w-3 h-3 bg-blue-500 rounded-full mr-2" />
                                            <h3 className="font-semibold text-sm text-blue-800">
                                                {work.title} - {work.company}
                                            </h3>
                                        </div>
                                        <ul className="text-xs text-blue-700 list-disc list-inside pl-2">
                                            {work.responsibilities.map((responsibility, i) => (
                                                <li key={i} className="mb-1">{responsibility}</li>
                                            ))}
                                        </ul>
                                    </div>
                                )
                            );
                        })}
                    </div>
                </div>
            </div>
            <Clock hourAngle={hourAngle} minuteAngle={minuteAngle} />
        </section>
    )
}