'use client';
import Image from "next/image";
import { About } from "./component/about";

export default function Home() {


  return (
    <div id="main" className="min-h-screen pb-20 gap-16 sm:py-30 sm:px-35 font-[family-name:var(--font-geist-sans)]">
      <About />

      <section className="mb-8 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">PROFESSIONAL EXPERIENCE:</h2>
        <div className="flex flex-col gap-4">
          <div className="border p-4 rounded-md">
            <h3 className="font-semibold text-lg text-gray-800">Full Stack Developer</h3>
            <p className="text-sm text-gray-600">May 2024 - Present</p>
            <h4 className="text-gray-700">Serve Up Software (PTY) Ltd.</h4>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed">
              <li className="mb-1">Led a comprehensive project refactoring, improving code quality, scalability, and maintainability.</li>
              <li className="mb-1">Designed and developed role-based access control (RBAC), ensuring secure and modular system architecture.</li>
              <li className="mb-1">Built and maintained high-performance web applications using Node.js, TypeScript, React, and Next.js.</li>
              <li className="mb-1">Collaborated with cross-functional teams to design, develop, and implement scalable software solutions.</li>
              <li className="mb-1">Conducted thorough code reviews, refactoring, and testing to ensure software quality.</li>
            </ul>
          </div>
          <div className="border p-4 rounded-md">
            <h3 className="font-semibold text-lg text-gray-800">Junior Developer</h3>
            <p className="text-sm text-gray-600">Dec 2019 - Mar 2022</p>
            <h4 className="text-gray-700">Astranix Technologies Pvt. Ltd</h4>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed">
              <li className="mb-1">Developed and maintained enterprise CRM systems using ASP.NET Core and Angular for corporate clients.</li>
              <li className="mb-1">Designed and implemented RESTful APIs supporting thousands of daily transactions with 99.9% uptime.</li>
              <li className="mb-1">Optimized database queries, improving system response time by 30%.</li>
              <li className="mb-1">Actively participated in Agile development, contributing to sprint planning, daily stand-ups, and collaborative coding efforts.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mb-8 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">EDUCATION:</h2>
        <div className="flex flex-col gap-4">
          <div className="border p-4 rounded-md">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Full Stack Software Developer</h3>
              <p className="text-sm text-gray-600">Lambton College, Toronto, ON, Canada.</p>
            </div>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed">
              <li className="mb-1">Mastered versatile programming languages python, C#, Java, and JavaScript.</li>
              <li className="mb-1">Gained expertise in DevOps tools and cloud computing technologies.</li>
              <li className="mb-1">Dean's List recipient for outstanding academic performance.</li>
            </ul>
          </div>
          <div className="border p-4 rounded-md">
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Bachelor in Computer Science and Information Technology</h3>
              <p className="text-sm text-gray-600">Tribhuvan University, Nepal</p>
            </div>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed">
              <li className="mb-1">Studied computer architecture, data structures, and advanced algorithms.</li>
              <li className="mb-1">Applied statistical methods and discrete structures in computing.</li>
              <li className="mb-1">Completed an internship at Boardway Infosys, gaining practical industry experience.</li>
            </ul>
          </div>
        </div>
      </section>
      <section className="mb-8 p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">PROJECTS:</h2>
        <div className="flex flex-col gap-4">
          <div className="border p-4 rounded-md">
            <h3 className="font-semibold text-lg text-gray-800">Merchant-Serve-Up:</h3>
            <ul className="list-disc list-inside text-gray-700 leading-relaxed">
              <li className="mb-1">Developed a staff management system with advanced role and permission handling.</li>
              <li className="mb-1">Implemented inventory and stock management features for restaurants, ensuring real-time tracking.</li>
              <li className="mb-1">Designed a recipe management module, allowing efficient ingredient tracking and cost estimation.</li>
              <li className="mb-1">Integrated seamless order processing and POS system, enhancing operational efficiency.</li>
            </ul>
          </div>
        </div>
      </section>

      <section className="p-6 rounded-lg">
        <h2 className="text-2xl font-semibold mb-4 text-gray-800">CONTACT:</h2>
        <div className="flex flex-col gap-4">
          <div className="flex flex-row gap-4 items-center">
            <Image
              src="/images/contact-logos/lightMode/gmail.png"
              alt="Email Logo"
              width={50} // Reduced image size
              height={50}
              priority
            />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">Email</h3>
              <p className="text-gray-700">umangashrestha@gmail.com</p>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <Image
              src="/images/contact-logos/lightMode/linkedin.png"
              alt="LinkedIn Logo"
              width={50} // Reduced image size
              height={50}
              priority
            />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">LinkedIn</h3>
              <p className="text-gray-700">umangashrestha</p>
            </div>
          </div>
          <div className="flex flex-row gap-4 items-center">
            <Image
              src="/images/contact-logos/lightMode/github-mark.png"
              alt="GitHub Logo"
              width={50} // Reduced image size
              height={50}
              priority
            />
            <div>
              <h3 className="font-semibold text-lg text-gray-800">GitHub</h3>
              <p className="text-gray-700">umangashrestha</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
}
