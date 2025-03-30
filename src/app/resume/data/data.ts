import { BiGame } from "react-icons/bi"
import { FaDatabase, FaGlobe, FaLaptopCode, FaServer, FaTools } from "react-icons/fa"

const experienceItems1 = [
    'Led a comprehensive project refactoring, improving code quality, scalability, and maintainability.',
    'Designed and developed role-based access control (RBAC), ensuring secure and modular system architecture.',
    'Built and maintained high-performance web applications using Node.js, TypeScript, React, and Next.js.',
    'Collaborated with cross-functional teams to design, develop, and implement scalable software solutions.',
    'Conducted thorough code reviews, refactoring, and testing to ensure software quality.'
]
const experienceItems2 = [
    'Developed and maintained enterprise CRM systems using ASP.NET Core and Angular for corporate clients.',
    'Designed and implemented RESTful APIs supporting thousands of daily transactions with 99.9% uptime.',
    'Optimized database queries, improving system response time by 30%.',
    'Actively participated in Agile development, contributing to sprint planning, daily stand-ups, and collaborative coding efforts.'
]

export const works = [
    {
        responsibilities: experienceItems1,
        dates: "May 2024 - Present",
        company: "Serve Up Software (PTY) Ltd.",
        title: "Full Stack Developer",
        time: { 
            start: '2024-07-01',
            end: 'current' 
        },
        color: 'rgb(74, 115, 74)',
        bgColor: 'rgb(196, 228, 196)'
    }, 
    {
        responsibilities: experienceItems2,
        dates: "Dec 2019 - Mar 2022",
        company: "Astranix Technologies Pvt. Ltd",
        title: "Junior Developer",
        time: {
            start: '2019-12-01',
            end: '2022-05-01'
        },
        color: 'rgb(179, 129, 14)',
        bgColor: 'rgb(255, 248, 190)' 
    }
]


  export  const educations = [
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
                
            ],
            time:{ start: '2023-01-01', end: '2024-08-28' },
           color: 'rgb(70, 114, 186)',
            bgColor: 'rgb(220, 235, 240)'
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
                
            ],
            time:{ start: '2015-09-06', end: '2019-08-30' },
            color: 'rgb(145, 110, 150)',
            bgColor: 'rgb(230, 220, 235)' 
        }
    ]


   export const skillsData: any = {
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
                icon: FaGlobe,
            }
        }


export const FullText = 'Results-driven and passionate Web Developer with around 3 years of experience in building and maintaining web applications. Proficient in React.js, Next.js, Redux, Angular for front-end development and Node.js, ASP.NET Core, and MVC for back-end services. Skilled in relational databases such as MS-SQL, MySQL, and PostgreSQL. Experienced in API development, Agile methodologies, and Docker. Passionate about writing clean, efficient, and maintainable code with CI/CD best practices.';
  