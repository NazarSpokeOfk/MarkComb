import {HandleChangeCodeInputProps,HandleKeyDownProps,HandlePasteProps} from "../../../types/types"
class CodeInputFunctions {
    handleChange = ({index, code , values , setValues , onComplete , inputsRef} : HandleChangeCodeInputProps) => {
        if (!/^[0-9]?$/.test(code)) return;
    
        const newValues = [...values];
        newValues[index] = code;
    
        setValues(newValues);
    
        if (code && index < 5) {
          inputsRef.current[index + 1]?.focus();
        }
    
        if (newValues.every((val) => val !== "")) {
          onComplete(newValues.join(""));
        }
      };
    
       handleKeyDown = ({index, e, values, inputsRef} : HandleKeyDownProps) => {
        if (e.key === "Backspace" && !values[index] && index > 0) {
          inputsRef.current[index - 1]?.focus();
        }
      };
    
       handlePaste = ({e, values , setValues , onComplete , inputsRef} : HandlePasteProps) => {
        e.preventDefault();
        const paste = e.clipboardData.getData("text").slice(0, 6).split("");
        const newValues = [...values];
    
        paste.forEach((char, i) => {
          if (i < 6) newValues[i] = char;
        });
    
        setValues(newValues);
    
        const filled = newValues.filter(Boolean);
        if (filled.length === 6) {
          onComplete(newValues.join(""));
        }
    
        const nextIndex = paste.length < 6 ? paste.length : 5;
        inputsRef.current[nextIndex]?.focus();
      };
}
export default CodeInputFunctions