import { About } from "./component/about";
import ContactSection from "./component/contacts";
import { Projects } from "./component/projects";
import { TimeLine } from "./component/time-line";


export default function Resume() {
    return (
        <>
          <div id="main" className="min-h-screen py-15  gap-16 font-[family-name:var(--font-geist-sans)]
                                                    2xl:px-60 2xl:pb-70 2xl:pt-40
                                                    xl:py-40 xl:px-40
                                                    sm:py-15 sm:px-35
                                                    lg:px-20 lg:py-32">
            <About />
            <TimeLine />
            <Projects />
          </div>
        <ContactSection />
        </>
    )
}