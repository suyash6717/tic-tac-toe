import { useEffect, useState } from 'react'
import './App.css'

function App() {
  //Defining state
  const [clickedData, setClickedData] = useState([]);
  const [result, setResult] = useState(0);
  const [firstMoveIndex, setFirstMoveIndex] = useState(0);

  // Function to check the win 
  const winCheck = () => {
    const winningConditions = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6]
    ];
    if (clickedData?.length > 2) {
      let humanSelectedBlock = clickedData
        ?.filter((item) => item.type === 'X')
        .map((item) => item.index);

      let machineSelectedBlock = clickedData
        ?.filter((item) => item.type === 'O')
        .map((item) => item.index);

      if (humanSelectedBlock.length > 2) {
        const isHumanWin = winningConditions.some(condition =>
          condition.every(num => humanSelectedBlock.includes(num))
        );
        if (isHumanWin) {
          setResult(1);
          return true;
        }
      }
      if (machineSelectedBlock.length >= 2) {
        const isMachineWin = winningConditions.some(condition =>
          condition.every(num => machineSelectedBlock.includes(num))
        );
        if (isMachineWin) {
          setResult(2);
          return true;
        }
      }

      return false;
    }
    return false;
  };

  //Function to return the smart index  for computer
  const winPatterns = [
    [0, 1, 2], [3, 4, 5], [6, 7, 8],
    [0, 3, 6], [1, 4, 7], [2, 5, 8],
    [0, 4, 8], [2, 4, 6]
  ];

  const smartMoveForComputer = (emptyIndexes, moveCount) => {
    const board = Array(9).fill(null);
    clickedData.forEach(({ index, type }) => board[index] = type);

    if (moveCount === 0) {
      const corners = [0, 2, 6, 8];
      const randomCorner = corners[Math.floor(Math.random() * corners.length)];
      return randomCorner;
    }

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const values = [board[a], board[b], board[c]];
      if (values.filter(v => v === 'O').length === 2 && values.includes(null)) {
        return pattern.find(index => board[index] === null);
      }
    }

    for (const pattern of winPatterns) {
      const [a, b, c] = pattern;
      const values = [board[a], board[b], board[c]];
      if (values.filter(v => v === 'X').length === 2 && values.includes(null)) {
        return pattern.find(index => board[index] === null);
      }
    }

    if (moveCount === 1 && emptyIndexes.includes(4)) return 4;

    const availableCorners = [0, 2, 6, 8].filter(index => emptyIndexes.includes(index));
    if (availableCorners.length) return availableCorners[0];

    return emptyIndexes[0];
  };

  //Function for computer turn
  const computerTurn = () => {
    const allIndexes = [...Array(9).keys()];
    const emptyIndexes = allIndexes.filter(index => !clickedData.some(data => data.index === index));

    if (emptyIndexes.length) {
      setTimeout(() => {
        setClickedData(prev => [...prev, { index: smartMoveForComputer(emptyIndexes, prev.length), type: 'O' }]);
      }, 500); // Delay for a more natural feel
    }
  };


  //Function to handle the user click
  const handleClick = (index, type) => {
    if (clickedData.some((item) => item.index === index)) return;
    setClickedData((prev) => [...prev, { index, type }]);
  };

  //Function to get the type of the index
  const getIndexValue = (index) => {
    return clickedData.find((item) => item.index == index)?.type;
  }

  //Function to reset the game
  const resetGame = () => {
    setResult(0)
    setClickedData([]);
  };

  //Function for computer's next move
  const nextMove = () => {
    if (clickedData.length < 9 && clickedData.length % 2 === 0 && !winCheck()) {
      computerTurn();
    }
    if (clickedData.length == 9) {
      setResult(3)
    }
  }

  //React hooks
  useEffect(() => {
    const winner = winCheck();
    if (winner) return;
    nextMove();
  }, [clickedData]);

  return (
    <>
      <div className="container">
        {result > 0 &&
          <div className="popup">
            <div className="popup-content">
              <p>
                {
                  result == 1 ? "You Win!" : result == 2 ? "AI Win!" : "It's a tie!"
                }
              </p>
              <button onClick={resetGame}>Restart Game</button>
            </div>
          </div>
        }
        <h1>Tic Tac Toe</h1>
        <div className="board">
          {[...Array(9)].map((_, i) => (
            <div key={i} className={`cell ${getIndexValue(i) == 'X' ? 'cross' : 'circle'}`} data-index={i} onClick={() => handleClick(i, "X")}>{getIndexValue(i)}</div>
          ))}
        </div>
        <h2 id="status">Player's Turn (X)</h2>
        <button id="reset" onClick={resetGame}>Reset Game</button>
      </div>
    </>
  )
}

export default App
