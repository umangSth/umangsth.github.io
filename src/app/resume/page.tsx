import { About } from "./component/about";
import ContactSection from "./component/contacts";
import { Projects } from "./component/projects";
import { TimeLine } from "./component/time-line";


export default function Resume() {
    return (
        <>
        <div id="main" className="min-h-screen pb-20 gap-16 sm:py-30 sm:px-35 font-[family-name:var(--font-geist-sans)]">
          <About />
          <TimeLine />
          <Projects />
        </div>
        <ContactSection />
        </>
    )
}