// Define symbols for each chess piece
const pieceSymbols = {
  "r": "♜", "n": "♞", "b": "♝", "q": "♛", "k": "♚", "p": "♟",
  "R": "♖", "N": "♘", "B": "♗", "Q": "♕", "K": "♔", "P": "♙"
};

// Initial board setup
const initialBoard = [
  ["r", "n", "b", "q", "k", "b", "n", "r"],
  ["p", "p", "p", "p", "p", "p", "p", "p"],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["", "", "", "", "", "", "", ""],
  ["P", "P", "P", "P", "P", "P", "P", "P"],
  ["R", "N", "B", "Q", "K", "B", "N", "R"]
];

// Reference to the chessboard container in HTML
const chessboard = document.getElementById("chessboard");

// Function to create the board and add pieces
function createBoard() {
  for (let row = 0; row < 8; row++) {
    for (let col = 0; col < 8; col++) {
      const square = document.createElement("div");
      square.classList.add("square", (row + col) % 2 === 0 ? "white" : "black");
      square.dataset.row = row;
      square.dataset.col = col;

      const piece = initialBoard[row][col];
      if (piece) {
        const pieceElement = createPieceElement(piece, row, col);
        square.appendChild(pieceElement);
      }

      chessboard.appendChild(square);
    }
  }
}

// Function to create and return a draggable piece element
function createPieceElement(piece, row, col) {
  const pieceElement = document.createElement("span");
  pieceElement.classList.add("piece");
  pieceElement.textContent = pieceSymbols[piece];
  pieceElement.draggable = true;
  pieceElement.dataset.row = row;
  pieceElement.dataset.col = col;
  pieceElement.addEventListener("dragstart", dragStart);
  return pieceElement;
}

// Handle drag start event
function dragStart(e) {
  e.dataTransfer.setData("piece", e.target.textContent);
  e.dataTransfer.setData("fromRow", e.target.dataset.row);
  e.dataTransfer.setData("fromCol", e.target.dataset.col);
}

// Handle drop event to move the piece
function handleDrop(e) {
  e.preventDefault();

  // Get data from the drag event
  const fromRow = e.dataTransfer.getData("fromRow");
  const fromCol = e.dataTransfer.getData("fromCol");
  const piece = e.dataTransfer.getData("piece");

  // Get the original square (where the piece came from)
  const fromSquare = document.querySelector(
    `.square[data-row="${fromRow}"][data-col="${fromCol}"]`
  );
  if (fromSquare) {
    fromSquare.innerHTML = ''; // Clear the original square
  }

  // Ensure we are targeting a valid square
  const targetSquare = e.target;
  if (!targetSquare.classList.contains("square")) return;

  // Clear the target square and add the new piece
  targetSquare.innerHTML = ''; // Clear any existing piece in the target square

  // Create and add the new piece element to the target square
  const pieceElement = document.createElement("span");
  pieceElement.classList.add("piece");
  pieceElement.textContent = piece;
  pieceElement.draggable = true;

  // Reattach drag event to the moved piece
  pieceElement.addEventListener("dragstart", dragStart);

  // Append the piece element to the target square
  targetSquare.appendChild(pieceElement);
}

// Allow dropping by preventing default behavior
function allowDrop(e) {
  e.preventDefault();
}

// Add event listeners to all squares for drag-and-drop functionality
function addDropListeners() {
  const squares = document.querySelectorAll(".square");
  squares.forEach(square => {
    square.addEventListener("drop", handleDrop);
    square.addEventListener("dragover", allowDrop);
  });
}

// Initialize the board and add listeners
createBoard();
addDropListeners();
