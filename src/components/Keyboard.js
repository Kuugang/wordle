import React, { useEffect } from "react";

const KEYBOARD_ROWS = [
  ["Q", "W", "E", "R", "T", "Y", "U", "I", "O", "P"],
  ["A", "S", "D", "F", "G", "H", "J", "K", "L"],
  ["Z", "X", "C", "V", "B", "N", "M"],
];

export const Keyboard = ({ onChar, onDelete, onEnter }) => {
  // Simple keyboard event handler
  useEffect(() => {
    const handleKeyPress = (e) => {
      if (e.code === "Enter") {
        onEnter();
      } else if (e.code === "Backspace") {
        onDelete();
      } else {
        const key = e.key.toUpperCase();
        if (key.length === 1 && key >= "A" && key <= "Z") {
          onChar(key);
        }
      }
    };

    window.addEventListener("keyup", handleKeyPress);
    return () => window.removeEventListener("keyup", handleKeyPress);
  }, [onEnter, onDelete, onChar]);

  // Handle click on keyboard keys
  const handleClick = (value) => {
    if (value === "ENTER") {
      onEnter();
    } else if (value === "DELETE") {
      onDelete();
    } else {
      onChar(value);
    }
  };

  return (
    <div className="keyboard">
      {KEYBOARD_ROWS.map((row, index) => (
        <div key={index} className="keyboard-row flex justify-center mb-1">
          {index === KEYBOARD_ROWS.length - 1 && (
            <button
              className="keyboard-key enter-key"
              onClick={() => handleClick("ENTER")}
            >
              Enter
            </button>
          )}

          {row.map((key) => (
            <button
              key={key}
              className="keyboard-key"
              onClick={() => handleClick(key)}
            >
              {key}
            </button>
          ))}

          {index === KEYBOARD_ROWS.length - 1 && (
            <button
              className="keyboard-key delete-key"
              onClick={() => handleClick("DELETE")}
            >
              Delete
            </button>
          )}
        </div>
      ))}
    </div>
  );
};
