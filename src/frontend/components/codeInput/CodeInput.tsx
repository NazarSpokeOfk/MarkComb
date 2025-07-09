import { useRef, useState, useEffect } from "react";

import { CodeInputProps } from "../../types/types";

import CodeInputFunctions from "./functions/CodeInputFunctions";

import "./CodeInput.css"
const CodeInput = ({ onComplete, setSignInData } : CodeInputProps) => {
  // setHide(true)
  const codeInputFunctions = new CodeInputFunctions();

  const [values, setValues] = useState<string[]>(Array(6).fill(""));
  const inputsRef = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    console.log("values : ",values)
  })
  return (
    <div className="code__flex">
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
              setSignInData
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
          className="input__cell"
        />
      ))}
    </div>
  );
};
export default CodeInput;
