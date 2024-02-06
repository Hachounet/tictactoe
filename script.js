

// gameBoard module
const gameBoard = (function () {

    let grid3 = [
        [0,0,0],
        [0,0,0],
        [0,0,0]
    ];

    let gameBoardObject = {grid: grid3};

    const getBoard = () => {
        return {grid: grid3}
    }

    const resetBoard = () => {
        grid3.forEach(row => row.fill(0));

    };

    function updateCell(positionX, positionY, marqueur){
        const isWin = logicModule.isWin()
        gameBoardObject.grid[positionX][positionY] = marqueur;
        return isWin;
    }

    return {
        getBoard,
        resetBoard,     
        updateCell,
        gameBoardObject,
    }
    
})();

//Logic module

const logicModule = (function () {

    const gameBoardObject = gameBoard.gameBoardObject

    function play(positionX, positionY, marqueur) {
        // Input need to be in xxx format like 111 / 012 / 222 etc.
        let valuePlay = prompt("Where do you want to play ? row, column, number")
        return isValid(valuePlay)
    }

    function isValid(valuePlay){
        valuePlay = Array.from(valuePlay)
        let positionX = valuePlay[0]
        let positionY = valuePlay[1]
        let marqueur = valuePlay[2]
        // should return [1, 1, 1]
        if (gameBoardObject.grid[positionX][positionY] === 0 ){
            return gameBoard.updateCell(positionX, positionY, marqueur)
        }
        else {
            console.log("Error, you can't play here.")
            logicModule.play()
        }
    }

    const isWin = () => {

        // Rows
        for (let i = 0; i < 3; i++) {
            if (gameBoardObject.grid[i][0] !== 0 &&
                gameBoardObject.grid[i][0] === gameBoardObject.grid[i][1] &&
                gameBoardObject.grid[i][1] === gameBoardObject.grid[i][2]) {
                console.log("It's a win.");
                return true;
            }
        }
    
        // Columns
        for (let j = 0; j < 3; j++) {
            if (gameBoardObject.grid[0][j] !== 0 &&
                gameBoardObject.grid[0][j] === gameBoardObject.grid[1][j] &&
                gameBoardObject.grid[1][j] === gameBoardObject.grid[2][j]) {
                console.log("It's a win.");
                return true;
            }
        }
    
        // Diagonals
        if (gameBoardObject.grid[0][0] !== 0 &&
            gameBoardObject.grid[0][0] === gameBoardObject.grid[1][1] &&
            gameBoardObject.grid[1][1] === gameBoardObject.grid[2][2]) {
            console.log("It's a win.");
            return true;
        }
    
        if (gameBoardObject.grid[0][2] !== 0 &&
            gameBoardObject.grid[0][2] === gameBoardObject.grid[1][1] &&
            gameBoardObject.grid[1][1] === gameBoardObject.grid[2][0]) {
            console.log("It's a win.");
            return true;
        }
    
        else {
            console.log("No win yet.");
        return false; }
    }

    const test = () => {
        const board = gameBoard.getBoard()
        console.log("Board:", board)
        console.log("Did you got your getBoard function ?")
    }

    return {
        test,
        isValid,
        play,
        isWin,
    }

})();