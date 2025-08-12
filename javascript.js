
const Player = (sign) => {
    this.sign = sign;

    const getSign = () => {
        return sign;
    }
    return { getSign };
};

const gameBoard = (() => {
    const board = ["", "", "", "", "", "", "", "", ""];

    const setCell = (index, sign) => {
        if (index > board.length) return;
        board[index] = sign;
    }

    const getCell = (index) => {
        if (index > board.length) return;
        return board[index];
    }

    const reset = () => {
        for (let i = 0; i < board.length; ++i) {
            board[i] = "";
        }
    }

    return { setCell, getCell, reset };
})();

const displayController = (() => {
    const cellElement = document.querySelectorAll('.cell');
    const messageElement = document.querySelector('.message');
    const restartElement = document.querySelector('.restart-btn');

    cellElement.forEach((cell) => {
        cell.addEventListener('click', (event) => {
            if (gameController.getIsOver() || event.target.textContent !== "") return;
            gameController.playRound(parseInt(event.target.dataset.index));
            updateGameBoard();
        })
    })

    restartElement.addEventListener('click', () => {
        gameBoard.reset();
        gameController.reset();
        updateGameBoard();
        setMessageElement(`Player X's turn`);
    })

    const updateGameBoard = () => {
        for (let i = 0; i < cellElement.length; ++i) {
            cellElement[i].textContent = gameBoard.getCell(i);
        }
    }
    const setMessageElement = (message) => {
        messageElement.textContent = message;
    }
    const setResult = (winner) => {
        if (winner === "Draw") {
            setMessageElement("Tie!");
        }
        else {
            setMessageElement(`Player: ${winner} win! Congrats!!!`);
        }
    }
    return { setMessageElement, setResult };
})();

const gameController = (() => {
    const playerX = Player("X");
    const playerO = Player("O");
    let round = 1;
    let isOver = false;

    const playRound = (cellIndex) => {
        gameBoard.setCell(cellIndex, getCurrentSignCell());
        if (checkWinner(cellIndex)) {
            displayController.setResult(getCurrentSignCell());
            isOver = true;
            return;
        }
        if (round === 9) {
            displayController.setResult("Draw");
            isOver = true;
            return;
        }
        round++;
        displayController.setMessageElement(`Player ${getCurrentSignCell()}'s turn`);

    }
    const getCurrentSignCell = () => {
        return round % 2 === 1 ? playerX.getSign() : playerO.getSign();
    }

    const checkWinner = (cellIndex) => {
        const winCondition = [
            [0, 1, 2],
            [3, 4, 5],
            [6, 7, 8],
            [0, 3, 6],
            [1, 4, 7],
            [2, 5, 8],
            [0, 4, 8],
            [2, 4, 6]
        ];

        return winCondition.filter((combination) => combination.includes(cellIndex))
            .some((possibleCombination) => possibleCombination
                .every((index) => gameBoard.getCell(index) === getCurrentSignCell()));
    }
    const getIsOver = () => {
        return isOver;
    }
    const reset = () => {
        round = 1;
        isOver = false;
    }
    return { playRound, getIsOver, reset }
})();