import { useEffect, useState } from "react";

const winningCombinations: number[][] = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
];

function App(): JSX.Element {
  const [cells, setCells] = useState<string[]>(Array(9).fill(""));
  const [currentPlayer, setCurrentPlayer] = useState<string>("X");
  const [scores, setScores] = useState<{ X: number; O: number }>({
    X: 0,
    O: 0,
  });

  useEffect(() => {
    if (currentPlayer === "O") {
      makeAIMove();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentPlayer]);

  const makeAIMove = (): void => {
    const bestMove: number = findBestMove(cells);
    handleCellClick(bestMove);
  };

  const handleCellClick = async (index: number): Promise<void> => {
    if (cells[index] === "") {
      const newCells: string[] = [...cells];
      newCells[index] = currentPlayer;
      setCells(newCells);

      const winner: string | null = calculateWinner(newCells);
      if (winner) {
        if (winner === "tie") {
          await new Promise((resolve) => setTimeout(resolve, 100));
          window.alert("It's a tie!");
        } else {
          await new Promise((resolve) => setTimeout(resolve, 100));
          window.alert(`Player ${winner} wins!`);
          setScores((prevScores) => ({
            ...prevScores,
            [winner as "X" | "O"]: prevScores[winner as "X" | "O"] + 1,
          }));
        }
        setCells(Array(9).fill(""));
      } else {
        setCurrentPlayer(currentPlayer === "X" ? "O" : "X");
      }
    }
  };

  const findBestMove = (board: string[]): number => {
    let bestScore = -Infinity;
    let bestMove = -1;

    for (let i = 0; i < board.length; i++) {
      if (board[i] === "") {
        const newBoard: string[] = [...board];
        newBoard[i] = "O";
        const score: number = minimax(newBoard, 0, false);
        if (score > bestScore) {
          bestScore = score;
          bestMove = i;
        }
      }
    }

    return bestMove;
  };

  const minimax = (
    board: string[],
    depth: number,
    isMaximizing: boolean
  ): number => {
    const result: string | null = calculateWinner(board);
    if (result !== null) {
      return result === "X" ? -1 : 1;
    }

    if (isMaximizing) {
      let bestScore = -Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          const newBoard: string[] = [...board];
          newBoard[i] = "O";
          const score: number = minimax(newBoard, depth + 1, false);
          bestScore = Math.max(bestScore, score);
        }
      }
      return bestScore;
    } else {
      let bestScore = Infinity;
      for (let i = 0; i < board.length; i++) {
        if (board[i] === "") {
          const newBoard: string[] = [...board];
          newBoard[i] = "X";
          const score: number = minimax(newBoard, depth + 1, true);
          bestScore = Math.min(bestScore, score);
        }
      }
      return bestScore;
    }
  };

  const calculateWinner = (board: string[]): string | null => {
    for (let i = 0; i < winningCombinations.length; i++) {
      const [a, b, c] = winningCombinations[i];
      if (board[a] && board[a] === board[b] && board[a] === board[c]) {
        return board[a];
      }
    }
    if (board.every((cell) => cell !== "")) {
      return "tie";
    }
    return null;
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="grid grid-cols-3 gap-4 max-w-lg">
        {cells.map((cell, index) => (
          <div
            onClick={() => handleCellClick(index)}
            key={index}
            className="bg-gray-200 rounded-lg flex justify-center items-center text-5xl font-bold h-16 sm:h-24 w-16 sm:w-24 cursor-pointer hover:bg-gray-300"
          >
            {cell}
          </div>
        ))}
      </div>
      <div className="mt-4 text-center">
        <p className="text-xl">Player X: {scores.X}</p>
        <p className="text-xl">Player O: {scores.O}</p>
      </div>
    </div>
  );
}

export default App;
