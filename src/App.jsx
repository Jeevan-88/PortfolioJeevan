import Hero from "./components/Hero/Hero.jsx";

const sections = [
  {
    id: "about",
    eyebrow: "About",
    title: "About Me",
    body: "This section will hold the exact text for the train-to-subway chapter once you lock the video timing.",
  },
  {
    id: "projects",
    eyebrow: "Work",
    title: "Projects",
    body: "Project cards, website embeds, case studies, and live links will continue naturally after the video unpins.",
  },
  {
    id: "experience",
    eyebrow: "Timeline",
    title: "Experience",
    body: "Your education, internships, milestones, and story beats can sit here as readable content after the cinematic intro.",
  },
  {
    id: "skills",
    eyebrow: "Tools",
    title: "Skills",
    body: "Skills can later be connected to exact video moments like fridge sticky notes or handwritten overlays.",
  },
  {
    id: "contact",
    eyebrow: "Connect",
    title: "Contact",
    body: "GitHub, LinkedIn, email, and social links will live here and can also appear inside the video phone scene.",
  },
];

export default function App() {
  return (
    <main>
      <Hero />

      <section className="content-intro">
        <p>Deploy Portfolio</p>
        <h2>The film ends. The portfolio continues.</h2>
      </section>

      {sections.map((section) => (
        <section className="portfolio-section" id={section.id} key={section.id}>
          <p>{section.eyebrow}</p>
          <h2>{section.title}</h2>
          <span>{section.body}</span>
        </section>
      ))}
    </main>
  );
}
