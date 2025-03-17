'use client';
import Image from "next/image";
import { About } from "./component/about";
import { Experience } from "./component/exprience";
import { Studies } from "./component/studies";
import { Projects } from "./component/projects";

export default function Home() {


  return (
    <div id="main" className="min-h-screen pb-20 gap-16 sm:py-30 sm:px-35 font-[family-name:var(--font-geist-sans)]">
      
        <About />
        <Experience />
        <Studies />
        <Projects />


      
     

        <section className="p-6 rounded-lg bg-white">
  <h2 className="text-2xl font-semibold mb-6 text-gray-800">Contact Information</h2>
  <div className="grid gap-6 md:grid-cols-3">
    {/* Email */}
    <div className="p-6 border rounded-lg hover:shadow-md transition-all text-center">
      <div className="w-20 h-20 mx-auto mb-4">
        <Image
          src="/images/contact-logos/lightMode/gmail.png"
          alt="Email"
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">Email</h3>
      <a href="mailto:umangashrestha@gmail.com" className="text-blue-600 hover:text-blue-800">
        umangashrestha@gmail.com
      </a>
    </div>

    {/* LinkedIn */}
    <div className="p-6 border rounded-lg hover:shadow-md transition-all text-center">
      <div className="w-20 h-20 mx-auto mb-4">
        <Image
          src="/images/contact-logos/lightMode/linkedin.png"
          alt="LinkedIn"
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">LinkedIn</h3>
      <a href="https://linkedin.com/in/umangashrestha" target="_blank" className="text-blue-600 hover:text-blue-800">
        /umangashrestha
      </a>
    </div>

    {/* GitHub */}
    <div className="p-6 border rounded-lg hover:shadow-md transition-all text-center">
      <div className="w-20 h-20 mx-auto mb-4">
        <Image
          src="/images/contact-logos/lightMode/github-mark.png"
          alt="GitHub"
          width={80}
          height={80}
          className="object-contain"
        />
      </div>
      <h3 className="text-lg font-semibold text-gray-800 mb-2">GitHub</h3>
      <a href="https://github.com/umangashrestha" target="_blank" className="text-blue-600 hover:text-blue-800">
        @umangashrestha
      </a>
    </div>
  </div>
</section>
    </div>
  );
}
