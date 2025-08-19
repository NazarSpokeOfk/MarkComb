const SmoothVerticalScroll = ({}) => {
  const observer = new IntersectionObserver(
    ([entry]) => {
      if (entry.isIntersecting) {
        console.log("Добавляю?");
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
  console.log("elements : ",elements)
  elements.forEach((el) => observer.observe(el));
};
export default SmoothVerticalScroll;
