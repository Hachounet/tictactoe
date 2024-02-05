let gameBoard = [];

function createUser(name) {
    return {
        name,
        score: 0,
        speaking() {
            return `${this.name} have a score of ${this.score}`;
        },

    };
}

const josh = createUser("Josh");
console.log(josh.speaking())