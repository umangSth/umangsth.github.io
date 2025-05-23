'use client';
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { skillsData, FullText } from "../data/data";
import imageLoader from "../helper_function/helper_function";

export const About = () => {
    
    const characterLimit = 150;
    const [isExpanding, setIsExpanding] = useState(false);
    const[isCollapsing, setIsCollapsing] = useState(false);
    const [displayedText, setDisplayedText] = useState(FullText.slice(0, characterLimit) + '...');
    const [textHeight, setTextHeight] = useState('');


 
    const textRef = useRef<HTMLParagraphElement>(null);
    const animationRef = useRef<number | null>(null);

    // Initialize with truncated text
    useEffect(() => {
        const initialText = FullText.slice(0, characterLimit) + '...';
        setDisplayedText(initialText);
    }, [])

    // Update height whenever displayed text changes
    useEffect(() => {
        // Only run on the client
        if (typeof window !== 'undefined' && textRef.current) {
            setTextHeight(`${textRef.current.scrollHeight}px`);
        }
    }, [displayedText, textHeight]);

    // Handle expanding animation
    useEffect(()=> {
        if (!isExpanding)  return;

        let currentIndex = characterLimit;
        const truncatedText = FullText.slice(0, characterLimit);

        const animateExpand = () => {
            if (currentIndex <= FullText.length){
                setDisplayedText(FullText.slice(0, currentIndex));
                currentIndex++;
                animationRef.current = requestAnimationFrame(animateExpand)
            }else {
                setIsExpanding(false);
                animationRef.current = null;
            }
        };

        // start with truncated text without ellipsis
        setDisplayedText(truncatedText);

        // small deplay before starting animation
        setTimeout(()=> {   
            animationRef.current = requestAnimationFrame(animateExpand);
        }, 4);

        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        }

    }, [isExpanding])


    // Handle collapsing animation
    useEffect(()=> {
        if (!isCollapsing) return;

        let currentIndex = FullText.length;

        const animateCollapse = () => {
            if (currentIndex > characterLimit){
                currentIndex--;
                setDisplayedText(FullText.slice(0, currentIndex));
                animationRef.current = requestAnimationFrame(animateCollapse)
            } else {
                setDisplayedText(FullText.slice(0, characterLimit) + '...');
                setIsCollapsing(false);
                animationRef.current = null;
            }
        };

        animationRef.current = requestAnimationFrame(animateCollapse);
        return () => {
            if (animationRef.current) {
                cancelAnimationFrame(animationRef.current);
                animationRef.current = null;
            }
        }

    },[isCollapsing])

    const handleToggleText = () =>{
        if (isExpanding || isCollapsing) return;

        if (displayedText.length <= characterLimit + 3) {
            setIsExpanding(true);
        } else {
            setIsCollapsing(true);
        }
    }


    return (
        <div className='flex flex-col lg:flex-row  gap-8 mb-8'>
            <section id='about' className="flex flex-col w-full lg:w-2/5 xl:w-1/3 transition-all duration-1000 ease-in-out ">
                <div className="flex flex-row gap-8 lg:gap-4 p-6 bg-[var(--primary)] rounded-t-2xl shadow-md hover:shadow-neutral-900">
                    <Image
                        src={imageLoader("/images/avatar-logo/me.png")}
                        alt="Umanga Shrestha"
                        width={80}
                        height={40}
                        className="border-2 border-gray-400 rounded-full shadow-lg shadow-gray-400/50 hover:shadow-xl sm:w-32 sm:h-32 lg:w-40 lg:h-40"
                    />
                    <div className="flex flex-col justify-center">
                        <h1 className="text-lg sm:text-lg lg:text-xl xl:text-2xl font-bold text-gray-900 mb-1">Umanga Shrestha</h1>
                        <p className=" text-sm lg:text-sm xl:text-lg text-gray-600">Web Developer | Game Enthusiast | Amateur Artist</p>
                    </div>
                </div>
                <div
                    className="flex flex-col gap-1 items-left p-6  bg-[var(--secondary1)] rounded-b-2xl shadow-md hover:shadow-neutral-900">
                    <h2 className="text-sm lg:text-sm xl:text-lg font-semibold mb-2 text-gray-800">ABOUT ME:</h2>
                    <div className="text-sm lg:text-sm xl:text-lg overflow-hidden transition-all duration-500 ease-in-out" style={{ height: textHeight }}>
                        <p ref={textRef} className="text-gray-700 leading-relaxed">
                            {displayedText}
                        </p>
                    </div>

                    {FullText.length > characterLimit && (
                        <button
                            className="text-blue-500 mt-2 text-sm lg:text-sm xl:text-lg  self-start cursor-pointer"
                            onClick={handleToggleText}
                            disabled={isExpanding || isCollapsing}
                        >
                            {displayedText.length > characterLimit + 3 ? 'Read less' : 'Read more'}
                        </button>
                    )}
                </div>
            </section>
            <section id='skill' className="mb-8 lg:w-3/5 xl:w-2/3">
                {/* <h2 className="text-lg sm:text-lg lg:text-xl xl:text-2xl font-semibold mb-4 text-gray-800">Skills</h2> */}
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                    {Object.keys(skillsData).map((category) => {
                        const Icon = skillsData[category].icon;
                        return (
                            <div key={category} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                                <h3 className="text-sm lg:text-sm xl:text-lg font-semibold mb-3 text-gray-800 flex items-center">
                                    <span className="w-8 h-8  bg-[var(--secondary1)] text-black-400  rounded-full flex items-center justify-center mr-2">
                                        <span className="text-xs">
                                            <Icon className="w-4 h-4" />
                                        </span>
                                    </span>
                                    {skillsData[category].title}
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">{skillsData[category].description}</p>

                                <div className="text-sm lg:text-sm xl:text-lg flex flex-wrap gap-2 mt-4">
                                    {skillsData[category].platform?.map((item: string) => (
                                        !item ? null :
                                            <span key={item} className="px-2 py-1 bg-[var(--secondary1)] text-xs text-black-500 rounded-full hover:scale-130 cursor-pointer">{item}</span>
                                    ))}
                                </div>
                            </div>
                        )
                    })}
                </div>
            </section>
        </div>

    )
}