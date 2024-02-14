

// gameBoard module
const gameBoard = (function () {

    let grid3 = [
        ["","",""],
        ["","",""],
        ["","",""]
    ];

    let gameBoardObject = {grid: grid3};

    const getBoard = () => {
        return {grid: grid3}
    }

    const resetBoard = () => {
        grid3.forEach(row => row.fill(""));

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

    /* Was used for console game
    const printNewRound = () => {
        const getBoard = gameBoard.getBoard()
        const userTurn = userLogic.getUserTurn();
        console.log(`It's ${userTurn.name} turn.`)
        console.log(`Current board :`, getBoard)
    }
    */

    function play(selectedRow, selectedCol) {
        let isValidReturn = false;
        
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
        /* Was used for console game
        printNewRound();
        */
        }
    } 


    function isValid(valuePlay){
 
        valuePlay = Array.from(valuePlay)
        let positionX = valuePlay[0]
        let positionY = valuePlay[1]
        positionX = parseInt(positionX)
        positionY = parseInt(positionY)
        if (gameBoardObject.grid[positionX][positionY] === "" ){
            return {positionX, positionY};
        }
        else {
            /* Used for console game
            console.log("You can't play here.")
            */
            return false;
            
        }
    }

    const isTie = () => {
        for (let i = 0; i < 3; i++) {
            for (let j = 0; j < 3; j++) {
                if (gameBoardObject.grid[i][j] === "") {
                    return false;
                }
            }
        }
        return true;
    }

    const isWin = () => {
        // Rows
        
        for (let i = 0; i < 3; i++) {
            if (gameBoardObject.grid[i][0] !== "" &&
                gameBoardObject.grid[i][0] === gameBoardObject.grid[i][1] &&
                gameBoardObject.grid[i][1] === gameBoardObject.grid[i][2]) {
                return endTurnResult.win;
                
            }
        }
    
        // Columns
        for (let j = 0; j < 3; j++) {
            if (gameBoardObject.grid[0][j] !== "" &&
                gameBoardObject.grid[0][j] === gameBoardObject.grid[1][j] &&
                gameBoardObject.grid[1][j] === gameBoardObject.grid[2][j]) {
                return endTurnResult.win;
            }
        }
    
        // Diagonals
        if (gameBoardObject.grid[0][0] !== "" &&
            gameBoardObject.grid[0][0] === gameBoardObject.grid[1][1] &&
            gameBoardObject.grid[1][1] === gameBoardObject.grid[2][2]) {
            return endTurnResult.win;
                
        }
    
        if (gameBoardObject.grid[0][2] !== "" &&
            gameBoardObject.grid[0][2] === gameBoardObject.grid[1][1] &&
            gameBoardObject.grid[1][1] === gameBoardObject.grid[2][0]) {
            return endTurnResult.win;
                
        }
    
    
        else {
            const tieResult = isTie()
            if ( tieResult === false){
                /* Used for console game
                console.log("No win yet.");
                */
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
        /* Used for console game
        console.log(`The winner is ${userTurn.name} and have now ${userTurn.points}`);
        */
        restart()

    }

    const annTie = () => {
        /* Used for console game
        console.log("This is a tie ! Equality !")
        */
        restart()
    }

    const restart = () => {
        setTimeout(() => {
            gameBoard.resetBoard()
            userLogic.switchPlayer()
        }, 4200);
            
            renderModule.displayMove()
            renderModule.refreshPoints()
            renderModule.restartDisplay()
            /* Used for console game
            console.log("Game reseted. ")
            */
            
    }

    return {
        isValid,
        play,
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
    }
}

function playerFactory(name) {
    return userFactory(name, "Player", "X")
}

function aiFactory(name){
    return userFactory(name, "AI", "O")
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


const user1 = userLogic.playerFactory("User1")
const userBot = userLogic.aiFactory("User2")
let initialization = userLogic.initUserTurn()

// Rendering module

const renderModule = (function () {

const gameBoardObject = gameBoard.gameBoardObject.grid;
const gamepart = document.getElementById("gamepart");


const generateGrid = () => {
    


    for (let i = 0; i < 3; i++) {
        for (let j = 0; j < 3; j++){
                const newBtn = document.createElement("button");
                newBtn.classList.add("cell");
                newBtn.classList.add("fadein")
                newBtn.dataset.rows = i;
                newBtn.dataset.columns = j;
                newBtn.textContent = gameBoardObject[i][j];
                gamepart.appendChild(newBtn);

        
        }
    }
}

const ungenerateGrid = () => {
    const cells = document.querySelectorAll(".cell")
    cells.forEach(cell => {
        cell.classList.remove("fadein")
        cell.classList.add("fade-out")
    })
    setTimeout(() => {
        cells.forEach(cell => {
            gamepart.removeChild(cell);
        });
    }, 4100);
}

const displayLastWinner = () => {
    const winnerDiv = document.createElement("div")
    const pWinnerDiv = document.createElement("p")
    const userTurn = userLogic.getUserTurn()
    winnerDiv.setAttribute("id", "winner-div")
    winnerDiv.setAttribute("class", "debug-font")
    winnerDiv.setAttribute("class", "fadein")
    pWinnerDiv.textContent = `The winner is ${userTurn.name} and have now ${userTurn.points}.`
    winnerDiv.appendChild(pWinnerDiv)
    gamepart.appendChild(winnerDiv);
}

const undisplayLastWinner = () => {
    const winnerDiv = document.getElementById("winner-div")
    winnerDiv.setAttribute("class", "fade-out")
    setTimeout(() => {
        gamepart.removeChild(winnerDiv)
    }, 4100);
}

const restartDisplay = () => {
    ungenerateGrid();
    setTimeout(() => {
        displayLastWinner();
    }, 4100);
    setTimeout(() => {
        undisplayLastWinner();
    }, 4200);
    setTimeout(() => {
        generateGrid();
    }, 8200);
    
    
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

    logicModule.play(selectedRow, selectedCol)
    displayMove();

}


const displayMenuName = () => {
    const header = document.querySelector("header");

    const playerInputLeft = document.createElement("input");
    playerInputLeft.setAttribute("placeholder", "Type Player1 name here.");
    playerInputLeft.classList.add("debug-font")
    playerInputLeft.setAttribute("id", "player-input-left")
    header.appendChild(playerInputLeft)

    const playerInputRight = document.createElement("input");
    playerInputRight.setAttribute("placeholder", "Type Player 2 name here.");
    playerInputRight.classList.add("debug-font");
    playerInputRight.setAttribute("id", "player-input-right");
    header.appendChild(playerInputRight)

    const leftPartMain = document.getElementById("left-part");

    const nameBtnLeft = document.createElement("button");
    nameBtnLeft.textContent= "OK !"
    nameBtnLeft.setAttribute("id", "button-player-left")
    leftPartMain.appendChild(nameBtnLeft)

    const rightPartMain = document.getElementById("right-part");

    const nameBtnRight = document.createElement("button");
    nameBtnRight.textContent= "OK !";
    nameBtnRight.setAttribute("id", "button-player-right");
    rightPartMain.appendChild(nameBtnRight);
}

const arePlayersReady = () => {
    const pointsElements = document.querySelectorAll(".points")
    if ( pointsElements.length >= 2){
        generateGrid();
    }
}

const refreshPoints = () => {
    const spanPointsLeft = document.getElementById("points-left");
    const spanPointsRight = document.getElementById("points-right");
    
    // Mettre à jour le nombre de points des joueurs dans les éléments span correspondants
    spanPointsLeft.textContent = user1.points;
    spanPointsRight.textContent = userBot.points;
}

const displayPlayerTurn = () => {
    const getUserTurn = userLogic.getUserTurn();
    if ( getUserTurn === user1 ){
        // add class to underline text into input
    }
    else {
        //add class to underline text into other input
    }
}




const chronologicFunctionsBtn = (event) => {
    // Only put here functions who need event and the eventBtn var.
    let eventBtn = event.target.id

    const retrieveNames = () => {

        if ( eventBtn === "button-player-left"){
            const playerInputLeft = document.getElementById("player-input-left")
            const playerNameLeft = playerInputLeft.value;

            if (playerNameLeft) {
                user1.name = playerNameLeft;
                }
            }

        else if ( eventBtn === "button-player-right") {
            const playerInputRight = document.getElementById("player-input-right")
            const playerNameRight = playerInputRight.value;
    
            if (playerNameRight) {
                userBot.name = playerNameRight;
            }
            }
        }
    
    const fadeBtns = () => {
        if ( eventBtn === "button-player-right"){
            const nameBtnRight = document.getElementById("button-player-right")
            nameBtnRight.classList.add("fade-out")
            
        }
        else if ( eventBtn === "button-player-left") {
            const nameBtnLeft = document.getElementById("button-player-left")
            nameBtnLeft.classList.add("fade-out")
        }
    }
    
    const deleteBtns = () => {
        if ( eventBtn === "button-player-right"){
            const nameBtnRight = document.getElementById("button-player-right")
            const mainRightPart = document.getElementById("right-part")
            mainRightPart.removeChild(nameBtnRight)
        }
        else if ( eventBtn === "button-player-left") {
            const nameBtnLeft = document.getElementById("button-player-left")
            const mainLeftPart = document.getElementById("left-part")
            mainLeftPart.removeChild(nameBtnLeft);
        }
    }

    const endingEditingInput = () => {
        const playerInputLeft = document.getElementById("player-input-left")
        const playerInputRight = document.getElementById("player-input-right")
        if (eventBtn === "button-player-right"){
            playerInputRight.setAttribute("disabled", "disabled")
        }
        else {
            playerInputLeft.setAttribute("disabled", "disabled")
        }

    }

    const removePlaceholderInput = () => {
        const playerInputLeft = document.getElementById("player-input-left")
        const playerInputRight = document.getElementById("player-input-right")
        if (eventBtn === "button-player-right"){
            playerInputRight.removeAttribute("placeholder")
        }
        else {
            playerInputLeft.removeAttribute("placeholder")
        }
    }

    const displayUserName = () => {
        const playerInputLeft = document.getElementById("player-input-left")
        const playerInputRight = document.getElementById("player-input-right")
        if (eventBtn === "button-player-right"){
            playerInputRight.setAttribute("placeholder", userBot.name)
        }
        else {
            playerInputLeft.setAttribute("placeholder", user1.name)
        }
    }

    const displayPoints = () => {
        const leftPartMain = document.getElementById("left-part");
        const rightPartMain = document.getElementById("right-part");
        if (eventBtn === "button-player-right"){
            const spanPointsRight = document.createElement("span");
            spanPointsRight.setAttribute("id", "points-right")
            spanPointsRight.classList.add("points");
            spanPointsRight.classList.add("fadein")
            spanPointsRight.textContent = userBot.points;
            rightPartMain.classList.add("centered");
            rightPartMain.appendChild(spanPointsRight);
        }
        if (eventBtn === "button-player-left"){
            const spanPointsLeft = document.createElement("span");
            spanPointsLeft.setAttribute("id", "points-left")
            spanPointsLeft.classList.add("points");
            spanPointsLeft.classList.add("fadein")
            spanPointsLeft.textContent = user1.points;
            leftPartMain.classList.add("centered")
            leftPartMain.appendChild(spanPointsLeft)
        }
        
    
    }

    retrieveNames(eventBtn);
    fadeBtns(eventBtn);
    endingEditingInput();
    removePlaceholderInput();
    displayUserName();
    setTimeout(() => {
        deleteBtns(eventBtn);
        displayPoints();
        arePlayersReady();
    }, 4200);
}

displayMenuName();

gamepart.addEventListener("click", retrieveClickPosition);
const nameBtnLeft = document.getElementById("button-player-left");
const nameBtnRight = document.getElementById("button-player-right");

nameBtnLeft.addEventListener("click", chronologicFunctionsBtn)
nameBtnRight.addEventListener("click", chronologicFunctionsBtn)

return {
    generateGrid,
    ungenerateGrid,
    displayLastWinner,
    undisplayLastWinner,
    restartDisplay,
    displayMove,
    displayMenuName,
    chronologicFunctionsBtn,
    refreshPoints,
}

})();