class Player {
    #playerName;
    #ball;
    #madeMoves;
    #playerIcon;
    constructor(name, ball) {
        this.#playerName = name;
        this.#ball = ball;
        this.#madeMoves = 0;
    }
}

class PlayersContainer {
    #numberOfPlayers;
    #maxNumberOfPlayers;
    #players = [];
    constructor(numberOfPlayers, maxNumberOfPlayers) {
        this.#numberOfPlayers = numberOfPlayers;
        this.#maxNumberOfPlayers = maxNumberOfPlayers;
    }

    addPlayer(Player) {
        if(this.#maxNumberOfPlayers == this.#maxNumberOfPlayers) {
            return -1;
        }

        this.#players[this.#numberOfPlayers] = Player;
        ++(this.#numberOfPlayers);
        
        return 0;
    }
}

