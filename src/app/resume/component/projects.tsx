import { FaCode } from "react-icons/fa";
import { FaDiagramProject } from "react-icons/fa6";

export  const Projects = () => {
    return (
        <section className="mb-8 p-6 rounded-lg bg-white shadow-lg">
            <h2 className="xl:text-xl lg:text-lg sm:text-sm text-sm font-semibold mb-6 text-gray-800 flex items-center">
                  <span className="w-8 h-8   lg:w-10 lg:h-10 xl:w-12 xl:h-12  bg-[var(--secondary)] text-black-500 rounded-full flex items-center justify-center mr-2">
                        <FaDiagramProject className="w-5 h-5 xl:w-6 xl:h-6" />
                    </span>
                Key Projects
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
                <div className="p-6 bg-gray-50 rounded-xl shadow-sm hover:shadow-md transition-shadow">
                    <div className="flex items-center gap-2 mb-4">
                        <div className="w-8 h-8  lg:w-10 lg:h-10 xl:w-12 xl:h-12  bg-[var(--secondary)] rounded-full flex items-center justify-center">
                            <FaCode className="w-5 h-5 xl:w-6 xl:h-6" />
                        </div>
                        <h3 className="xl:text-xl lg:text-lg sm:text-sm text-sm font-semibold text-gray-800">Merchant-Serve-Up</h3>
                    </div>
                    <ul className="space-y-3 pl-4 border-t pt-4 text-xs lg:text-sm xl:text-lg ">
                        <li className="text-gray-700 relative pl-6 before:content-['-'] before:text-purple-500 before:absolute before:left-0">
                            Staff management system with RBAC
                        </li>
                        <li className="text-gray-700 relative pl-6 before:content-['-'] before:text-purple-500 before:absolute before:left-0">
                            Real-time inventory tracking
                        </li>
                        <li className="text-gray-700 relative pl-6 before:content-['-'] before:text-purple-500 before:absolute before:left-0">
                            Recipe management module
                        </li>
                        <li className="text-gray-700 relative pl-6 before:content-['-'] before:text-purple-500 before:absolute before:left-0">
                            Integrated POS system
                        </li>
                    </ul>
                    <div className="mt-4 flex flex-wrap gap-2 text-xs lg:text-sm xl:text-lg ">
                        <span className="px-2 py-1  bg-[var(--secondary)] text-xs text-black-500 rounded-full hover:scale-130 cursor-pointer">React</span>
                        <span className="px-2 py-1  bg-[var(--secondary)] text-xs text-black-500 rounded-full hover:scale-130 cursor-pointer">Node.js</span>
                        <span className="px-2 py-1  bg-[var(--secondary)] text-xs text-black-500 rounded-full hover:scale-130 cursor-pointer">PostgreSQL</span>
                    </div>
                </div>
            </div>
        </section>
    )
}