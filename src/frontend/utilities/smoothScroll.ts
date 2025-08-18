import {SmoothScrollProps} from "../types/types"

function smoothScrollContainer({ containerRef, contentRefs }: SmoothScrollProps) {
  const appearObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add("animate-in");
          entry.target.classList.remove("fall-off");
          entry.target.classList.remove("initial-hidden");
        }
      });
    },
    {
      root: containerRef.current,
      threshold: 0.3,
    }
  );

  const disappearObserver = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          entry.target.classList.remove("animate-in");
          entry.target.classList.add("fall-off");
        }
      });
    },
    {
      root: containerRef.current,
      threshold: 0.3,
    }
  );

  contentRefs.current.forEach((el) => {
    if (el) {
      appearObserver.observe(el);
      disappearObserver.observe(el);
    }
  });
}
export default smoothScrollContainer