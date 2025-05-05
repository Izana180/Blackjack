import { Deck } from "@model/deck";
export class Table {
    betDenominations;
    turnCounter = 0;
    gamePhase;
    resultsLog;
    deck;
    players;
    constructor(betDenominations, players) {
        this.betDenominations = betDenominations;
        this.players = players;
        this.deck = new Deck();
        this.bjClearPlayerHandsAndBets();
        this.bjAssignPlayerHands();
    }
    // ハンドを配る
    bjAssignPlayerHands() {
        for (const player of this.players) {
            player.receiveCard(this.deck.drawCard());
            player.receiveCard(this.deck.drawCard());
        }
    }
    // ハンド、ベットサイズの初期化
    bjClearPlayerHandsAndBets() {
        for (const player of this.players) {
            player.clearHand();
            player.clearBet();
        }
    }
    evaluateMove(player) {
        const decision = player.promptPlayer(null);
        player.applyDecision(decision);
    }
    getTurnPlayer() {
        return this.players[this.turnCounter % this.players.length];
    }
    haveTurn(userData) {
        if (this.gamePhase === "betting" || this.gamePhase === "acting") {
            const currentPlayer = this.getTurnPlayer();
            const decision = currentPlayer.promptPlayer(userData);
            currentPlayer.applyDecision(decision);
            this.turnCounter++;
        }
    }
    getResultsLog() {
        return this.resultsLog;
    }
    getGamePhase() {
        return this.gamePhase;
    }
    getTurnCount() {
        return this.turnCounter;
    }
    isLastPlayer() {
        return (this.turnCounter + 1) % this.players.length === 0;
    }
    onFirstPlauer() {
        return this.turnCounter % this.players.length === 0;
    }
    allPlayerActionsResolved() {
        return this.players.every(player => {
            const status = player.getGameStatus();
            return ["broken", "bust", "stand", "surrender"].indexOf(status) !== -1;
        });
    }
    bjEvaluateAndGetRoundResults() {
        const house = this.players.find(p => p.getType() === "house");
        const houseScore = house?.getHandScore() ?? 0;
        const resultMessages = [];
        for (const player of this.players) {
            if (player.getType() === "house")
                continue;
            const score = player.getHandScore();
            const status = player.getGameStatus();
            if (["bust", "surrender", "broken"].includes(status)) {
                resultMessages.push(`${player.getName()} の負け(${status})`);
                continue;
            }
            if (score > houseScore || houseScore > 21) {
                player.winChips(player.getBet() * 2);
                resultMessages.push(`${player.getName()}の勝ち!(${score})`);
            }
            else if (score === houseScore) {
                player.winChips(player.getBet());
                resultMessages.push(`チョップ(${score})`);
            }
            else {
                resultMessages.push(`${player.getName()}の負け(${score})`);
            }
        }
        const summary = resultMessages.join("\n");
        this.resultsLog.push(summary);
        return summary;
    }
}
