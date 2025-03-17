'use client';
import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { FaLaptopCode, FaReact, FaServer, FaDatabase, FaTools, FaGlobe } from "react-icons/fa";

export const About = () => {

    const [showFullAbout, setShowFullAbout] = useState(false);
    const characterLimit = 150;
    const [textHeight, setTextHeight] = useState('auto');
    const textRef: any = useRef(null);

    const text = 'Results-driven and passionate Web Developer with around 3 years of experience in building and maintaining web applications. Proficient in React.js, Next.js, Redux, Angular for front-end development and Node.js, ASP.NET Core, and MVC for back-end services. Skilled in relational databases such as MS-SQL, MySQL, and PostgreSQL. Experienced in API development, Agile methodologies, and Docker. Passionate about writing clean, efficient, and maintainable code with CI/CD best practices.';
    const [activeSkill, setActiveSkill] = useState('Frontend');
    useEffect(() => {
        if (textRef.current) {
            const fullHeight = textRef.current.scrollHeight;
            const truncatedText = text.slice(0, characterLimit) + '...';
            textRef.current.textContent = truncatedText;
            const collapsedHeight = textRef.current.scrollHeight;

            setTextHeight(showFullAbout ? `${fullHeight}px` : `${collapsedHeight}px`);
            if (showFullAbout) {
                textRef.current.textContent = text;
            }

        }

    }, [showFullAbout])
    const displayedText = showFullAbout ? text : text.slice(0, characterLimit) + (text.length > characterLimit ? '...' : '');



    const skillsData: any = {
        Frontend: {
            title: "Front-end Development",
            description: "Proficient in React.js, Next.js, Redux, and Angular, with experience in TypeScript, JavaScript, HTML, CSS, Tailwind CSS, and Sass for building responsive and visually appealing user interfaces.",
            platform: ["react", "nextjs", "redux", "angular", "typescript", "javascript", "html5", "css3", "tailwind"],
            icon: FaLaptopCode,
        },
        Backend: {
            title: "Back-end Development",
            description: "Skilled in Node.js, ASP.NET Core, and MVC, specializing in RESTful API development, authentication, and server-side logic.",
            platform: ["nodejs", "dotnet", "csharp", "express"],
            icon: FaServer,
        },
        Database: {
            title: "Database & ORM",
            description: "Experienced with relational databases such as MS-SQL, MySQL, and PostgreSQL, including query optimization, and database schema design.",
            platform: ["mysql", "postgresql", "mssql"],
            icon: FaDatabase,
        },
        DevOps: {
            title: "DevOps & Tools",
            description: "Strong foundation in Docker, Git, CI/CD, and Agile methodologies (Scrum & Kanban) for streamlined deployment and development.",
            platform: ["docker", "git", "github"],
            icon: FaTools,
        },
        Languages: {
            title: "Languages",
            description: "English (Professional), Hindi(Fluent), and Nepali(Native).",
            // platform: ["globe"]
            icon: FaGlobe,
        }
    }


    return (
        <div className='flex flex-row gap-8 mb-8'>
            <section id='about' className="flex flex-col w-1/3 transition-all duration-1000 ease-in-out ">
                <div className="flex flex-row gap-8 p-6 bg-[var(--primary)] rounded-t-2xl shadow-md hover:shadow-neutral-900">
                    <Image
                        src="/images/avatar-logo/me.png"
                        alt="Umanga Shrestha"
                        width={200}
                        height={200}
                        className="border-2 border-gray-400 rounded-full shadow-lg shadow-gray-400/50 hover:shadow-xl"
                    />
                    <div className="flex flex-col justify-center">
                        <h1 className="text-3xl font-bold text-gray-900 mb-1">Umanga Shrestha</h1>
                        <p className="text-lg text-gray-600">Web Developer | Game Enthusiast | Amateur Artist</p>
                    </div>
                </div>
                <div
                    className="flex flex-col gap-1 items-left p-6  bg-[var(--secondary)] rounded-b-2xl shadow-md hover:shadow-neutral-900">
                    <h2 className="text-1xl font-semibold mb-2 text-gray-800">ABOUT ME:</h2>
                    <div className="overflow-hidden transition-all duration-500 ease-in-out" style={{ height: textHeight }}>
                        <p ref={textRef} className="text-gray-700 leading-relaxed">
                            {displayedText}
                        </p>
                    </div>

                    {text.length > characterLimit && (
                        <button
                            className="text-blue-500 mt-2 self-start cursor-pointer"
                            onClick={() => setShowFullAbout(!showFullAbout)}
                        >
                            {showFullAbout ? 'Read less' : 'Read more'}
                        </button>
                    )}
                </div>
            </section>
            <section id='skill' className="mb-8 w-2/3">
                <h2 className="text-2xl font-semibold mb-4 text-gray-800">SKILLS</h2>
                <div className="grid grid-cols-2 gap-4">
                    {Object.keys(skillsData).map((category) => {
                        const Icon = skillsData[category].icon;
                        return (
                            <div key={category} className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
                                <h3 className="text-lg font-semibold mb-3 text-gray-800 flex items-center">
                                    <span className="w-8 h-8  bg-[var(--secondary)] text-black-400  rounded-full flex items-center justify-center mr-2">
                                        <span className="text-xs">
                                            <Icon className="w-4 h-4" />
                                        </span>
                                    </span>
                                    {skillsData[category].title}
                                </h3>
                                <p className="text-gray-700 text-sm leading-relaxed">{skillsData[category].description}</p>

                                <div className="flex flex-wrap gap-2 mt-4">
                                    {skillsData[category].platform?.map((item: any) => (
                                        !item ? null :
                                            <span key={item} className="px-2 py-1  bg-[var(--secondary)] text-xs text-black-500 rounded-full hover:scale-130 cursor-pointer">{item}</span>
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