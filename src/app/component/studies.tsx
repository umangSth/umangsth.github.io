import { FaUniversity } from "react-icons/fa";


export const Studies = () => {
    const educations = [
        {
            title: "Full Stack Software Developer",
            institution: "Lambton College",
            location: "Toronto, ON, Canada",
            material: [
                'Mastered versatile programming language python, C#, Java, and JavaScript.',
                'Acquired advanced skills in relational and non-relational database design and practical application.',
                'Gained knowledge and practical skills in DevOps tools, ensuring streamlined and collaborative software development processes.',
                'Acquired expertise in cloud computing technologies, understanding their applications in software development.',
                'Completed numerous team projects, fostering collaborative problem-solving and effective communication within diverse groups,'
                
            ]
        },
        {
            title: "BSc Computer Science & IT",
            institution: "Tribhuvan University",
            location: "Nepal",
            material: [
                'Acquired a strong foundation in digital logic and microprocessor architecture.',
                'Studied the fundamental principles of computer architecture and gained proficiency in data structures.',
                'Explored advanced algorithms and theoretical aspects of computation.',
                'Applied statistical methods and studied the foundational concepts of discrete structures.',
                'Completed an internship (Boardway Infosys), gaining practical experience applying theoretical knowledge to real-world scenarios.',
                
            ]
        }
    ]


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