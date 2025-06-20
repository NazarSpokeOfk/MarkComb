const SmoothEffect = () => {
    return new Promise<void>((resolve) => {
      const styleSheet = document.createElement("style");
      styleSheet.textContent = `
        .none {
          opacity: 0;
          transition: opacity 0.2s ease-in-out;
        }
      `;
      document.head.appendChild(styleSheet);
  
      setTimeout(() => {
        const styleSheet2 = document.createElement("style");
        styleSheet2.textContent = `
          .none {
            opacity: 1;
          }
        `;
        document.head.appendChild(styleSheet2);
        resolve(); // Анимация завершена, выполняем следующий шаг
      }, 200);
    });
  };
export default SmoothEffect  