

'use client';
import Link from "next/link";
import React, { useEffect, useState } from "react";



export const Header = (props: React.PropsWithChildren) => {
    const [isScrolled, setIsScrolled] = useState(false);
    const [isNavOpen, setIsNavOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            const scrolled = window.scrollY > 50;
            setIsScrolled(scrolled);
            if (scrolled) setIsNavOpen(false);
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    const toggleNavState = (caseParam: 'header-case' | 'hamIcon-case') => {
        switch (caseParam) {
            case 'header-case':
                if (window.scrollY > 50) {
                    setIsNavOpen(false);
                    setIsScrolled(true);
                }
                break;

            case 'hamIcon-case':
                setIsNavOpen(true);
                setIsScrolled(false);
                break;
        }
    };

    return (
        <>
        <header className="h-24 sm:h-32 flex items-center z-30 w-full fixed ">
            <div className="container mx-auto px-6 flex items-center justify-end">
                <div className="flex items-center gap-4 sm:gap-6" onMouseLeave={() => toggleNavState('header-case')}>
                    <nav className={`
                      font-sen text-gray-800 dark:text-white uppercase text-lg items-center 
                          transition-all duration-1000 ease-in-out
                          ${isScrolled ? 'opacity-0 translate-x-full lg:translate-x-20 pointer-events-none' :
                            'opacity-100 translate-x-0'}
                          ${isNavOpen ? '!opacity-100 !translate-x-0 pointer-events-auto' : ""}
                          relative lg:static`}
                    >
                        <div className="flex  items-center gap-4">
                            <Link href="/" className="shadow-lg shadow-gray-300/50 hover:shadow-xl flex items-center px-4 py-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-600 transition-all group">
                                <svg id="resume" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                                    {/* Main document body */}
                                    <rect x="2" y="4" width="18" height="20" rx="2" className="" />

                                    <circle cx="6" cy="8" r="1" className="fill-white" />
                                    <rect x="8" y="7.5" width="10" height="1" className="fill-blue-300" />

                                    <circle cx="6" cy="11" r="1" className="fill-white " />
                                    <rect x="8" y="10.5" width="8" height="1" className="fill-blue-300" />

                                    <circle cx="6" cy="14" r="1" className="fill-white" />
                                    <rect x="8" y="13.5" width="6" height="1" className="fill-blue-300" />

                                    <circle cx="6" cy="17" r="1" className="fill-white" />
                                    <rect x="8" y="16.5" width="8" height="1" className="fill-blue-300" />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-200 ">Resume</span>
                            </Link>
                            <Link href="/drawings" className="shadow-lg shadow-gray-300/50 hover:shadow-xl flex items-center px-4 py-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 drak:hover:bg-gray-600 transition-all group">
                                <svg id="pencil" viewBox="0 0 24 24" className="h-5 w-5 mr-0">
                                    <polygon points="4,20 7,20 5,25 6,25" className="" />
                                    <polygon points="1,14 9,14 7,20 4,20" className=" fill-orange-400" />
                                    <rect x="0.9" y="0" width="8.5" height="15" rx="1" ry="2" className="" />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-200 ">Drawings</span></Link>
                            <Link href="/games" className="shadow-lg shadow-gray-300/50 hover:shadow-xl flex items-center px-4 py-2 bg-white dark:bg-gray-700 rounded-lg hover:bg-gray-100 drak:hover:bg-gray-600 transition-all group">
                                <svg id="pacman" viewBox="0 0 24 24" className="h-5 w-5 mr-2">
                                    <circle cx="50%" cy="50%" r="25%" />
                                </svg>
                                <span className="text-gray-700 dark:text-gray-200 ">Games</span>
                            </Link>
                        </div>
                    </nav>
                    <button
                        className={`flex flex-col ml-4 transition-opacity duration-600 bg-white py-3 px-3 rounded-full hover:bg-gray-200 
                          ${isScrolled ? 'lg:flex pointer' : ''}
                          ${isScrolled && !isNavOpen ? 'opacity-100' : 'opacity-0 lg:opacity-0'}
                          shadow-lg shadow-gray-400/50 hover:shadow-xl
                          group-hover:opacity-100`}
                        onMouseEnter={() => { toggleNavState('hamIcon-case'); }}
                        onMouseLeave={() => { setIsNavOpen(false); }}
                        onClick={() => setIsNavOpen(!isNavOpen)}
                    >
                        <span className={`w-6 h-1 bg-gray-800 dark:bg-white mb-1 
                          `} />
                        <span className={`w-6 h-1 bg-gray-800 dark:bg-white mb-1 
                          `} />
                        <span className={`w-6 h-1 bg-gray-800 dark:bg-white mb-1 
                            
                          `} />

                    </button>
                </div>
            </div>
        </header>
        {props.children}
        </>
    )
}