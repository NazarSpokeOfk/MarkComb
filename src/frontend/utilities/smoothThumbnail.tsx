import { RefObject } from "react";

const smoothThumbnail = ( thumbnailRef  : RefObject<HTMLDivElement | null>) => {
  if (thumbnailRef.current) {
    const el = thumbnailRef.current;

    console.log(el)

    // Сброс состояния на изначальное
    el.classList.remove("appearing");

    // Принудительно заставляем браузер нарисовать `default`
    // перед добавлением `appearing`, чтобы сработала анимация
    requestAnimationFrame(() => {
      //чтобы отрисовалась дефолт анимация, а потом уже appearing
      requestAnimationFrame(() => {
        el.classList.add("appearing");
      });
    });
  }
};

export default smoothThumbnail;
