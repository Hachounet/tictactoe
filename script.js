

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

    function updateCell(positionX, positionY){
        const userMarqueur = userLogic.getUserTurn()
        gameBoardObject.grid[positionX][positionY] = userMarqueur.marqueur;

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

    const endTurnResult = {
        win: "win",
        tie: "tie",
        nowinnotie: "nowinnotie",
    }
    
    const gameBoardObject = gameBoard.gameBoardObject

    const printNewRound = () => {
        const getBoard = gameBoard.getBoard()
        const userTurn = userLogic.getUserTurn();
        console.log(`It's ${userTurn.name} turn.`)
        console.log(`Current board :`, getBoard)
    }

    function play(selectedRow, selectedCol) {
        let isValidReturn = false;
        
        // Input needs to be in xx format like 11 / 01 / 22 etc.
        let valuePlay = [selectedRow, selectedCol];
        isValidReturn = isValid(valuePlay);
             
        if ( isValidReturn === false){
            return;
        }
        // Destructuration of isValidReturn ( who return as an object ) to give vars to updateCell
        const { positionX, positionY } = isValidReturn;
        gameBoard.updateCell(positionX, positionY);
        const isWinReturn = logicModule.isWin();
        if ( isWinReturn === endTurnResult.win ){
          annWinner()  
        }
        else if ( isWinReturn === endTurnResult.tie){
            annTie()
        }
        else {
        userLogic.switchPlayer();
        printNewRound();
        }
    } 

/* Cancelled. Will be reworked with minmax algo later.

    function aiPlay() {
        // Can it win ? 
        console.log("It's AI turn.")
        const userMarqueur = userLogic.getUserTurn()
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameBoardObject.grid[i][j] === 0) {
                    if (isWin()) {
                        gameBoard.updateCell(i, j, userMarqueur.marqueur);
                        const annWinner = logicModule.annWinner()
                        return;
                    } else {
                        // Undo the move if it doesn't lead to a win
                        playRandomMove()
                        gameBoard.updateCell(i, j, 0);
                    }
                }
            }
        }
    }
    */



    function isValid(valuePlay){
 
        valuePlay = Array.from(valuePlay)
        let positionX = valuePlay[0]
        let positionY = valuePlay[1]
        positionX = parseInt(positionX)
        positionY = parseInt(positionY)
        if (gameBoardObject.grid[positionX][positionY] === 0 ){
            return {positionX, positionY};
        }
        else {
            console.log("You can't play here.")
            return false;
            
        }
    }

    const isTie = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameBoardObject.grid[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    const isWin = () => {
        // Rows
        
        for (let i = 0; i < 3; i++) {
            if (gameBoardObject.grid[i][0] !== 0 &&
                gameBoardObject.grid[i][0] === gameBoardObject.grid[i][1] &&
                gameBoardObject.grid[i][1] === gameBoardObject.grid[i][2]) {
                return endTurnResult.win;
                
            }
        }
    
        // Columns
        for (let j = 0; j < 3; j++) {
            if (gameBoardObject.grid[0][j] !== 0 &&
                gameBoardObject.grid[0][j] === gameBoardObject.grid[1][j] &&
                gameBoardObject.grid[1][j] === gameBoardObject.grid[2][j]) {
                return endTurnResult.win;
            }
        }
    
        // Diagonals
        if (gameBoardObject.grid[0][0] !== 0 &&
            gameBoardObject.grid[0][0] === gameBoardObject.grid[1][1] &&
            gameBoardObject.grid[1][1] === gameBoardObject.grid[2][2]) {
            return endTurnResult.win;
                
        }
    
        if (gameBoardObject.grid[0][2] !== 0 &&
            gameBoardObject.grid[0][2] === gameBoardObject.grid[1][1] &&
            gameBoardObject.grid[1][1] === gameBoardObject.grid[2][0]) {
            return endTurnResult.win;
                
        }
    
    
        else {
            const tieResult = isTie()
            if ( tieResult === false){
                console.log("No win yet.");
                return endTurnResult.nowinnotie;
            } 
            else {
                return endTurnResult.tie;
            }
        }

    }

    const annWinner = () => {
        const userTurn = userLogic.getUserTurn()
        userTurn.points++
        console.log(`The winner is ${userTurn.name} and have now ${userTurn.points}`);
        restart()

    }

    const annTie = () => {
        console.log("This is a tie ! Equality !")
        restart()
    }

    const restart = () => {
        let userChoice = prompt("Do you want to play another game ?")
        if ( userChoice === "yes"){
            gameBoard.resetBoard()
            renderModule.displayMove()
            console.log("Game reseted. ")
            userLogic.switchPlayer()

        }
        else {
            console.log("Okay, no more games. :'(")
        }
    }

    return {
        printNewRound,
        isValid,
        play,
        // aiPlay,
        isWin,
        isTie,
        restart,
    }

})();

// User factory

const userLogic = (function () {

let userTurn = null;


const getUserTurn = () => {
    return userTurn;
}

const initUserTurn = () => {
    return userTurn = user1;
}

function userFactory(name, typeOf, marqueur){
    return {
        name: name,
        typeOf: typeOf,
        marqueur: marqueur,
        points : 0,
        talk() {
            return console.log(`Hello i'm ${name}`) }
    }
}

function playerFactory(name) {
    return userFactory(name, "Player", "1")
}

function aiFactory(name){
    return userFactory(name, "AI", "2")
}

const switchPlayer = () => {
    userTurn = (userTurn === user1) ? userBot : user1;
   

}



return {
    userFactory,
    playerFactory,
    aiFactory,
    switchPlayer,
    getUserTurn,
    initUserTurn,
}

})();


const user1 = userLogic.playerFactory("val")
const userBot = userLogic.aiFactory("Bot")
let initialization = userLogic.initUserTurn()

// Rendering module

const renderModule = (function () {

const gameBoardObject = gameBoard.gameBoardObject.grid;

const generateGrid = () => {
    const gamepart = document.getElementById("gamepart");


    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++){
                const newBtn = document.createElement("button");
                newBtn.classList.add("cell");
                newBtn.dataset.rows = i;
                newBtn.dataset.columns = j;
                newBtn.textContent = gameBoardObject[i][j];
                gamepart.appendChild(newBtn);

        
        }
    }
}

const displayMove = () => {
    let cells = document.getElementsByClassName("cell");
   
    let index = 0;
    cells = Array.from(cells)
    for ( let i = 0; i < 3; i++){
        for ( let j = 0; j < 3; j++){
            
            cells[index].textContent = gameBoardObject[i][j];
            index++;
        }
        
    }
}

function retrieveClickPosition(e) {
    const selectedRow = e.target.dataset.rows;
    const selectedCol = e.target.dataset.columns
    if (!selectedRow) return;

    logicModule.play(selectedRow, selectedCol);
    displayMove();

}

gamepart.addEventListener("click", retrieveClickPosition);

generateGrid();

return {
    generateGrid,
    displayMove,
}

})();