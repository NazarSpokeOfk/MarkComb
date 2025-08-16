import React, { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";

import { TypeWriterComponentProps , Direction } from "../../../types/types"

const TypeWriterComponent = ({
  words,
  triggerErase = null,
  onEraseComplete,
  autoLoop = false,
  delayBetweenWords = 1500,
}: TypeWriterComponentProps) => {
  const { t } = useTranslation();
  const [displayText, setDisplayText] = useState("");
  const [isDeleting, setIsDeleting] = useState(false);
  const [index, setIndex] = useState(0);
  const [direction, setDirection] = useState<Direction | null>(null);

  const currentWord = t(words[index] ?? "");

  useEffect(() => {
    const speed = isDeleting ? 40 : 40;

    const timeout = setTimeout(() => {
      if (isDeleting) {
        setDisplayText((prev) => {
          const updated = prev.slice(0, -1);
          if (updated === "") {
            setIsDeleting(false);

            // Вызываем onEraseComplete безопасно
            if (triggerErase && direction) {
              console.log("triggerErase :",triggerErase)
              queueMicrotask(() => onEraseComplete?.(direction));
              setDirection(null);
            }

            if (autoLoop && !triggerErase) {
              setTimeout(() => {
                setIndex((prev) => (prev + 1) % words.length);
              }, 100);
            }
          }
          return updated;
        });
      } else {
        setDisplayText((prev) => {
          const updated = currentWord.slice(0, prev.length + 1);
          if (updated === currentWord && autoLoop && !triggerErase) {
            setTimeout(() => {
              setIsDeleting(true);
            }, delayBetweenWords);
          }
          return updated;
        });
      }
    }, speed);

    return () => clearTimeout(timeout);
  }, [displayText, isDeleting, index, currentWord, triggerErase]);

  useEffect(() => {
    if (triggerErase === "forward" || triggerErase === "backward") {
      setDirection(triggerErase);
      setIsDeleting(true);
    }
  }, [triggerErase]);

  return (
    <span className="typewriter">
      {displayText}
      <span className="cursor">|</span>
    </span>
  );
};



export default TypeWriterComponent;
