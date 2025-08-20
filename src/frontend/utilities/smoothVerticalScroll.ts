const SmoothVerticalScroll = ({}) => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("moving__in-class");
      }
      if (!entry.isIntersecting) {
        entry.target.classList.remove("moving__in-class");
      }
    },
    {
      root: null,
      threshold: 0.3,
    }
  );
  const elements = document.querySelectorAll(".moving__in-class_initial-state");
  elements.forEach((el) => observer.observe(el));

  return observer;
};
export default SmoothVerticalScroll;
