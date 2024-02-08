

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
        gameBoardObject.grid[positionX][positionY] = marqueur;
        renderModule.displayMove()
        const isWin = logicModule.isWin()

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

    function play(positionX, positionY) {
        const userTurn = userLogic.getUserTurn()
        // Input need to be in xx format like 11 / 01 / 22 etc.
        console.log(`It's ${userTurn.name} turn.`)
        let valuePlay = prompt("Where do you want to play ? row, column")
        isValid(valuePlay)
        
        
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
        const userMarqueur = userLogic.getUserTurn()
        
        valuePlay = Array.from(valuePlay)
        let positionX = valuePlay[0]
        let positionY = valuePlay[1]
        let marqueur = userMarqueur.marqueur
        positionX = parseInt(positionX)
        positionY = parseInt(positionY)
        marqueur = parseInt(marqueur)
        if (gameBoardObject.grid[positionX][positionY] === 0 ){
            gameBoard.updateCell(positionX, positionY, marqueur)
        }
        else {
            console.log("Error, you can't play here.")
            play()
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
        console.log("Current Board:", gameBoardObject);
        const switchPlayer = userLogic.switchPlayer
        // Rows
        
        for (let i = 0; i < 3; i++) {
            if (gameBoardObject.grid[i][0] !== 0 &&
                gameBoardObject.grid[i][0] === gameBoardObject.grid[i][1] &&
                gameBoardObject.grid[i][1] === gameBoardObject.grid[i][2]) {
                return annWinner();
                
            }
        }
    
        // Columns
        for (let j = 0; j < 3; j++) {
            if (gameBoardObject.grid[0][j] !== 0 &&
                gameBoardObject.grid[0][j] === gameBoardObject.grid[1][j] &&
                gameBoardObject.grid[1][j] === gameBoardObject.grid[2][j]) {
                return annWinner();
            }
        }
    
        // Diagonals
        if (gameBoardObject.grid[0][0] !== 0 &&
            gameBoardObject.grid[0][0] === gameBoardObject.grid[1][1] &&
            gameBoardObject.grid[1][1] === gameBoardObject.grid[2][2]) {
               return annWinner();
                
        }
    
        if (gameBoardObject.grid[0][2] !== 0 &&
            gameBoardObject.grid[0][2] === gameBoardObject.grid[1][1] &&
            gameBoardObject.grid[1][1] === gameBoardObject.grid[2][0]) {
                return annWinner();
                
        }
    
    
        else {
            const tieResult = isTie()
            if ( tieResult === false){
            console.log("No win yet.");
            switchPlayer()
            return false; } 
            else {
                annTie()
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
            const resetBoard = gameBoard.resetBoard()
            console.log("Game reseted. ")
            const switchPlayer = userLogic.switchPlayer()
        }
        else {
            console.log("Okay, no more games.")
        }
    }

    return {
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
     if (userTurn === userBot) {
        // aiPlay cancelled for now. Will be rework with minmax algo later
        console.log(`Switched to ${userTurn.typeOf} turn.`)
        const aiPlay = logicModule.play()
    }
    else {
        console.log(`Switched to ${userTurn.typeOf} turn.`)
        const play = logicModule.play()
    }
    
   

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
                const newDiv = document.createElement("div");
                newDiv.classList.add("cell")
                newDiv.textContent = gameBoardObject[i][j]
                gamepart.appendChild(newDiv)

        
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
    return console.log("I'm supposed to have refresh textContent");
}

return {
    generateGrid,
    displayMove,
}

})();