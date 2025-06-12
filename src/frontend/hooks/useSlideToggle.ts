import { useEffect, useRef } from "react";

export function useSlideToggle(isOpen : boolean, duration = 300) {
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.style.overflow = "hidden";
    el.style.transition = `max-height ${duration}ms ease`;

    if (isOpen) {
      el.style.maxHeight = "0px";
      requestAnimationFrame(() => {
        el.style.maxHeight = el.scrollHeight + "px";
      });
    } else {
      el.style.maxHeight = el.scrollHeight + "px";
      requestAnimationFrame(() => {
        el.style.maxHeight = "0px";
      });
    }
  }, [isOpen, duration]);

  return ref;
}
