import { useMemo, useState } from "react";
import { useScrollVideo } from "../../hooks/useScrollVideo.js";
import "./Hero.css";

const VIDEO_SRC = "/videos/PortfolioAnimation.mov";

const chapters = [
  { id: "whoami", label: "Whoami", url: "www.whoami.com" },
  { id: "about", label: "About Me", url: "www.aboutme.com" },
  { id: "projects", label: "Projects", url: "www.projects.com" },
  { id: "experience", label: "Experience", url: "www.experience.com" },
  { id: "skills", label: "Skills", url: "www.skills.com" },
  { id: "contact", label: "Contact", url: "www.contactme.com" },
];

const chapterCopy = {
  whoami: "Opening chapter. Keep the first 17 seconds locked to the train scene and intro reveal.",
  about: "Personal story chapter. Use the next segment for background, character, and identity beats.",
  projects: "Project showcase chapter. Let the motion continue into featured work and demos.",
  experience: "Experience chapter. Move through roles, milestones, and timeline beats.",
  skills: "Skills chapter. Reserve this segment for tools, stack, and strengths.",
  contact: "Closing chapter. Finish with links, contact, and the final frame.",
};

export default function Hero() {
  const [activeChapter, setActiveChapter] = useState(chapters[0].id);

  const { heroRef, videoRef, duration, isReady, scrollToSegment } = useScrollVideo({
    segmentCount: chapters.length,
    firstSegmentDuration: 17,
    onSegmentChange: (index) => {
      setActiveChapter(chapters[index]?.id ?? chapters[0].id);
    },
  });

  const durationLabel = useMemo(() => {
    if (!duration) return "Loading";

    const minutes = Math.floor(duration / 60);
    const seconds = Math.floor(duration % 60)
      .toString()
      .padStart(2, "0");

    return `${minutes}:${seconds}`;
  }, [duration]);

  const handleChapterClick = (chapter, index) => {
    setActiveChapter(chapter.id);
    scrollToSegment(index);
  };

  return (
    <section className="hero" ref={heroRef} aria-label="Cinematic portfolio hero">
      <video
        ref={videoRef}
        className="hero__video"
        muted
        playsInline
        preload="auto"
        controls={false}
        loop={false}
      >
        <source src={VIDEO_SRC} type="video/quicktime" />
      </video>

      <div className="hero__grain" aria-hidden="true" />
      <div className="hero__vignette" aria-hidden="true" />

      <header className="deploy-chrome" aria-label="Deploy browser navigation">
        <div className="deploy-chrome__top">
          <div className="deploy-chrome__lights" aria-hidden="true">
            <span />
            <span />
            <span />
          </div>
          <strong>Deploy Browser</strong>
          <span className="deploy-chrome__duration">{durationLabel}</span>
        </div>

        <nav className="deploy-tabs" aria-label="Portfolio tabs">
          {chapters.map((chapter, index) => (
            <button
              className={activeChapter === chapter.id ? "is-active" : ""}
              key={chapter.id}
              type="button"
              onClick={() => handleChapterClick(chapter, index)}
            >
              {chapter.label}
            </button>
          ))}
        </nav>

        <div className="deploy-address" aria-label="Current page">
          {chapters.find((chapter) => chapter.id === activeChapter)?.url}
        </div>
      </header>

      <div className={`hero__loader ${isReady ? "is-hidden" : ""}`} aria-live="polite">
        Preparing cinematic scroll...
      </div>

      <div className="hero__caption">
        <p className="hero__eyebrow">Scroll-driven portfolio film</p>
        <h1>Avula Jeevan Yadav</h1>
        <p>
          Scroll to scrub the video frame by frame. Later we will map exact timestamps to
          Whoami, About Me, Projects, Experience, Skills, and Contact.
        </p>
        <p className="hero__chapter-copy">{chapterCopy[activeChapter] ?? chapterCopy.whoami}</p>
      </div>
    </section>
  );
}
