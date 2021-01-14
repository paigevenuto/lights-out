import React, { useState } from "react";
import Cell from "./Cell";
import _ from "lodash";
import "./Board.css";

/** Game board of Lights out.
 *
 * Properties:
 *
 * - nrows: number of rows of board
 * - ncols: number of cols of board
 * - chanceLightStartsOn: float, chance any cell is lit at start of game
 *
 * State:
 *
 * - board: array-of-arrays of true/false
 *
 *    For this board:
 *       .  .  .
 *       O  O  .     (where . is off, and O is on)
 *       .  .  .
 *
 *    This would be: [[f, f, f], [t, t, f], [f, f, f]]
 *
 *  This should render an HTML table of individual <Cell /> components.
 *
 *  This doesn't handle any clicks --- clicks are on individual cells
 *
 **/

function Board({ nrows, ncols, chanceLightStartsOn }) {
  const [board, setBoard] = useState(createBoard());

  /** create a board nrows high/ncols wide, each cell randomly lit or unlit */
  function createBoard() {
    let initialBoard = [];
    for (let y = 0; y < nrows; y++) {
      let row = [];
      for (let x = 0; x < ncols; x++) {
        row.push(Math.random() <= chanceLightStartsOn);
      }
      initialBoard.push(row);
    }
    return initialBoard;
  }

  function hasWon() {
    for (let y = 0; y < nrows; y++) {
      for (let x = 0; x < ncols; x++) {
        if (board[y][x]) return false;
      }
    }
    return true;
  }

  function flipCellsAround(coord) {
    setBoard((oldBoard) => {
      const [y, x] = coord.split("-").map(Number);

      const flipCell = (y, x, boardCopy) => {
        // if this coord is actually on board, flip it

        if (x >= 0 && x < ncols && y >= 0 && y < nrows) {
          boardCopy[y][x] = !boardCopy[y][x];
        }
      };

      const boardCopy = _.cloneDeep(board);

      const targetCells = [
        [y, x],
        [y + 1, x],
        [y - 1, x],
        [y, x + 1],
        [y, x - 1],
      ];

      for (let cell of targetCells) {
        flipCell(cell[0], cell[1], boardCopy);
      }

      return boardCopy;
    });
  }

  if (hasWon()) return <h1>You Won!</h1>;

  let table = [];
  for (let y = 0; y < nrows; y++) {
    let tr = [];
    for (let x = 0; x < ncols; x++) {
      tr.push(
        <Cell
          key={`${x}-${y}`}
          flipCellsAroundMe={() => flipCellsAround(`${y}-${x}`)}
          isLit={board[y][x]}
        />
      );
    }
    table.push(tr);
  }

  return (
    <div
      className="Board"
      style={{ gridTemplateColumns: `repeat(${ncols}, 100px)` }}
    >
      {table}
    </div>
  );
}

Board.defaultProps = {
  nrows: 2,
  ncols: 2,
  chanceLightStartsOn: 0.5,
};

export default Board;
