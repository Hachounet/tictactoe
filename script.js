
// to modify value in array use gameBoard.grid[val][val] = value;

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
        gameBoardObject.grid[positionX][positionY] = marqueur;
    }

    return {
        getBoard,
        resetBoard,     
        updateCell,
        gameBoardObject,
    }
    
})();