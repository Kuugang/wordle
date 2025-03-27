import logo from "./logo.svg";
import "./App.css";
import { useEffect, useState, useRef, useCallback } from "react";
import { Keyboard } from "./components/Keyboard";

function App() {
  const [solution, setSolution] = useState("");
  const [guesses, setGuesses] = useState(Array(6).fill(null));
  const [currentGuess, setCurrentGuess] = useState("");
  const [solved, setSolved] = useState(false);

  useEffect(() => {
    let date = new Date();
    date = date.toISOString().split("T")[0];

    const getWord = async () => {
      const WORDLE_URL = `https://www.nytimes.com/svc/wordle/v2/${date}.json`;
      const API_URL = "https://corsproxy.io/?url=" + WORDLE_URL;

      const response = await fetch(API_URL);
      const responseJSON = await response.json();
      setSolution(responseJSON.solution);
    };
    getWord();
  }, []);

  const handleOnDelete = () => {
    setCurrentGuess((prev) => prev.slice(0, -1));
  };

  const handleOnGuess = () => {
    if (currentGuess.length !== 5) return;

    setGuesses((prev) =>
      prev.map((g, i) =>
        g === null && prev.indexOf(null) === i ? currentGuess : g,
      ),
    );
    if (currentGuess === solution) setSolved(true);
    setCurrentGuess("");
  };

  const handleOnChar = (letter) => {
    if (!letter.match(/^[a-zA-Z]$/)) return;

    setCurrentGuess((prev) => (prev.length < 5 ? prev + letter : prev));
  };

  const useWordleInput = (
    solution,
    currentGuess,
    setCurrentGuess,
    setGuesses,
    solved,
  ) => {
    const solvedRef = useRef(solved);

    useEffect(() => {
      solvedRef.current = solved;
    }, [solved]);

    const handleType = useCallback(
      (event) => {
        if (solvedRef.current) return;

        switch (event.key) {
          case "Backspace":
            handleOnDelete();
            break;

          case "Enter":
            handleOnGuess();
            break;

          default:
            handleOnChar(event.key);
        }
      },
      [currentGuess, setCurrentGuess, setGuesses, solution],
    );

    useEffect(() => {
      window.addEventListener("keyup", handleType);
      return () => window.removeEventListener("keyup", handleType);
    }, [handleType]);
  };

  useWordleInput(solution, currentGuess, setCurrentGuess, setGuesses, solved);

  return (
    <div className="App">
      {guesses.map((guess, i) => {
        return (
          <Row
            key={i}
            guess={
              guesses.indexOf(null) === i ? currentGuess : (guess ?? "     ")
            }
            isCurrentGuess={guesses.indexOf(null) === i ? true : false}
            solution={solution}
          />
        );
      })}

      <Keyboard
        onChar={(letter) => {
          handleOnChar(letter.toLowerCase());
        }}
        onDelete={() => {
          handleOnDelete();
        }}
        onEnter={() => {
          handleOnGuess();
        }}
      />
    </div>
  );
}

export default App;

function Row({ guess, isCurrentGuess, solution }) {
  if (guess.length !== 5) {
    guess = guess + " ".repeat(5 - guess.length);
  }
  const getTileColor = (letter, index) => {
    if (guess.trim().length === 0) return "";

    if (isCurrentGuess) return "";

    if (letter === solution[index]) return "green";
    if (solution.includes(letter)) return "yellow";
    return "grey";
  };

  return (
    <div className="row">
      {guess.split("").map((letter, i) => (
        <div key={i} className={`tile ${getTileColor(letter, i)}`}>
          {letter}
        </div>
      ))}
    </div>
  );
}
