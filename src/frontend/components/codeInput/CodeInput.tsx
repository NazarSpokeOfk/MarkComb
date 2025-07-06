import React from "react";
import { useRef, useState } from "react";

import CodeInputFunctions from "./functions/CodeInputFunctions";
const CodeInput = ({ onComplete }: { onComplete: (code: string) => void }) => {
  const codeInputFunctions = new CodeInputFunctions();

  const [values, setValues] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  return (
    <div className="flex gap-2 justify-center">
      {values.map((val, i) => (
        <input
          key={i}
          ref={(el) => {
            inputsRef.current[i] = el;
          }}
          type="text"
          inputMode="numeric"
          maxLength={1}
          value={val}
          onChange={(e) =>
            codeInputFunctions.handleChange({
              index: i,
              code: e.target.value,
              values,
              setValues,
              onComplete,
              inputsRef,
            })
          }
          onKeyDown={(e) =>
            codeInputFunctions.handleKeyDown({ index: i, e, values, inputsRef })
          }
          onPaste={(e) => {
            codeInputFunctions.handlePaste({
              e,
              values,
              setValues,
              onComplete,
              inputsRef,
            });
          }}
          className="w-12 h-12 text-center border border-gray-300 rounded-md text-lg focus:outline-blue-500"
        />
      ))}
    </div>
  );
};
export default CodeInput;
