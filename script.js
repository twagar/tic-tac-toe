/* Logic psuedo code:
Choose playernames
render board
0 | 1 | 2
3 | 4 | 5
6 | 7 | 8
game start

*/


//Condition to win: three in a row. 

/* [0, 1, 2]
   [3, 4, 5]
   [6, 7, 8]  */


//Player factory for creation
   const playerCreation = (name, mark) => {
    const playTurn = (board, cell) => {
        const indx = board.cells.findIndex(position => position === cell);
            if (board.boardArr[indx] === '') {
                board.render();
                return indx;
            }
        return null;
    };
    return { name, mark, playTurn };
}

//Initalize game board 
const tttModule = (() => {
    let boardArr = ["", "", "", "", "", "", "", "", ""];
    const gameBoard = document.querySelector("#matrix");
    const cells = Array.from(document.querySelectorAll(".cell"));
    let winner = null;

    const render = () => {
        boardArr.forEach((mark, indx) => {
            cells[indx].textContent = boardArr[indx];
        });
    };

    const restart = () => {
        boardArr = ["", "", "", "", "", "", "", "", ""];
    }
    //Win conditions, lines
    const winConditions = () => {
        const winArr = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6],
        ];

        winArr.forEach((line) => {
            if (boardArr[line[0]]
                && boardArr[line[0]] === boardArr[line[1]]
                && boardArr[line[0]] === boardArr[line[2]]) {
                    winner = "winner";
                }
        });
        //Use ternary operator, condition ? expression is true : expression if falsy.
        return winner || (boardArr.includes("") ? null : "ties");
    }
   
    return { render, cells, winConditions, 
        gameBoard, restart, boardArr,
    };
})();
//Gameplay module
const playGame =  (() => {
    const play1 = document.querySelector("#player1");
    const play2 = document.querySelector("#player2");
    const resetButton = document.querySelector("#resetBtn");
    const nameForm = document.querySelector(".player-info");
    let currPlayer;
    let playerOne;
    let playerTwo;

    const nextTurn = () => {
        currPlayer = currPlayer === playerOne ? playerTwo : playerOne;
    };

    const gameRound = () => {
        const board = tttModule;
        const gameUpdate = document.querySelector('#statusTxt');
        //Select a name to start the game! name cannot be equal to nothing
        if (currPlayer.name !== '') {
            gameUpdate.textContent = `${currPlayer.name}'s Turn`;
        } else {
            gameUpdate.textContent = 'Board: Choose a name to start!';
        }

        board.gameBoard.addEventListener('click', (event) => {
            event.preventDefault();
            const play = currPlayer.playTurn(board, event.target);
            if (play !== null) {
                board.boardArr[play] = `${currPlayer.mark}`;
                board.render();
                const checkStatus = board.winConditions();
                if (checkStatus === 'tie') {
                    gameUpdate.textContent = 'tie';
                } else if (checkStatus === null) {
                    nextTurn();
                    gameUpdate.textContent = `${currPlayer.name}'s turn`;
                
                } else {
                    gameUpdate.textContent = `The winner is ${currPlayer.name}`;
                    board.restart();
                    board.render();
                }
            }
        });
    };


    const tttIntialize = () => {
        if (play1.value !== '' && play2.value !== '') {
            playerOne = playerCreation(play1.value, 'X');
            playerTwo = playerCreation(play2.value, "O");
            currPlayer = playerOne;
            gameRound();
        }
    };

    nameForm.addEventListener('submit', (event) => {
        event.preventDefault();
        if (play1.value !== '' && play2.value !== '') {
            tttIntialize();
            nameForm.classList.add('hidden');
            document.querySelector('.place').classList.remove('hidden');
        } else {
            window.location.reload();
        }
    });


    resetButton.addEventListener('click', () => {
        document.querySelector('#statusTxt').textContent = 'Board: ';
        document.querySelector('#player1').value = '';
        document.querySelector('#player2').value = '';
        window.location.reload();
    });
    
    return {
        tttIntialize,
    };
})();


playGame.tttIntialize();

