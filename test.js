const checkBingoWin = (grid, checkedNumbers) => {
    const gridSize = grid.length;
    let matchedPatternCount = 0;
  
    // Check rows for Bingo
    for (let row = 0; row < gridSize; row++) {
      if (grid[row].every((number) => checkedNumbers.includes(number))) {
        console.log(`Bingo in Row ${row + 1}`);
        matchedPatternCount++;
      }
    }
  
    // Check columns for Bingo
    for (let col = 0; col < gridSize; col++) {
      let columnMatch = true;
      for (let row = 0; row < gridSize; row++) {
        if (!checkedNumbers.includes(grid[row][col])) {
          columnMatch = false;
          break;
        }
      }
      if (columnMatch) {
        console.log(`Bingo in Column ${col + 1}`);
        matchedPatternCount++;
      }
    }
  
    // Check top-left to bottom-right diagonal
    let topLeftToBottomRight = true;
    for (let i = 0; i < gridSize; i++) {
      if (!checkedNumbers.includes(grid[i][i])) {
        topLeftToBottomRight = false;
        break;
      }
    }
    if (topLeftToBottomRight) {
      console.log("Bingo in Top-Left to Bottom-Right Diagonal");
      matchedPatternCount++;
    }
  
    // Check top-right to bottom-left diagonal
    let topRightToBottomLeft = true;
    for (let i = 0; i < gridSize; i++) {
      if (!checkedNumbers.includes(grid[i][gridSize - i - 1])) {
        topRightToBottomLeft = false;
        break;
      }
    }
    if (topRightToBottomLeft) {
      console.log("Bingo in Top-Right to Bottom-Left Diagonal");
      matchedPatternCount++;
    }
  
    // Check if we have 5 matched patterns
    if (matchedPatternCount >= 5) {
      console.log(`Total Matched Patterns: ${matchedPatternCount}`);
      return true;
    }
  
    return false; 
  };
  

  const player1Grid = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 10],
    [11, 12, 13, 14, 15],
    [16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25],
  ];
  const player2Grid = [
    [1, 2, 3, 4, 5],
    [6, 7, 8, 9, 11],
    [16, 17, 18, 19, 20],
    [21, 22, 23, 24, 25],
    [10, 12, 13, 14, 15],
  ];
  
  const playerCheckedNumbers = [1,7,13,19,25,5,9,13,17,21,6,11,16,2,12,22,3,8,18,23]; 
  
  const player1 = checkBingoWin(player1Grid, playerCheckedNumbers);
  const player2 = checkBingoWin(player2Grid, playerCheckedNumbers);

  console.log("Bingo Win player1:", player1);
  console.log("Bingo Win player2:", player2); 

//   export default checkBingoWin;

  