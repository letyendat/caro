import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';

function Square(props) {
  if (props.flag === true) {
    return (
      <button id="indam" className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  } else {
    return (
      <button className="square" onClick={props.onClick}>
        {props.value}
      </button>
    );
  }

}

class Board extends React.Component {
  renderSquare(i, flag) {
    return <Square
      flag={flag}
      value={this.props.squares[i]}
      onClick={() => this.props.onClick(i)}
    />;
  }

  render() {
    const array = Array(this.props.sizeBroad).fill(null);
    return (
      <div>
        {
          array.map((object, i) =>
            <div className="board-row">
              {array.map((object, k) => {
                let flag = false;
                if (this.props.arrayWinner2chiu !== null) {
                  for (let x = 0; x < 5; x++) {
                    if (this.props.arrayWinner2chiu[x][0] === i && this.props.arrayWinner2chiu[x][1] === k) {
                      flag = true;
                    }
                  }
                  if (flag === true) {
                    return this.renderSquare(i * this.props.sizeBroad + k, flag)
                  } else {
                    return this.renderSquare(i * this.props.sizeBroad + k, flag)
                  }
                } else {
                  return this.renderSquare(i * this.props.sizeBroad + k, flag)
                }
              })}
            </div>
          )
        }
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [{
        squares: Array(25).fill(null),
        index: Array(2).fill(null)
      }],
      stepNumber: 0,
      xIsNext: true,
      sizeBroad: 5,
      displaySizeBroad: 5,
      sort: false,
    };
    this.handleChange = this.handleChange.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleClickSort = this.handleClickSort.bind(this);

  }

  handleClick(i) {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const squares = current.squares.slice();
    if (calculateWinner(squares, current.index[0], current.index[1]) || squares[i]) {
      return;
    }
    squares[i] = this.state.xIsNext ? 'X' : 'O';
    this.setState({
      history: history.concat([{
        squares: squares,
        index: calculateIndex(i, this.state.sizeBroad)
      }]),
      stepNumber: history.length,
      xIsNext: !this.state.xIsNext,
    });
  }

  jumpTo(step) {
    this.setState({
      stepNumber: step,
      xIsNext: (step % 2) === 0,
    });
  }

  handleChange(event) {
    const a = parseInt(event.target.value);
    if (Number.isNaN(a) === false) {
      this.setState({ displaySizeBroad: a });
    } else {
      this.setState({ displaySizeBroad: 0 });
    }
  }

  handleSubmit(event) {
    if (this.state.displaySizeBroad < 5) {
      alert('Broad size > 5');
    } else {
      this.setState({
        sizeBroad: this.state.displaySizeBroad,
        history: [{
          squares: Array(this.state.displaySizeBroad * this.state.displaySizeBroad).fill(null),
          index: Array(2).fill(null)
        }],
        stepNumber: 0,
        xIsNext: true
      });
      event.preventDefault();
    }
  }

  handleClickSort(event) {
    if (this.state.sort === true) {
      this.setState({ sort: false });
    } else {
      this.setState({ sort: true });
    }
    event.preventDefault();
  }


  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const respCalculateWinner = calculateWinner(current.squares, current.index[0], current.index[1]);

    let arrayWinner2chiu = null;
    if (respCalculateWinner !== null) {
      arrayWinner2chiu = indexWin2chiu(respCalculateWinner.win, current.index[0], current.index[1], respCalculateWinner.method, this.state.sizeBroad);
    }
    const moves = history.map((step, move) => {
      let moveTemp = move;
      if (this.state.sort === true) {
        moveTemp = history.length - move - 1;
      }
      const desc = moveTemp ?
        'Go to move #' + moveTemp + ' (' + history[moveTemp].index + ')' :
        'Go to game start'
        ;

      if (this.state.stepNumber === moveTemp) {
        return (
          <li key={moveTemp}>
            <button className="button" onClick={() => this.jumpTo(moveTemp)}>{desc}</button>
          </li>
        );
      } else {
        return (
          <li key={moveTemp}>
            <button onClick={() => this.jumpTo(moveTemp)}>{desc}</button>
          </li>
        );
      }

    });

    let status;
    if (respCalculateWinner) {
      status = 'Winner: ' + (this.state.xIsNext ? 'O' : 'X');
    } else {
      let fullSquares = checkFullSquares(current.squares);
      if (fullSquares === true) {
        status = 'Game Draw';
      } else {
        status = 'Next player: ' + (this.state.xIsNext ? 'X' : 'O');
      }
    }

    return (
      <div>
        <div className="input-size">
          <form onSubmit={this.handleSubmit}>
            <label>
              Size:
              <input type="text" value={this.state.displaySizeBroad} onChange={this.handleChange} />
            </label>
            <input type="submit" value="Ok" />
          </form>
        </div>

        <div className="game">
          <div className="game-board">
            <Board
              arrayWinner2chiu={arrayWinner2chiu}
              squares={current.squares}
              sizeBroad={this.state.sizeBroad}
              onClick={(i) => this.handleClick(i)}
            />
          </div>
          <div className="game-info">
            <input className="sort" type="submit" value={this.state.sort ? "DESC" : "ASC"} onClick={this.handleClickSort} />
            <div>{status}</div>
            <ol>{moves}</ol>
          </div>
        </div>
        


      </div>

    );
  }
}

// ========================================

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(<Game />);

function calculateWinner(squares1chiu, indexRow, indexCol) {
  if (indexRow === null || indexCol === null) {
    return null;
  }

  let [squares, size] = ChuyenMang(squares1chiu, squares1chiu.length);
  const sizeSquares = size;

  console.log(squares);
  //Ngang
  const arrayHorizontal = squares[indexRow];


  //Doc
  let arrayVertical = [];
  for (let i = 0; i < sizeSquares; i++) {
    arrayVertical.push(squares[i][indexCol]);
  }

  //Cheo phai
  let iRightDiagonal = indexRow - 1;
  let kRightDiagonal = indexCol - 1;
  let arrayRightDiagonal = [squares[indexRow][indexCol]];
  while ((iRightDiagonal >= 0) && (kRightDiagonal >= 0)) {
    arrayRightDiagonal.splice(0, 0, squares[iRightDiagonal][kRightDiagonal]);
    iRightDiagonal--;
    kRightDiagonal--;
  }
  let xRightDiagonal = indexRow + 1;
  let yRightDiagonal = indexCol + 1;
  while ((xRightDiagonal < sizeSquares) && (yRightDiagonal < sizeSquares)) {
    arrayRightDiagonal.splice(arrayRightDiagonal.length + 1, 0, squares[xRightDiagonal][yRightDiagonal]);
    xRightDiagonal++;
    yRightDiagonal++;
  }

  //Cheo trai
  let iLeft = indexRow - 1;
  let kLeft = indexCol + 1;
  let arrayLeftDiagonal = [squares[indexRow][indexCol]];
  while ((iLeft >= 0) && (kLeft < sizeSquares)) {
    arrayLeftDiagonal.splice(0, 0, squares[iLeft][kLeft]);
    iLeft--;
    kLeft++;
  }
  let xLeft = indexRow + 1;
  let yLeft = indexCol - 1;
  while ((xLeft < sizeSquares) && (yLeft >= 0)) {
    arrayLeftDiagonal.splice(arrayLeftDiagonal.length + 1, 0, squares[xLeft][yLeft]);
    xLeft++;
    yLeft--;
  }

  console.log(arrayHorizontal)

  let win = calculateArray(arrayHorizontal);
  if (win) {
    return {
      win: win,
      method: "Horizontal",
    };
  }

  win = calculateArray(arrayVertical);
  if (win) {
    return {
      win: win,
      method: "Vertical",
    };
  }

  win = calculateArray(arrayRightDiagonal);
  if (win) {
    return {
      win: win,
      method: "RightDiagonal",
    };
  }

  win = calculateArray(arrayLeftDiagonal);
  if (win) {
    return {
      win: win,
      method: "LeftDiagonal",
    };
  }

  return null;
}

function calculateArray(array) {

  let i = 0;
  let k = 1;
  let arrayWin = [i]
  let count = 1;
  while (i < array.length && k < array.length) {
    if ((array[k] === array[i]) && (array[k] != null)) {
      arrayWin.push(k);
      count++;
      k++;
    } else {
      i = k;
      arrayWin = [i];
      k++;
      count = 1;
    }

    if (count === 5) {
      return arrayWin;
    }
  }

  return null;
}

//n kich thuoc mang vuong
function calculateIndex(index, n) {
  const row = (index - (index % n)) / n;
  const col = index % n;

  return [row, col]
}

function ChuyenMang(squares, size) {
  let n = Math.sqrt(size);

  let array2chiu = [

  ];
  for (let i = 0; i < n; i++) {
    array2chiu.push(Array(n).fill(null));
  }

  let k = 0;

  for (let i = 0; i < n; i++) {
    for (let j = 0; j < n; j++) {
      array2chiu[i][j] = squares[k];
      k++;
    }
  }

  return [array2chiu, n];
}


function indexWin2chiu(arrayIndexWin, indexRow, indexCol, method, size) {
  if (arrayIndexWin == null) {
    return null;
  }
  let index2chiu = [];
  if (method === "Horizontal") {
    for (let i = 0; i < 5; i++) {
      index2chiu.push([indexRow, arrayIndexWin[i]]);
    }
  } else if (method === "Vertical") {
    for (let i = 0; i < 5; i++) {
      index2chiu.push([arrayIndexWin[i], indexCol]);
    }
  } else if (method === "RightDiagonal") {
    let i1 = indexRow - 1;
    let k1 = indexCol - 1;
    while (true) {
      if (i1 === 0 || k1 === 0) {
        break;
      }
      i1--;
      k1--;
    }

    i1 += arrayIndexWin[0];
    k1 += arrayIndexWin[0];
    for (let i = 0; i < 5; i++) {
      index2chiu.push([i1, k1]);
      i1++;
      k1++;
    }
  } else {
    let i1 = indexRow - 1;
    let k1 = indexCol + 1;
    while (true) {
      if (i1 === 0 || k1 === (size - 1)) {
        break;
      }
      i1--;
      k1++;
    }

    i1 += arrayIndexWin[0];
    k1 -= arrayIndexWin[0];
    for (let i = 0; i < 5; i++) {
      index2chiu.push([i1, k1]);
      i1++;
      k1--;
    }
  }

  return index2chiu;
}

function checkFullSquares(squares) {
  for (let i = 0; i < squares.length; i++) {
    if (squares[i] === null) {
      return false;
    }

    return true
  }
}