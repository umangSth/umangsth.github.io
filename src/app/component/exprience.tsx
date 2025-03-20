import { FaBriefcase, FaBuilding, FaCode } from "react-icons/fa";
import { works } from "./data/data";

export const Experience = () => {
    return (
        <section className="bg-white p-5 rounded-xl shadow-md hover:shadow-lg transition-all duration-300">
            <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                <span className="w-10 h-10  bg-[var(--secondary)] text-black-500 rounded-full flex items-center justify-center mr-2">
                    <FaBriefcase className="w-6 h-6" />
                </span>
                Professional Journey
            </h2>

            <div className="space-y-6">
                {works.map((exp, index) => (
                    <div key={index} className="group relative pl-8  hover:pl-10 transition-all">
                        <div className="p-6  rounded-lg shadow bg-gray-50 transition-colors">
                            <div className="mb-2">
                                <h3 className="text-lg font-semibold text-gray-800">{exp.title}</h3>
                                <div className="flex justify-between items-center">
                                    <h4 className="text-gray-700 font-medium mt-1">{exp.company}</h4>
                                    <p className="text-sm text-gray-500">{exp.dates}</p>
                                </div>
                            </div>
                            <ul className="space-y-3 pl-4 border-t pt-4">
                                {exp.responsibilities.map((item, i) => (
                                    <li key={i} className="text-gray-700 flex">
                                        <span className="text-blue-500 mr-2">▹</span>
                                        {item}
                                    </li>
                                ))}
                            </ul>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}