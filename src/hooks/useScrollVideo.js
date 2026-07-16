import { useEffect, useRef, useState } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { ScrollToPlugin } from "gsap/ScrollToPlugin";

gsap.registerPlugin(ScrollTrigger, ScrollToPlugin);

const MIN_SCROLL_SECONDS = 4;
const PIXELS_PER_VIDEO_SECOND = 620;

export function useScrollVideo({ segmentCount = 1, firstSegmentDuration = 17, onSegmentChange } = {}) {
  const heroRef = useRef(null);
  const videoRef = useRef(null);
  const tweenRef = useRef(null);
  const scrollTriggerRef = useRef(null);
  const segmentRef = useRef(0);
  const onSegmentChangeRef = useRef(onSegmentChange);
  const [duration, setDuration] = useState(0);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    onSegmentChangeRef.current = onSegmentChange;
  }, [onSegmentChange]);

  useEffect(() => {
    const video = videoRef.current;

    if (!video) return undefined;

    const prepareVideo = () => {
      if (!Number.isFinite(video.duration) || video.duration <= 0) return;

      video.pause();
      video.currentTime = 0;
      setDuration(video.duration);
      setIsReady(true);
      ScrollTrigger.refresh();
    };

    video.addEventListener("loadedmetadata", prepareVideo);
    video.addEventListener("loadeddata", prepareVideo);

    if (video.readyState >= 1) {
      prepareVideo();
    }

    return () => {
      video.removeEventListener("loadedmetadata", prepareVideo);
      video.removeEventListener("loadeddata", prepareVideo);
    };
  }, []);

  useEffect(() => {
    const hero = heroRef.current;
    const video = videoRef.current;

    if (!hero || !video || !duration) return undefined;

    const getScrollDistance = () => {
      const durationDistance = duration * PIXELS_PER_VIDEO_SECOND;
      const viewportDistance = window.innerHeight * MIN_SCROLL_SECONDS;

      return Math.round(Math.max(durationDistance, viewportDistance));
    };

    tweenRef.current?.kill();
    scrollTriggerRef.current?.kill();

    tweenRef.current = gsap.to(video, {
      currentTime: duration,
      ease: "none",
      scrollTrigger: {
        trigger: hero,
        start: "top top",
        end: () => `+=${getScrollDistance()}`,
        scrub: 0.35,
        pin: true,
        anticipatePin: 1,
        invalidateOnRefresh: true,
        onUpdate: (self) => {
          const introDuration = Math.min(firstSegmentDuration, duration);

          let nextSegment = 0;

          if (segmentCount > 1 && video.currentTime > introDuration) {
            const remainingDuration = Math.max(duration - introDuration, 0.0001);
            const remainingProgress = Math.max(0, Math.min(1, (video.currentTime - introDuration) / remainingDuration));
            nextSegment = Math.min(segmentCount - 1, 1 + Math.floor(remainingProgress * (segmentCount - 1)));
          }

          if (nextSegment !== segmentRef.current) {
            segmentRef.current = nextSegment;
            onSegmentChangeRef.current?.(nextSegment);
          }
        },
      },
    });

    scrollTriggerRef.current = tweenRef.current.scrollTrigger;

    return () => {
      tweenRef.current?.kill();
      scrollTriggerRef.current?.kill();
      tweenRef.current = null;
      scrollTriggerRef.current = null;
    };
  }, [duration, segmentCount, firstSegmentDuration]);

  const scrollToSegment = (index) => {
    const trigger = scrollTriggerRef.current;

    if (!trigger || !duration) return;

    const safeIndex = Math.max(0, Math.min(index, Math.max(segmentCount - 1, 0)));
    const introDuration = Math.min(firstSegmentDuration, duration);
    const remainingDuration = Math.max(duration - introDuration, 0);
    const progress =
      safeIndex === 0 || segmentCount <= 1
        ? 0
        : (safeIndex - 1) / Math.max(segmentCount - 1, 1);
    const targetTime = safeIndex === 0 ? 0 : introDuration + remainingDuration * progress;
    const target = trigger.start + (trigger.end - trigger.start) * Math.max(0, Math.min(1, targetTime / duration));

    gsap.to(window, {
      scrollTo: target,
      duration: 1.15,
      ease: "power3.inOut",
    });
  };

  return {
    heroRef,
    videoRef,
    duration,
    isReady,
    scrollToSegment,
  };
}
