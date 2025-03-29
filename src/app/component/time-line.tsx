'use client';
import { useEffect, useState, useRef, useCallback } from "react";
import { Clock } from "./parts/clock";
import { works, educations } from "./data/data";
import { FaBriefcase, FaUniversity } from "react-icons/fa";

const CONSTANT_GAP = 10;
const ANIMATION_THRESHOLD = 80; // px before an item becomes visible to start animation

const calculateMonthDifference = (startDate: Date | string, endDate: Date | string) => {
    const end = endDate === 'current' ? new Date() : new Date(endDate);
    const start = startDate === 'current' ? new Date() : new Date(startDate);

    const startYear = start.getFullYear();
    const startMonth = start.getMonth();
    const endYear = end.getFullYear();
    const endMonth = end.getMonth();

    return (endYear - startYear) * 12 + (endMonth - startMonth);
};


const throttle = (func: Function, limit: number) => {
    let inThrottle: boolean;
    return function (this: any, ...args: any[]) {
        if (!inThrottle) {
            func.apply(this, args);
            inThrottle = true;
            setTimeout(() => inThrottle = false, limit);
        }
    };
}

interface yearColor {
    height: number,
    color: string
}
const defaultYearColor = { height: 0, color: 'rgb(255, 99, 132)' }

interface YearGap {
    [key: string]: {
        upper: yearColor,
        middle: yearColor,
        lower: yearColor,
        actualHeight: number;
    }
}


export const TimeLine = () => {
    const [date, setDate] = useState<Date>(new Date());

        useEffect(() => {
        setDate(new Date());
        }, []);
    const [currentTime, setCurrentTime] = useState<Date>(date);
    const [scrollProgress, setScrollProgress] = useState(0);
    const containerRef = useRef<HTMLElement>(null);
    const [colorCodes, setColorCodes] = useState<any>({});
    const yearsGap: YearGap = {};



    const dividerLineColor = 'rgb(75 85 99)';
    const year = currentTime.getFullYear();
    const month = currentTime.getMonth();
    const yearFraction = ((month + currentTime.getDate() / 30) / 12);


    const listOfYears = [];

    for (let y = 2013; year >= y; y++) {
        listOfYears.push(y === year ? 'current Year' : y + "");
    }

    const height_from_year = calculateMonthDifference('2014-12-25', date);
    const minHeight = 150;
    const maxHeight = height_from_year * CONSTANT_GAP;

    const handleScroll = useCallback(throttle(() => {
        const container = containerRef.current;
        if (!container) return;

        const scrollDistance = maxHeight - minHeight;
        const initialOffsetTop = container.offsetTop * 0.1;
        const currentScroll = window.scrollY;
        const scrolled = currentScroll - initialOffsetTop;
        let progress = scrolled / scrollDistance;
        progress = Math.min(1, Math.max(0, progress));
        setScrollProgress(progress);
    }, 16), [maxHeight, minHeight]); // 16 ms throttle (~60 fps)


    useEffect(() => {
        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, [handleScroll]);

    // Update clock time every minute when not scrolling
    useEffect(() => {
        const timer = setInterval(() => {
            if (scrollProgress === 0) {
                setCurrentTime(new Date());
            }
        }, 60000);

        return () => { clearInterval(timer) };
    }, [scrollProgress]);



    const scrollMinuteAngle = scrollProgress * 360 * 12;
    const scrollHourAngle = scrollProgress * 360 * 2;
    const hourAngle = scrollProgress > 0 ? scrollHourAngle : (currentTime.getHours() % 12) * 30 + currentTime.getMinutes() * 0.5;
    const minuteAngle = scrollProgress > 0 ? scrollMinuteAngle : currentTime.getMinutes() * 6;
    const currentHeight = Math.max(minHeight, maxHeight * scrollProgress);
    const currentBodyHeight = maxHeight * scrollProgress;
    const tempIndex = Math.floor(currentBodyHeight / 100)
    let tempArray = listOfYears.reverse().slice(0, tempIndex)
    let tempRemainingTopHeight = 0;

    // console.log("=========>",maxHeight, scrollProgress)



    // Calculate visibility of an item
    const calculateVisibility = (topPosition: number) => {
        // Start fading in before fully visible 
        const distanceFromVisibility = topPosition - currentBodyHeight;

        if (topPosition < 0) return 0;
        if (distanceFromVisibility > ANIMATION_THRESHOLD) return 0;
        if (distanceFromVisibility < 0) return 1;

        // smooth transition as element appraches visibility
        return 1 - (distanceFromVisibility / ANIMATION_THRESHOLD);
    }

    useEffect(() => {
        const newColorCodes: any = {};

        // calculate color codes for education and work sections
        works.forEach((work) => {
            const top = (calculateMonthDifference(work.time.end, date) * CONSTANT_GAP) + 80;
            const height = (calculateMonthDifference(work.time.start, work.time.end) * CONSTANT_GAP);
            newColorCodes[top] = { height, color: work.color };

        })
        educations.forEach((edu) => {
            const top = (calculateMonthDifference(edu.time.end, date) * CONSTANT_GAP) + 80;
            const height = (calculateMonthDifference(edu.time.start, edu.time.end) * CONSTANT_GAP);
            newColorCodes[top] = { height, color: edu.color };

        })
        setColorCodes(newColorCodes);
    }, [currentBodyHeight])



    return (
        <section ref={containerRef}
            className="mb-8 shadow-lg p-6 rounded-lg bg-white flex flex-col items-center transition-all duration-300 ease-out"
            style={{
                height: `${currentHeight}px`,
                minHeight: `${minHeight}px`,
            }}
        >
            <div id='timeLineHeader' className="flex flex-row w-full mb-2 text-center">
            <div className="flex flex-col items-center w-full">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                        <span className="w-10 h-10 bg-[var(--secondary)] text-black-500 rounded-full flex items-center justify-center mr-2">
                            <FaUniversity className="w-6 h-6" />
                        </span>
                        Education
                    </h2>
                </div>
                <div className="flex flex-col items-center justify-end  w-full">
                    <h2 className="text-2xl font-semibold text-gray-800 flex items-center">
                        <span className="w-10 h-10 bg-[var(--secondary)] text-black-500 rounded-full flex items-center justify-center mr-2">
                            <FaBriefcase className="w-6 h-6" />
                        </span>
                        Work
                    </h2>
                </div>
            </div>

            <div id='timelinebody' className="flex flex-row items-center justify-center w-full text-center relative"
                style={{ height: `${currentBodyHeight}px`, overflow: 'hidden' }}
            >
                {/* Education Column */}
                <div id='education' className='w-6/13 h-full flex flex-col items-center'>
                    <div className="relative w-full h-full">
                        {educations.map((edu, index) => {
                            const top = calculateMonthDifference(edu.time.end, date) * CONSTANT_GAP;
                            const height = calculateMonthDifference(edu.time.start, edu.time.end) * CONSTANT_GAP;
                            const isWithinView = top < currentBodyHeight;
                            const visibility = calculateVisibility(top);

                            return isWithinView && (
                                <div key={index}
                                    className="absolute left-4 w-4/5 p-4 rounded-lg bg-green-50 shadow-md transition-all duration-700 ease-out"
                                    style={{
                                        top: `${top}px`,
                                        height: `${height}px`,
                                        opacity: visibility,
                                        transform: `translateY(${(1 - visibility) * 20}px)  scale(${0.9 + (visibility * 0.1)})`,
                                        pointerEvents: visibility > 0.5 ? 'auto' : 'none'
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

                            );
                        })}
                    </div>
                </div>

                {/* Timeline Divider */}
                <div id='divider' className="w-1/13 h-full flex items-center  flex-col pt-0">
                    {(() => {
                        let cumulativeTop = 0;
                        let tempYearColorArray: any = {};
                        let tempColorRecord: any = {};
                        let firstItemFlag = true;
                        let preColorArray: any
                        return tempArray.map((year, index) => {
                            const isCurrentYearLine = index === tempArray.length - 1;
                            const scrollProgressInYear = currentBodyHeight % 100;

                            let defaultColor = dividerLineColor;
                            let lineHeight;

                            if (index === 1) {
                                lineHeight = yearFraction * 80;
                                firstItemFlag = false;
                            } else if (isCurrentYearLine) {
                                lineHeight = Math.min(scrollProgressInYear, 80);
                            } else {
                                lineHeight = 80;
                            }


                            const lineStart = cumulativeTop;
                            const lineEnd = lineStart + lineHeight;
                            const yearLabelHeight = 28;

                            let curColorArray: any = getColorForScroll(lineStart, colorCodes);
                            if (year !== 'current Year') {

                                const targetColorScrollPos = (currentBodyHeight - 128);
                                const diffColorLoadFlag = !!(curColorArray.height - preColorArray.height);
                                let takenHeight = 0;
                                let preTemp = tempYearColorArray[parseInt(year) + 1];
                                let curColorTopCrossFlag = curColorArray.top < targetColorScrollPos;
                                let remaining = 0;


                                if (year === '2024' && preTemp === undefined) {
                                    takenHeight = lineHeight + 28 + 28;
                                    preTemp = { remaining: 12220 };
                                    remaining = curColorArray.height - takenHeight;
                                } else {
                                    takenHeight = preTemp.totalHeight + lineHeight + 28;
                                    remaining = curColorArray.height - Math.abs((curColorArray.top - 80) - takenHeight);
                                }

                                let midHeight = (curColorArray.top - 80) - (preTemp.totalHeight + preTemp.remaining);
                                midHeight = midHeight < 0 ? 0 : midHeight > 80 ? 80 : midHeight;


                                defaultColor = curColorArray.color;
                                tempYearColorArray[year] = {
                                    top: {
                                        height: preTemp?.remaining > lineHeight ? lineHeight : preTemp.remaining,
                                        color: preColorArray.color
                                    },
                                    mid: {
                                        height: !diffColorLoadFlag ? 0 : !curColorTopCrossFlag ? lineHeight - preTemp.remaining : midHeight < 0 ? 0 : midHeight,
                                        color: diffColorLoadFlag && !curColorTopCrossFlag && preTemp.remaining > 0 ? curColorArray.color : '#000000'
                                    },
                                    end: {
                                        height: !diffColorLoadFlag ? 0 : curColorTopCrossFlag ? lineHeight - preTemp.remaining - midHeight : 0,
                                        color: diffColorLoadFlag && curColorTopCrossFlag ? curColorArray.color : '#000000'
                                    },
                                    remaining: remaining < 0 ? 0 : remaining,
                                    totalHeight: takenHeight
                                }
                            }



                            cumulativeTop = lineEnd + yearLabelHeight;
                            preColorArray = curColorArray
                            const realYear = year

                            return (
                                <div key={index} className="flex flex-col items-center">
                                    {index !== 0 && (
                                        <div className="flex flex-col">
                                            <div
                                                className="w-2 transition-all duration-300 ease-out"
                                                style={{
                                                    height: `${tempYearColorArray[realYear].top.height}px`,
                                                    backgroundColor: tempYearColorArray[realYear].top.color
                                                }}
                                            />
                                            <div
                                                className="w-2 transition-all duration-300 ease-out"
                                                style={{
                                                    height: `${tempYearColorArray[realYear].mid.height}px`,
                                                    backgroundColor: tempYearColorArray[realYear].mid.color
                                                }}
                                            />
                                            <div
                                                className="w-2 transition-all duration-300 ease-out"
                                                style={{
                                                    height: `${tempYearColorArray[realYear].end.height}px`,
                                                    backgroundColor: tempYearColorArray[realYear].end.color
                                                }}
                                            />

                                        </div>
                                    )}
                                    <div className="px-2 py-1 bg-white rounded-full shadow-sm text-sm font-medium">
                                        {year}
                                    </div>
                                </div>
                            );
                        });
                    })()}
                </div>

                {/* Work Column */}
                <div id='work' className="w-6/13 h-full flex flex-col items-center">
                    <div className="relative w-full h-full">
                        {works.map((work, index) => {
                            const top = calculateMonthDifference(work.time.end, date) * CONSTANT_GAP;
                            const height = calculateMonthDifference(work.time.start, work.time.end) * CONSTANT_GAP;
                            const isWithinView = top < currentBodyHeight;
                            const visibility = calculateVisibility(top);

                            return isWithinView && (
                                <div key={index}
                                    className="absolute left-4 w-4/5 p-4 rounded-lg bg-blue-50 shadow-md transition-all duration-700 ease-out"
                                    style={{
                                        top: `${top}px`,
                                        height: `${height}px`,
                                        opacity: visibility,
                                        transform: `translateY(${(1 - visibility) * 20}px) scale(${0.9 + (visibility * 0.1)})`,
                                        pointerEvents: visibility > 0.5 ? 'auto' : 'none'
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
                            );
                        })}
                    </div>
                </div>
            </div>
            <Clock hourAngle={hourAngle} minuteAngle={minuteAngle} />
        </section>
    )
}

function getColorForScroll(scrollProgress: number, colorCodes: any) {
    if (!colorCodes || Object.keys(colorCodes).length === 0) return 0;

    let closestKey = Object.keys(colorCodes)[0];
    let minDifference = Math.abs(scrollProgress - parseInt(closestKey));


    for (const key of Object.keys(colorCodes)) {
        const difference = Math.abs(scrollProgress - parseInt(key));
        if (difference < minDifference) {
            minDifference = difference;
            closestKey = key;
        }
    }

    return { height: colorCodes[closestKey].height, color: colorCodes[closestKey].color, top: parseInt(closestKey) };
}