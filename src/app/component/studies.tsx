import { FaUniversity } from "react-icons/fa";
import { educations } from "./data";


export const Studies = () => {
    return (
        <section className="my-16 p-6 rounded-lg bg-white shadow-lg">
                        <h2 className="text-2xl font-semibold mb-6 text-gray-800 flex items-center">
                 <span className="w-10 h-10  bg-[var(--secondary)] text-black-500 rounded-full flex items-center justify-center mr-2">
                        <FaUniversity className="w-6 h-6" />
                </span>    
                Education
            </h2>
            <div className="space-y-6">
                {educations.map((edu, index) => (
                        <div key={index} className='group relative pl-8  hover:pl-10 transition-all'>
                            <div className="absolute w-4 h-4 rounded-full"></div>
                            <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                            <h3 className="text-lg font-semibold text-gray-800">{edu.title}</h3>
                            <div className="mb-2    ">
                                <div className="flex justify-between items-center">
                                    <h4 className="text-gray-700 font-medium mt-1">{edu.institution}</h4>
                                    <p className="text-sm text-gray-500">{edu.location}</p>
                                </div>
                            </div>
        
                                <ul className="space-y-3 pl-4 border-t pt-4">
                                    {
                                        edu.material.map((item, i) => (
                                            <li key={i} className="text-gray-700 relative  before:text-green-500 before:mr-2">
                                                <span className="text-blue-500 mr-2">▹</span>
                                                {item}
                                            </li>
                                        ))
                                    }
                                
                                </ul>
                            </div>
                        </div>
                ))}
            </div>
        </section>
    )
}   